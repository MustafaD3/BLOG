(async ()=>{
    //Post Images Delete
    const postContents = document.querySelectorAll(".post-content")
    for(const content of postContents)
    {
        const images = content.querySelectorAll("img")
        for(const image of images)
            image.remove()
    }
    //Post Images Delete
    const container = document.querySelector("#github-posts")
    const request = await fetch("https://api.github.com/users/MustafaD3/repos")
    const githubPosts = await request.json()
    for(const post of githubPosts){
        container.innerHTML += `
        <li class="post">
            <a class="link" href="${post.html_url}">
                <h1 class="post-title">${post.name.replaceAll("-"," ")}</h1>
                <p class="post-content"></p>
            </a>
        </li>
        `
    }
})()
