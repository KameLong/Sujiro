import React, {useContext} from 'react'
import axios from 'axios'
import {getAuth} from "firebase/auth";
import {statusContext, useStatusContext} from "./UseStatusContext";
import * as signalR from "@microsoft/signalr";

const BaseUrl = process.env.REACT_APP_SERVER_URL;


export const useSignalR=()=>{
    const ctx=useContext(statusContext);
    const [connection,setConnection]=React.useState<signalR.HubConnection|undefined>(undefined);
    React.useEffect(() => {
        if (connection !== undefined) {
            connection.start().then(() => {
                console.log('SignalR Connected');
            }).catch((err) => {
                console.log('SignalR Connection Error: ', err);
            });
        }
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
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_SERVER_URL}/ws/chatHub`,
                {accessTokenFactory: async() => await getAuth().currentUser?.getIdToken() ?? ''})
            .withAutomaticReconnect()
            .build();
        setConnection(connection);
    }
    return {createConnection,connection};
}
