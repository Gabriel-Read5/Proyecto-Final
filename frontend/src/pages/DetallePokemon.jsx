import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    return (
      <div className="contenedor">
        <div className="estado-vista">
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="contenedor">
        <div className="estado-vista">
          <p>No se encontró el Pokémon.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="contenedor">
      <Link to="/" className="boton-volver">← Volver</Link>

      <motion.div
        className="detalle-card"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="detalle-superior">
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="detalle-imagen"
          />

          <div className="detalle-info">
            <h1 className="detalle-titulo">
              #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
            </h1>

            <p><strong>Experiencia base:</strong> {pokemon.base_experience}</p>
            <p><strong>Altura:</strong> {pokemon.height}</p>
            <p><strong>Peso:</strong> {pokemon.weight}</p>

            <div className="chips-contenedor">
              {pokemon.types.map((tipo) => (
                <span key={tipo.type.name} className="chip">
                  {tipo.type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="detalle-secciones">
          <div className="detalle-bloque">
            <h3>Habilidades</h3>
            <ul>
              {pokemon.abilities.map((habilidad) => (
                <li key={habilidad.ability.name}>{habilidad.ability.name}</li>
              ))}
            </ul>
          </div>

          <div className="detalle-bloque">
            <h3>Estadísticas base</h3>
            <div className="stats-lista">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-item">
                  <div className="stat-header">
                    <span className="stat-nombre">{stat.stat.name}</span>
                    <span className="stat-valor">{stat.base_stat}</span>
                  </div>
                  <div className="barra-stat-fondo">
                    <div
                      className="barra-stat"
                      style={{ width: `${Math.min(stat.base_stat, 150) / 1.5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DetallePokemon