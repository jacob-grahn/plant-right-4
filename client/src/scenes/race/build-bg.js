import { makeGidLookup } from './make-gid-lookup'
import { loadBGImages } from './load-bg-images'

export const buildBG = (scene, tilemap) => {
    const gidLookup = makeGidLookup(tilemap.tilesets)
    loadBGImages(scene, Object.values(gidLookup))
    const layers = tilemap.layers
    const artLayers = layers.filter(layer => layer.type === 'objectgroup')
    const offsetX = layers[0].x * 30
    const offsetY = layers[0].y * 30
    artLayers.forEach(layer => {
        const container = scene.add.container()
        layer.objects.forEach(object => {
            const { gid, x, y } = object
            const imageUrl = gidLookup[gid].image
            const image = scene.add.sprite(x - offsetX, y - offsetY, imageUrl)
            console.log(x, y, imageUrl)
            container.add(image)
        })
    })
}