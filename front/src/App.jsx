import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de haber instalado Bootstrap

function App() {
  const [cuenta, setCuenta] = useState(null);
  const [tx, setTx] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar la carga
  const [saldo, setSaldo] = useState(null)

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" })
        .then(cuentas => {
          setCuenta(cuentas[0]);
          window.ethereum.on("accountsChanged", (cuentas) => {
            setCuenta(cuentas[0]);
          });
        }).catch(err => {
          console.error(err);
          setError('Error al solicitar cuentas. Asegúrate de que tu wallet esté conectada.');
        });
    } else {
      setError('Ethereum wallet no está disponible. Asegúrate de tener MetaMask instalado.');
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', setCuenta);
      }
    };
  }, []);

  useEffect(() => {
    async function saldo(){
      const url = `http://localhost:3333/balance/${cuenta}`
      const response = await fetch(url)
      const saldoWei = await response.json()
      const saldo = saldoWei / 1e+18
      setSaldo(saldo)
    }
    if(cuenta)
    saldo()
  }, [cuenta])


  async function invocarFaucet() {
    setIsLoading(true); // Activa el spinner y deshabilita el botón
    setError('');
    if (!cuenta) {
      setError('No hay cuenta seleccionada.');
      setIsLoading(false); // Desactiva el spinner y habilita el botón
      return;
    }
    
    try {
      const url = `http://localhost:3333/faucet/${cuenta}`;
      const response = await fetch(url);
      const json = await response.json();
      setTx(JSON.stringify(json, null, 2));
    } catch (err) {
      console.error(err);
      setError('Error al invocar el faucet. Revisa la consola para más detalles.');
    } finally {
      setIsLoading(false); // Desactiva el spinner y habilita el botón
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="text-center mb-4">Wallet: {cuenta || 'No Conectada'}</h1>
          <h2>Saldo: {saldo}</h2>
          <button className="btn btn-primary w-100" onClick={invocarFaucet} disabled={isLoading}>
            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Enviar 0.1 PRU'}
          </button>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="mt-3">
            <h3>Transacción</h3>
            <pre>{tx || 'No hay transacciones.'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
