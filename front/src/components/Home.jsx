import React, { useState, useRef, useEffect } from "react";
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom';
import './api-styles/estilos.css';

export function Home() {
    const [showButtons, setShowButtons] = useState({});
    const [isLoading2, setIsLoading2] = useState(true);
    const node = useRef();
    const { data, isLoading, error } = useQuery("redes", () => {
        return fetch("http://localhost:3000/").then(res => res.json());
    });

    const [status, setStatus] = useState({});
    //Funcion para detectar si la red está levantada
    async function checkStatus(id) {
        const response = await fetch(`http://localhost:3000/status/${id}`);
        const data = await response.json();
        return data.status;
    }

    function mostrarMensaje(mensaje, exito) {
        // Crea un pop-up con el mensaje proporcionado
        const tipo = exito ? 'success' : 'error';
        alert(`${mensaje} (${tipo})`);
    }
    //Si actualizamos el estado "redStatus" cada red esta encendida o apagada
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

    //Aquí utilizamos un useEffect para detectar si clicamos al engranage de opciones
    useEffect(() => {
        // Agrega un detector de clics al documento
        document.addEventListener("mousedown", handleClick);
        return () => {
            // Limpia el detector de clics al desmontar
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);
    //Aquí si clicamos al engranaje, llamamos a la funcion setShouwButtons, que nos desplegará unas opciones.
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
    //Funcion para lanzar la red
    async function lanzarRed(id) {
        await fetch(`http://localhost:3000/up/${id}`);
        window.location.reload();
    }
    //Funcion para reiniciar la red
    async function reiniciarRed(id) {
        await fetch(`http://localhost:3000/restart/${id}`);
        window.location.reload();
    }
    //Funcion para parar la red
    function pararRed(id) {
        return fetch(`http://localhost:3000/stop/${id}`)
    }
    //Funcion para eliminar la red
    function eliminarRed(id) {
        const url = `http://localhost:3000/network/${id}`;

        // Realiza la solicitud DELETE
        fetch(url, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    // Red eliminada con éxito
                    mostrarMensaje('Se ha eliminado la red.', true);
                } else {
                    // Error al eliminar la red
                    mostrarMensaje('No se ha eliminado la red.', false);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
                mostrarMensaje('Error al eliminar la red.', false);
            });
    }

    //Ahora imprimimos todos los datos de la red
    return (
        <div className="container mt-5">
            <h2>Listado de Redes</h2>
            <table className="table table-striped text-center">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>IP</th>
                        <th>Status</th>
                        <th>Numero de nodos</th>
                        <th>Start</th>
                        <th>Stop</th>
                        <th>Restart</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody >
                    {data.map((red) => (
                        <tr key={red.chainId}>
                            <td>{red.chainId}</td>
                            <td>
                                <Link to={`/redinfo/${red.id}`}>{red.id}</Link>
                            </td>
                            <td className="text-center">{red.subnet}</td>
                            <td className={`bi bi-activity ${status[red.id] === 'UP' ? 'neon' : ''}`}></td>
                            <td className="text-center">{red.nodos.length}</td>
                            <td>
                                <button type="button" className="btn btn-light custom-button btn-start" onClick={() => lanzarRed(red.id)}>
                                    <span className="bi bi-play-fill"></span>
                                </button>
                            </td>
                            <td>
                                <button type="button" className="btn btn-light custom-button btn-stop" onClick={() => pararRed(red.id)}>
                                    <span className="bi bi-stop-fill"></span>
                                </button>
                            </td>
                            <td>
                                <button type="button" className="btn btn-light custom-button btn-restart" onClick={() => reiniciarRed(red.id)}>
                                    <span className="bi bi-arrow-clockwise"></span>
                                </button>
                            </td>
                            <td className="text-center">
                                <div ref={node}>
                                    <button type="button" className="btn btn-light custom-button" onClick={() => toggleButtons(red.chainId)}>
                                        <span className="bi bi-gear"></span>
                                    </button>
                                    {showButtons[red.chainId] && (
                                        <div style={{ position: 'absolute', backgroundColor: 'white' }}>
                                            <button
                                                type="button"
                                                className="btn btn-light btn-eliminar"
                                                onClick={() => eliminarRed(red.id)}
                                            >
                                                Eliminar Red
                                            </button>
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
