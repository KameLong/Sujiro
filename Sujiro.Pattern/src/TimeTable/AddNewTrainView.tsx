import style from "./TimeTablePage.module.css";
import React, {useCallback} from "react";
import {Station, StopTime, Train} from "../SujiroData/DiaData";
import {Add} from "@mui/icons-material";
import { Button } from "@mui/material";
import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
import {axiosClient} from "../Hooks/AxiosHook";
import {useEditPatternTrain} from "../SujiroData/PatternTrain";

interface AddNewTripViewProps{
    stations:Station[];
    direct:number;
}

export function AddNewTrainView({stations,direct}:AddNewTripViewProps){
    const {companyID} = useRequiredParamsHook<{ companyID: string }>();
    const {routeID} = useRequiredParamsHook<{ routeID: string }>();
    const editTrain=useEditPatternTrain();
    const showStations=(direct===0)?stations: [...stations].reverse();


    const addNewTrip=useCallback(()=>{
        const tripID=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
        const trip:Train={
            trainID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER/10000),
            typeID:0,
            name:"",
            direction:direct,
            times:stations.map(s=>{
                const res:StopTime={
                    trainID:tripID,
                    stationID:s.id,
                    stopType:0,
                    depTime:-1,
                    ariTime:-1,
                    stopTimeID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
                    stopID:-1
                }
                return res;
            }),
        }
        editTrain.addTrain([trip],direct,undefined);


    },[companyID,routeID,direct,stations]);

    return (
        <div className={style.trainAddView} style={{borderTop:'1px solid black'}}>
        <div style={{textAlign: "center"}}>
    <input style={{visibility: "hidden"}} className={style.checkbox} type={"checkbox"}/>
    </div>
    <div style={{borderBottom: "2px solid #000"}}>
    </div>
    <div className={`${style.timeView2}`}>
    </div>
    <div className={`${style.trainNameView}`}>
    </div>
    <div style={{position:'relative'}}>
    {
        showStations.map(station =>

            <div key={station.id}>
            {
            (station.style & 0x02) > 0 ?
                <div className={`${style.timeView}`}>
        </div> : null
    }
        {
            (station.style & 0x03) === 3 ?
                <div style={{borderBottom: "1px solid #000"}}></div>
        : null
        }

        {
            (station.style & 0x01) > 0 ?
                <div className={`${style.timeView}`}>
            </div> : null
        }
        </div>
    )
    }
    <div style={{borderBottom: "2px solid #000"}}></div>
    <div>
    <Button style={{position:'absolute',top:'0',bottom:'0',left:'0',right:'0',margin:'auto auto'}} onClick={addNewTrip}> <Add style={{backgroundColor:'#FFF'}}/></Button>
    </div>
    </div>
    </div>
)
}