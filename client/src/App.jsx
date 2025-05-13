import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SignUp from './pages/SignUp'
import SignIN from './pages/SignIN'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/signin' element={<SignIN />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
   )
}

export default App