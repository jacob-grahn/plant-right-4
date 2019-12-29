// create a gid -> tile image lookup object
// example: {55: { image: "11264_9984.webp", imageheight: 256, imagewidth: 256 }}

export const makeGidLookup = (tilesets) => {
    const gidLookup = {}
    tilesets.forEach(tileset => {
        if (tileset.tiles) {
            const firstGid = tileset.firstgid
            Object.keys(tileset.tiles).forEach(key => {
                const tile = tileset.tiles[key]
                gidLookup[firstGid + parseInt(key)] = tile
            })
        }
    })
    return gidLookup
}