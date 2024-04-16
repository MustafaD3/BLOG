import htmlFileRead from "../utilities/htmlFileRead.js"
async function errorRoute(request,response){
    response.status(404).send(await htmlFileRead(request.routePaths.error))
}
export default errorRoute