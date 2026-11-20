import { allPages, request } from './api'
export const MODEL = 'arcada-v2'
export const toothIds = Array.from({ length: 8 }, (_, i) => `S${i + 1}`).concat(Array.from({ length: 8 }, (_, i) => `I${i + 1}`))
export const initialDesign = () => ({ nombre: 'Mis grillz', modelo: MODEL, dientes: ['S3','S4','S5','S6'].map((id) => ({ id, material: 'dorado', estilo: 'liso' })) })
export const getGrillzOptions = () => request('catalog', '/v1/grillz/opciones', { authenticated: false })
export const estimateGrillz = (body) => request('catalog', '/v1/grillz/estimacion', { method: 'POST', body, authenticated: false })
export const saveGrillz = (body) => request('catalog', '/v1/grillz/disenos', { method: 'POST', body })
export const quoteGrillz = (id) => request('catalog', `/v1/grillz/disenos/${id}/cotizacion`, { method: 'POST' })
export const getMyGrillz = () => allPages('catalog', '/v1/grillz/disenos', {}, { page: 'pagina', size: 'tamano' })
export const getGrillzQuotes = () => allPages('catalog', '/v1/admin/grillz/cotizaciones', {}, { page: 'pagina', size: 'tamano' })

const draftKey = 'ja.grillz.draft.v1'
export function restoreGrillzDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(draftKey))
    if (['arcada-v1', MODEL].includes(draft?.modelo) && typeof draft.nombre === 'string' && draft.nombre.length <= 100
      && Array.isArray(draft.dientes) && draft.dientes.length <= 16
      && draft.dientes.every((d) => d && toothIds.includes(d.id) && ['dorado','plata','rosa'].includes(d.material) && ['liso','piedras','ventana','solitario','colmillo','rayas','corazon'].includes(d.estilo))) return { ...draft, modelo: MODEL }
  } catch { /* Un borrador local inválido se reemplaza por el diseño inicial. */ }
  return initialDesign()
}
export function storeGrillzDraft(design) {
  try { sessionStorage.setItem(draftKey, JSON.stringify(design)) } catch { /* La descarga y el guardado remoto siguen disponibles. */ }
}
