import express from "express"
import { getSiteInfo } from "../db/get.js"
import { propertyUpdate } from "../db/post.js"
import responseData from "../utilities/response.js"
import jwtVerification from "../middleware/jwt.js"

const siteInfoRoute = express.Router()
siteInfoRoute.use("/",jwtVerification)

siteInfoRoute.get("/",siteInfoJson)

//Siteinfo Property Update Endpoint
siteInfoRoute.post("/propertyUpdate",blogInfoPropertyUpdate)

//Siteinfo Property Update
async function blogInfoPropertyUpdate(request,response){
    if(!request.body.propertyName && request.body.propertyValue)
      responseData(response,errors.updateEmptyDataError,1)
    const query = await propertyUpdate(request.body.propertyName,request.body.propertyValue)
    if(query.affectedRows){
      if (query.affectedRows > 0)
        responseData(response,"Özellik Başarılı Bir Şekilde Güncellendi.")
      else
        responseData(response,"Özellik Güncelleme Başarısız.",1)
    }
    else
      responseData(response,...query)
  }
async function siteInfoJson(request,response){
    //Changing
    response.json(await getSiteInfo())
}
export default siteInfoRoute