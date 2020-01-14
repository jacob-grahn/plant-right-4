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
    artLayers.forEach((layer, layerIndex) => {
        const container = scene.add.container()
        container.setDepth(layerIndex)
        container.setScrollFactor(layer.parallax)
        container.x = -offsetX * layer.parallax
        container.y = -offsetY * layer.parallax
        containers.push(container)
    })

    // when an image loads, add it to the scene
    scene.load.on('filecomplete', (key, type, texture) => {
        artLayers.forEach((layer, layerIndex) => {
            layer.objects.forEach(object => {
                const { gid, x, y, width, height } = object
                const imageUrl = gidLookup[gid].image
                if (imageUrl === key) {
                    const image = scene.add.sprite(x, y, imageUrl)
                    image.setOrigin(0, 1)
                    console.log(width, height, image.width, image.height)
                    image.scaleX = width / image.width
                    image.scaleY = height / image.height
                    containers[layerIndex].add(image)
                }
            })
        })
    })
}