export class Route {

    constructor (strRoute) {
        const dirs = strRoute.split('/')
        this.strRoute = strRoute
        this.sceneId = dirs[0]
        this.regex = new RegExp(`^${dirs[0]}.*`)
    }

    matches (url) {
        return this.regex.test(url)
    }
}