import { makeGidLookup } from './make-gid-lookup'
import { loadBGImages } from './load-bg-images'

export const buildBG = (scene, tilemap) => {
    const gidLookup = makeGidLookup(tilemap.tilesets)
    const containers = []
    const layers = tilemap.layers
    const artLayers = layers.filter(layer => layer.type === 'objectgroup')
    const offsetX = layers[0].x * 30
    const offsetY = layers[0].y * 30

    // start loading bg images
    loadBGImages(scene, Object.values(gidLookup))

    // create containers for each art layer
    artLayers.forEach((_layer, layerIndex) => {
        const container = scene.add.container()
        container.setDepth(layerIndex)
        const scroll = [0.1, 0.5, 1, 1]
        container.setScrollFactor(scroll[layerIndex])
        containers.push(container)
    })

    // when an image loads, add it to the scene
    scene.load.on('filecomplete', (key, type, texture) => {
        artLayers.forEach((layer, layerIndex) => {
            layer.objects.forEach(object => {
                const { gid, x, y } = object
                const imageUrl = gidLookup[gid].image
                if (imageUrl === key) {
                    const image = scene.add.sprite(x - offsetX, y - offsetY, imageUrl)
                    image.setOrigin(0, 1)
                    containers[layerIndex].add(image)
                }
            })
        })
    })
}