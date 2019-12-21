import { makeGidLookup } from './make-gid-lookup'
import { loadBGImages } from './load-bg-images'

export const buildBG = (scene, tilemap) => {
    const gidLookup = makeGidLookup(tilemap.tilesets)
    const imageLookup = {}
    const layers = tilemap.layers
    const artLayers = layers.filter(layer => layer.type === 'objectgroup')
    const offsetX = layers[0].x * 30
    const offsetY = layers[0].y * 30

    loadBGImages(scene, Object.values(gidLookup))

    scene.load.on('filecomplete', (key, type, texture) => {
        artLayers.forEach(layer => {
            // const container = scene.add.container()
            layer.objects.forEach(object => {
                const { gid, x, y } = object
                const imageUrl = gidLookup[gid].image
                if (imageUrl === key) {
                    scene.add.sprite(x - offsetX + 128, y - offsetY - 128, imageUrl)
                }
                // container.add(image)
            })
        })
    })
}