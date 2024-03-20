import React from 'react';
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getBlock } from "./api";
import CopyToClipboardButton from './CopyToClipboardButton'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import '../api-styles/estilos.css'; 

// Componente principal que muestra la información de un bloque específico
export function Bloque() {
    // Obtener los parámetros de la URL
    const params = useParams();
    // Utilizar React Query para cargar los datos del bloque usando los parámetros de la URL
    const { isLoading, isError, data } = useQuery([params.idRed, params.idBloque], getBlock);

    // Función para acortar hashes y direcciones para mejorar la legibilidad
    const shorten = (str) => `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;

    // Mostrar carga mientras los datos están siendo obtenidos
    if (isLoading) return <h1>Cargando...</h1>;
    // Mostrar error si no se pueden cargar los datos
    if (isError) return <h1>Error</h1>;

    return (
        <div className="table-container">
            {/* Tabla principal con detalles del bloque */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Hash</th>
                        <th>Timestamp</th>
                        <th>Total de Transacciones</th>
                        <th>Gas Usado</th>
                        <th>Límite de Gas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{data.number}</td>
                        <td>
                            {shorten(data.hash)}
                            <CopyToClipboardButton text={data.hash}>
                                <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                            </CopyToClipboardButton>
                        </td>
                        <td>{data.timestamp}</td>
                        <td>{data.totalTransactions}</td>
                        <td>{data.gasUsed}</td>
                        <td>{data.gasLimit}</td>
                    </tr>
                </tbody>
            </table>

            {/* Tabla de transacciones, visible solo si hay transacciones */}
            {data.transactions.length > 0 && (
                <div>
                    <h2>Transacciones</h2>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Hash</th>
                                <th>De</th>
                                <th>A</th>
                                <th>Valor (TA)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.transactions.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link to={`/tx/${params.idRed}/${item.hash}`}>{shorten(item.hash)}</Link>
                                        <CopyToClipboardButton text={item.hash}>
                                            <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                                        </CopyToClipboardButton>
                                    </td>
                                    <td>
                                        {shorten(item.from)}
                                        <CopyToClipboardButton text={item.from}>
                                            <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                                        </CopyToClipboardButton>
                                    </td>
                                    <td>
                                        {shorten(item.to)}
                                        <CopyToClipboardButton text={item.to}>
                                            <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                                        </CopyToClipboardButton>
                                    </td>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Visualización estilizada de JSON con los datos del bloque */}
            <div className="json-display">
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}
