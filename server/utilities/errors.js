import log from "./log.js";
import messages from "./messages.js";
const errors = {
    databaseConnectionErrorMessage : function(){
        log(messages.databaseError,1);
        return [messages.databaseError,1,400]
    }
    ,
    queryError : function (error){
        log(messages.queryError + error,1);
        return [messages.queryError + error,1,400]
    }
    ,
    updateEmptyDataError:function(){
        log(messages.updateEmptyData,1);
        return [messages.updateEmptyData,1,400]
    }
}
export default errors 