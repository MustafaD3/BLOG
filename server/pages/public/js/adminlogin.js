const loginForm = document.querySelector("#admin-login-form")
loginForm.addEventListener("submit",submit)
async function submit(event){
    event.preventDefault()
    event.target.button.style.pointerEvents = "none"
    const data = {username:event.target.username.value,password:event.target.password.value}
    const request = await fetch("/admin/login",{
        method:"POST",
        body:JSON.stringify(data),
        mode:"cors",
        headers:{
            "content-type":"application/json"
        }
    })
    const response = await request.json()
    toast(response.message,response.state)
    if(!response.state)
        toast("Yönlendiriliyorsunuz...")
    setTimeout(()=>{
        event.target.button.style.pointerEvents = "auto"
        window.location.reload()
    },1700)
}