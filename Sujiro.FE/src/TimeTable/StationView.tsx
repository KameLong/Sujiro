import React from "react";
import style from "./TimeTablePage.module.css";
import {Station} from "../SujiroData/DiaData";

interface StationViewProps {
    stations:Station[];
    direct:number;
}
function StationView({stations,direct}:StationViewProps){
    const showStations=(direct===0)?stations: [...stations].reverse();
    return (
        <div className={style.stationListView}>
            <div style={{textAlign: "center"}}>
                <input className={style.checkbox} type={"checkbox"} style={{visibility: "hidden"}}/>
            </div>
            <div style={{borderBottom: "2px solid #000"}}></div>
            <div className={style.timeView}>
                列車番号
            </div>
            <div className={style.timeView}>
                列車種別
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={style.trainNameView}/>

            {showStations.map((station: Station) => {
                switch(station.style&0x03){
                    case 3:
                        return (
                            <div key={station.stationID} className={style.bigStationView}>
                                    {station.name}
                            </div>
                        )
                    default:
                        return (
                            <div className={style.stationView} key={station.stationID}> {station.name} </div>
                        )

                }

            })}
            <div style={{borderBottom: "2px solid #000"}}></div>
        </div>

    );
}

export default StationView;