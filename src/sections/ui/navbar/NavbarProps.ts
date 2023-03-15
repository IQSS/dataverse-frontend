export interface Link {
  title: string
  value: string | Link[]
}

interface Logo {
  src: string
  altText: string | null
}

interface Brand {
  logo: Logo
  title: string
  path: string
}

export interface NavbarProps {
  brand: Brand
  links: Link[]
}
