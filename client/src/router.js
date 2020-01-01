import { Route } from './route'

export class Router {

    constructor (game, routes) {
        this.game = game
        this.routes = routes.map(strRoute => new Route(strRoute))
        this.defaultRoute = this.routes[0]
        this.curSceneId = this.defaultRoute.sceneId

        window.addEventListener('popstate', this.apply);
    }

    go = (url) => {
        window.history.pushState('', '', url)
        this.apply()
    }

    apply = () => {
        const url = window.location.href.split('/').splice(3).join('/')
        const route = this.getMatchingRoute(url)
        if (route.sceneId === this.curSceneId) {
            return
        }
        if (this.curSceneId) {
            this.game.scene.stop(this.curSceneId)
        }
        this.curSceneId = route.sceneId
        this.game.scene.start(route.sceneId)
    }

    getMatchingRoute = (url) => {
        const matchingRoutes = this.routes.filter(route => route.matches(url))
        if (matchingRoutes.length === 1) {
            return matchingRoutes[0]
        } else {
            return this.defaultRoute
        }
    }
}