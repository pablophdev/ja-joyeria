import { request } from '../datos/api'
import { resolveImage } from '../datos/media'

export async function readProductImage(file) {
  if (!/\.(jpe?g|png|webp)$/i.test(file.name)) throw new Error('Selecciona una imagen JPG, PNG o WebP.')
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('La imagen debe pesar entre 1 byte y 10 MB.')
  const body = new FormData()
  body.append('imagen', file)
  const result = await request('catalog', '/v1/admin/imagenes', { method: 'POST', body })
  return resolveImage(result.key)
}
