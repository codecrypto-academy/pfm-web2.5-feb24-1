export async function getChain(red) {
    console.log(red.queryKey[1])
    const response = await fetch(`http://localhost:3000/internalBlocks/${red.queryKey[1]}`)
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json()
    return data
}