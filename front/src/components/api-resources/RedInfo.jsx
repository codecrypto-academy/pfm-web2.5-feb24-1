import React from 'react';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { getChain } from "./api";
import CopyToClipboardButton from './CopyToClipboardButton'; // Asegúrate de tener este componente
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import '../api-styles/estilos.css'; // Ajusta esta importación según la estructura de tu proyecto

export function Redinfo() {
    const params = useParams();
    const { isLoading, isError, data } = useQuery(['red', params.id], getChain);

    // Función para recortar hashes y direcciones largas
    const shorten = (str) => `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;

    if (isLoading) return <h1>Cargando...</h1>;
    if (isError) return <h1>Error</h1>;

    return (
        <div>
            <h2>Información de la Red y Transacciones</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Bloque</th>
                        <th>Hash</th>
                        <th>TimeStamp</th>
                        <th>Transacciones</th>
                        <th>Transacción Hash</th>
                        <th>Gas Usado</th>
                        <th>Gas Limit</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td><Link to={`/internalBlock/${params.id}/${item.number}`}>{item.number}</Link></td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CopyToClipboardButton text={item.hash}>
                                        <FontAwesomeIcon icon={faCopy} />
                                    </CopyToClipboardButton>
                                    {shorten(item.hash)}
                                </div>
                            </td>
                            <td>{new Date(item.timestamp * 1000).toLocaleString()}</td>
                            <td>{item.transHash.length > 0 ? item.transHash.length + ' transacciones' : 'Sin transacciones'}</td>
                            <td>
                                <div className={item.transHash.length > 0 ? "transacciones-container" : ""}>
                                    {item.transHash.length > 0 ? item.transHash.map((transHash, idx) => (
                                        <div key={idx} style={{ marginBottom: '5px' }}>
                                            <CopyToClipboardButton text={transHash}>
                                                <FontAwesomeIcon icon={faCopy} />
                                            </CopyToClipboardButton>
                                            <Link to={`/tx/${params.id}/${transHash}`}>{shorten(transHash)}</Link>
                                        </div>
                                    )) : 'N/A'}
                                </div>
                            </td>
                            <td>{item.gasUsed}</td>
                            <td>{item.gasLimit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}