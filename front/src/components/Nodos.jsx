/////////// Sacar la lista de nodos de una network

//Este componente nos dara toda la lista de nodos de una red.
//Primero buscaremos todas las redes, y se añadiran en un desplegable.
//Cuando se seleccione la red del desplegable, se mostrarán los nodos de dicha red.
//Como todo estará registrado en una BD, lo sacaremos de ahí

import React, { useState } from "react";
import { useQuery } from 'react-query'

export function Nodos() {

    //Creamos un estado para guardar la red seleccionada y detectar cuando se cambia.
    const [selectedChainID, setSelectedChainID] = useState(null);
    const [chainError, setError] = useState(null)

    //Buscamos lista de redes
    const { data, isLoading, error } = useQuery('products', () =>
        fetch('http://localhost:5555/products').then((res) => {
            if (!res.ok) {
                throw new Error('Hubo un problema con la petición fetch');
            }
            return res.json();
        }));
    if (isLoading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!data || data.length === 0) {
        return <div>No se encontraron datos</div>;
    }

    // Función para mostrar los nodos de la red seleccionada
    const mostrarNodos = () => {
        // Verifica si data y selectedChainID son válidos
        if (!data || !selectedChainID) {
            return <div>Selecciona una red válida para ver los nodos.</div>;
        }

        // Busca la red seleccionada por su ID
        const redSeleccionada = data.find((chain) => chain.chainID === selectedChainID);

        if (redSeleccionada) {
            return (
                <div>
                    <h2>Nodos de la red {redSeleccionada.chainID}:</h2>
                    <ul>
                        {redSeleccionada.nodos?.map((nodo) => (
                            <li key={nodo}>{nodo}</li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return <div>No se encontró la red con el ID {selectedChainID}.</div>;
        }
    };
    //Ahora creamos una lista, el select tiene la opcion de onChange, el cual nos cambiará el estado de la red seleccionada
    //Con el estado cambiado, fuera de el select, llamamos a la funcion mostrarNodos, que con la red seleccionada, nos mostrara todos los nodos de dicha red
    return (
        <div>
            <select
                className="form-select form-select-lg mb-3"
                aria-label=".form-select-lg example"
                onChange={(e) => setSelectedChainID(e.target.value)}
                value={selectedChainID || ''} // Establece un valor predeterminado si selectedChainID está vacío
            >
                <option value="">Selecciona una red</option>
                {data.length > 0 ? (
                    // Renderiza las opciones solo si hay datos disponibles
                    data.map((chain) => (
                        <option key={chain.chainID} value={chain.chainID}>
                            {chain.chainID}
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