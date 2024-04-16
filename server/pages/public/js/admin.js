const menuItem = document.querySelectorAll(".admin-menu-item")
const container = document.querySelector("#container")
const placeholders = ["Site Adı", "Site Port'u", "Site Tıklanma Sayısı", "Site Uzantısı", "Site HTTPS Durumu"]
for (const x of menuItem) {
    x.addEventListener("click", click)
}
async function click(event) {
    const parent = event.target.parentElement
    switch ([...parent.children].indexOf(event.target)) {
        case 0: await siteInfo(event)
            break;
        case 1: aboutText(event)
            break;
        case 2: postOperations(event)
            break;
    }
}

//Get Token
function getToken() {
    let token = ""
    for (const cookie of document.cookie.split(";")) {
        if (cookie.split("=")[0].trim() == "token") {
            token = cookie.split("=")[1]
        }
    }
    console.log(token)
    return token
}

//Site Info
async function siteInfo(event) {
    const request = await fetch("/siteinfo")
    const response = await request.json()
    siteInfoHtml(response[0])
}
//Site Info List Create
function siteInfoHtml(site) {
    container.innerHTML =
        `
            <h1 class="title">Site Bilgileri</h1>
            <div id="site-info">
                <h1 id="site-name" data-key="name" data-value="${site.name}">Site Adı: ${site.name}</h1>
                <h1 data-key="port" data-value="${site.port}">Site Port: ${site.port}</h1>
                <h1 data-key="clickCount" data-value="${site.clickCount}">Site Tıklanma Sayısı: ${site.clickCount}</h1>
                <h1 id="site-extension" data-key="extension" data-value="${site.extension}">Site Uzantısı: ${site.extension}</h1>
                <h1 data-key="HTTPS" data-value="${site.HTTPS}">Site HTTPS: ${site.HTTPS ? "Evet" : "Hayır"}</h1>
                <h1 id="site-url">Site Url: www.${site.name + site.extension}</h1>
            </div>
            `
    for (const x of [...container.querySelector("#site-info").children]) {
        x.addEventListener("click", siteInfoPropertyUpdate)
    }
}
//Update Event
function siteInfoPropertyUpdate(event) {
    const target = event.target
    if (target.tagName.toLowerCase() == "h1") {
        const parent = event.target.parentElement
        const input = document.createElement("input")
        const index = [...parent.children].indexOf(target)
        if (parent.children[index] != parent.lastElementChild) {
            //H1 To Input
            input.name = target.getAttribute("data-key")
            input.value = target.getAttribute("data-value")
            input.id = target.id
            input.setAttribute("beforeValue", input.value)
            input.placeholder = placeholders[index]
            parent.insertBefore(input, target)
            input.focus()
            input.addEventListener("focusout", async (event) => {
                //Turn Back H1 Element
                const h1 = document.createElement("h1")
                h1.setAttribute("data-key", input.getAttribute("name"))
                h1.setAttribute("data-value", input.value)
                h1.id = input.id
                h1.innerHTML = input.placeholder + ": "
                h1.addEventListener("click", siteInfoPropertyUpdate)

                //Request Property Update
                if (input.value.trim() && input.value != input.getAttribute("beforeValue")) {
                    if (!await siteInfoPropertyUpdateRequest(input.name, input.value, h1)) {
                        h1.innerHTML += input.value
                        toast(placeholders[index] + " Alanı Güncellendi")
                        document.querySelector("#site-url").innerHTML = "Site Url: www." + document.querySelector("#site-name").getAttribute("data-value") + document.querySelector("#site-extension").getAttribute("data-value")
                        parent.insertBefore(h1, input)
                        input.remove()
                    }
                    else
                        toast(placeholders[index] + "Alanı Güncellenemedi", 1)
                }
                else
                    h1.innerHTML += input.getAttribute("beforeValue")
            })
            target.remove()
        }
    }
}
//Update Request
async function siteInfoPropertyUpdateRequest(propertyName, propertyValue) {

    const request = await fetch("/siteinfo/propertyUpdate", {
        method: "POST",
        body: JSON.stringify({ propertyName: propertyName, propertyValue: propertyValue }),
        mode: "cors",
        headers: {
            "content-type": "application/json",
        }
    })
    const response = await request.json()
    return response.state

}
//Site Info End

function domainInfo(event) {
    console.log(event.target.innerHTML)
}

//About Text
async function aboutText(event) {
    const request = await fetch("/about/text")
    const response = await request.json()
    container.innerHTML = `
        <div id="post-operations">
            <h1 class="title"> Hakkımda Yazısı </h1>
            <form id="post-add-form">
                <textarea id="about-text" name="aboutText" placeholder="Yazı İçerigi" required>${response.message.text}</textarea>
                <input type="submit" value="Ekle">
            </form>
        </div>
    `
    aboutTextEvent()
}
async function aboutTextEvent() {
    const form = document.querySelector("#post-add-form")
    form.addEventListener("submit", aboutTextUpdate)

}
async function aboutTextUpdate(event) {
    event.preventDefault()
    const data = { text: event.target.aboutText.value }
    console.log(data)
    const request = await fetch("/about/text", {
        method: "POST",
        body: JSON.stringify(data),
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
        }
    })
    const response = await request.json()
    toast(response.message, response.state)
}
//About Text End

//Post
async function postOperations(event) {
    const request = await fetch("/post")
    const posts = await request.json()
    let htmlContent = ""
    container.innerHTML = `
                <div id="post-operations">
                    <h1 class="title"> Yazı Ekle </h1>
                    <form id="post-add-form">
                        <input id="post-title" name="postTitle" placeholder="Yazı Başlığı" required/>
                        <input id="post-images" name="postImages" accept="image/png, image/gif, image/jpeg" multiple type="file">
                        <div id="image-previews-container"></div>
                        <textarea id="post-content" name="postContent" placeholder="Yazı İçerigi" required></textarea>
                        <input type="submit" value="Ekle">
                    </form>
                </div>
            `
    if (posts.length > 0) {
        htmlContent += `
                <h1 class="title">Yazılar</h1>
                <ul id="posts">
              `
        for (const post of posts) {
            htmlContent += `
                <li class="post">
                    <div id="${post.id}" class="link" href="">
                        <h1 class="post-title">${post.title}</h1>
                        <p class="post-content">${post.content}</p>
                        <i class="trash fa fa-trash" aria-hidden="true"></i>
                    </div>
                </li>`
        }
        htmlContent += `</ul>`
    }
    else
        htmlContent += `<main><h1 class='title'>Yazı Bulunamadı</h1></main>`

    container.innerHTML += htmlContent
    const postContents = document.querySelectorAll(".post-content")
    for (const content of postContents) {
        const images = content.querySelectorAll("img")
        for (const image of images)
            image.remove()
    }
    for(const trash of [...document.querySelectorAll(".trash")])
        trash.addEventListener("click",deletePost)
    document.querySelector("#post-images").addEventListener("change", imagePreview)
    document.querySelector("#post-add-form").addEventListener("submit", postReady)
}
function imagePreview(event) {
    const imagesContainer = document.querySelector("#image-previews-container")
    if (event.target.files) {
        imagesContainer.innerHTML = ""
        for (const [id, file] of Object.entries(event.target.files)) {
            const blob = new Blob([file], { type: file.type });
            const imageUrl = URL.createObjectURL(blob);
            const image = document.createElement("img")
            const div = document.createElement("div")
            image.classList.add("post-preview-image")
            image.src = imageUrl
            div.classList.add("post-preview-image-container")
            div.append(image)
            imagesContainer.append(div)
            div.addEventListener("click", imageClick.bind(this, file.name))
        }
    }
}
function imageClick(fileName, event) {
    const postContentElement = document.querySelector("#post-content")
    const imagesFolder = "/public/assets/"
    postContentElement.value += `<img src="${imagesFolder + fileName}">\n`
}
function postReady(event) {
    event.preventDefault()
    const dataJson = {}
    dataJson["title"] = event.target.postTitle.value
    dataJson["content"] = event.target.postContent.value
    const data = new FormData()
    data.append("data", JSON.stringify(dataJson))
    for (const [id, file] of Object.entries(event.target.querySelector("#post-images").files)) {
        data.append("image", file)
    }
    postSubmit(data, event.target)
}
async function postSubmit(data, form) {

    const request = await fetch("/post", {
        method: "POST",
        mode: "cors",
        body: data,
    })
    const response = await request.json()
    toast(response.message, response.state)
    form.reset()
    form.postImages.value = ''
    document.querySelector("#image-previews-container").innerHTML = ""
}
async function deletePost(event){
    const postID = event.target.parentElement.id
    const request = await fetch("/post",{
        method:"DELETE",
        body:JSON.stringify({id:postID}),
        mode: "cors",
        headers: {
            "content-type": "application/json",
        }
    })
    const response = await request.json()
    console.log(response)
}
//Post End
function commentOperations(event) {
    console.log(event.target.innerHTML)
}