import React, { useState, useRef, useEffect } from "react";
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom';
import { getChain } from "./api";


export function Redinfo() {
    useEffect(() => {
        const intervalo = setInterval(() => {
          window.location.reload();
        }, 2000); // Se ejecuta cada 2 segundos
    
        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalo);
      }, []); // Pasar un array vacío como segundo argumento para que se ejecute solo una vez
    const params = useParams()
    const { isLoading, isError, data } = useQuery(['red',params.id], getChain)
    if (isLoading)
        return <h1>Cargando</h1>
    if (isError)
        return <h1>Error</h1>
    return <div><h1>Información de la red y transacciones</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Bloque</th>
                    <th>Hash</th>
                    <th>TimeStamp</th>
                    <th>Transacciones</th>
                    <th>Transaccion Hash</th>
                    <th>Miner</th>
                    <th>Gas Usado</th>
                    <th>Gas Limit</th>
                </tr>
            </thead>
            <tbody>
            {
                    data.map((item, index) =>
                        <tr key={index}>
                            <td>{item.number}</td>
                            <td><Link to={`/tx/${params.id}/${item.hash}`}></Link></td>
                            <td>{item.timestamp}</td>
                            <td>{item.transactions}</td>
                            <td>
                                {<Link to={`/tx/${params.id}/${item.transHash}`}>{item.transHash}</Link>
                                }
                            </td>
                            <td>{item.miner}</td>
                            <td>{item.gasUsed}</td>
                            <td>{item.gasLimit}</td>
                        </tr>
                    )
            }
            </tbody>
        </table>

        <pre>
           
        </pre>
    </div>
}/* 

 {JSON.stringify(data, null, 4)}
{
                    data.transactions.map((item, index) =>
                        <tr key={index}>
                            <td>
                            <Link to={`/tx/${item}`}>{item}</Link>
                            </td>
                        </tr>
                    )
                }*/