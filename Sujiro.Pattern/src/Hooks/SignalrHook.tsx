import React, {useContext} from 'react'
import axios from 'axios'
import {getAuth} from "firebase/auth";
import {statusContext, useStatusContext} from "./UseStatusContext";
import * as signalR from "@microsoft/signalr";
import {HubConnection} from "@microsoft/signalr";

const BaseUrl = process.env.REACT_APP_SERVER_URL;


export const useSignalR=()=>{
    const ctx=useContext(statusContext);
    const [connection,setConnection]=React.useState<signalR.HubConnection|undefined>(undefined);
    const [onStart,setOnStart]=React.useState<{onStart:((conn:HubConnection)=>void)|undefined}>({onStart:undefined});

    React.useEffect(() => {
        connection?.stop().then(() => {
            return connection?.start();
        }).then(()=>{
            ctx.setSignalRConnectionError(false);
            console.log(connection);

            if(onStart.onStart!==undefined){
                onStart.onStart(connection)
            }
        }).catch((err) => {
            console.log('SignalR Connection Error: ', err);
        });
        connection?.onreconnected(()=>{
            ctx.setSignalRConnectionError(false);
            console.log(connection);
            if(onStart.onStart!==undefined){
                onStart.onStart(connection)
            }
            console.log('SignalR Reconnected');
        })
        connection?.onreconnecting(()=>{
            ctx.setSignalRConnectionError(true);
            console.log('SignalR Reconnecting');
        })
        connection?.onclose(()=>{
            console.log('SignalR Disconnected');
        });
        return () => {
            if (connection !== undefined) {
                connection.stop().then(() => {
                    console.log('SignalR Disconnected');
                }).catch((err) => {
                    console.log('SignalR Disconnection Error: ', err);
                });
            }
        };
    }, [connection]);
    const createConnection=()=>{
            const conn = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.REACT_APP_SERVER_URL}/ws/chatHub`,
                    {accessTokenFactory: async() => await getAuth().currentUser?.getIdToken() ?? ''})
                .withAutomaticReconnect()
                .build();
            setConnection(conn);
    }
    return {createConnection,connection,setOnStart};
}
