const CLAVE_FAVORITOS = 'pokedex_favoritos'

export const obtenerFavoritos = () => {
  const data = localStorage.getItem(CLAVE_FAVORITOS)
  return data ? JSON.parse(data) : []
}

export const esFavorito = (nombre) => {
  const favoritos = obtenerFavoritos()
  return favoritos.includes(nombre)
}

export const alternarFavorito = (nombre) => {
  const favoritos = obtenerFavoritos()

  if (favoritos.includes(nombre)) {
    const actualizados = favoritos.filter((item) => item !== nombre)
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(actualizados))
    return actualizados
  }

  const actualizados = [...favoritos, nombre]
  localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(actualizados))
  return actualizados
}