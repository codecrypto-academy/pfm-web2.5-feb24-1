import React, { useState, useRef, useEffect } from "react";
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom';

export function Home() {
    const [showButtons, setShowButtons] = useState({});
    const node = useRef();

    const { data, isLoading, error } = useQuery("redes", () => {
        return fetch("http://localhost:5555/redes").then(res => res.json());
    });

    useEffect(() => {
        // Agrega un detector de clics al documento
        document.addEventListener("mousedown", handleClick);
        return () => {
            // Limpia el detector de clics al desmontar
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = e => {
        if (node.current.contains(e.target)) {
            // Dentro del clic, no hacemos nada
            return;
        }
        // Fuera del clic, cierra el desplegable
        setShowButtons({});
    };

    if (isLoading) return <div>Cargando listado de redes...</div>;
    if (error) return <div>Ocurrió un error al cargar las redes: {error.message}</div>;

    const toggleButtons = (id) => {
        setShowButtons(prevState => ({ ...prevState, [id]: !prevState[id] }));
    }

    return (
        <div className="container mt-5">
            <h2>Listado de Redes</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Wallet Firmante</th>
                        <th>Descripción</th>
                        <th>Fecha de Creación</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((red) => (
                        <tr key={red.CHAIN_ID}>
                            <td>{red.CHAIN_ID}</td>
                            <td>
                                <Link to={`/redes/${red.CHAIN_ID}`}>{red.NOMBRE}</Link>
                            </td>
                            <td>{red.WALLET_FIRMANTE}</td>
                            <td>{red.DESCRIPCION}</td>
                            <td>{new Date(red.FECHA_CREACION).toLocaleString()}</td>
                            <td className="text-center">
                                <div ref={node}>
                                    <button type="button" className="btn btn-light" onClick={() => toggleButtons(red.CHAIN_ID)}>
                                        <span className="bi bi-gear"></span>
                                    </button>
                                    {showButtons[red.CHAIN_ID] && (
                                        <div style={{ position: 'absolute',  backgroundColor: 'white' }}>
                                            <button type="button" className="btn btn-light">Añadir Nodo</button>
                                            <button type="button" className="btn btn-light">Eliminar Nodo</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}


/*
{showButtons && (
                <div className="mt-3 text-center">
                    <button type="button" className="btn btn-primary mr-2">Añadir Nodo</button>
                    <button type="button" className="btn btn-primary mr-2">Borrar Nodo</button>
                </div>
            )}
            */


/*
export function Home (){
    const [selectedChainID, setSelectedChainID] = useState(null);
    const [chainError, setError] = useState(null)

    const { data, isLoading, error } = useQuery('redes', () =>
        fetch('http://localhost:5555/redes').then((res) => {
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
    return (
        <div><h1>Lista de redes:</h1>
            <select
                className="form-select form-select-lg mb-3"
                aria-label=".form-select-lg example"
                onChange={(e) => setSelectedChainID(e.target.value)}
                value={selectedChainID || ''} // Establece un valor predeterminado si selectedChainID está vacío
            >
                {data.length > 0 ? (
                    // Renderiza las opciones solo si hay datos disponibles
                    data.map((chain) => (
                        <option key={chain.CHAIN_ID} value={chain.CHAIN_ID}>
                            {chain.CHAIN_ID}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>No hay datos disponibles</option>
                )}
            </select>
            {error && <p className="alert alert-success">{error.message}</p>}
            {chainError && <p className="alert alert-success">{chainError}</p>}
        </div>
    );
}*/