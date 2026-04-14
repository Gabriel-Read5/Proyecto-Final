import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DetallePokemon from './pages/DetallePokemon'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:nombre" element={<DetallePokemon />} />
      </Routes>
    </>
  )
}

export default App