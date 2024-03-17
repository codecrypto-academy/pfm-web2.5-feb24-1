import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import InputText from "./InputText";

export function NuevoNodo() {
    const { chainId } = useParams();
    const [nodo, setNodo] = useState(null);

    const { register, control, handleSubmit, formState: { errors }, } = useForm({
        values: nodo,
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
            <h1>Nuevo nodo para la red {chainId}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputText name="name" label="Nombre" help="Nombre" register={register}/>
                <InputText name="type" label="Tipo de nodo" help="Tipo de nodo" register={register}/>
                <InputText name="ip" label="Dirección IP" help="Dirección IP" register={register}/>
                <InputText name="port" label="Puerto" help="Puerto" register={register}/>
            </form>
        </div>
    );
}