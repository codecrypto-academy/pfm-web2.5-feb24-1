import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputText from "./InputText";
import { useQuery } from "react-query";

export function NuevoNodo() {
    const { id } = useParams();
    const [nodo, setNodo] = useState(null);

    const { register, control, handleSubmit, formState: { errors }, } = useForm({
        values: nodo,
    });

    //Buscamos lista de redes
    const { data, isLoading, error } = useQuery('redes', () =>
        fetch(`http://localhost:3000/${id}`).then((res) => {
            if (!res.ok) {
                throw new Error('Hubo un problema con la petición fetch');
            }
            return res.json();
        }));
    if (isLoading) {
        return <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const onSubmit = (data) => {
        console.log(data);
        fetch(`http://localhost:3000/network/${id}/node`, {
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
        window.history.back();
    };
    
    return (
        <div className="container">
            <h1>Nuevo nodo para la red {id} con IP {data.subnet}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputText name="name" label="Nombre" help="Nombre" register={register}/>
                <InputText name="type" label="Tipo de nodo" help="Tipo de nodo" register={register}/>
                <InputText name="ip" label="Dirección IP" help="Dirección IP" register={register}/>
                <InputText name="port" label="Puerto" help="Puerto" register={register}/>
                <input className="btn btn-primary" type="submit" />
            </form>
        </div>
    );
}