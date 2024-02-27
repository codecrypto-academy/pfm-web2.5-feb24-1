import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.jsx'
import { NewChain } from './components/NewChain.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

//Ruta rapida creada para yo poder ver el NewChain
function App(){
  return <BrowserRouter >
          <Routes>
            <Route path='/' element={<NewChain></NewChain>}>
              <Route path='/newchain' element={<NewChain></NewChain>}/>
            </Route>
          </Routes>
        </BrowserRouter >
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
