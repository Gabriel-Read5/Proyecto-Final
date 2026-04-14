import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerPokemonPorNombre } from '../services/pokeapi'

function DetallePokemon() {
  const { nombre } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const data = await obtenerPokemonPorNombre(nombre)
        setPokemon(data)
      } catch (error) {
        console.error('Error al cargar el detalle del Pokémon:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarDetalle()
  }, [nombre])

  if (cargando) {
    return <div className="contenedor"><p>Cargando...</p></div>
  }

  if (!pokemon) {
    return <div className="contenedor"><p>No se encontró el Pokémon.</p></div>
  }

  return (
    <div className="contenedor">
      <Link to="/" className="boton-volver">← Volver</Link>

      <div className="detalle-card">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="detalle-imagen"
        />

        <h1>{pokemon.name}</h1>
        <p><strong>ID:</strong> {pokemon.id}</p>
        <p><strong>Altura:</strong> {pokemon.height}</p>
        <p><strong>Peso:</strong> {pokemon.weight}</p>

        <div>
          <strong>Tipos:</strong>
          <ul>
            {pokemon.types.map((tipo) => (
              <li key={tipo.type.name}>{tipo.type.name}</li>
            ))}
          </ul>
        </div>

        <div>
          <strong>Habilidades:</strong>
          <ul>
            {pokemon.abilities.map((habilidad) => (
              <li key={habilidad.ability.name}>{habilidad.ability.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DetallePokemon