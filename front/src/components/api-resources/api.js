export async function getChain(red) {
    const response = await fetch(`http://localhost:3000/internalBlocks/${red.queryKey[1]}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
}

export async function getTx(tx) {
    const response = await fetch(`http://localhost:3000/transaction/${tx.queryKey[0]}/${tx.queryKey[1]}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
}

export async function getBlock(bloque) {
    const response = await fetch(`http://localhost:3000/bloque/${bloque.queryKey[1]}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return JSON.parse(data)
}

export async function getBalance(address) {
    console.log(address.queryKey[1])
    const response = await fetch(`http://localhost:3000/balance/${address.queryKey[0]}/${address.queryKey[1]}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
}