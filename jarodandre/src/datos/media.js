import { serviceUrls } from './api'

const assets = import.meta.glob('../assets/**/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' })
export function resolveImage(key) {
  if (!key) return ''
  const local = assets[`../assets/${key}`]
  if (local) return local
  if (/^https?:\/\//.test(key)) return key
  return `${import.meta.env.VITE_MEDIA_URL || `${serviceUrls.catalog}/media`}/${key}`
}

export function imageKey(url) {
  const match = Object.entries(assets).find(([, value]) => value === url)
  if (match) return match[0].replace('../assets/', '')
  const prefix = `${import.meta.env.VITE_MEDIA_URL || `${serviceUrls.catalog}/media`}/`
  return url.startsWith(prefix) ? url.slice(prefix.length) : url
}

export function productImageOptions() {
  return Object.entries(assets).filter(([key]) => key.includes('/products/')).map(([key, image]) => ({ image, label: key.split('/').pop() }))
}
