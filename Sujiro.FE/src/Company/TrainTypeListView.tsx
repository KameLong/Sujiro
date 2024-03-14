import {Divider, List, ListItem} from "@mui/material";
import {GiRailway} from "react-icons/gi";
import React, {useEffect, useState} from "react";
import {TrainType} from "../SujiroData/DiaData";
import {getAuth} from "firebase/auth";
import {axiosClient} from "../Hooks/AxiosHook";
import {auth} from "../firebase";


export interface TrainTypeListView {
    companyID:string
}
export default function TrainTypeListView({companyID}:TrainTypeListView) {
    const [trainTypes,setTrainTypes]=useState<TrainType[]>([]);
    const loadTrainTypeFromServer=async()=>{
        const token=await getAuth().currentUser?.getIdToken();
        axiosClient.get(`/api/TrainType/${companyID}?timestamp=${new Date().getTime()}`
        ).then(res => {
            setTrainTypes(res.data);
        }).catch(err=>{});
    }
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            loadTrainTypeFromServer();
        });
    },[]);
    return (
            <List style={{maxHeight: '100%', overflow: 'auto'}}>
                <Divider  component="li" />
                {trainTypes.map((type) => {
                    return (<div key={type.trainTypeID}><ListItem onClick={()=>{

                    }}><GiRailway /><span>{type.name}</span>
                    </ListItem><Divider  component="li" /></div>)
                })}
            </List>
    );
}