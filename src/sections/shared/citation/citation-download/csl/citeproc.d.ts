declare module 'citeproc' {
  export interface CiteprocSys {
    retrieveLocale: (lang: string) => string
    retrieveItem: (id: string | number) => Record<string, unknown>
  }

  export class Engine {
    constructor(sys: CiteprocSys, style: string, lang?: string, forceLang?: boolean)
    updateItems(ids: (string | number)[]): void
    makeBibliography(): [Record<string, unknown>, string[]] | false
  }

  interface CslNamespace {
    Engine: typeof Engine
  }

  const CSL: CslNamespace
  export default CSL
}
