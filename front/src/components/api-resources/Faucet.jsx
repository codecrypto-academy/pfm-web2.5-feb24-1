import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
export function Fucet() {
    
    
    const [account, setAccount] = useState(null);
    const [tx, setTx] = useState(null); // [tx, setTx
    const params = useParams();
    useEffect(() => {
      const ethereum = window.ethereum;
  
      if (ethereum) {
        ethereum.on("accountsChanged", (accounts) => {
          console.log(accounts);
          setAccount(accounts[0]);
        });
        ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts) => {
            console.log(accounts);
            setAccount(accounts[0]);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, []);
    async function send(amount) {
      fetch(`http://localhost:3000/faucet/mired/${account}/${amount}`)
        .then((response) => {
          response.json().then((data) => {
            setTx(data);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return (
      <div>
        <h1>Faucet</h1>
        <div>
          {account ? <p>Account: {account}</p> : <p>Account: No hay cuenta</p>}
          Cantidad solicitada 0.1
          <button className="btn btn-primary" onClick={() => {send(0.1)}}>
            Solicitar
          </button><div className="json-display">
          {tx ? <pre>Transaction: {JSON.stringify(tx,null, 4)}</pre> : <p>Transaction: No hay transacción</p>}
          </div>
        </div>
      </div>
    );
  }
  
    
    
    
    
    
    
    
    
    
    
    
    /*
    const [cuenta, setCuenta] = useState(null)
    const [receiptString, setTx] = useState(null)
    const [saldo, setSaldo] = useState(null)

    useEffect(() => {
 
        async function obtenerCuenta() {
            const provider = new ethers.BrowserProvider(window.ethereum);
            // Solicitará al usuario las conexiones de la cuenta si no está conectado
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            console.log("Cuenta:", address);
            setCuenta(address);
        }

        window.ethereum.request({
            method:"eth_requestAccounts"
          }).then(() => {
            obtenerCuenta();
            window.ethereum.on("accountsChanged", obtenerCuenta)
          }).catch((error) => {
            console.error("Error al conectar con MetaMask:", error);
          });
    }, [])

    useEffect(() => {
        async function saldo() {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            // Obtiene el balance en wei (la unidad más pequeña de ether)
            const balanceWei = await provider.getBalance(address);

            // Convierte el balance a ether
            const balance = ethers.formatEther(balanceWei);

            console.log("Saldo:", balance);
            setSaldo(balance);
        }
        if (cuenta)
            saldo()
    }, [cuenta])

    async function invocarFaucet() {
        const url = `http://localhost:3000/faucet/${cuenta}`
        const response = await fetch(url)
        const json = await response.json()
        const receiptString = JSON.stringify(json, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );

        setTx(receiptString)
    }
    return (
        <div>
            <h1>{cuenta}</h1>
            <h2>Saldo: {saldo}</h2>
            <button onClick={() => invocarFaucet()}>Enviar 0.1 eth</button>
            <div>
                {JSON.stringify(receiptString, null, 4)}
            </div>
        </div>

    )
}
*/
