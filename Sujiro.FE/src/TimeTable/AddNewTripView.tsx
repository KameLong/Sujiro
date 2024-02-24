import style from "./TimeTablePage.module.css";
import React, {useCallback} from "react";
import {Station, StopTime} from "../SujiroData/DiaData";
import {TimeTableStation, TimeTableTrip} from "./TimeTableData";
import {Add} from "@mui/icons-material";
import { Button } from "@mui/material";
import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
import {axiosClient} from "../Hooks/AxiosHook";

interface AddNewTripViewProps{
    stations:TimeTableStation[];
    direct:number;
}

export function AddNewTripView({stations,direct}:AddNewTripViewProps){
    const {companyID} = useRequiredParamsHook<{ companyID: string }>();
    const {routeID} = useRequiredParamsHook<{ routeID: string }>();

    const showStations=(direct===0)?stations: [...stations].reverse();
    const addNewTrip=useCallback(()=>{
        const tripID=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
        const trip:TimeTableTrip={
            tripID:tripID,
            routeID:parseInt(routeID),
            trainID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            typeID:-1,
            direct:direct,
            number:"",
            name:"",
            seq:-1,
            trainType:{
                trainTypeID:-1,
                name:"",
                shortName:"",
                color:"#000000",
            },
            stopTimes:stations.map(s=>{
                const res:StopTime={
                    tripID:tripID,
                    routeStationID:s.routeStationID,
                    stopType:0,
                    depTime:-1,
                    ariTime:-1,
                    stopTimeID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
                    stopID:-1
                }
                return res;
            }),
        }
        console.log(trip.stopTimes,stations);
        axiosClient.post(`/api/timeTablePage/InsertTrip/${companyID}`,{trip:trip,insertTripID:-1}).catch(err=>{});

    },[companyID,routeID,direct,stations]);

    return (
        <div className={style.trainAddView}>
            <div style={{textAlign: "center"}}>
                <input style={{visibility: "hidden"}} className={style.checkbox} type={"checkbox"}/>
            </div>
            <div style={{borderBottom: "2px solid #000"}}>
            </div>
            <div className={`${style.timeView2}`}>
            </div>
            <div className={`${style.timeView2}`}>
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={`${style.trainNameView}`}>
            </div>
            <div style={{position:'relative'}}>
            {
                showStations.map(station =>

                    <div key={station.routeStationID}>
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
