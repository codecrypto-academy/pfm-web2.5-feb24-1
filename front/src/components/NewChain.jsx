/////////Formulario para crear la red que nos pida: NUMERO DE RED. Creará la red con el nodo1

//El formulario tendrá que tener un input tipo numero para el ChainID
//Tendra un boton donde llame la funcion onSubmit para llamar la funcion al backend de añadir un nodo
//Antes pero se tendrà que verificar que ese ChainID no esté ya registrado, y si lo está, que lance un error avisando

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputText from "./InputText";

export function NewChain() {
  const params = useParams();
  const [network, setNetwork] = useState(null);
  let id = params.id;

  
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/${id}`).then((response) => {
        response.json().then((data) => {
          console.log(data);
          setNetwork(data);
        });
      }); 
    } else {
      setNetwork({
        id: "",
        chainId: 0,
        subnet: "",
        ipBootnode: "",
        alloc: [
          "C077193960479a5e769f27B1ce41469C89Bec299",
        ],
        nodos: [
          {
            type: "",
            name: "",
            ip: "",
            port: 0,
          },
        ],
      })
    }
  }, [id]);
  

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: network,
  });

  const {
    fields: allocFields,
    append: allocAppend,
    remove: allocRemove,
  } = useFieldArray({
    control,
    name: "alloc",
  });

  const {
    fields: nodosFields,
    append: nodosAppend,
    remove: nodosRemove,
  } = useFieldArray({
    control,
    name: "nodos",
  });

  const onSubmit = (data) => {
    console.log(data);
    fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    });

  };

  return (
    <div className="container">
      <h1>Add Network</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          name="id"
          label="Network ID"
          help="Network ID"
          register={register}
        />
        <InputText
          name="chainId"
          label="Chain ID"
          help="Chain ID"
          register={register}
        />
        <InputText
          name="subnet"
          label="Subnet con /24 al final"
          help="Subnet"
          register={register}
        />
        <InputText
          name="ipBootnode"
          label="IP Bootnode"
          help="IP Bootnode"
          register={register}
        />
        <h3>Alloc</h3>
        <input
          className="btn btn-primary"
          type="button"
          onClick={() => allocAppend("")}
          value="Add"
        />
        <div>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {allocFields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                    <input
                      type="button"
                      onClick={() => allocRemove(index)}
                      value="X"
                    />
                  </td>
                  <td>
                    <input {...register(`alloc.${index}`)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Nodos</h3>
        <input
          className="btn btn-primary"
          type="button"
          onClick={() => nodosAppend("")}
          value="Add"
        />
        <div>
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Type</th>
                <th>Name</th>
                <th>IP</th>
                <th>Port</th>
              </tr>
            </thead>
            <tbody>
              {nodosFields.map((field, index) => (
                <tr key={field.id}>
                  <td>
                    <input
                      type="button"
                      onClick={() => nodosRemove(index)}
                      value="X"
                    />
                  </td>
                  <td>
                    <select {...register(`nodos.${index}.type`)}>
                        <option value="rpc">RPC</option>
                        <option value="signer">Signer</option>
                        <option value="miner">Miner</option>
                    </select>
                </td>
                  <td>
                    <input {...register(`nodos.${index}.name`)} />
                  </td>
                  <td>
                    <input {...register(`nodos.${index}.ip`)} />
                  </td>
                  <td>
                    <input {...register(`nodos.${index}.port`)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <input className="btn btn-primary" type="submit" />
      </form>
    </div>
  );
}















/*

import React, { useState }  from "react";
import {useForm, useFieldArray, useParams } from "react-hook-form";


export function NewChain(){
    //Declaramos el handleSubmit para recojer los datos del formulario
    const { register, control, handleSubmit,formState: { errors }, } = useForm({ values: network,});
    const params = useParams();
    const [network, setNetwork] = useState(null);
    let id = params.id
    //Declaramos un state error, para lanzar error en caso de que no exista, lo inizializamos como null
    const [error, setError] = useState(null);
    const [ok, setOk] = useState(null);

    useEffect(() => {
        if (id) {
          fetch(`http://localhost:5555/${id}`).then((response) => {
            response.json().then((data) => {
              console.log(data);
              setNetwork(data);
            });
          }); 
        } else {
          setNetwork({
            id: "",
            chainId: 0,
            subnet: "",
            ipBootnode: "",
            alloc: [
              "C077193960479a5e769f27B1ce41469C89Bec299",
            ],
            nodos: [
              {
                type: "",
                name: "",
                ip: "",
                port: 0,
              },
            ],
          })
        }
      }, [id]);

    //Creamos la funcion para añadir la red, será asincrona
    async function createChain(data){
    const url = `http://localhost:5555/crearRed`
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } 
}
    const {
        fields: allocFields,
        append: allocAppend,
        remove: allocRemove,
    } = useFieldArray({
        control,
        name: "alloc",
    });

    const onSubmit = async (data) =>{
        
        const chainID = data.chainID;
        createChain(data)
        //Comprobamos que el data llega desde el formulario

        //Para testear que el formulario funciona, podemos comentar las 2 líneas de codigo siguiente, y descomentar la 3a, asi damos por hecho que el result esta vacio, pero si le asignamos un valor, vemos el cambio
        const exists = await fetch(`RUTA PARA LA FUNCIÓN DE COMPROBAR CHAIN DADO UN ID${chainID}`)
        result = await exists.json();

        //Comprobamos el resultado
        //console.log(result.length)

        //Si el resultado da 0, no existe, sino, ya esta en uso
        if(result.length === 0){
            //Ejecutamos la funcion para añadir la red, con el parametro chainID
            createChain(chainID)
            setOk("Chain añadida correctamente!")
        } else {
            createChain(chainID)
            //Avisamos por consola que no llega
            console.log("Doesn´t exist");
            setError("Este chain ID no está disponible")
        }
    }
    return <div className="container mt-4"> 
        
        <form className="form-group" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
                <label className="form-style">Introduzca el Nombre de la red</label>
                <input required {...register('chainName')} type="number" className="form-control"></input>
                <label className="form-style">Introduzca el número de red "ChainID"</label>
                <input required {...register('chainID')} type="number" className="form-control"></input>

                <label className="form-style">Introduzca la Subnet</label>
                <input required {...register('subnet')} type="number" className="form-control"></input>

                <label className="form-style">Introduzca la IP del bootnode</label>
                <input required {...register('ipBootnode')} type="number" className="form-control"></input>

                <h2>Allocation</h2>
                <input className="btn btn-primary" type="button" onClick={() => allocAppend("")} value="Add"/>

                <label className="form-style">Introduzca el tipo de nodo</label><br></br>
                <select {...register('tipoNodo')}>
                    <option value="signer">Firmador</option>
                    <option value="miner">Minador</option>
                    <option value="rpc">RPC</option>
                </select>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-light custom-button mt-3">Añadir red</button>
            </div>
        </form>
        {error && <h1 className="alert alert-danger" role="alert">{error}</h1>}
        {ok && <h1 className="alert alert-success" role="alert">{ok}</h1>}
    </div>
    
}*/