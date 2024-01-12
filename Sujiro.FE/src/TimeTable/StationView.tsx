import React, {useEffect, useState} from "react";
import style from "./TimeTablePage.module.css";
import {Station} from "./DiaData";
import {Checkbox} from "@mui/material";

interface StationViewProps {
    stations:Station[];
}
function StationView({stations}:StationViewProps){
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

            {stations.map((station: any) => {
                switch(station.style&0x03){
                    case 3:
                        return (
                            <div key={station.id}>
                                <div className={style.bigStationView}>
                                    {station.name}
                                </div>
                            </div>
                        )
                    default:
                        return (
                            <div className={style.stationView} key={station.id}> {station.name} </div>
                        )

                }

            })}
            <div style={{borderBottom: "2px solid #000"}}></div>
            <div>

            </div>
        </div>

    );
}

export default StationView;