const CLAVE_TEMA = 'pokedex_tema'

export const obtenerTemaGuardado = () => {
  return localStorage.getItem(CLAVE_TEMA) || 'claro'
}

export const guardarTema = (tema) => {
  localStorage.setItem(CLAVE_TEMA, tema)
}

export const aplicarTema = (tema) => {
  document.body.setAttribute('data-theme', tema)
}