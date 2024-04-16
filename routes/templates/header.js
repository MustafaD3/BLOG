import { getSingleSiteInfo } from "../../db/get.js"
import htmlFileRead from "../../utilities/htmlFileRead.js"
export default async function header(headerPath){
   const [title] = await getSingleSiteInfo("name")
   return await htmlFileRead(headerPath,
      {
         title:title ? title['name']:""
      }
      )
}