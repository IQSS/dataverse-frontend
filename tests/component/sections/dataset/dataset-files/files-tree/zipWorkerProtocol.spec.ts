import workerSource from '../../../../../../public/zip-download-sw.js?raw'

describe('ZIP service worker response protocol', () => {
  const start = (
    options: {
      declared?: number
      hold?: boolean
      protocol?: number
      name?: string
      chunks?: Uint8Array[]
    } = {}
  ) => {
    const handlers = new Map<string, (event: unknown) => void>()
    const scope = 'https://zip.test/reusable/'
    // Execute the checked-in worker against an isolated event harness, not user input.
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function('self', workerSource)({
      registration: { scope },
      location: { href: scope, origin: 'https://zip.test' },
      addEventListener: (type: string, handler: (event: unknown) => void) =>
        handlers.set(type, handler)
    })
    const replies: Array<{ type: string; bytes?: number; reason?: string }> = []
    const ack = {
      postMessage: (message: (typeof replies)[number]) => replies.push(message),
      close() {
        return undefined
      }
    }
    let cancelled = false
    const chunks = options.chunks ?? [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5])]
    let index = 0
    const stream = new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          if (index < chunks.length) controller.enqueue(chunks[index++])
          else controller.close()
        },
        cancel() {
          cancelled = true
        }
      },
      { highWaterMark: 0 }
    )
    handlers.get('message')?.({
      data: {
        type: 'zipdl-register',
        protocol: options.protocol ?? 2,
        id: 'test',
        name: options.name ?? 'data.zip',
        ack,
        stream,
        expectedBytes: options.declared,
        holdUntilComplete: options.hold
      }
    })
    let response: Response | undefined
    let lifetime: Promise<void> | undefined
    const request = () =>
      handlers.get('fetch')?.({
        request: new Request(`${scope}zipdl/test/data.zip`),
        respondWith: (value: Response) => {
          response = value
        },
        waitUntil: (promise: Promise<void>) => {
          lifetime = promise
        }
      })
    request()
    if (!response) throw new Error('No worker response')
    return {
      response,
      replies,
      request,
      getResponse: () => response,
      getLifetime: () => lifetime,
      cancelled: () => cancelled,
      unregister: () =>
        handlers.get('message')?.({
          data: { type: 'zipdl-unregister', id: 'test', reason: 'test stop' }
        })
    }
  }
  it('declares exact length and confirms the actual body count', async () => {
    const run = start({ declared: 5, name: "café's (copy)*.zip" })
    expect(run.response.headers.get('content-length')).to.equal('5')
    expect(run.response.headers.get('content-disposition')).to.contain(
      'caf%C3%A9%27s%20%28copy%29%2A.zip'
    )
    expect(run.replies.some((reply) => reply.type === 'zipdl-closed')).to.equal(false)
    expect([...new Uint8Array(await run.response.arrayBuffer())]).to.deep.equal([1, 2, 3, 4, 5])
    expect(run.replies.at(-1)).to.include({ type: 'zipdl-closed', bytes: 5 })
    run.request()
    expect(run.getResponse()?.status).to.equal(404)
  })
  for (const declared of [4, 6]) {
    it(`errors instead of completing an incorrect declared length (${declared})`, async () => {
      const run = start({ declared })
      let failed = false
      await run.response.arrayBuffer().catch(() => {
        failed = true
      })
      expect(failed).to.equal(true)
      expect(run.replies.at(-1)?.type).to.equal('zipdl-error')
      if (declared < 5) expect(run.cancelled()).to.equal(true)
    })
  }
  it('keeps unknown length valid for variable ZIP contents', async () => {
    const run = start()
    expect(run.response.headers.has('content-length')).to.equal(false)
    await run.response.arrayBuffer()
    expect(run.replies.at(-1)).to.include({ type: 'zipdl-closed', bytes: 5 })
    expect(run.getLifetime()).to.equal(undefined)
  })
  it('splits a large transferred source chunk and bounds each response chunk', async () => {
    const run = start({ chunks: [new Uint8Array(1024 * 1024 + 17).fill(7)] })
    const reader = run.response.body?.getReader()
    if (!reader) throw new Error('No body')
    let bytes = 0
    for (;;) {
      const next = await reader.read()
      if (next.done) break
      expect(next.value.byteLength).to.be.at.most(256 * 1024)
      expect(next.value.every((value) => value === 7)).to.equal(true)
      bytes += next.value.byteLength
    }
    expect(bytes).to.equal(1024 * 1024 + 17)
  })
  it('pins only when requested and settles lifetime after cancellation', async () => {
    const run = start({ hold: true })
    expect(run.getLifetime()).to.be.instanceOf(Promise)
    await run.response.body?.cancel('network changed')
    await run.getLifetime()
    expect(run.replies.at(-1)).to.include({ type: 'zipdl-cancelled', reason: 'network changed' })
    expect(run.cancelled()).to.equal(true)
  })
  it('errors an active response when its producer unregisters', async () => {
    const run = start()
    run.unregister()
    let failed = false
    await run.response.arrayBuffer().catch(() => {
      failed = true
    })
    expect(failed).to.equal(true)
    expect(run.cancelled()).to.equal(true)
  })
  it('continues serving old pages while a new worker takes over', async () => {
    const run = start({ protocol: 1 })
    expect((await run.response.arrayBuffer()).byteLength).to.equal(5)
  })
})
