import { getSingleSiteInfo } from "../../db/get.js"
import htmlFileRead from "../../utilities/htmlFileRead.js"
export default async function footer(footerPath){
   //const [title] = await getSingleSiteInfo("name")
   return await htmlFileRead(footerPath,
      {
      }
      )
}