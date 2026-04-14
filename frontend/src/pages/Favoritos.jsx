import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { obtenerFavoritos, alternarFavorito } from '../services/favoritos'
import { obtenerPokemonPorNombre } from '../services/pokeapi'
import PokemonCard from '../components/PokemonCard'
import ModalPokemon from '../components/ModalPokemon'
import EstadoError from '../components/EstadoError'

function Favoritos() {
  const [favoritos, setFavoritos] = useState([])
  const [pokemonesFavoritos, setPokemonesFavoritos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pokemonModal, setPokemonModal] = useState(null)
  const [error, setError] = useState('')

  const cargarFavoritos = async () => {
    try {
      setError('')
      setCargando(true)

      const nombresFavoritos = obtenerFavoritos()
      setFavoritos(nombresFavoritos)

      const detalles = await Promise.all(
        nombresFavoritos.map((nombre) => obtenerPokemonPorNombre(nombre))
      )

      const formateados = detalles.map((pokemon) => ({
        name: pokemon.name,
        detalle: pokemon
      }))

      setPokemonesFavoritos(formateados)
    } catch (error) {
      console.error('Error al cargar favoritos:', error)
      setError('No se pudieron cargar tus favoritos en este momento.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarFavoritos()
  }, [])

  const manejarFavorito = (nombre) => {
    const actualizados = alternarFavorito(nombre)
    setFavoritos(actualizados)
    setPokemonesFavoritos((prev) =>
      prev.filter((pokemon) => pokemon.name !== nombre)
    )
  }

  return (
    <div className="contenedor">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="subtitulo">Tu colección personalizada</p>
          <h1 className="titulo-principal">Pokémon Favoritos</h1>
          <p className="descripcion-principal">
            Aquí ves los Pokémon que has marcado con estrella y guardado en localStorage.
          </p>
        </div>
      </motion.section>

      {cargando ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card skeleton-card">
              <div className="skeleton skeleton-circulo"></div>
              <div className="skeleton skeleton-texto"></div>
              <div className="skeleton skeleton-chip"></div>
              <div className="skeleton skeleton-boton"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EstadoError
          titulo="No se pudieron cargar los favoritos"
          mensaje={error}
          onReintentar={cargarFavoritos}
        />
      ) : pokemonesFavoritos.length === 0 ? (
        <div className="estado-vista">
          <h3>No tienes favoritos todavía</h3>
          <p>Marca Pokémon con la estrella para que aparezcan aquí.</p>
        </div>
      ) : (
        <>
          <section className="resumen-barra">
            <div className="resumen-item">
              <span className="resumen-numero">{pokemonesFavoritos.length}</span>
              <span className="resumen-label">Favoritos guardados</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-numero">{favoritos.length}</span>
              <span className="resumen-label">Persistidos en localStorage</span>
            </div>
            <div className="resumen-item">
              <span className="resumen-numero">★</span>
              <span className="resumen-label">Colección activa</span>
            </div>
          </section>

          <div className="grid">
            {pokemonesFavoritos.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                esFavorito={favoritos.includes(pokemon.name)}
                alCambiarFavorito={manejarFavorito}
                alVistaRapida={setPokemonModal}
              />
            ))}
          </div>
        </>
      )}

      <ModalPokemon
        pokemon={pokemonModal}
        abierto={Boolean(pokemonModal)}
        alCerrar={() => setPokemonModal(null)}
      />
    </div>
  )
}

export default Favoritos