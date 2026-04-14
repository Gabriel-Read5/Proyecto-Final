import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2'
})

export const obtenerPokemones = async (limite = 20) => {
  const respuesta = await api.get(`/pokemon?limit=${limite}`)
  return respuesta.data.results
}

export const obtenerPokemonPorNombre = async (nombre) => {
  const respuesta = await api.get(`/pokemon/${nombre.toLowerCase()}`)
  return respuesta.data
}