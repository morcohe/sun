


class FetcherErrorHandler {


    constructor(){}


    set = (err: any, name?: string) => {

        this.print(err, name);

        if(err?.response?.status === 401){
            return "TOKEN_EXPIRED"
        }

        if(err.message){
            return this.byMessage(err.message);
        }

        if(err?.response){
            if(err.response.status){
                if(err?.response.status === 401){
                    return "TOKEN_EXPIRED"
                }
                const handledByStatus = this.byStatus(err?.response);
                if(handledByStatus){ return handledByStatus }
            } else {
                return err.response;
            }
        }
        
        else if (err.request) { return err.request }

        else { return err }

    }



    private byMessage = (errMessage: any) => {
        if (errMessage.includes("timeout")) {
            return "Invalid Service";
        }
    }



    private byStatus = (errResponse: any) => {
        switch (errResponse.status) {
            case 400:
                if (errResponse.type === "MISSING_VALUES") {
                    return errResponse.data;
                }
                break;

            case 401:
                return "UNAUTHORIZED";

            default:
                break;
        }

        return null;
    }



    print = (err: any, name?: string) => {
        console.log(`> mFetcher Error - ${name ? name : ''}: `, err.response? err.response : err.message);
    }

}


export default FetcherErrorHandler;