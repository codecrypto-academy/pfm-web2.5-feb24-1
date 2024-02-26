const {Web3} = require("web3")
const {ethers} = require("ethers")
const express = require("express")
const fs = require("fs")
const cors = require("cors");

const web3 = new Web3("http://localhost:9999")


const app = express();
app.use(cors())
app.listen(3333)

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
})