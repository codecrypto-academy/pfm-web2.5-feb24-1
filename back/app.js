const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
const ethers = require('ethers');
const { execSync, exec } = require("child_process");
const port = 3000;

app.listen(3000, () => console.log('Listening on port 3000'));
/////////INICIAR CON npx nodemon --ignore "**/datos/**" .\app.js
app.use(cors());
app.use(express.json());

try {
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
} catch (error) {
    console.log(error)
}
DIR_BASE = path.join(__dirname, 'datos')
DIR_NETWORKS = path.join(DIR_BASE, 'networks')

function existsDir(dir) {
    try {
        fs.statSync(dir)
        return true
    } catch (err) {
        return false
    }
}
function createDir(dir) {
    if (!existsDir(dir)) {
        fs.mkdirSync(dir)
    }
}


function createGenesis(network) {
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    // ejemplo de genesis
    let genesis = {
        "config": {
            "chainId": parseInt(network.chainId),
            "homesteadBlock": 0,
            "eip150Block": 0,
            "eip155Block": 0,
            "eip158Block": 0,
            "byzantiumBlock": 0,
            "constantinopleBlock": 0,
            "petersburgBlock": 0,
            "istanbulBlock": 0,
            "clique": {
                "period": 4,
                "epoch": 30000
            }
        },
        "nonce": "0x0",
        "timestamp": "0x5e9d4d7c",

        "extradata": "0x0000000000000000000000000000000000000000000000000000000000000000E0f53357B6540A4896Ab80E19D5E81009A5df5890000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",

        "gasLimit": "0x2fefd8",
        "difficulty": "0x1",

        "alloc": {
            "E0f53357B6540A4896Ab80E19D5E81009A5df589": {
                "balance": "0xad78ebc5ac6200000"
            },
            "2f74f4234cab05273c1f39b562F32c286Ae2f495": {
                "balance": "0xad78ebc5ac6200000"
            }
        }
    }
    // metemos la cuenta generada 
    network.alloc.push(fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim())
    genesis.alloc = network.alloc.reduce((acc, i) => {
        const cuenta = i.substring(0, 2) == '0x' ? i.substring(2) : i
        acc[cuenta] = { balance: "0xad78ebc5ac6200000" }
        return acc
    }, {})

    // cuenta que firma
    let cuenta = fs.readFileSync(`${pathNetwork}/address.txt`).toString()
    cuenta = cuenta.substring(0, 2) == '0x' ? cuenta.substring(2) : i

    genesis.extradata = "0x" + "0".repeat(64) + cuenta.trim() + "0".repeat(130)
    return genesis;
}

function createPassword(network) {
    return 'PruebaPassword'
}

function createNodoMiner(nodo) {
    const miner = `
    ${nodo.name}:
        image: ethereum/client-go:latest
        volumes:
            - ./${nodo.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
            - ./password.txt:/root/.ethereum/password.sec
            - ./keystore:/root/.ethereum/keystore
        depends_on:
            - geth-bootnode
        networks:
            ethnetwork:
                ipv4_address: ${nodo.ip}
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth   
            --nat "extip:${nodo.ip}"
            --netrestrict=\${SUBNET} 
            --bootnodes="\${BOOTNODE}"
            --miner.etherbase \${ETHERBASE}   
            --mine  
            --unlock \${UNLOCK}
            --password /root/.ethereum/password.sec'

`
    return miner;
}



function createBootnode(network) {
    const bootnode = `
    geth-bootnode:
        hostname: geth-bootnode
        image: ethereum/client-go:alltools-latest
        command: 'bootnode     --addr \${IPBOOTNODE}:30301 
            --netrestrict=\${SUBNET} 
            --nodekey=/pepe/bootnode.key'
        volumes:
        - ./bootnode.key:/pepe/bootnode.key
        networks:
            ethnetwork:
                ipv4_address: \${IPBOOTNODE} `
    return bootnode;
}


function createNodoRpc(nodo) {
    const rpc = `
    ${nodo.name}:
        image: ethereum/client-go:latest
        volumes:
            - ./${nodo.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
        depends_on:
             - geth-bootnode
        networks:
            ethnetwork:
                    ipv4_address: ${nodo.ip}
        ports:
            - "${nodo.port}:8545"
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth     
            --netrestrict=\${SUBNET}    
            --bootnodes="\${BOOTNODE}"
            --nat "extip:${nodo.ip}"
            --http 
            --http.addr "0.0.0.0" 
            --http.port 8545
            --http.corsdomain "*" 
            --http.api "admin,eth,debug,miner,net,txpool,personal,web3"'
    `
    return rpc
}

function createNodoNormal(nodo) {
    const n =
        `
    ${nodo.name}:
        image: ethereum/client-go:latest
        volumes:
            - ./${nodo.name}:/root/.ethereum
            - ./genesis.json:/root/genesis.json
        depends_on:
            - geth-bootnode
        networks:
            ethnetwork:
                    ipv4_address: ${nodo.ip}
        entrypoint: sh -c 'geth init 
            /root/genesis.json && geth   
            --bootnodes="\${BOOTNODE}"
            --nat "extip:${nodo.ip}"
            --netrestrict=\${SUBNET}  ' `
    return n;

}

function createNodo(nodo) {
    switch (nodo.type) {
        case 'miner':
            return createNodoMiner(nodo)
        case 'rpc':
            return createNodoRpc(nodo)
        case 'normal':
            return createNodoNormal(nodo)
    }

}
function createDockerCompose(network) {
    const dockerCompose =
        `
version: '3'
services:
${createBootnode(network)}
${network.nodos.map(nodo => createNodo(nodo)).join('\n')}
networks:
  ethnetwork:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: \${SUBNET}

`
    return dockerCompose;
}
function createEnv(network) {
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    let bootnode =
        `enode://${fs.readFileSync(`${pathNetwork}/bootnode`).toString()}@${network.ipBootnode}:0?discport=30301`
    bootnode = bootnode.replace('\n', '')
    const file =
        `
BOOTNODE=${bootnode}
SUBNET=${network.subnet}
IPBOOTNODE=${network.ipBootnode}
ETHERBASE=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
UNLOCK=${fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()}
`
    return file
}

function createCuentaBootnode(network, pathNetwork) {
    const cmd = `docker run -e IP="@192.168.50.110:0?discport=30301" --rm -v ${pathNetwork}:/root ethereum/client-go:alltools-latest sh -c "geth account new --password /root/password.txt --datadir /root | grep 'of the key' | cut -c30- > /root/address.txt &&  bootnode -genkey /root/bootnode.key -writeaddress > /root/bootnode"`
    execSync(cmd)
}

app.get('/removeNetwork/:id', async (req, res) => {
    const { id } = req.params
    const pathNetwork = path.join(DIR_NETWORKS, id)
    if (!existsDir(pathNetwork))
        res.status(404).send('No se ha encontrado la red')
    else {
        execSync(`docker-compose -f ${pathNetwork}/docker-compose.yml down`)
        fs.rmdirSync(pathNetwork, { recursive: true })
        res.send({ id: id });
    }
})

app.get('/up/:id', async (req, res) => {
    const { id } = req.params
    var networks = null
    try {
        networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())


        const network = networks.find(i => i.id == id)
        if (!network)
            res.status(404).send('No se ha encontrado la red')
        else {

            console.log("up", network)
            const pathNetwork = path.join(DIR_NETWORKS, id)

            if (existsDir(path.join(DIR_BASE, 'networks', id)))
                fs.rmdirSync(path.join(DIR_BASE, 'networks', id), { recursive: true })

            fs.mkdirSync(path.join(DIR_BASE, 'networks', id), { recursive: true })

            fs.writeFileSync(`${pathNetwork}/password.txt`, createPassword(network))
            console.log(network)
            console.log(pathNetwork)
            createCuentaBootnode(network, pathNetwork)
            fs.writeFileSync(`${pathNetwork}/genesis.json`, JSON.stringify(createGenesis(network), null, 4))

            fs.writeFileSync(`${pathNetwork}/docker-compose.yml`, createDockerCompose(network))
            fs.writeFileSync(`${pathNetwork}/.env`, createEnv(network))
            console.log(`docker-compose -f ${pathNetwork}/docker-compose.yml up -d`)
            execSync(`docker-compose -f ${pathNetwork}/docker-compose.yml up -d`)

            res.send(network);
        }
    } catch (error) {
        console.log(error)
    }
})

app.get('/status/:id', async (req, res) => {
    const { id } = req.params;
    const cmd = `docker ps -f "name=${id}" -q`;
    exec(cmd, (error, stdout, stderr) => {

        if (error) {
            console.error(`Error ejecutando el comando: ${error}`);
            return;
        }

        if (stdout.trim()) {
            return res.send({ status: "UP" })
        } else {
            return res.send({ status: "DOWN" })
        }
    });
})

app.get('/restart/:id', async (req, res) => {
    const { id } = req.params
    const pathNetwork = path.join(DIR_NETWORKS, id)
    // docker-compose stop 
    // update el docker-compose
    if (!existsDir(pathNetwork))
        res.status(404).send('No se ha encontrado la red')
    else {
        execSync(`docker-compose -f ${pathNetwork}/docker-compose.yml restart`)
        res.send('ok');
    }

});
app.get('/', async (req, res) => {
    res.send(JSON.parse(fs.readFileSync('./datos/networks.json').toString()));
}
);
app.get('/:id', async (req, res) => {
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == req.params.id)
    if (!network)
        res.status(404).send('No se ha encontrado la red')
    else
        res.send(network);
}
);

app.delete('/network/:networkId/node/:nodeName', async (req, res) => {
    const { networkId, nodeName } = req.params;

    try {
        let networks = JSON.parse(fs.readFileSync(path.join(DIR_BASE, 'networks.json'), 'utf8'));
        const networkIndex = networks.findIndex(network => network.id === networkId);

        if (networkIndex === -1) {
            return res.status(404).send('Red no encontrada.');
        }

        const nodeIndex = networks[networkIndex].nodos.findIndex(node => node.name === nodeName);

        if (nodeIndex === -1) {
            return res.status(404).send('Nodo no encontrado.');
        }

        // Eliminar el nodo de la red.
        networks[networkIndex].nodos.splice(nodeIndex, 1);

        // Guardar los cambios en el archivo networks.json.
        fs.writeFileSync(path.join(DIR_BASE, 'networks.json'), JSON.stringify(networks, null, 4));

        // Ubicación del directorio de la red.
        const pathNetwork = path.join(DIR_NETWORKS, networkId);

        // Asegurarse de que el directorio de la red existe antes de intentar reiniciar.
        if (existsDir(pathNetwork)) {
            // Bajar la red.
            execSync(`docker-compose -f ${pathNetwork}/docker-compose.yml down`);

            // Reiniciar la red.
            execSync(`docker-compose -f ${pathNetwork}/docker-compose.yml up -d`);
            res.send({ message: 'Nodo eliminado con éxito y red reiniciada.' });
        } else {
            res.status(404).send('Directorio de la red no encontrado.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar el nodo.');
    }
});


app.post('/network/:networkId/node', async (req, res) => {
    const { networkId } = req.params;
    const newNodeDetails = req.body; // Aquí esperamos recibir los detalles del nuevo nodo

    try {
        let networks = JSON.parse(fs.readFileSync(path.join(DIR_BASE, 'networks.json'), 'utf8'));

        // Buscar la red específica por ID
        const networkIndex = networks.findIndex(network => network.id === networkId);
        if (networkIndex === -1) {
            return res.status(404).send('Red no encontrada.');
        }

        // Validar los detalles del nuevo nodo (esto depende de tus requerimientos específicos)
        if (!newNodeDetails.type || !newNodeDetails.name || !newNodeDetails.ip) {
            return res.status(400).send('Faltan detalles necesarios para crear el nodo.');
        }

        // Opcionalmente, validar que el nombre del nodo no esté duplicado en la red
        const isDuplicateName = networks[networkIndex].nodos.some(node => node.name === newNodeDetails.name);
        if (isDuplicateName) {
            return res.status(400).send('El nombre del nodo ya existe en la red.');
        }

        // Añadir el nuevo nodo a la configuración de la red
        networks[networkIndex].nodos.push({
            type: newNodeDetails.type,
            name: newNodeDetails.name,
            ip: newNodeDetails.ip,
            port: newNodeDetails.port || "" // El puerto puede ser opcional dependiendo del tipo de nodo
        });

        // Guardar los cambios en el archivo networks.json
        fs.writeFileSync(path.join(DIR_BASE, 'networks.json'), JSON.stringify(networks, null, 4));

        // Aquí puedes añadir lógica adicional para actualizar los archivos de configuración, 
        // generar archivos de genesis (si es necesario), y arrancar el nodo en Docker.

        res.send({ message: 'Nodo creado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el nodo.');
    }
});


// para cuando existe y para cuando no existe
app.post('/', async (req, res) => {
    const network = req.body
    console.log(network)
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    if (networks.find(i => i.id == network.id)) {
        console.log("Encuentra el ID lin-322")
        networks[networks.findIndex(i => i.id == network.id)] = network
        fs.writeFileSync('./datos/networks.json', JSON.stringify(networks, null, 4))
        res.send(network);
    }
    else {
        console.log("NO Encuentra el ID lin-328")
        networks.push(network)
        fs.writeFileSync('./datos/networks.json', JSON.stringify(networks, null, 4))
        res.send(network);
    }
});

app.get('/faucet/:net/:account/:amount', async (req, res) => {
    // los parametros son la red, la cuenta y la cantidad
    const { account, net, amount } = req.params
    // obtenemos la red
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == net)
    // si no existe not data found
    if (!network) {
        res.status(404).send('No se ha encontrado la red');
        return;
    }
    // obtenemos el directorio donde esta y los datos de la password la cuenta
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    const address = fs.readFileSync(`${pathNetwork}/address.txt`).toString().trim()
    const password = fs.readFileSync(`${pathNetwork}/password.txt`).toString().trim()
    const files = fs.readdirSync(`${pathNetwork}/keystore`)
    // obtenemos el port del rpc
    const port = network.nodos.find(i => i.type == 'rpc').port
    // creamos el provider y el signer
    const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);
    // leemos la clave privada para hacer un wallet
    const json = fs.readFileSync(path.join(pathNetwork, 'keystore', files[0])).toString()
    const wallet = await ethers.Wallet.fromEncryptedJson(
        json, password);
    // creamos el signer a partir del wallet y del provider
    const signer = wallet.connect(provider);
    // enviamos la cantidad a la cuenta
    const tx = await signer.sendTransaction({
        from: address,
        to: account,
        value: ethers.parseUnits(amount, 18)
    });
    // devolvemos la transaccion
    res.send({ hash: tx });
})

app.get('/blocks/:net/', async (req, res) => {
    const { net } = req.params
    // obtenemos la red
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == net)
    // si no existe not data found
    if (!network) {
        res.status(404).send('No se ha encontrado la red');
        return;
    }
    // obtenemos el directorio donde esta y los datos de la password la cuenta
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    // obtenemos el port del rpc
    const port = network.nodos.find(i => i.type == 'rpc').port
    // creamos el provider 
    const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`);

    const blockNumber = await provider.getBlockNumber();
    let promises = [];
    for (let i = blockNumber - 10; i < blockNumber; i++) {
        promises.push(provider.getBlock(i));
    }
    const blocks = await Promise.all(promises);
    res.send(blocks);
})
app.get('/isAlive/:net/', async (req, res) => {
    res.send({ "ok": true })
}
)

app.get('/isAlive/:net/', async (req, res) => {
    const { net } = req.params
    // obtenemos la red
    const networks = JSON.parse(fs.readFileSync('./datos/networks.json').toString())
    const network = networks.find(i => i.id == net)
    // si no existe not data found
    if (!network) {
        res.status(404).send('No se ha encontrado la red');
        return;
    }
    // obtenemos el directorio donde esta y los datos de la password la cuenta
    const pathNetwork = path.join(DIR_NETWORKS, network.id)
    // obtenemos el port del rpc
    const port = network.nodos.find(i => i.type == 'rpc').port
    console.log(port)
    // creamos el provider 
    try {
        const provider = new ethers.JsonRpcProvider(`http://localhost:${port}`,
        );
        const blockNumber = await provider.getBlockNumber();
        console.log(blockNumber)
        res.send({ alive: true, blockNumber })

    } catch (error) {
        res.send({ alive: false })
    }


})

function initialize() {
    //Creamos red nada mas lanzar la app con ID 111

    //Escribimos en networks.json


}


