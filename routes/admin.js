import express from "express"
import md5 from "md5"
import { getSingleSiteInfo} from "../db/get.js"
import { findAdmin } from "../db/post.js"
import head from "./templates/head.js"
import { jwtVerification_util, newToken } from "../utilities/jwt.js"
import htmlFileRead from "../utilities/htmlFileRead.js"
import jwtVerification from "../middleware/jwt.js"
import responseData from "../utilities/response.js"
const adminRoute = express.Router()
//Admin Login Page Endpoint
adminRoute.get("/login",loginPage)

//Admin Login Endpoint
adminRoute.post("/login",adminLogin)

//Token Control Middleware
adminRoute.use("/",jwtVerification)

//Admin Page Endpoint
adminRoute.get("/",adminPage)

//Admin Login Page
async function loginPage(request,response){
  //Cookie Control
    let adminLogin = await htmlFileRead(request.routePaths.adminLogin)
    adminLogin = adminLogin.replace(`{{head}}`,head())
    if(!request.cookies || !request.cookies.cookieAllow){
      adminLogin = adminLogin.replace(`{{cookie}}`,
      `
      <div id="cookie">
        <span>Bu İşlemi Yapmak İçin Önce Çerezlere İzin Vermelisiniz</span>
        <div>
          <button id="yes">Kabul Ediyorum</button>
          <button id="no">Kabul Etmiyorum</button>
        </div>
      </div>
      <script>
        const yes = document.querySelector("#yes")
        yes.addEventListener("click",async ()=>{
          const request = await fetch("/cookieAllow",{
            method:"POST",
            body:JSON.stringify({cookieAllow:true}),
            headers:{"content-type":"application/json"}
          })
          const response = await request.json()
          toast(response.message,response.state)
          setTimeout(()=>document.querySelector("#cookie").style.display = "none",1700)
        })
        const no = document.querySelector("#no")
        no.addEventListener("click",()=>{
          window.location.href = "/"
        })
      </script>
      `
      )
    }
    else
    {
      adminLogin = adminLogin.replace(`{{cookie}}`,"")
      if(request.cookies.token && jwtVerification_util(request.cookies.token)){
        response.redirect('/admin')
        return
      }
    }
    response.send(adminLogin)
}

//Admin Page
async function adminPage(request,response){
  const [title] = await getSingleSiteInfo("name")
  let admin = await htmlFileRead(request.routePaths.admin,{title:title ? title["name"]:""})
  admin = admin.replace(`{{head}}`,head())
  response.send(admin)
}

//Admin Login Endpoint
async function adminLogin(request,response){
  if(request.body.username && request.body.password){
    const admin = await findAdmin({username:md5(request.body.username),password:md5(request.body.password)})
    if(admin.length > 0){
      response.cookie("token",newToken(),{
        httpOnly:true,
        secure:true,
        sameSite:'strict'
      })
      responseData(response,"Giriş Yapıldı")
    }
    else
      responseData(response,"Admin Bulunamadı",1)
  }
  else
    responseData(response,"Giriş Yapabilmek İçin Bilgileri Göndermelisiniz",1)
}

export default adminRoute