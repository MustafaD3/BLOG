import { cookieAllow } from "../middleware/jwt.js";
import aboutRouter from "./about.js";
import adminRoute from "./admin.js";
import main from "./main.js";
import postRoute from "./post.js";
import siteInfoRoute from "./siteinfo.js";
const routes = {
    main:main,
    about:aboutRouter,
    post:postRoute,
    admin:adminRoute,
    siteInfo:siteInfoRoute,
    cookieAllow:cookieAllow
}
export default routes