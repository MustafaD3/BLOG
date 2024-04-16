import express from "express"
import cors from "cors"
import { configDotenv } from "dotenv"
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import routes from "./routes/all.js"
import cookieParser from "cookie-parser";
import errorRoute from "./routes/404.js";

//Start dotenv For Use Local Environment
configDotenv()

//Start Server
function start(){
    console.log("Sunucu Çalışıyor")
    //Server App
    const app = express()

    //Port
    const PORT = process.env.PORT

    //Listen To App
    app.listen(PORT,()=>{

        //Pages Folder Path
        const pages = dirname(fileURLToPath(import.meta.url)) + "\\pages\\"
        
        //Cors
        app.use(cors())        

        //Cookie Parser
        app.use(cookieParser())
        //Route Paths Middleware
        app.use((request,response,next)=>{
            request.routePaths = {
                main:pages + "main.html",
                admin:pages + "admin.html",
                about:pages + "about.html",
                singlePost:pages + "singlepost.html",
                adminLogin:pages + "adminlogin.html",
                error:pages + "404.html",
                header:pages + "templates/header.html",
                footer:pages + "templates/footer.html"
            }
            next()
        })
        
        //BodyParser Middleware
        app.use(express.json())
        app.use(express.urlencoded({limit:'10mb', extended: true }))
        
        //Public Folder
        app.use("/public",express.static(pages + "public"))

        //Routes
        app.get("/",routes.main)
        app.post("/cookieAllow",routes.cookieAllow)
        app.use("/about",routes.about)
        app.use("/post",routes.post)
        app.use("/siteinfo",routes.siteInfo)
        app.use("/admin",routes.admin)
        app.use(errorRoute)
    })
}
start()