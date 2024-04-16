import express from "express"
import multer from "multer"
import jwtVerification from "../middleware/jwt.js"
import responseData from "../utilities/response.js"
import { postAdd, postDelete } from "../db/post.js"
import { getPost, getPosts } from "../db/get.js"
import header from "./templates/header.js"
import footer from "./templates/footer.js"
import head from "./templates/head.js"
import errorRoute from "./404.js"
import htmlFileRead from "../utilities/htmlFileRead.js"
const postRoute = express.Router()

//Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./pages/public/assets")
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
})
//Multer Start
const uploadStorage = multer({ storage: storage })

//Post Get Endpoint
postRoute.get("/",async (request,response)=>{ response.json(await getPosts())})

//Single Post Get Endpoint
postRoute.get("/:id",singlePostPage)

//Token Control Middleware
postRoute.use("/",jwtVerification)

//Post Add Endpoint
postRoute.post("/",uploadStorage.array("image"),blogPostAdd)

//Post Delete Endpoint
postRoute.delete("/",blogPostDelete)

//Post Get
async function singlePostPage(request,response){
  if(Number(request.params.id)){
    const post = await getPost(request.params.id)
    let singlePost = await htmlFileRead(request.routePaths.singlePost)
    singlePost = singlePost.replace(`{{head}}`,head())
    singlePost = singlePost.replace(`{{header}}`,await header(request.routePaths.header))
    singlePost = singlePost.replace(`{{footer}}`,await footer(request.routePaths.footer))
    if(post.length > 0)
      singlePost = singlePost.replace("{{content}}",singlePostContent(post[0]))
    else
      singlePost = singlePost.replace("{{content}}","<main><h1 class='title'>Yazı Bulunamadı</h1></main>")
    response.send(singlePost)
  }
  else
    errorRoute(request,response)
}
//Post Add
async function blogPostAdd(request,response){
    const query = await postAdd(JSON.parse(request.body.data))
    if(query.affectedRows){
      if (query.affectedRows > 0)
        responseData(response,"Yazı Başarılı Bir Şekilde Eklendi")
      else
        responseData(response,"Yazı Ekleme Başarısız",1)
    }
    else
      responseData(response,...query)
}
async function blogPostDelete(request,response){
  const query = await postDelete(request.body.id)
    if(query.affectedRows){
      if (query.affectedRows > 0)
        responseData(response,"Yazı Başarılı Bir Şekilde Silindi")
      else
        responseData(response,"Yazı Silme Başarısız",1)
    }
    else
      responseData(response,...query)
}
//Single Post Content
function singlePostContent(post){
  return `<main id="single-post">
    <h1 id="single-post-title">${post.title}</h1>
    <p id="single-post-content">${post.content}</p>
  </main>`
}
export async function postContent(){
  const posts = await getPosts()
  let htmlContent = ""
  if(posts.length > 0){
    htmlContent += `
      <h1 class="title">Yazılar</h1>
      <ul id="posts">
    `
    for(const post of posts){
      htmlContent += `
      <li class="post">
          <a class="link" href="/post/${post.id}">
              <h1 class="post-title">${post.title}</h1>
              <p class="post-content">${post.content}</p>
          </a>
      </li>`
    }
    htmlContent += `</ul>`
  }
  else
    htmlContent += `<main><h1 class='title'>Yazı Bulunamadı</h1></main>`
  return htmlContent
}

export default postRoute