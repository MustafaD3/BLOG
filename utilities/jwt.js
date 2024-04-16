import jwt from "jsonwebtoken"
let characters = [];
for (let character = 'a'.charCodeAt(0); character <= 'z'.charCodeAt(0); character++)
    characters.push(String.fromCharCode(character));
for(let number = 0;number <= 9;number++)
    characters.push(number.toString()); // Sayıları string olarak ekleyin
let min = characters.length;
let max = 100;
export function newToken() {
    const tokenLength = Math.floor(Math.random() * (max - min + 1)) + min;
    const token = randomString(tokenLength);
    return jwt.sign({ data: token }, process.env.JWT);
}

function randomString(length) {
    let token = "";
    for (let i = 0; i < length; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    return token;
}
export function jwtVerification_util(token){
    let state = true
    if(!token)
        state = false
    else{
        try {
            const verify = jwt.verify(token,process.env.JWT)
            if(!verify)
                state = false
        } catch (error) {
            state = false
        }
    }
    return state
}