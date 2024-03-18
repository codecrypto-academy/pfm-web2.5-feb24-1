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
    const { data, isLoading, error } = useQuery('redes', () =>
        fetch('http://localhost:3000/').then((res) => {
            if (!res.ok) {
                throw new Error('Hubo un problema con la petición fetch');
            }
            return res.json();
        }));
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

    //Funcion para eliminar nodos
    const eliminarNodos = (nodo,  id) =>{
        fetch(`http://localhost:3000/network/${id}/node/${nodo}`).then((res) => {
            if (!res) {
                throw new Error('Hubo un error al eliminar el nodo')
            }
            return res.json()
        })
    }
    // Función para mostrar los nodos de la red seleccionada
    const mostrarNodos = () => {
        // Verifica si data y selectedChainID son válidos
        if (!data || !selectedID) {
            return <div>Selecciona una red válida para ver los nodos.</div>;
        }
        // Busca la red seleccionada por su ID
        // Si encuentra datos con la red seleccionada, nos muestra los nodos, y nos aparece con un botón en cada uno para eliminar
        // Sinó, nos lanza un error
        const redSeleccionada = data.find((chain) => chain.id === selectedID);
        if (redSeleccionada) {
            return (
                <div>
                    <h2>Nodos de la red {redSeleccionada.id}:</h2>
                    <table className="table table-striped table-hover">
                        {redSeleccionada.nodos?.map((nodo) => (
                                    <tr>
                                        <td ><li key={nodo.name}>{nodo.name}</li></td>
                                        <td ><button type="button" className="btn btn-light custom-button" onSubmit={eliminarNodos(nodo, selectedID)}>Eliminar</button></td>
                                    </tr>
                        ))}
                    </table>
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