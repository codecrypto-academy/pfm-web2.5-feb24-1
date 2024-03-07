const {Web3} = require("web3")
const {ethers} = require("ethers")
const fs = require("fs")
const path = require('path');
const bodyParser = require('body-parser')
const quote = require('shell-quote').quote;
const express = require("express");
const cors = require("cors");
const db = require('./db');
const { exec, execSync } = require("child_process");
const yaml = require('js-yaml');

// Arreglado problema con los espacios
//let pathNodo = path.join(__dirname, '../nodo').replace(/ /g, '\\ ');
//let PATH_NODO = quote([pathNodo]).replace(/'/g, '"');

const DIR_BASE = path.join(__dirname, 'datos');
const DIR_NETWORKS = path.join(DIR_BASE, 'networks');
 
// Inicialización de la aplicación Express
const app = express();
app.use(cors());
app.use(bodyParser.json())


// Middleware para el uso de body en peticiones
app.use(bodyParser.json());

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

// Endpoint para insertar Redes en base de datos
app.post("/redes", async (req, res) => {
    const datos = req.body;

    const sql = `INSERT INTO C##NODO.redes (chain_id, nombre, wallet_firmante, descripcion) VALUES (:chainId, :nombre, :addressSigner, :descripcion)`;

    const result = await db.q(sql, datos);
    console.log('Red insertada con éxito');

    res.status(201).send(result);
});

// Endpoint para modificar Redes en base de datos
app.put("/redes/:chainId", async (req, res) => {
    const chainId = req.params.chainId;
    const datos = req.body;

    const sql = `UPDATE C##NODO.redes SET nombre = :nombre, descripcion = :descripcion WHERE chain_id = ${chainId}`;

    const result = await db.q(sql, datos);
    console.log('Red modificada con éxito');

    res.status(200).send(result);
});

// Endpoint para borrar Redes en base de datos
app.delete("/redes/:chainId", async (req, res) => {
    const chainId = req.params.chainId;

    //TODO: try-catch

    const sql = `DELETE FROM C##NODO.redes WHERE chain_id = ${chainId}`;
    borrarNodosDeRed(chainId)

    const result = await db.q(sql, []);
    console.log('Red borrada con éxito');

    res.status(204).send();
});

async function borrarNodosDeRed (chainId) {
    const sql = `DELETE FROM C##NODO.nodos WHERE chain_id = ${chainId}`;

    const result = await db.q(sql, []);
    console.log(`Nodos de la red ${chainId} borrada con éxito`);
}

// Asegura la creación de directorios necesarios para almacenar los datos de la red
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("llega")
    }
}
// TO DO change period to 4
// Genera y guarda un archivo de configuración de génesis basado en el chainId
function createGenesisFile(chainId, networkDir) {
    const genesisPath = path.join(networkDir, 'genesis.json');
    const genesis = {
        // Configuración básica de la red Ethereum, incluyendo el chainId y configuraciones para EIPs
        "config": {
            "chainId": chainId,
            "homesteadBlock": 0,
            "eip150Block": 0,
            "eip155Block": 0,
            "eip158Block": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "petersburgBlock": 0,
            "istanbulBlock": 0,
            "clique": {
                "period": 15,
                "epoch": 30000,
            },
        },
        "nonce": "0x0",
        "timestamp": "0x5e9d4d7c",
        "extraData": "0x00",//TO DO
        "gasLimit": "0x2fefd8",
        "difficulty": "0x1",
        "mixHash": "0x63746963616c636861696e2d686173682d67656e657369732d68617368",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "alloc": {},//TO DO AÑADIR CUENTAS CON SALDOS
    };
    fs.writeFileSync(genesisPath, JSON.stringify(genesis, null, 4));
}

// Crea y guarda un archivo Docker Compose para inicializar la red con el nodo especificado
//TO DO, AÑADIR LA PARTE DEL GENESIS
function createDockerComposeFile(chainId, networkDir) {
    const composePath = path.join(networkDir, 'docker-compose.yml');
    const composeContent = `
version: '3'
services:
  node:
    image: ethereum/client-go:latest
    command: --datadir /data --networkid ${chainId} --http --http.addr 0.0.0.0 --http.port 4000 --http.corsdomain "*" --http.api eth,web3,personal,net --allow-insecure-unlock --nodiscover
    volumes:
      - ./data:/data
    ports:
      - "4000:4000"
      - "30303:30303"
networks:
  default:
    name: eth-net-${chainId}
`;
    fs.writeFileSync(composePath, composeContent);
}

// Endpoint para crear una nueva red blockchain basada en Ethereum
app.post('/crearRed', async (req, res) => {
    const { chainId, chainName, tipoNodo } = req.body;
    console.log(tipoNodo)
    if (!chainId) {
        return res.status(400).send('El campo chainId es requerido.');
    }
    console.log(chainId)
    console.log(chainName)
    console.log(tipoNodo)
    const networkDir = path.join(DIR_NETWORKS, `chain-${chainId}`);
    ensureDir(networkDir); // Asegura la existencia del directorio de la red
    createGenesisFile(chainId, networkDir); // Crea el archivo de génesis
    createDockerComposeFile(chainId, networkDir); // Crea el archivo Docker Compose

    const cmd = `docker-compose -f ${path.join(networkDir, 'docker-compose.yml')} up -d`;
    console.log(cmd)
        execSync(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al iniciar la red con chainId ${chainId}:`, error);
                res.status(500).send(`Error al iniciar la red con chainId ${chainId}.`);
                return;
            }
            console.log(`Red con chainId ${chainId} ha sido iniciada exitosamente.`);
            res.json({ message: `Red con chainId ${chainId} ha sido creada e iniciada exitosamente. `});
        });







    /*try {
        // Construye el comando para ejecutar docker-compose up en el directorio correcto
        const cmd = `docker-compose -f ${path.join(networkDir, 'docker-compose.yml')} up -d`;
        // Ejecuta el comando
        console.log(cmd)
        execSync(cmd,  { shell: '/bin/bash' });

        console.log(`Red con chainId ${chainId} ha sido iniciada exitosamente.`);
        res.json({ message: `Red con chainId ${chainId} ha sido creada e iniciada exitosamente. `});
    } catch (error) {
        console.error(`Error al iniciar la red con chainId ${chainId}:`, error);
        res.status(500).send(`Error al iniciar la red con chainId ${chainId}.`);
    }*/
    
});

// Actualiza el archivo Docker Compose con la definición de un nuevo nodo
function addNodoToNetwork(chainId, nodo) {
    const networkDir = path.join(DIR_NETWORKS, `chain-${chainId}`);
    const composePath = path.join(networkDir, 'docker-compose.yml');

    let composeConfig;
    try {
        composeConfig = yaml.load(fs.readFileSync(composePath, 'utf8'));
    } catch (e) {
        console.error('Error leyendo el archivo Docker Compose:', e);
        return false;
    }

    const nodoServiceName = `${nodo.type}-${nodo.name}`;
    // Aquí debes definir `generateNodeCommand` para generar el comando específico del nodo
    composeConfig.services[nodoServiceName] = {
        image: 'ethereum/client-go:latest',
        volumes: [`./${nodo.name}:/root/.ethereum`, './genesis.json:/root/genesis.json'],
        networks: { default: { aliases: [nodo.name] } },
        command: generateNodeCommand(nodo) // Necesitas implementar esta función basada en tu lógica
    };

    if (nodo.type === 'rpc') {
        composeConfig.services[nodoServiceName].ports = [`${nodo.port}:8546`];
    }

    try {
        fs.writeFileSync(composePath, yaml.dump(composeConfig));
        return true;
    } catch (e) {
        console.error('Error escribiendo el archivo Docker Compose:', e);
        return false;
    }
}

// Endpoint para añadir un nuevo nodo a una red existente
app.post('/añadirNodo/:chainId', (req, res) => {
    const { chainId } = req.params;
    const nodo = req.body;

    if (!chainId || !nodo) {
        return res.status(400).send('Se requiere chainId y los detalles del nodo.');
    }

    const success = addNodoToNetwork(chainId, nodo);
    if (success) {
        res.json({ message: `Nodo ${nodo.name} de tipo ${nodo.type} añadido a la red ${chainId} exitosamente.` });
    } else {
        res.status(500).send('Error al añadir el nodo a la red.');
    }
});

/*
// Endpoint para levantar nodo
app.get("/levantar", async (req, res) => {
    const cmd = `docker run --name proyecto-eth-nodo -v ${PATH_NODO}/password.txt:/password -p 8545:8545 \
    -v ${PATH_NODO}/data:/data ethereum/client-go:latest --datadir /data --allow-insecure-unlock \
    --miner.etherbase 267d1477b48716439fec3fa1b0b1d40855db8aa1 --mine --unlock "267d1477b48716439fec3fa1b0b1d40855db8aa1" \
    --password /password --http --http.addr "0.0.0.0" --http.port 8545 --http.corsdomain "*" \
    --http.api "admin,eth,debug,miner,net,txpool,personal,web3"`

    console.log(cmd);
    execSync(cmd);

    res.status(200).send("Nodo iniciado")
});
*/



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