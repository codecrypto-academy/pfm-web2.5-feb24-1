const {ethers} = require("ethers")
const fs = require("fs")
async function main(){
    const provider = new ethers.JsonRpcProvider("http://localhost:9999")
    const wallet = ethers.Wallet.fromEncryptedJsonSync(
        fs.readFileSync("nodo/data/keystore/UTC--2024-02-17T20-51-34.980090419Z--267d1477b48716439fec3fa1b0b1d40855db8aa1"),
        fs.readFileSync("nodo/password.txt").toString()
    )
    wallet.connect(provider)

    const signer = wallet.connect(provider);
    //Enviamos la cantidad a la cuenta

    const tx = await signer.sendTransaction({
        from: wallet.address,
        to: "0xA8F9D1Ae0a8911c4162710fD011F88F477F662eF",
        value: ethers.parseUnits("0.1",18)
    });
    await tx.wait()
    console.log(JSON.stringify(tx, null, 2))
    const balance = await provider.getBalance("0xA8F9D1Ae0a8911c4162710fD011F88F477F662eF")
    console.log(ethers.formatEther(balance))
}

main() 