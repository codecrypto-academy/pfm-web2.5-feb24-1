/////////Formulario para crear la red que nos pida: NUMERO DE RED. Creará la red con el nodo1

//El formulario tendrá que tener un input tipo numero para el ChainID
//Tendra un boton donde llame la funcion onSubmit para llamar la funcion al backend de añadir un nodo
//Antes pero se tendrà que verificar que ese ChainID no esté ya registrado, y si lo está, que lance un error avisando

import React, { useState }  from "react";
import {useForm } from "react-hook-form";


export function NewChain(){
    //Declaramos el handleSubmit para recojer los datos del formulario
    const { register, handleSubmit } = useForm();

    //Declaramos un state error, para lanzar error en caso de que no exista, lo inizializamos como null
    const [error, setError] = useState(null);

    //Creamos la funcion para añadir la red, será asincrona
    async function createChain(){
        const url = `RUTA PARA LA FUNCION DE AÑADIR LA RED ${chainID}`
        const response = await fetch(url)
    }

    const onSubmit = async (data) =>{
        
        const chainID = data.chainID;

        //Comprobamos que el data llega desde el formulario
        console.log(chainID)

        const exists = await fetch(`RUTA PARA LA FUNCIÓN DE COMPROBAR CHAIN DADO UN ID${chainID}`)
        const result = await exists.json();

        //Comprobamos el resultado
        console.log(result)

        //Si el resultado da 0, no existe, sino, ya esta en uso
        if(result.lenght === 0){
            //Ejecutamos la funcion para añadir la red, con el parametro chainID
            createChain(chainID)

        } else {
            //Avisamos por consola que no llega
            console.log("Doesn´t exist");
            setError("Este chain ID no está disponible")
        }
    }
    return <div className="container mt-4">
        
        {error && <h1 className="alert">{error}</h1>}
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label className="form-style" htmlFor="">Introduzca el número de red "ChainID"</label>
                <input {...register('chainID')} type="number" className="form-control"></input>
            </div>
            <button className="btn btn-primary mt-3">Añadir red</button>
        </form>
    </div>
    
}