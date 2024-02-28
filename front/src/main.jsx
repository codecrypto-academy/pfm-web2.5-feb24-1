import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

//import App from './App.jsx'
import { NewChain } from './components/NewChain.jsx'
import { Inicio } from './components/Inicio.jsx'
import { Perfil } from './components/Perfil.jsx'
import { Redes } from './components/Redes.jsx'
import { Nodos } from './components/Nodos.jsx'
import './index.css'


//Ruta rapida creada para yo poder ver el NewChain
function App() {
  /*return <BrowserRouter >
          <Routes>
            <Route path='/' element={<NewChain></NewChain>}>
              <Route path='/newchain' element={<NewChain></NewChain>}/>
            </Route>
          </Routes>
        </BrowserRouter >*/
  return <BrowserRouter >
    <Routes>
      <Route path='/' element={<Inicio></Inicio>}>
        <Route index element={<NewChain></NewChain>}></Route>
        <Route path='*' element={<NewChain></NewChain>}></Route>
        <Route path='newchain' element={<NewChain></NewChain>}></Route>
        <Route path='perfil' element={<Perfil></Perfil>}></Route>
        <Route path='redes' element={<Redes></Redes>}></Route>
        <Route path='nodos' element={<Nodos></Nodos>}></Route>
      </Route>
    </Routes>
  </BrowserRouter >
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
