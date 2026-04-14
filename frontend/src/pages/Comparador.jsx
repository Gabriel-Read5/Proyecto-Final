import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { obtenerPokemones, obtenerPokemonPorNombre } from '../services/pokeapi'
import EstadoError from '../components/EstadoError'

function Comparador() {
  const [listaPokemones, setListaPokemones] = useState([])
  const [nombreIzquierda, setNombreIzquierda] = useState('bulbasaur')
  const [nombreDerecha, setNombreDerecha] = useState('charmander')
  const [pokemonIzquierda, setPokemonIzquierda] = useState(null)
  const [pokemonDerecha, setPokemonDerecha] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const cargarDatos = async () => {
    try {
      setError('')
      setCargando(true)

      const listaBase = await obtenerPokemones(151)
      setListaPokemones(listaBase)

      const [izquierda, derecha] = await Promise.all([
        obtenerPokemonPorNombre(nombreIzquierda),
        obtenerPokemonPorNombre(nombreDerecha)
      ])

      setPokemonIzquierda(izquierda)
      setPokemonDerecha(derecha)
    } catch (err) {
      console.error('Error al cargar comparador:', err)
      setError('No se pudo cargar el comparador en este momento.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  useEffect(() => {
    const cargarSeleccion = async () => {
      try {
        setCargando(true)
        const [izquierda, derecha] = await Promise.all([
          obtenerPokemonPorNombre(nombreIzquierda),
          obtenerPokemonPorNombre(nombreDerecha)
        ])

        setPokemonIzquierda(izquierda)
        setPokemonDerecha(derecha)
      } catch (err) {
        console.error('Error al comparar Pokémon:', err)
        setError('No se pudo actualizar la comparación.')
      } finally {
        setCargando(false)
      }
    }

    if (nombreIzquierda && nombreDerecha) {
      cargarSeleccion()
    }
  }, [nombreIzquierda, nombreDerecha])

  const statsComparados = useMemo(() => {
    if (!pokemonIzquierda || !pokemonDerecha) return []

    return pokemonIzquierda.stats.map((statIzq) => {
      const statDer = pokemonDerecha.stats.find(
        (item) => item.stat.name === statIzq.stat.name
      )

      return {
        nombre: statIzq.stat.name,
        izquierda: statIzq.base_stat,
        derecha: statDer?.base_stat || 0
      }
    })
  }, [pokemonIzquierda, pokemonDerecha])

  if (cargando && !pokemonIzquierda && !pokemonDerecha) {
    return (
      <div className="contenedor">
        <div className="estado-vista">
          <p>Cargando comparador...</p>
        </div>
      </div>
    )
  }

  if (error && !pokemonIzquierda && !pokemonDerecha) {
    return (
      <div className="contenedor">
        <EstadoError
          titulo="No se pudo cargar el comparador"
          mensaje={error}
          onReintentar={cargarDatos}
        />
      </div>
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
          <p className="subtitulo">Comparación avanzada</p>
          <h1 className="titulo-principal">Comparador de Pokémon</h1>
          <p className="descripcion-principal">
            Selecciona dos Pokémon y compara sus estadísticas, tipos y datos base.
          </p>
        </div>
      </motion.section>

      <section className="comparador-controles">
        <div>
          <label htmlFor="pokemon-izquierda" className="label-control">
            Pokémon 1
          </label>
          <select
            id="pokemon-izquierda"
            className="select-tipo"
            value={nombreIzquierda}
            onChange={(e) => setNombreIzquierda(e.target.value)}
            aria-label="Seleccionar primer Pokémon"
          >
            {listaPokemones.map((pokemon) => (
              <option key={pokemon.name} value={pokemon.name}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pokemon-derecha" className="label-control">
            Pokémon 2
          </label>
          <select
            id="pokemon-derecha"
            className="select-tipo"
            value={nombreDerecha}
            onChange={(e) => setNombreDerecha(e.target.value)}
            aria-label="Seleccionar segundo Pokémon"
          >
            {listaPokemones.map((pokemon) => (
              <option key={pokemon.name} value={pokemon.name}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && (
        <div className="mensaje-inline-error" role="alert">
          {error}
        </div>
      )}

      {pokemonIzquierda && pokemonDerecha && (
        <>
          <section className="comparador-paneles">
            <article className="comparador-card" aria-labelledby="titulo-izquierda">
              <img
                src={pokemonIzquierda.sprites.other['official-artwork'].front_default || pokemonIzquierda.sprites.front_default}
                alt={`Imagen oficial de ${pokemonIzquierda.name}`}
                className="comparador-imagen"
              />
              <h2 id="titulo-izquierda" className="detalle-titulo">
                #{String(pokemonIzquierda.id).padStart(3, '0')} {pokemonIzquierda.name}
              </h2>
              <div className="chips-contenedor chips-card">
                {pokemonIzquierda.types.map((tipo) => (
                  <span key={tipo.type.name} className="chip">
                    {tipo.type.name}
                  </span>
                ))}
              </div>
              <p><strong>Altura:</strong> {pokemonIzquierda.height}</p>
              <p><strong>Peso:</strong> {pokemonIzquierda.weight}</p>
              <p><strong>Experiencia base:</strong> {pokemonIzquierda.base_experience}</p>
            </article>

            <article className="comparador-card" aria-labelledby="titulo-derecha">
              <img
                src={pokemonDerecha.sprites.other['official-artwork'].front_default || pokemonDerecha.sprites.front_default}
                alt={`Imagen oficial de ${pokemonDerecha.name}`}
                className="comparador-imagen"
              />
              <h2 id="titulo-derecha" className="detalle-titulo">
                #{String(pokemonDerecha.id).padStart(3, '0')} {pokemonDerecha.name}
              </h2>
              <div className="chips-contenedor chips-card">
                {pokemonDerecha.types.map((tipo) => (
                  <span key={tipo.type.name} className="chip">
                    {tipo.type.name}
                  </span>
                ))}
              </div>
              <p><strong>Altura:</strong> {pokemonDerecha.height}</p>
              <p><strong>Peso:</strong> {pokemonDerecha.weight}</p>
              <p><strong>Experiencia base:</strong> {pokemonDerecha.base_experience}</p>
            </article>
          </section>

          <section className="comparacion-stats" aria-labelledby="titulo-stats">
            <h2 id="titulo-stats">Comparación de estadísticas</h2>

            {statsComparados.map((stat) => {
              const porcentajeIzq = Math.min(stat.izquierda, 150) / 1.5
              const porcentajeDer = Math.min(stat.derecha, 150) / 1.5

              return (
                <div key={stat.nombre} className="comparacion-stat-item">
                  <div className="comparacion-stat-header">
                    <span>{stat.nombre}</span>
                    <span>{stat.izquierda} vs {stat.derecha}</span>
                  </div>

                  <div className="comparacion-barras">
                    <div>
                      <div className="barra-stat-fondo" aria-hidden="true">
                        <div
                          className="barra-stat barra-stat-izquierda"
                          style={{ width: `${porcentajeIzq}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="barra-stat-fondo" aria-hidden="true">
                        <div
                          className="barra-stat barra-stat-derecha"
                          style={{ width: `${porcentajeDer}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </section>
        </>
      )}
    </div>
  )
}

export default Comparador