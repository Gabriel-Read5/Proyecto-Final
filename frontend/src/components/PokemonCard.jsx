import { Link } from 'react-router-dom'

function PokemonCard({ pokemon }) {
  const id = pokemon.url.split('/').filter(Boolean).pop()
  const imagen = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

  return (
    <div className="card">
      <img src={imagen} alt={pokemon.name} className="pokemon-imagen" />
      <h3 className="pokemon-nombre">{pokemon.name}</h3>
      <Link to={`/pokemon/${pokemon.name}`} className="boton">
        Ver detalle
      </Link>
    </div>
  )
}

export default PokemonCard