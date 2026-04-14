import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="barra">
      <div className="contenedor barra-contenido">
        <Link to="/" className="logo">
          PokÃ©dex Web
        </Link>
      </div>
    </nav>
  )
}

export default Navbar