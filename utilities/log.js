export default function log(logText,error = 0){
    if(error)
        console.error(Date() + ":" + logText)
    else
        console.log(Date() + ":" + logText)
}