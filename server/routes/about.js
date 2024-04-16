import express from "express"
import { getAbout } from "../db/get.js"
import htmlFileRead from "../utilities/htmlFileRead.js"
import head from "./templates/head.js"
import header from "./templates/header.js"
import jwtVerification from "../middleware/jwt.js"
import responseData from "../utilities/response.js"
import { aboutTextUpdate } from "../db/post.js"
import footer from "./templates/footer.js"
const aboutRouter = express.Router()
//About Page Endpoint
aboutRouter.get("/",about)
aboutRouter.get("/text",aboutText)
//Token Control Middleware
aboutRouter.use("/",jwtVerification)

//About Text Update Endpoint
aboutRouter.post("/text",aboutUpdate)

//About Page
async function about(request,response){
    const aboutText = await getAbout()
    let about = await htmlFileRead(request.routePaths.about)
    about = about.replace(`{{head}}`,head())
    about = about.replace(`{{header}}`,await header(request.routePaths.header))
    about = about.replace(`{{footer}}`,await footer(request.routePaths.footer))
    if(aboutText[0] && aboutText[0]["content"])
        about = about.replace(`{{content}}`,aboutContent(aboutText[0]["content"]))
    else
        about = about.replace(`{{content}}`,"<h1>Hakkımda Yazısı Bulunamadı")
    response.send(about)
}

//About Page Content
function aboutContent(data){
    let htmlContent = `
        <main id="about">
            <h1 class="title">Hakkımda</h1>
            <p id="text">${data}</p>
        </main>
        `
    return htmlContent
}

//About Content Send
async function aboutText(request,response){
    const aboutText = await getAbout()
    if(aboutText[0] && aboutText[0]["content"]){
        responseData(response,{text:aboutText[0]["content"]})
    }
    else
        responseData(response,{text:""})
}

//About Content Update
async function aboutUpdate(request,response){
    if(request.body.text){
        const query = await aboutTextUpdate(request.body.text)
        if(query.affectedRows){
            if (query.affectedRows > 0)
              responseData(response,"Hakkımda Yazısı Başarılı Bir Şekilde Güncellendi")
            else
              responseData(response,"Hakkımda Yazısı Güncelleme Başarısız",1)
          }
          else
            responseData(response,...query)
    }
}
export default aboutRouter