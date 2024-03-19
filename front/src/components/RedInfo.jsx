import React, { useState, useRef, useEffect } from "react";
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom';
import { getChain } from "./api";


export function Redinfo() {
    const params = useParams()
    //console.log(params.id)
    const { isLoading, isError, data } = useQuery(['red',params.id], getChain)
    //console.log(data)
    if (isLoading)
        return <h1>Cargando</h1>
    if (isError)
        return <h1>Error</h1>
    return <div><h1>Información de la red y transacciones</h1>
        <table className="table">
            <thead>
                <tr>
                    <th>Transacción</th>
                    <th>Hash</th>
                    <th>TimeStamp</th>
                    <th>Transacciones</th>
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
                            <td>{item.hash}</td>
                            <td>{item.timestamp}</td>
                            <td>{item.transactions}</td>
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