export const BASE_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
export const AUTHN_URL = (import.meta.env.VITE_DATAVERSE_AUTHN_URL as string) ?? BASE_URL
