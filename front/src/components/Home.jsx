import React, { useState, useRef, useEffect } from "react";
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom';

export function Home() {
    const [showButtons, setShowButtons] = useState({});
    const [isLoading2, setIsLoading2] = useState(true);
    const node = useRef();
    const { data, isLoading, error } = useQuery("redes", () => {
        return fetch("http://localhost:3000/").then(res => res.json());
    });

    const [status, setStatus] = useState({});

    async function checkStatus(id) {
        const response = await fetch(`http://localhost:3000/status/${id}`);
        const data = await response.json();
        return data.status;
    }
    
    useEffect(() => {
        if (data) {
            setIsLoading2(true);
            Promise.all(data.map(async (red) => {
                try {
                    const redStatus = await checkStatus(red.id);
                    setStatus(prevStatus => ({ ...prevStatus, [red.id]: redStatus }));
                } catch (err) {
                    setError(err.message);
                }
            }))
            .finally(() => setIsLoading2(false));
        }
    }, [data]);

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

    if (isLoading) return <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
    if (error) return <div>Ocurrió un error al cargar las redes: {error.message}</div>;

    const toggleButtons = (id) => {
        setShowButtons(prevState => ({ ...prevState, [id]: !prevState[id] }));
    }

    async function lanzarRed(id) {
        await fetch(`http://localhost:3000/up/${id}`);
    window.location.reload();
    }
    function pararRed(id) {
        return fetch(`http://localhost:3000/up/${id}`)
    }

    //TO DO STATUS DE LA RED
    return (

        <div className="container mt-5">
            <h2>Listado de Redes</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>IP</th>
                        <th>Status</th>
                        <th>Numero de nodos</th>
                        <th>Start</th>
                        <th>Stop</th>
                        <th className="text-center">Opciones</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((red) => (
                        <tr key={red.chainId}>
                            <td>{red.chainId}</td>
                            <td>
                                <Link to={`/redes/${red.id}`}>{red.id}</Link>
                            </td>
                            <td>{red.subnet}</td>
                            <td className={`bi bi-activity ${status[red.id] === 'UP' ? 'neon' : ''}`}>
                            
                            </td>
                            <td>{red.nodos.length}</td>
                            <td>
                                <button type="button" className="btn btn-light custom-button" onClick={() => lanzarRed(red.id)}>
                                            <span className="bi bi-play-fill"></span>
                                </button>
                            </td>
                            <td>
                                <button type="button" className="btn btn-light custom-button" onClick={() => pararRed(red.id)}>
                                            <span className="bi bi-stop-fill"></span>
                                </button>
                            </td>
                            <td className="text-center">
                                <div ref={node}>
                                    <button type="button" className="btn btn-light custom-button" onClick={() => toggleButtons(red.chainId)}>
                                        <span className="bi bi-gear"></span>
                                    </button>
                                    {showButtons[red.chainId] && (
                                        <div style={{ position: 'absolute', backgroundColor: 'white' }}>
                                            <button type="button" className="btn btn-light">Modificar Red</button>
                                            <button type="button" className="btn btn-light">Eliminar Red</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center mb-2">
                <button className="btn btn-light col-2 mx-auto text-center custom-button" onClick={() => window.location.href = 'http://localhost:5173/newchain'}>CREAR RED</button>
            </div>
        </div>
        
    );
}

/*{status[red.id] ? status[red.id] : 'Cargando...'}*/
