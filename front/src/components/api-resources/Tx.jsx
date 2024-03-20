import React from 'react';
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getTx } from "./api";
import CopyToClipboardButton from './CopyToClipboardButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import '../api-styles/estilos.css'; // Asegúrate de que la ruta es correcta para tu proyecto

export function Tx() {
    const params = useParams();
    const { isLoading, isError, data } = useQuery([params.id, params.tx], getTx);

    if (isLoading) {
        return <h1>Cargando...</h1>;
    }

    if (isError) {
        return <h1>Error al cargar los datos de la transacción</h1>;
    }

    return (

        <div><h2>Información Transacción</h2>
            <div className="table-container">
                {/* Tabla con la información de la transacción sin nombres de columnas */}
                <table className="table">
                    <tbody>
                        <tr>
                            <td>Bloque</td>
                            <td>
                                <Link to={`/internalBlock/${params.id}/${data.blockNumber}`}>
                                    {data.blockNumber}
                                </Link>
                            </td>
                        </tr>
                        <tr>
                            <td>From</td>
                            <td>
                                <Link to={`/balance/${params.id}/${data.from}`}>
                                    {data.from}
                                </Link>
                                <CopyToClipboardButton text={data.from}>
                                    <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                                </CopyToClipboardButton>
                            </td>
                        </tr>
                        <tr>
                            <td>To</td>
                            <td>
                                <Link to={`/balance/${params.id}/${data.to}`}>
                                    {data.to}
                                </Link>
                                <CopyToClipboardButton text={data.to}>
                                    <FontAwesomeIcon icon={faCopy} className="copy-icon" />
                                </CopyToClipboardButton>
                            </td>
                        </tr>
                        <tr>
                            <td>Value</td>
                            <td>{data.value}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Visualización estilizada de JSON con los datos de la transacción */}
                <div className="json-display">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            </div>
        </div>
    );
}