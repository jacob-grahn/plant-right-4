import 'phaser'

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update
  }
}

function preload () {
}

async function create () {
    const result = await fetch('https://pr2hub.com/random_level.php')
}

function update (time, delta) {
}