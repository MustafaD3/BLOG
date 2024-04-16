import jwt from "jsonwebtoken"
import errorRoute from "../routes/404.js"
import responseData from "../utilities/response.js"
async function jwtVerification(request,response,next){
    let state = true
    let token = ""
    if(request.headers.authorization)
        token = request.headers.authorization
    else if(request.cookies && request.cookies.token && request.cookies.cookieAllow)
        token = request.cookies.token
    else
        state = false
    try {
        const verify = jwt.verify(request.cookies.token || request.headers.authorization,process.env.JWT)
        if(!verify)
            state = false
    } catch (error) {
        state = false
    }
    if(!state)
        errorRoute(request,response)
    else
        next()
}

export function cookieAllow(request,response){
    if(request.body.cookieAllow)
    {
        response.cookie("cookieAllow",true,{
            httpOnly:true,
            sameSite:"strict",
            secure:true,
            maxAge: 2 * 60 * 60 * 1000
        })
        responseData(response,"Çerezlere İzin Verildi")
    }
    else
        responseData(response,"Bu Tür İşlemler İçin Çerezlere İzin Vermelisiniz ",1)
    
}
export default jwtVerification