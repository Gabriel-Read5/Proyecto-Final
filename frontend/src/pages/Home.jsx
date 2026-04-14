import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { obtenerPokemones, obtenerPokemonPorNombre, obtenerTipos } from '../services/pokeapi'
import { obtenerFavoritos, alternarFavorito } from '../services/favoritos'
import PokemonCard from '../components/PokemonCard'
import ModalPokemon from '../components/ModalPokemon'
import EstadoError from '../components/EstadoError'

function Home() {
  const [pokemonesDetallados, setPokemonesDetallados] = useState([])
  const [tipos, setTipos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [tipoSeleccionado, setTipoSeleccionado] = useState('')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const [favoritos, setFavoritos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [orden, setOrden] = useState('numero-asc')
  const [paginaActual, setPaginaActual] = useState(1)
  const [pokemonModal, setPokemonModal] = useState(null)
  const [error, setError] = useState('')

  const pokemonesPorPagina = 24

  const cargarDatos = async () => {
    try {
      setError('')
      setCargando(true)

      const [listaBase, listaTipos] = await Promise.all([
        obtenerPokemones(151),
        obtenerTipos()
      ])

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
      setError('No se pudieron cargar los Pokémon. Verifica tu conexión e inténtalo de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    setFavoritos(obtenerFavoritos())
  }, [])

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    setPaginaActual(1)
  }, [busqueda, tipoSeleccionado, soloFavoritos, orden])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [paginaActual])

  const manejarFavorito = (nombre) => {
    const actualizados = alternarFavorito(nombre)
    setFavoritos(actualizados)
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setTipoSeleccionado('')
    setSoloFavoritos(false)
    setOrden('numero-asc')
    setPaginaActual(1)
  }

  const sugerenciasBusqueda = useMemo(() => {
    if (!busqueda.trim()) return []

    return pokemonesDetallados
      .filter((pokemon) =>
        pokemon.name.toLowerCase().includes(busqueda.toLowerCase())
      )
      .slice(0, 5)
  }, [busqueda, pokemonesDetallados])

  const pokemonesFiltrados = useMemo(() => {
    let resultado = pokemonesDetallados.filter((pokemon) => {
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

    if (orden === 'nombre-asc') {
      resultado = [...resultado].sort((a, b) => a.name.localeCompare(b.name))
    }

    if (orden === 'nombre-desc') {
      resultado = [...resultado].sort((a, b) => b.name.localeCompare(a.name))
    }

    if (orden === 'numero-asc') {
      resultado = [...resultado].sort((a, b) => a.detalle.id - b.detalle.id)
    }

    if (orden === 'numero-desc') {
      resultado = [...resultado].sort((a, b) => b.detalle.id - a.detalle.id)
    }

    return resultado
  }, [pokemonesDetallados, busqueda, tipoSeleccionado, soloFavoritos, favoritos, orden])

  const totalPaginas = Math.max(1, Math.ceil(pokemonesFiltrados.length / pokemonesPorPagina))
  const inicio = (paginaActual - 1) * pokemonesPorPagina
  const fin = inicio + pokemonesPorPagina
  const pokemonesPaginados = pokemonesFiltrados.slice(inicio, fin)

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
            Explora los 151 Pokémon originales, filtra por tipo, ordénalos, guarda favoritos y revisa detalles completos.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="panel-filtros panel-filtros-grande"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="busqueda-contenedor">
          <input
            type="text"
            placeholder="Busca un Pokémon por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
            aria-label="Buscar Pokémon por nombre"
          />

          {busqueda && sugerenciasBusqueda.length > 0 && (
            <div className="autocomplete-lista" id="lista-autocompletado" role="listbox">
              {sugerenciasBusqueda.map((pokemon) => (
                <button
                  key={pokemon.name}
                  type="button"
                  className="autocomplete-item"
                  onClick={() => setBusqueda(pokemon.name)}
                  role="option"
                >
                  #{String(pokemon.detalle.id).padStart(3, '0')} {pokemon.name}
                </button>
              ))}
            </div>
          )}
        </div>

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

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="select-tipo"
        >
          <option value="numero-asc">Número: menor a mayor</option>
          <option value="numero-desc">Número: mayor a menor</option>
          <option value="nombre-asc">Nombre: A-Z</option>
          <option value="nombre-desc">Nombre: Z-A</option>
        </select>

        <button
          type="button"
          className={`boton-secundario ${soloFavoritos ? 'activo' : ''}`}
          onClick={() => setSoloFavoritos(!soloFavoritos)}
        >
          {soloFavoritos ? 'Mostrando favoritos' : 'Ver solo favoritos'}
        </button>

        <button
          type="button"
          className="boton-limpiar"
          onClick={limpiarFiltros}
        >
          Limpiar filtros
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
      ) : error ? (
        <EstadoError
          titulo="No se pudo cargar la Pokédex"
          mensaje={error}
          onReintentar={cargarDatos}
        />
      ) : pokemonesFiltrados.length === 0 ? (
        <div className="estado-vista">
          <h3>No se encontraron Pokémon</h3>
          <p>Prueba cambiando la búsqueda o limpiando los filtros.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {pokemonesPaginados.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                esFavorito={favoritos.includes(pokemon.name)}
                alCambiarFavorito={manejarFavorito}
                alVistaRapida={setPokemonModal}
              />
            ))}
          </div>

          <div className="paginacion">
            <button
              type="button"
              className="boton-paginacion"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((prev) => prev - 1)}
            >
              Anterior
            </button>

            <span className="pagina-texto">
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              type="button"
              className="boton-paginacion"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((prev) => prev + 1)}
            >
              Siguiente
            </button>
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

export default Home