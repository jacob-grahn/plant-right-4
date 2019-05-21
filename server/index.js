const jiber = require('jiber-server')
const watchLobby = require('./watch-lobby')

const store = jiber.createStore({})
store.start()

watchLobby.start(store)
