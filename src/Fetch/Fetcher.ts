import axios, { AxiosRequestConfig, Method, AxiosRequestHeaders } from "axios";
import FetcherErrorHandler from './ErrorHandler';



type TFetcher = {
    method: Method,
    url: string,
    data?: {},
    headers?: AxiosRequestHeaders,
    name?: string,
    isOutboundRequest?: boolean
}



const DEV_BASE_URL = "http://localhost:3000";
const TEST_BASE_URL = "";
const PROD_BASE_URL = "";

const REQURST_TTL = 60000;


const setBaseURL = () => {
    switch (process.env.ENVIRONMENT) {
        case "development":
            return DEV_BASE_URL;
        case "test":
            return TEST_BASE_URL;
        case "production":
            return PROD_BASE_URL;
        default:
            return PROD_BASE_URL;
    }
}


class Fetcher {


    private authorization: string = "";
    private baseURL: string;
    private errorHandler: FetcherErrorHandler;


    constructor() {
        this.errorHandler = new FetcherErrorHandler();
        this.baseURL = setBaseURL();
    }





    clearLocalStorage = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    }


    isAtknShouldBeUpdatedAfter5Minutes = () => {
        if (typeof window !== 'undefined') {
            try {
                const lastUpdate = localStorage.getItem("createdAt");
                if (typeof lastUpdate === 'string') {
                    const lastUpdateToNumber = parseInt(lastUpdate);
                    const lastUpdateToNumberPlus5Minutes = lastUpdateToNumber + (1000 * 60 * 5);
                    const nowTimeStamp = Date.now();
                    return lastUpdateToNumberPlus5Minutes - nowTimeStamp < 0;
                } else {
                    return false;
                }
            } catch (error) {
                console.error(error);
                return false;
            }
        } else {
            return false;
        }
    }



    handleSetAccessToken = async (atkn: string) => {
        if (atkn) {
            //await this.fetch({ url: `/api/session/end`, method: "GET" });
            await this.fetch({ url: `/api/session/start?atkn=${atkn}`, method: "GET" });
        }
    }



    setAuthorization = (accessToken: string) => {
        this.authorization = `Bearer ${accessToken}`;
    }



    private setHeaders = (headers?: any) => {
        if (this.authorization) {
            const authHeader = { 'Authorization': this.authorization };
            return {
                ...authHeader,
                ...headers
            };
        } else {
            
        }
    }



    private setRequestSettings = (payload: TFetcher) => {

        const headers: AxiosRequestHeaders = this.setHeaders(payload.headers);

        let url = payload.url;
        if (payload.isOutboundRequest) { url = this.baseURL + url }

        const requestConfig: AxiosRequestConfig = {
            method: payload.method,
            data: payload.data,
            timeout: REQURST_TTL,
            url,
            headers,
        };
        return requestConfig;
    }



    fetch = async (payload: TFetcher) => {

        if (this.baseURL === "") {
            this.baseURL = setBaseURL();
        }

        return new Promise<{ data: any }>(async (resolve, reject) => {

            try {

                const conf = this.setRequestSettings(payload);
                const response = await axios(conf);

                //console.log("mFetcher Response ", payload.name, ": ", " url: ", JSON.stringify(conf.url), ", ", response.data);


                resolve(response);

            } catch (error) {

                console.log(error)
                if (error.response && error.response.data && error.response.data === "EMPTY_RTKN") {
                    console.log("SHOULD LOGOUT")
                }
                reject(this.errorHandler.set(error, payload.name));

            }
        });
    }

}



const mFetcher = new Fetcher();
export default mFetcher;