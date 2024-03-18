/////////// Sacar la lista de nodos de una network

//Este componente nos dara toda la lista de nodos de una red.
//Primero buscaremos todas las redes, y se añadiran en un desplegable.
//Cuando se seleccione la red del desplegable, se mostrarán los nodos de dicha red.
//Como todo estará registrado en una BD, lo sacaremos de ahí

import React, { useState } from "react";
import { useQuery } from 'react-query'

export function Nodos() {

    //Creamos un estado para guardar la red seleccionada y detectar cuando se cambia.
    const [selectedID, setSelectedChainID] = useState(null);
    const [chainError, setError] = useState(null)

    //Buscamos lista de redes
    const { data, isLoading, error } = useQuery('redes', async () => {
        const res = await fetch('http://localhost:3000/');
        if (!res.ok) {
            throw new Error('Hubo un problema con la petición fetch');
        }
        const data = await res.json();
        // Si solo hay una red, establece selectedID a su id
        if (data.length === 1) {
            setSelectedChainID(data[0].id);
        }
        return data;
    });
    
    if (isLoading) {
        return <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    }
    
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    if (!data || data.length === 0) {
        return <div>No se encontraron datos</div>;
    }
    
    

    //Funcion para eliminar nodos/*
   /* const eliminarNodos = (id,  nodo) =>{
        fetch(`http://localhost:3000/network/${id}/node/${nodo}`).then((res) => {
            if (!res) {
                throw new Error('Hubo un error al eliminar el nodo')
            }
            return res.json()
        })
    }*/
    function eliminarNodos(id, nodo) {
        const url = `http://localhost:3000/network/${id}/node/${nodo}`;

        // Realiza la solicitud DELETE
        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                    // Red eliminada con éxito
                   // mostrarMensaje('Se ha eliminado el nodo.', true);
                } else {
                    // Error al eliminar la red
                   // mostrarMensaje('No se ha eliminado el nodo.', false);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
               // mostrarMensaje('Error al eliminar la red.', false);
            });
    }
    // Función para mostrar los nodos de la red seleccionada
    const mostrarNodos = () => {
        // Verifica si data y selectedID son válidos
        if (!data || !selectedID) {
            return <div>Selecciona una red válida para ver los nodos.</div>;
        }
        
        // Busca la red seleccionada por su ID
        // Si encuentra datos con la red seleccionada, nos muestra los nodos, y nos aparece con un botón en cada uno para eliminar
        // Sinó, nos lanza un error
        const redSeleccionada = data.find((chain) => chain.id === selectedID);
        
        
        if (redSeleccionada) {
            return (
                <div className="text-justify">
                    <h2>Nodos de la red {redSeleccionada.id}:</h2>
                    <table className="table table-striped table-hover">
                        {redSeleccionada.nodos?.map((nodo) => (
                                    <tr key={nodo.name} >
                                        <td ><h5 >{nodo.name}</h5></td>
                                        <td ><button type="button" className="btn btn-light custom-button" onClick={() => eliminarNodos(redSeleccionada.id, nodo.name)}>Eliminar</button></td>
                                    </tr>
                        ))}
                    </table>
                    <div className="d-flex justify-content-left">
                        <button className="btn btn-light col-2 mx-auto text-center custom-button" onClick={() => window.location.href = `http://localhost:5173/nuevo-nodo/${redSeleccionada.id}`}>CREAR NODO</button>
                    </div>
                </div>
            );
        } else {
            return <div>No se encontró la red con el ID {selectedID}.</div>;
        }
    };
    //Ahora creamos una lista, el select tiene la opcion de onChange, el cual nos cambiará el estado de la red seleccionada
    //Con el estado cambiado, fuera de el select, llamamos a la funcion mostrarNodos, que con la red seleccionada, nos mostrara todos los nodos de dicha red
    return (
        <div><h1>Lista de redes:</h1>
            <select
                className="form-select form-select-lg mb-3"
                aria-label=".form-select-lg example"
                onChange={(e) => setSelectedChainID(e.target.value)}
                value={selectedID || ''} // Establece un valor predeterminado si selectedChainID está vacío
            >
                {data.length > 0 ? (
                    // Renderiza las opciones solo si hay datos disponibles
                    data.map((chain) => (
                        <option key={chain.id} value={chain.id}>
                            {chain.id}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No hay datos disponibles</option>
                )}
            </select>
            {mostrarNodos()}
            {error && <p className="alert alert-success">{error.message}</p>}
            {chainError && <p className="alert alert-success">{chainError}</p>}
        </div>
    );
}