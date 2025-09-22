import axios from "axios";
import ServiceResult from "../../types/ServiceResult";

interface Config {
    method: Methods;
    url: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any | null;
    auth: boolean | null;
    headers: Record<string, string> | null;
}

type Methods = "get" | "post" | "put" | "delete" | "patch";

const urlBase = "https://localhost:8443/api/v1/"


export default class BaseService {
    protected config;
    constructor({method, url, data = null, auth = false, headers = null}: Config) {

        let cabeca: Record<string, string> = {};

        if (auth)
        {
            cabeca = {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }

        if (headers)
        {
            for (const [key, value] of Object.entries(headers)) {
                cabeca[key] = value;
            }
        }

        this.config = {
            method: method,
            maxBodyLength: Infinity,
            url: urlBase + url,
            headers: cabeca,
            data: data
        }

    }

    async request() : Promise<ServiceResult> {
        return axios.request(this.config)
            .then((response) => {
                return new ServiceResult(response.status, response.statusText, response.data);
            })
            .catch((error) => {
                return new ServiceResult(error.response.status, error.response.statusText, error.response.data);
            });
    }

}
