//Formulario para crear la red que nos pida: NUMERO DE RED. Creará la red con el nodo1

import React from "react";
import {useForm } from "react-hook-form";


export function NewChain(){

    const onSubmit = async (data) =>{

    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="">Introduzca el número de red "CainID"</label>
                        <input {...register('chainID')} type="number" className="form-control"></input>
                    </div>
                    <button className="btn btn-primary mt-3">Añadir red</button>
        </form>
    </div>
    
}