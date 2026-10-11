const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_DIMENSION = 1200

function readDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer el archivo. Intenta seleccionarlo nuevamente.'))
    reader.onabort = () => reject(new Error('La lectura de la imagen se interrumpió.'))
    reader.readAsDataURL(blob)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('El archivo no contiene una imagen válida o está dañado.'))
    image.src = src
  })
}

export async function readProductImage(file) {
  if (!/\.(jpe?g|png|webp)$/i.test(file.name)) throw new Error('Selecciona una imagen JPG, PNG o WebP.')
  if (!file.size) throw new Error('El archivo de imagen está vacío.')
  if (file.size > MAX_FILE_SIZE) throw new Error('La imagen debe pesar como máximo 10 MB.')

  // Comprobar el contenido además de la extensión elegida en el explorador.
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  const matches = (signature, offset = 0) => signature.every((value, index) => bytes[offset + index] === value)
  const mime = matches([0xff, 0xd8, 0xff]) ? 'image/jpeg'
    : matches([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) ? 'image/png'
      : matches([0x52, 0x49, 0x46, 0x46]) && matches([0x57, 0x45, 0x42, 0x50], 8) ? 'image/webp'
        : null
  if (!mime) throw new Error('El contenido del archivo debe ser una imagen JPG, PNG o WebP.')

  const source = await readDataUrl(new Blob([file], { type: mime }))
  const image = await loadImage(source)
  if (!image.naturalWidth || !image.naturalHeight) throw new Error('La imagen no tiene dimensiones válidas.')
  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
  const context = canvas.getContext('2d')
  if (!context) throw new Error('No se pudo preparar la imagen en este navegador.')
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  // Guardar el contenido, no una URL temporal que dejaría de funcionar al recargar.
  return canvas.toDataURL('image/webp', 0.85)
}
