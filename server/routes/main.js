import htmlFileRead from "../utilities/htmlFileRead.js"
import { postContent } from "./post.js"
import footer from "./templates/footer.js"
import head from "./templates/head.js"
import header from "./templates/header.js"
export default async function main(request,response){
    let main = await htmlFileRead(request.routePaths.main)
    main = main.replace(`{{head}}`,head())
    main = main.replace(`{{header}}`,await header(request.routePaths.header))
    main = main.replace(`{{footer}}`,await footer(request.routePaths.footer))
    main = main.replace("{{content}}",await mainContent())
    response.send(main)
}
async function mainContent(){
    let htmlContent = await postContent()
    return htmlContent
}