import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function PokemonCard({ pokemon, esFavorito, alCambiarFavorito }) {
  const id = pokemon.detalle?.id || pokemon.url.split('/').filter(Boolean).pop()
  const imagen =
    pokemon.detalle?.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.detalle?.sprites?.front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

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

      <span className="pokemon-id">#{String(id).padStart(3, '0')}</span>

      <img src={imagen} alt={pokemon.name} className="pokemon-imagen" />

      <h3 className="pokemon-nombre">{pokemon.name}</h3>

      <div className="chips-contenedor chips-card">
        {pokemon.detalle?.types?.map((tipo) => (
          <span key={tipo.type.name} className="chip">
            {tipo.type.name}
          </span>
        ))}
      </div>

      <div className="acciones-card">
        <Link to={`/pokemon/${pokemon.name}`} className="boton">
          Ver detalle
        </Link>
      </div>
    </motion.div>
  )
}

export default PokemonCard