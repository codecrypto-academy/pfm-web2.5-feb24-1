/////////// Sacar la lista de nodos de una network

//Este componente nos dara toda la lista de nodos de una red.
//Primero buscaremos todas las redes, y se añadiran en un desplegable.
//Cuando se seleccione la red del desplegable, se mostrarán los nodos de dicha red.
//Como todo estará registrado en una BD, lo sacaremos de ahí

export function ListaNodo() {

    //Creamos un estado para guardar la red seleccionada y detectar cuando se cambia.
    const [selectedChainID, setSelectedChainID] = useState(null);

    //Buscamos lista de redes
    const { data, isLoading } = useQuery('products', () => {
      return fetch('http://localhost:5555/products').then((res) => res.json());
    });
  
    if (isLoading) {
      return <div>Cargando...</div>;
    }
  
    // Función para mostrar los nodos de la red seleccionada
    const mostrarNodos = () => {
      const redSeleccionada = data.find((chain) => chain.chainID === selectedChainID);
  
      if (redSeleccionada) {
        return (
          <div>
            <h2>Nodos de la red {redSeleccionada.chainID}:</h2>
            <ul>
              {redSeleccionada.nodos.map((nodo) => (
                <li key={nodo}>{nodo}</li>
              ))}
            </ul>
          </div>
        );
      } else {
        return <div>Selecciona una red para ver los nodos.</div>;
      }
    };
    
    return (
        //Ahora creamos una lista, el select tiene la opcion de onChange, el cual nos cambiará el estado de la red seleccionada
        //Con el estado cambiado, fuera de el select, llamamos a la funcion mostrarNodos, que con la red seleccionada, nos mostrara todos los nodos de dicha red
      <div>
        <select
          className="form-select form-select-lg mb-3"
          aria-label=".form-select-lg example"
          onChange={(e) => setSelectedChainID(e.target.value)}
          value={selectedChainID}
        >
          <option value="">Selecciona una red</option>
          {data.map((chain) => (
            <option key={chain.chainID} value={chain.chainID}>
              {chain.chainID}
            </option>
          ))}
        </select>
        {mostrarNodos()}
      </div>
    );
  }