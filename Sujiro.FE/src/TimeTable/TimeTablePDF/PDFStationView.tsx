import React, {useEffect, useState} from "react";
import style from "../TimeTablePage.module.css";
import {Station} from "../../SujiroData/DiaData";
import {Checkbox} from "@mui/material";

import {Text, View} from "@react-pdf/renderer";
interface StationViewProps {
    stations:Station[];
    direct:number;
}
function PDFStationView({stations,direct}:StationViewProps){
    const showStations=(direct==0)?stations: [...stations].reverse();
    return (
        <View style={{width:'70px',borderRight:"2px solid black"}}>
            <div style={{textAlign: "center"}}>
                <input className={style.checkbox} type={"checkbox"} style={{visibility: "hidden"}}/>
            </div>
            <div style={{borderBottom: "2px solid #000"}}></div>
            <div className={style.timeView}>
               <Text>列車番号</Text>
            </div>
            <div className={style.timeView}>
                <Text>列車種別</Text>
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={style.trainNameView}/>

            {showStations.map((station: Station) => {
                switch(station.style&0x03){
                    case 3:
                        return (
                            <div key={station.stationID} className={style.bigStationView}>
                                <Text style={{height:'31px',fontSize:'13px'}}>{station.name.slice(0,4)}</Text>
                            </div>
                        )
                    default:
                        return (
                            <div className={style.stationView} key={station.stationID}>
                                <Text  style={{height:'15px',overflow:'hidden'}}>{station.name.slice(0,6)}</Text> </div>
                        )

                }

            })}
            <div style={{borderBottom: "2px solid #000"}}></div>
        </View>

    );
}

export default PDFStationView;