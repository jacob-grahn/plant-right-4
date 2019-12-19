export const loadBGImages = (scene, images) => {
    scene.load.setPath('');
    images.forEach(image => {
        let path
        if(image.image.indexOf('.png') !== -1) {
            path = 'https://dev-levels.platformracing.com/pr2/stamps'
        } else {
            path = 'https://dev-levels.platformracing.com/pr2/levels/50815'
        }
        scene.load.image(image.image, `${path}/${image.image}`)
    })
    scene.load.start()
}