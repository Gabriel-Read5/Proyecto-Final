import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Navbar() {
  return (
    <motion.nav
      className="barra"
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="contenedor barra-contenido">
        <Link to="/" className="logo">
          Pokédex Web
        </Link>
        <span className="marca-secundaria">React · PokeAPI · PowerShell</span>
      </div>
    </motion.nav>
  )
}

export default Navbar
