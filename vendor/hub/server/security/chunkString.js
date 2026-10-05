const chunkString = (str, size) => 
{
    const numChunks = Math.ceil(str.length / size)
    console.log(`chunkString: str=${JSON.stringify(str)}, size=${size}, numChunks=${numChunks}`)
    const chunks = new Array(numChunks)
  
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }

    return chunks
}

module.exports = {
    chunkString
}