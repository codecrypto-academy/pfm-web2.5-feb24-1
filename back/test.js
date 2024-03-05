const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const DIR_BASE = path.join(__dirname, 'datos');
const DIR_NETWORKS = path.join(DIR_BASE, 'networks');

// Asegura la creación de directorios necesarios para almacenar los datos de la red
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Genera y guarda un archivo de configuración de génesis basado en el chainId
function createGenesisFile(chainId, networkDir) {
    const genesisPath = path.join(networkDir, 'genesis.json');
    const genesis = {
        // Configuración básica de la red Ethereum, incluyendo el chainId y configuraciones para EIPs
        config: {
            chainId: chainId,
            homesteadBlock: 0,
            eip150Block: 0,
            eip155Block: 0,
            eip158Block: 0,
            byzantiumBlock: 0,
            constantinopleBlock: 0,
            petersburgBlock: 0,
            istanbulBlock: 0,
            clique: {
                period: 15,
                epoch: 30000,
            },
        },
        nonce: "0x0",
        timestamp: "0x5e9d4d7c",
        extraData: "0x00",
        gasLimit: "0x2fefd8",
        difficulty: "0x1",
        mixHash: "0x63746963616c636861696e2d686173682d67656e657369732d68617368",
        parentHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
        alloc: {},
    };
    fs.writeFileSync(genesisPath, JSON.stringify(genesis, null, 4));
}

// Crea y guarda un archivo Docker Compose para inicializar la red con el nodo especificado
function createDockerComposeFile(chainId, networkDir) {
    const composePath = path.join(networkDir, 'docker-compose.yml');
    const composeContent = `
version: '3'
services:
  node:
    image: ethereum/client-go:latest
    command: --datadir /data --networkid ${chainId} --http --http.addr 0.0.0.0 --http.port 8545 --http.corsdomain "*" --http.api eth,web3,personal,net --allow-insecure-unlock --nodiscover
    volumes:
      - ./data:/data
    ports:
      - "8545:8545"
      - "30303:30303"
networks:
  default:
    name: eth-net-${chainId}
`;
    fs.writeFileSync(composePath, composeContent);
}

// Endpoint para crear una nueva red blockchain basada en Ethereum
app.post('/crearRed', (req, res) => {
    const { chainId } = req.body;
    if (!chainId) {
        return res.status(400).send('El campo chainId es requerido.');
    }

    const networkDir = path.join(DIR_NETWORKS, `chain-${chainId}`);
    ensureDir(networkDir); // Asegura la existencia del directorio de la red
    createGenesisFile(chainId, networkDir); // Crea el archivo de génesis
    createDockerComposeFile(chainId, networkDir); // Crea el archivo Docker Compose

    res.json({ message: `Red con chainId ${chainId} ha sido creada exitosamente.` });
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
        composeConfig.services[nodoServiceName].ports = [`${nodo.port}:8545`];
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

// Iniciar el servidor en el puerto especificado
//const PORT = 3000;
//app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));