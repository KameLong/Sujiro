import React, {useContext} from 'react'
import axios, { AxiosRequestConfig } from 'axios'
import { useNavigate } from 'react-router-dom'
import {getAuth} from "firebase/auth";
import {statusContext} from "./UseStatusContext";

const BaseUrl = process.env.REACT_APP_SERVER_URL;

// デフォルト config の設定
export const axiosClient = axios.create({
    baseURL: BaseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
})


export function AxiosClientProvider({children}: {children: React.ReactElement}) {
    // 関数コンポーネントなのでフックが使える
    const navigate = useNavigate()
    const ctx=useContext(statusContext);

    React.useEffect(() => {

        // リクエスト インターセプター
        const requestInterceptors = axiosClient.interceptors.request.use(async(config) => {
            if (config.headers !== undefined) {
                const token=await getAuth().currentUser?.getIdToken()
                if (token) {
                  config.headers.Authorization = `Bearer ${token}`
                }
            }
            return config
        })

        // レスポンス インターセプター
        const responseInterceptor = axiosClient.interceptors.response.use(
            (response) => {
                console.log(response.status);
                return response
            },
            (error) => {
                if(error.code==="ERR_NETWORK"){
                    ctx.setNetworkError(true);
                    return;
                }
                console.log(error);
                console.log(error.response?.status);
                switch (error.response?.status) {
                    case 401:
                        ctx.setNotLogined(true);
                        break
                    case 403:
                        ctx.setForbiddenError(true);
                        break
                    case 404:
                        ctx.setNotFoundError(true);
                        break
                    case 500:
                        ctx.setClientError("500");
                        break
                    default:
                        if(error.response?.status!==undefined){
                            if(error.response.status>=500){
                                //サーバーエラー
                                ctx.setClientError(error.response.status);
                            }else if(error.response.status>=400){
                                //クライアントエラー
                                ctx.setClientError(error.response.status);
                            }
                        }
                        break
                }
                return Promise.reject(error)
            }
        )


        // クリーンアップ
        return () => {
            axiosClient.interceptors.request.eject(requestInterceptors)
            axiosClient.interceptors.response.eject(responseInterceptor)
        }

    }, [])

    return (<>{children}</>)
}