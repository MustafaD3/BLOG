//Respone Data
function responseData(response,message,error = 0,status = 200){
    response.status(status).json({message:message,state:error})
}
export default responseData