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


const DEFAULT_REQUEST_TTL = 120000;
const REQURST_TTL: number = process.env.FETCH_MAX_TTL ? parseInt(process.env.FETCH_MAX_TTL) : DEFAULT_REQUEST_TTL;


const setBaseURL = () => `${process.env.HOST}:${process.env.PORT}`;


class Fetcher {


    private authorization: string = "";
    private baseURL: string;
    private errorHandler: FetcherErrorHandler;
    private fetchQueue: Array<string> = [];


    constructor() {
        this.errorHandler = new FetcherErrorHandler();
        this.baseURL = setBaseURL();
    }


    insertFetchQueue = (fetchPath: string) => {
        if(!this.fetchQueue.includes(fetchPath)){
            this.fetchQueue.push(fetchPath);
            return true;
        }
        return false;
    }


    removeFromFetchQueue = (fetchPath: string) => {
        if(this.fetchQueue.includes(fetchPath)){
            const indexToDeleteFrom = this.fetchQueue.indexOf(fetchPath);
            this.fetchQueue.splice(indexToDeleteFrom,1);
            return true;
        }
        return false;
    }


    clearLocalStorage = () => {
        localStorage.removeItem("user");
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

        const requestConfig: AxiosRequestConfig = {
            method: payload.method,
            data: payload.data,
            timeout: REQURST_TTL,
            url: payload.isOutboundRequest ? this.baseURL + payload.url : payload.url,
            headers,
        };

        return requestConfig;
    }



    fetch = async (payload: TFetcher) => {
        
        const newFetchInsertedToQueue = this.insertFetchQueue(payload.url);
        if(newFetchInsertedToQueue === false){ return }
        if (this.baseURL === "") { this.baseURL = setBaseURL() }

        return new Promise<{ data: any }>(async (resolve, reject) => {
            try {
                const conf = this.setRequestSettings(payload);
                const response = await axios(conf);
                this.removeFromFetchQueue(payload.url);
                resolve(response);
            } catch (error) {
                console.log(error);
                this.removeFromFetchQueue(payload.url);
                reject(this.errorHandler.set(error, payload.name));
            }
        });
    }

}



const mFetcher = new Fetcher();
export default mFetcher;