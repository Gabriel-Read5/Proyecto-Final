import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function PokemonCard({ pokemon, esFavorito, alCambiarFavorito }) {
  const id = pokemon.url.split('/').filter(Boolean).pop()
  const imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        className={`boton-favorito ${esFavorito ? 'activo' : ''}`}
        onClick={() => alCambiarFavorito(pokemon.name)}
        type="button"
      >
        {esFavorito ? '★' : '☆'}
      </button>

      <img src={imagen} alt={pokemon.name} className="pokemon-imagen" />

      <h3 className="pokemon-nombre">{pokemon.name}</h3>

      <div className="acciones-card">
        <Link to={`/pokemon/${pokemon.name}`} className="boton">
          Ver detalle
        </Link>
      </div>
    </motion.div>
  )
}

export default PokemonCard