const {Web3} = require("web3")
const {ethers} = require("ethers")
const fs = require("fs")


//const web3 = new Web3("http://localhost:9999")


const express = require("express");
const cors = require("cors");
const db = require('./db');

// Inicialización de la aplicación Express
const app = express();
app.use(cors());

// Inicialización de la base de datos antes de empezar a escuchar en el puerto
db.init().then(() => {
    app.listen(5555, () => {
        console.log("Escuchando el backend en el puerto 5555");
    });
}).catch(err => {
    console.error("Error al inicializar la conexión a la base de datos:", err);
});

// Endpoint para verificar que el servidor está en funcionamiento
app.get("/ping", async (req, res) => {
    res.send({ fecha: new Date().toISOString()});
});

// Endpoint para consultar la tabla REDES en la base de datos
app.get("/redes", async (req, res) => {
    try {
        const result = await db.q("SELECT * FROM REDES", []);
        res.send(result.rows); // Asumiendo que el resultado es un objeto con una propiedad 'rows'
    } catch (error) {
        console.error("Error al realizar la consulta en la base de datos:", error);
        res.status(500).send(error);
    }
});





/*
const json = JSON.parse(fs.readFileSync("../nodo/data/keystore/UTC--2024-02-17T20-51-34.980090419Z--267d1477b48716439fec3fa1b0b1d40855db8aa1"))
console.log(json)
app.get("/balance/:address", async (req, res) => {
    web3.eth.getBalance(req.params.address)
        .then(saldo => {
            res.send(saldo.toString());
        }).catch(err => {
            res.send(err);
        })
})

app.get("/faucet/:address", async(req, res) => {

    const provider = new ethers.JsonRpcProvider("http://localhost:9999")
    const wallet = ethers.Wallet.fromEncryptedJsonSync(
        fs.readFileSync("../nodo/data/keystore/UTC--2024-02-17T20-51-34.980090419Z--267d1477b48716439fec3fa1b0b1d40855db8aa1"),
        fs.readFileSync("../nodo/password.txt").toString()
    )
    wallet.connect(provider)

    const signer = wallet.connect(provider);
    //Enviamos la cantidad a la cuenta

    const tx = await signer.sendTransaction({
        from: wallet.address,
        to: req.params.address,
        value: ethers.parseUnits("0.1",18)
    });
    await tx.wait()
    console.log(JSON.stringify(tx, null, 2))
    const balance = await provider.getBalance(req.params.address)
    console.log(ethers.formatEther(balance))
    res.send(ethers.formatEther(balance))
})*/