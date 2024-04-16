import newQuery from "./connection.js";
export async function getSiteInfo(){
    return await newQuery("SELECT * FROM siteinfo")
}

export async function getAbout(){
    return await newQuery("SELECT content FROM about WHERE id = 1")
}

export async function getSingleSiteInfo(columnName){
    const sql = `SELECT ${columnName} FROM siteinfo WHERE id = 1 `
    return await newQuery(sql)
}

export async function getPosts(){
    return await newQuery("SELECT * FROM post")
}
export async function getPost(id){
    const sql = `SELECT * FROM post WHERE id = ${id} LIMIT 1`
    return await newQuery(sql)
}