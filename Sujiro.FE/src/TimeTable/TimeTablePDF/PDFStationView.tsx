import React from "react";
import style from "../TimeTablePage.module.css";
import {Station} from "../../SujiroData/DiaData";

import {Text, View} from "@react-pdf/renderer";
interface StationViewProps {
    stations:Station[];
    direct:number;
    lineHeight:number;
    fontSize:number;
}
function PDFStationView({stations,direct,lineHeight,fontSize}:StationViewProps){
    const showStations=(direct===0)?stations: [...stations].reverse();
    return (
        <View style={{width:'100%',borderRight:"1px solid black"}}>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={style.timeView}>
               <Text style={{paddingLeft:'2px'}}>列車番号</Text>
            </div>
            <div className={style.timeView}>
                <Text style={{paddingLeft:'2px'}}>列車種別</Text>
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>

            {showStations.map((station: Station) => {
                switch(station.style&0x03){
                    case 3:
                        return (
                            <div key={station.stationID} className={style.bigStationView}>
                                <Text style={{paddingLeft:'2px',verticalAlign:'sub', height:((lineHeight*0.1)*2+0.5)+'px',fontSize:(fontSize*0.13)+'pt'}}>{station.name}</Text>
                            </div>
                        )
                    default:
                        return (
                            <div className={style.stationView} key={station.stationID}>
                                <Text style={{paddingLeft:'2px',height:(lineHeight*0.1)+'px',overflow:'hidden'}}>{station.name}</Text> </div>
                        )

                }

            })}
            <div style={{borderBottom: "1px solid #000"}}></div>
        </View>

    );
}

export default PDFStationView;