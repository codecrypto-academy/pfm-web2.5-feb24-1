import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NewChain } from './components/NewChain.jsx'
import { Inicio } from './components/Inicio.jsx'
import { Nodos } from './components/Nodos.jsx'
import { TerminosCondiciones } from './components/TerminosCondiciones.jsx'
import { Privacidad } from './components/Privacidad.jsx'
import { QuienesSomos } from './components/QuienesSomos.jsx'
import { Home } from './components/Home.jsx'
import './index.css'
import { NuevoNodo } from './components/NuevoNodo.jsx'
import { Redinfo } from './components/api-resources/RedInfo.jsx'
import { Tx } from './components/api-resources/Tx.jsx'
import { Bloque } from './components/api-resources/Bloque.jsx'
import { Balance } from './components/api-resources/Balance.jsx'
import { Fucet } from './components/api-resources/Faucet.jsx'

const queryClient = new QueryClient()
function App() {
  return <QueryClientProvider client={queryClient}>
  <BrowserRouter >
    <Routes>
      <Route path='/' element={<Inicio></Inicio>}>
        <Route index element={<Home></Home>}></Route>
        <Route path='*' element={<NewChain></NewChain>}></Route>
        <Route path='newchain' element={<NewChain></NewChain>}></Route>
        <Route path='nodos' element={<Nodos></Nodos>}></Route>
        <Route path='nuevo-nodo/:id' element={<NuevoNodo></NuevoNodo>}></Route>
        <Route path='terminos-y-condiciones' element={<TerminosCondiciones></TerminosCondiciones>}></Route>
        <Route path='privacidad' element={<Privacidad></Privacidad>}></Route>
        <Route path='quienes-somos' element={<QuienesSomos></QuienesSomos>}></Route>
        <Route path='redinfo/:id' element={<Redinfo></Redinfo>}></Route>
        <Route path='tx/:id/:tx' element={<Tx></Tx>}></Route>
        <Route path='internalBlock/:idRed/:idBloque' element={<Bloque></Bloque>}></Route>
        <Route path='balance/:id/:address' element={<Balance></Balance>}></Route>
        <Route path='faucet' element={<Fucet></Fucet>}></Route>
      </Route>
    </Routes>
  </BrowserRouter >
  </QueryClientProvider>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
