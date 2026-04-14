import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

function Navbar({ tema, alternarTema }) {
  return (
    <motion.nav
      className="barra"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="contenedor barra-contenido">
        <div className="nav-izquierda">
          <Link to="/" className="logo">
            Pokédex Web
          </Link>
          <span className="marca-secundaria">React · PokeAPI · PowerShell</span>
        </div>

        <div className="nav-enlaces">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/favoritos"
            className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
          >
            Favoritos
          </NavLink>

          <NavLink
            to="/comparador"
            className={({ isActive }) => (isActive ? 'nav-link activo' : 'nav-link')}
          >
            Comparador
          </NavLink>

          <button type="button" className="boton-tema" onClick={alternarTema}>
            {tema === 'oscuro' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar