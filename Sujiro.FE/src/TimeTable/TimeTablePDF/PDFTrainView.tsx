import React from "react";
import style from "../TimeTablePage.module.css";
import {Station, StopTime} from "../../SujiroData/DiaData";
import {time2Str, TimeTableStation, TimeTableTrip} from "../TimeTableData";
import {Text, View} from "@react-pdf/renderer";
interface TrainViewProps {
    trip:TimeTableTrip;
    stations:TimeTableStation[]
    direct:number;
    width:number;
    lineHeight:number;
}
function PDFTrainView({trip,stations,direct,width,lineHeight}:TrainViewProps) {
    const showStations=(direct===0)?stations: [...stations].reverse();
    const getDepTimeStr=(station:TimeTableStation,stopTimes:StopTime[])=>{
        const stopTimeIndex=stopTimes.findIndex(item=>item.routeStationID===station.routeStationID);
        const stopTime=stopTimes[stopTimeIndex];

        if((station.style& 0x03)===3){
            //発着の時
            if(stopTimeIndex+1<stopTimes.length){
                const nextStopTime=stopTimes[stopTimeIndex+1];
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
    const getAriTimeStr=(station:TimeTableStation,stopTimes:StopTime[])=>{
        const stopTimeIndex=stopTimes.findIndex(item=>item.routeStationID===station.routeStationID);
        const stopTime=stopTimes[stopTimeIndex];
        if((station.style& 0x03)===3) {
            if (stopTimeIndex - 1 >= 0) {
                const befStopTime = stopTimes[stopTimeIndex - 1];
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
             style={{color:trip.trainType.color,width:(width/10)+'mm',borderRight:'0.5px solid #000',textAlign:'center'}}
        >
            <div style={{borderBottom: "1px solid #000"}}>
            </div>
            <div className={`${style.timeView2}`}
            >
                <Text>{trip.number}</Text>
            </div>
            <div className={`${style.timeView2}`}>
                <Text>{trip.trainType.shortName}</Text>
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            {/*<div className={`${style.trainNameView}`}>*/}
            {/*</div>*/}
            {
                showStations.map(station =>

                    <div key={station.routeStationID} style={{fontFamily: "DiaPro"}}>
                        {
                            (station.style&0x02)>0?
                            <div className={`${style.timeView}`}>
                                <Text style={{width:'100%',height:(lineHeight*0.1)+'px',textAlign:'center'}}>{getAriTimeStr(station, trip.stopTimes)}</Text>
                            </div>:null
                        }
                        {
                            (station.style & 0x03) === 3 ?
                                <div style={{borderBottom: "0.5px solid #000"}}></div>
                                : null
                        }

                        {
                            (station.style&0x01)>0?
                                <div className={`${style.timeView}`}>

                                    <Text style={{width:'100%',height:(lineHeight*0.1)+'px',textAlign:'center'}}>{getDepTimeStr(station,trip.stopTimes)}</Text>
                                </div>:null
                        }
                    </div>
                )
            }
            <div style={{borderBottom: "1px solid #000"}}></div>
        </View>
    );
}




export default PDFTrainView;