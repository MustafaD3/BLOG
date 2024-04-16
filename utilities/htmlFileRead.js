import fs from "fs/promises"
export default async function htmlFileRead(htmlPath,dataObject = {}){
    try {
      let data = await fs.readFile(htmlPath, 'utf8');
      for(const [key,value] of Object.entries(dataObject)){
        data = data.replaceAll(`{{${key}}}`,value)
      }
      return data
    } catch (error) {
        log('Dosya Okuma Hatası:' + error,1)
      return error
    }
}