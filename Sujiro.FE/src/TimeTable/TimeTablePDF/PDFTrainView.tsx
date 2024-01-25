import React, {Dispatch, SetStateAction, useContext} from "react";
import style from "../TimeTablePage.module.css";
import {Station, StopTime} from "../../SujiroData/DiaData";
import {Button, Checkbox, Dialog, DialogTitle, List, ListItem, ListItemButton} from "@mui/material";
import axios from "axios";
import {time2Str, TimeTableTrip} from "../TimeTableData";
import {Text, View} from "@react-pdf/renderer";
interface TrainViewProps {
    trip:TimeTableTrip;
    stations:Station[]
    direct:number;
}
function PDFTrainView({trip,stations,direct}:TrainViewProps) {
    const showStations=(direct===0)?stations: [...stations].reverse();
    const getDepTimeStr=(station:Station,stopTimes:StopTime[])=>{
        const stopTimeIndex=stopTimes.findIndex(item=>item.stationID===station.stationID);
        const stopTime=stopTimes[stopTimeIndex];

        if((station.style& 0x03)===3){
            //発着の時
            if(stopTimeIndex+1<stopTimes.length){
                const nextStopTime=stopTimes[stopTimeIndex+1];
                console.log(nextStopTime);
                if(nextStopTime.stopType===0){
                    return "‥";
                }
                if(nextStopTime.stopType===3){
                    return "║";
                }
            }
        }

        if(stopTime.stopType===0){
            // if((station.style&0x03)===1){
            //     return "┄"
            // }
            return "‥";
        }
        if(stopTime.stopType===2){
            return "⇂";
        }
        if(stopTime.stopType===3){
            return "║";
        }
        let time=stopTime.ariTime;
        if(stopTime.depTime>=0){
            time=stopTime.depTime;
        }
        return time2Str(time);

    }
    const getAriTimeStr=(station:Station,stopTimes:StopTime[])=>{
        const stopTimeIndex=stopTimes.findIndex(item=>item.stationID===station.stationID);
        const stopTime=stopTimes[stopTimeIndex];
        if((station.style& 0x03)===3) {
            if (stopTimeIndex - 1 >= 0) {
                const befStopTime = stopTimes[stopTimeIndex - 1];
                console.log(befStopTime);
                if (befStopTime.stopType === 0) {
                    return "‥";
                }
                if (befStopTime.stopType === 3) {
                    return "║";
                }
            }
        }


        if(stopTime.stopType===0){
            return "‥";
        }
        if(stopTime.stopType===2){
            return "⇂";
        }
        if(stopTime.stopType===3){
            return "║";
        }
        let time=stopTime.depTime;
        if(stopTime.ariTime>=0){
            time=stopTime.ariTime;
        }
        return time2Str(time);
    }




    return (
        <View
             style={{color:trip.trainType.color,width:'28px',borderRight:'1px solid #000',textAlign:'center'}}
        >
            <div style={{borderBottom: "2px solid #000"}}>
            </div>
            <div className={`${style.timeView2}`}
            >
                <Text>{trip.number}</Text>
            </div>
            <div className={`${style.timeView2}`}>
                <Text>{trip.trainType.shortName}</Text>
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={`${style.trainNameView}`}>
            </div>
            {
                showStations.map(station =>

                    <div key={station.stationID} style={{fontFamily: "DiaPro"}}>
                        {
                            (station.style&0x02)>0?
                            <div className={`${style.timeView}`}>
                                <Text style={{width:'28px',height:'15px',textAlign:'center'}}>{getAriTimeStr(station, trip.stopTimes)}</Text>
                            </div>:null
                        }
                        {
                            (station.style & 0x03) == 3 ?
                                <div style={{borderBottom: "1px solid #000"}}></div>
                                : null
                        }

                        {
                            (station.style&0x01)>0?
                                <div className={`${style.timeView}`}>

                                    <Text style={{width:'28px',height:'15px',textAlign:'center'}}>{getDepTimeStr(station,trip.stopTimes)}</Text>
                                </div>:null
                        }
                    </div>
                )
            }
            <div style={{borderBottom: "2px solid #000"}}></div>
        </View>
    );
}




export default PDFTrainView;