import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DetallePokemon from './pages/DetallePokemon'
import Favoritos from './pages/Favoritos'
import Comparador from './pages/Comparador'
import { obtenerTemaGuardado, guardarTema, aplicarTema } from './services/tema'

function App() {
  const [tema, setTema] = useState('claro')

  useEffect(() => {
    const temaGuardado = obtenerTemaGuardado()
    setTema(temaGuardado)
    aplicarTema(temaGuardado)
  }, [])

  const alternarTema = () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro'
    setTema(nuevoTema)
    guardarTema(nuevoTema)
    aplicarTema(nuevoTema)
  }

  return (
    <>
      <Navbar tema={tema} alternarTema={alternarTema} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:nombre" element={<DetallePokemon />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/comparador" element={<Comparador />} />
      </Routes>
    </>
  )
}

export default App