const toastContainer = document.querySelector("#toastify-container")
function toast(message, error = 0) {
    const toastElement = document.createElement("div");
    toastElement.classList.add(`${error ? "error" : "success"}`, "toast", "toast-animation");
    toastElement.innerHTML = `
        <h3>${message}</h3>
        <i class="fa ${error ? "fa-exclamation-circle" : "fa-check"}" aria-hidden="true"></i>
    `;
    toastContainer.append(toastElement);
    delay(2000).then(() => {
        toastElement.classList.add("toast-re-animation")
       return delay(500)
    }).then(()=>{toastElement.remove()})
}

function delay(ms = 0){
    return new Promise(resolve=> setTimeout(resolve, ms))
}