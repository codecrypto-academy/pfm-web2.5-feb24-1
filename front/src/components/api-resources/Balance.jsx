import { useParams } from "react-router-dom"
import { useQuery } from "react-query"
import { getBalance } from "./api"

export function Balance() {
    const params = useParams()
    const { isLoading, isError, data } = useQuery([params.id, params.address], getBalance)
    if (isLoading)
        return <h1>Cargando</h1>
    if (isError)
        return <h1>Error</h1>
    return <div >
        <table className="table">
            <thead>
                <tr>
                    <th>Address</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{params.address}</td>
                    <td>{data}</td>
                </tr>
            </tbody>
        </table>
        <pre>

        </pre>
    </div>
}
