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
    const [ok, setOk] = useState(null);

    //Creamos la funcion para añadir la red, será asincrona
    async function createChain(){
        const url = `RUTA PARA LA FUNCION DE AÑADIR LA RED ${chainID}`
        const response = await fetch(url)
    }

    const onSubmit = async (data) =>{
        
        const chainID = data.chainID;

        //Comprobamos que el data llega desde el formulario
        console.log(chainID)

        //Para testear que el formulario funciona, podemos comentar las 2 líneas de codigo siguiente, y descomentar la 3a, asi damos por hecho que el result esta vacio, pero si le asignamos un valor, vemos el cambio
        //const exists = await fetch(`RUTA PARA LA FUNCIÓN DE COMPROBAR CHAIN DADO UN ID${chainID}`)
        //result = await exists.json();
        //const result = [] /* Aquí el valor estaria vacio, por ende estaria correcto */
        const result = [0] /* Aquí habría un registro, simulando que ya esta utilizada el fetc, asi que sacaria un error */

        //Comprobamos el resultado
        console.log(result.length)

        //Si el resultado da 0, no existe, sino, ya esta en uso
        if(result.length === 0){
            //Ejecutamos la funcion para añadir la red, con el parametro chainID
            createChain(chainID)
            setOk("Chain añadida correctamente!")

        } else {
            //Avisamos por consola que no llega
            console.log("Doesn´t exist");
            setError("Este chain ID no está disponible")
        }
    }
    return <div className="container mt-4"> 
        
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label className="form-style">Introduzca el número de red "ChainID"</label>
                <input {...register('chainID')} type="number" className="form-control"></input>
            </div>
            <button className="btn btn-primary mt-3">Añadir red</button>
        </form>
        {error && <h1 className="alert alert-danger" role="alert">{error}</h1>}
        {ok && <h1 className="alert alert-success" role="alert">{ok}</h1>}
    </div>
    
}