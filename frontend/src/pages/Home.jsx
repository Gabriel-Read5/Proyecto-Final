import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { obtenerPokemones, obtenerPokemonPorNombre, obtenerTipos } from '../services/pokeapi'
import { obtenerFavoritos, alternarFavorito } from '../services/favoritos'
import PokemonCard from '../components/PokemonCard'

function Home() {
  const [pokemones, setPokemones] = useState([])
  const [pokemonesDetallados, setPokemonesDetallados] = useState([])
  const [tipos, setTipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tipoSeleccionado, setTipoSeleccionado] = useState('')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [favoritos, setFavoritos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setFavoritos(obtenerFavoritos())
  }, [])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)

        const [listaBase, listaTipos] = await Promise.all([
          obtenerPokemones(30),
          obtenerTipos()
        ])

        setPokemones(listaBase)
        setTipos(listaTipos)

        const detalles = await Promise.all(
          listaBase.map((pokemon) => obtenerPokemonPorNombre(pokemon.name))
        )

        const combinados = listaBase.map((pokemon, index) => ({
          ...pokemon,
          detalle: detalles[index]
        }))

        setPokemonesDetallados(combinados)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  const manejarFavorito = (nombre) => {
    const actualizados = alternarFavorito(nombre)
    setFavoritos(actualizados)
  }

  const pokemonesFiltrados = useMemo(() => {
    return pokemonesDetallados.filter((pokemon) => {
      const coincideBusqueda = pokemon.name
        .toLowerCase()
        .includes(busqueda.toLowerCase())

      const coincideTipo =
        !tipoSeleccionado ||
        pokemon.detalle.types.some((tipo) => tipo.type.name === tipoSeleccionado)

      const coincideFavorito =
        !soloFavoritos || favoritos.includes(pokemon.name)

      return coincideBusqueda && coincideTipo && coincideFavorito
    })
  }, [pokemonesDetallados, busqueda, tipoSeleccionado, soloFavoritos, favoritos])

  return (
    <div className="contenedor">
      <motion.section
        className="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="subtitulo">Proyecto Final · Programación III</p>
          <h1 className="titulo-principal">Pokédex Web Interactiva</h1>
          <p className="descripcion-principal">
            Busca Pokémon, filtra por tipo, revisa detalles y guarda tus favoritos.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="panel-filtros"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="text"
          placeholder="Busca un Pokémon por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />

        <select
          value={tipoSeleccionado}
          onChange={(e) => setTipoSeleccionado(e.target.value)}
          className="select-tipo"
        >
          <option value="">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo.name} value={tipo.name}>
              {tipo.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          className={`boton-secundario ${soloFavoritos ? 'activo' : ''}`}
          onClick={() => setSoloFavoritos(!soloFavoritos)}
        >
          {soloFavoritos ? 'Mostrando favoritos' : 'Ver solo favoritos'}
        </button>
      </motion.section>

      <section className="resumen-barra">
        <div className="resumen-item">
          <span className="resumen-numero">{pokemonesDetallados.length}</span>
          <span className="resumen-label">Pokémon cargados</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{pokemonesFiltrados.length}</span>
          <span className="resumen-label">Resultados</span>
        </div>
        <div className="resumen-item">
          <span className="resumen-numero">{favoritos.length}</span>
          <span className="resumen-label">Favoritos</span>
        </div>
      </section>

      {cargando ? (
        <div className="estado-vista">
          <p>Cargando Pokémon...</p>
        </div>
      ) : pokemonesFiltrados.length === 0 ? (
        <div className="estado-vista">
          <p>No se encontraron Pokémon con esos filtros.</p>
        </div>
      ) : (
        <div className="grid">
          {pokemonesFiltrados.map((pokemon) => (
            <PokemonCard
              key={pokemon.name}
              pokemon={pokemon}
              esFavorito={favoritos.includes(pokemon.name)}
              alCambiarFavorito={manejarFavorito}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home