import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

function ModalPokemon({ pokemon, abierto, alCerrar }) {
  if (!pokemon) return null

  const imagen =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="modal-overlay"
          onClick={alCerrar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <button type="button" className="modal-cerrar" onClick={alCerrar}>
              ×
            </button>

            <img src={imagen} alt={pokemon.name} className="modal-imagen" />

            <h2 className="detalle-titulo">
              #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
            </h2>

            <div className="chips-contenedor chips-card">
              {pokemon.types.map((tipo) => (
                <span key={tipo.type.name} className="chip">
                  {tipo.type.name}
                </span>
              ))}
            </div>

            <div className="modal-info">
              <p><strong>Experiencia base:</strong> {pokemon.base_experience}</p>
              <p><strong>Altura:</strong> {pokemon.height}</p>
              <p><strong>Peso:</strong> {pokemon.weight}</p>
            </div>

            <div className="modal-botones">
              <Link to={`/pokemon/${pokemon.name}`} className="boton" onClick={alCerrar}>
                Ver detalle completo
              </Link>
              <button type="button" className="boton-limpiar" onClick={alCerrar}>
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalPokemon