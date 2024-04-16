import newQuery from "./connection.js";
export async function aboutTextUpdate(text){
    const sql = `UPDATE about SET content = ? WHERE id = 1`
    return await newQuery(sql,[text])
}
export async function findAdmin(data){
    return await newQuery("SELECT * FROM admin WHERE username=? and password=?",[data.username,data.password])
}
export async function propertyUpdate(propertyName,propertyValue){
    const sql = `UPDATE siteinfo SET ${propertyName} = ? WHERE id = 1`
    return await newQuery(sql,[propertyValue])
}
export async function postAdd(data){
    const sql = `INSERT INTO post (title,content) VALUES (?,?)`
    return await newQuery(sql,[data.title,data.content])
}