import { getPosts } from "../db/get.js"
import htmlFileRead from "../utilities/htmlFileRead.js"
import footer from "./templates/footer.js"
import head from "./templates/head.js"
import header from "./templates/header.js"
export default async function main(request,response){
    const mainData = await getPosts()
    let main = await htmlFileRead(request.routePaths.main)
    main = main.replace(`{{head}}`,head())
    main = main.replace(`{{header}}`,await header(request.routePaths.header))
    main = main.replace(`{{footer}}`,await footer(request.routePaths.footer))
    if(mainData.length > 0)
        main = main.replace("{{content}}",mainContent(mainData))
    else
        main = main.replace("{{content}}","<main><h1 class='title'>Yazı Bulunamadı</h1></main>")
    response.send(main)
}
function mainContent(data){
    let htmlContent = `
            <h1 class="title">Yazılar</h1>
            <ul id="posts">
            `
            for(const post of data){
                htmlContent += `
                <li class="post">
                    <a class="link" href="/post/${post.id}">
                        <h1 class="post-title">${post.title}</h1>
                        <p class="post-content">${post.content}</p>
                    </a>
                </li>`
            }
            htmlContent += `
            </ul>`
    return htmlContent
}