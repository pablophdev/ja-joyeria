export function readStoredData(key) {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(key)
    return value === null ? null : JSON.parse(value)
  } catch (error) {
    console.warn('No se pudieron leer los datos locales. Se usarán los datos iniciales.', error)
    return null
  }
}

export function writeStoredData(key, data) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    throw new Error('No se pudieron guardar los cambios en este navegador. Revisa el espacio y los permisos de almacenamiento.', { cause: error })
  }
}
