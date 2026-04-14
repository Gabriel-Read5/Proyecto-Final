import { useEffect, useState } from 'react'
import { obtenerPokemones } from '../services/pokeapi'
import PokemonCard from '../components/PokemonCard'

function Home() {
  const [pokemones, setPokemones] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const cargarPokemones = async () => {
      try {
        const data = await obtenerPokemones(30)
        setPokemones(data)
      } catch (error) {
        console.error('Error al cargar los pokémon:', error)
      }
    }

    cargarPokemones()
  }, [])

  const pokemonesFiltrados = pokemones.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="contenedor">
      <h1 className="titulo-principal">Pokédex Web Interactiva</h1>

      <input
        type="text"
        placeholder="Busca un Pokémon..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-busqueda"
      />

      <div className="grid">
        {pokemonesFiltrados.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  )
}

export default Home