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

    getParams (url) {
        const routeDirs = this.strRoute.split('/')
        const urlDirs = url.split('/')
        const params = {}
        routeDirs.forEach((routeDir, index) => {
            if (urlDirs.length <= index) {
                return
            }
            if (routeDir.charAt(0) !== ':') {
                return
            }
            const key = routeDir.substring(1)
            const value = urlDirs[index]
            params[key] = value
        })
        return params
    }
}