import {TimeTableStation, TimeTableTrip} from "./TimeTableData";
import React, {useEffect, useState} from "react";
import {auth} from "../firebase";
import {HubConnection} from "@microsoft/signalr";
import {StopTime, Trip} from "../SujiroData/DiaData";
import {axiosClient} from "../Hooks/AxiosHook";
import {Grid, MenuItem, Select, StyledEngineProvider} from "@mui/material";
import style from './TrainEdit.module.css';
import TimeEdit from "./TimeEdit";
import './test.css';


interface TrainEditProps {
    trip: TimeTableTrip;
    stations: TimeTableStation[];
}

function useTimeEditHook() {
    const [editTime, setEditTime] = useState(-1);
    const [routeStationID, setRouteStationID] = useState(-1);
    const [isDep, setIsDep] = useState(false);

    return {editTime, setEditTime, routeStationID, setRouteStationID, isDep, setIsDep};
}

export default function TrainEdit({trip, stations}: TrainEditProps) {
    const [stopTimes, setStopTimes] = useState<StopTime[]>([]);

    const timeEditHook = useTimeEditHook();

    useEffect(() => {
        const res = stations.map((station) => {
            return trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0];
        });
        setStopTimes(res);
    }, [trip, stations]);

    useEffect(() => {
        const index = stations.findIndex(st => st.routeStationID === timeEditHook.routeStationID);
        if (index >= 0) {
            if (timeEditHook.isDep) {
                timeEditHook.setEditTime(stopTimes[index].depTime);
            } else {
                timeEditHook.setEditTime(stopTimes[index].ariTime);
            }
        }
    }, [stopTimes]);
    const timeInt2Str = (time: number) => {
        if (time < 0) {
            return "";
        }
        const ss = time % 60;
        const mm = Math.floor(time / 60) % 60;
        const hh = Math.floor(time / 3600) % 24;
        return `${hh.toString().padStart(2, '0')} ${mm.toString().padStart(2, '0')} ${ss.toString().padStart(2, '0')}`;
    }
    const stopTime = (depTime: number, ariTime: number) => {
        if (depTime < 0 || ariTime < 0) {
            return "";
        }
        if (depTime < ariTime) {
            return "";
        }
        const time = depTime - ariTime;
        const ss = time % 60;
        const mm = Math.floor(time / 60) % 60;
        return `${mm.toString().padStart(2, '0')} ${ss.toString().padStart(2, '0')}`;
    }
    const betweenTime = () => {
        if (stopTimes.length === 0) {
            return [];
        }

        let nowTime = stopTimes[0].ariTime;
        let nowStation = 0;
        if (stopTimes[0].depTime >= 0) {
            nowTime = stopTimes[0].depTime;
        }
        let res = [];
        for (let i = 1; i < stopTimes.length; i++) {
            if (stopTimes[i].ariTime >= 0) {
                res.push(
                    <div key={stopTimes[i].routeStationID} className={style.trainEditBody}
                         style={{lineHeight: 30 * (i - nowStation) + 'px', height: 30 * (i - nowStation) + 'px'}}>
                        {stopTime(stopTimes[i].ariTime, nowTime)}
                    </div>
                )
                nowTime = stopTimes[i].ariTime;
                nowStation = i;
            }
            if (stopTimes[i].depTime >= 0) {
                if (nowStation !== i) {
                    res.push(
                        <div key={stopTimes[i].routeStationID} className={style.trainEditBody}
                             style={{lineHeight: 30 * (i - nowStation) + 'px', height: 30 * (i - nowStation) + 'px'}}>
                            {stopTime(stopTimes[i].depTime, nowTime)}
                        </div>
                    )
                }
                nowTime = stopTimes[i].depTime;
                nowStation = i;
            }
        }
        return res;
    }


    function searchNearTime(routeStation: number): number {
        //自分の駅に時刻があればそれを返す
        //なければ、前方の駅を順に探索し、depTimeを優先して返す
        for (let i = stations.findIndex(st => st.routeStationID === routeStation); i >= 0; i--) {
            if (stopTimes[i].depTime >= 0) {
                return stopTimes[i].depTime;
            }
            if (stopTimes[i].ariTime >= 0) {
                return stopTimes[i].ariTime;
            }
        }
        for (let i = stations.findIndex(st => st.routeStationID === routeStation) + 1; i < stations.length; i++) {
            if (stopTimes[i].ariTime >= 0) {
                return stopTimes[i].ariTime;
            }
            if (stopTimes[i].depTime >= 0) {
                return stopTimes[i].depTime;
            }
        }
        return 0;

    }

    return (
        <StyledEngineProvider injectFirst>

        <div style={{display: 'flex', flexFlow: 'column', height: '100%', width: '100%', maxWidth: '400px'}}>
            <div style={{height: '0px', flexGrow: '1', overflowY: 'auto'}}>

                <Grid container spacing={2} style={{margin: '0px auto', width: '100%'}}>
                </Grid>
                <div style={{
                    display: 'flex',
                    width: '360px',
                    margin: '4px auto',
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <div style={{width: '48px', height: '100px'}} >
                        <div className={style.trainEditHeader} style={{fontSize:'10pt',lineHeight:'12pt'}}>所要<br/>時間</div>
                        <div className={style.trainEditBodyHalf}></div>
                        {
                            betweenTime().map(item => {
                                return item;
                            })
                        }
                        <div className={style.trainEditBodyHalf}></div>

                    </div>
                    <div style={{width: '72px', height: '100px'}} >
                        <div className={style.trainEditHeader}>駅名</div>
                        {
                            stations.map((station) => {
                                return (
                                    <div key={station.stationID}
                                         className={style.trainEditBody}>{station.station.name}</div>
                                )
                            })}
                    </div>
                    <div style={{width: '24px'}} >
                        <div className={style.trainEditHeader} style={{fontSize:'10px'}}>駅扱</div>
                        {
                            stations.map((station) => {
                                return (
                                    <div key={station.stationID}
                                         className={style.trainEditEditable + " " + style.trainEditBody}>

                                        <select
                                            value={trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].stopType}
                                            className={style.test}
                                            onChange={(e) => {
                                                const newStopTimes = [...stopTimes];
                                                newStopTimes[stations.findIndex(st => st.routeStationID === station.routeStationID)].stopType = parseInt(e.target.value);
                                                setStopTimes(newStopTimes);
                                            }}
                                        >
                                            <option value={0}>&nbsp;&nbsp;&nbsp;&nbsp; : 運行なし</option>
                                            <option value={1}>〇&nbsp;&nbsp;: 停車</option>
                                            <option value={2}>ㇾ&nbsp;&nbsp;: 通過</option>
                                            <option value={3}>&nbsp;||&nbsp;&nbsp;: 経由なし</option>
                                        </select>


                                    </div>
                                )
                            })}

                    </div>
                    <div style={{width: '72px', height: '100px'}} >
                        <div className={style.trainEditHeader}>着時刻</div>
                        {
                            stations.map((station) => {
                                return (
                                    <div key={station.stationID}
                                         className={style.trainEditEditable + " " + style.trainEditBody + " " +
                                             (timeEditHook.routeStationID === station.routeStationID && !timeEditHook.isDep ? style.trainEditEditableSelected : "")}

                                         onClick={(e) => {
                                             let time = trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].ariTime;
                                             timeEditHook.setRouteStationID(station.routeStationID);
                                             timeEditHook.setIsDep(false);
                                             if (time < 0) {
                                                 time = searchNearTime(station.routeStationID);
                                                 setStopTimes(prev=>{
                                                     const newStopTimes=[...prev];
                                                     newStopTimes[stations.findIndex(st=>st.routeStationID===station.routeStationID)].ariTime=time;
                                                     return newStopTimes;

                                                 })
                                             }

                                             timeEditHook.setEditTime(time);

                                         }}>{
                                        timeInt2Str(trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].ariTime)
                                    }</div>
                                )
                            })}
                    </div>
                    <div style={{width: '48px', height: '100px'}} >
                        <div className={style.trainEditHeader}>停車</div>
                        {
                            stations.map((station) => {
                                return (
                                    <div key={station.stationID} className={style.trainEditBody}>{
                                        stopTime(
                                            trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].depTime,
                                            trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].ariTime)
                                    }</div>
                                )
                            })}

                    </div>
                    {/*<div style={{width: '24px', height: '100px'}}>*/}
                    {/*    <div className={style.trainEditHeader}>番線</div>*/}
                    {/*</div>*/}
                    <div style={{width: '72px', height: '100px'}}>
                        <div className={style.trainEditHeader} style={{borderRight: '1px solid black'}}>発時刻</div>
                        {
                            stations.map((station) => {
                                return (
                                    <div key={station.stationID} style={{borderRight: '1px solid black'}}
                                         className={style.trainEditEditable + " " + style.trainEditBody + " " +
                                             (timeEditHook.routeStationID === station.routeStationID && timeEditHook.isDep ? style.trainEditEditableSelected : "")}
                                         onClick={(e) => {

                                             let time = trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].ariTime;
                                             timeEditHook.setRouteStationID(station.routeStationID);
                                             timeEditHook.setIsDep(true);
                                             if (time < 0) {
                                                 time = searchNearTime(station.routeStationID);
                                                 setStopTimes(prev=>{
                                                        const newStopTimes=[...prev];
                                                        newStopTimes[stations.findIndex(st=>st.routeStationID===station.routeStationID)].depTime=time;
                                                        return newStopTimes;

                                                 })
                                             }
                                             timeEditHook.setEditTime(time);
                                         }
                                    }
                                    >{
                                        timeInt2Str(trip.stopTimes.filter(st => st.routeStationID === station.routeStationID)[0].depTime)
                                    }</div>
                                )
                            })}

                    </div>
                </div>
            </div>
            <div style={{display: timeEditHook.editTime >= 0 ? 'block' : 'none'}}>
                <TimeEdit time={timeEditHook.editTime} onChange={(shift, kurisage, kuriage) => {
                    if (timeEditHook.routeStationID >= 0) {
                        const stopTime = [...stopTimes];
                        let st = stopTime.filter(st => st.routeStationID === timeEditHook.routeStationID)[0];
                        if (timeEditHook.isDep) {
                            st.depTime = (st.depTime + shift + 24 * 3600) % (24 * 3600);
                        } else {
                            st.ariTime = (st.ariTime + shift + 24 * 3600) % (24 * 3600);
                        }
                        if (kurisage) {
                            if (!timeEditHook.isDep) {
                                st.depTime = (st.depTime + shift + 24 * 3600) % (24 * 3600);
                            }
                            for (let i = stations.findIndex(st => st.routeStationID === timeEditHook.routeStationID) + 1; i < stopTimes.length; i++) {
                                if (stopTime[i].depTime >= 0) {
                                    stopTime[i].depTime = (stopTime[i].depTime + shift + 24 * 3600) % (24 * 3600);
                                }
                                if (stopTime[i].ariTime >= 0) {
                                    stopTime[i].ariTime = (trip.stopTimes[i].ariTime + shift + 24 * 3600) % (24 * 3600);
                                }
                            }
                        }
                        if (kuriage) {
                            if (timeEditHook.isDep) {
                                st.ariTime = (st.ariTime + shift + 24 * 3600) % (24 * 3600);
                            }
                            for (let i = stations.findIndex(st => st.routeStationID === timeEditHook.routeStationID) - 1; i >= 0; i--) {
                                if (stopTime[i].depTime >= 0) {
                                    stopTime[i].depTime = (stopTime[i].depTime + shift + 24 * 3600) % (24 * 3600);
                                }
                                if (stopTime[i].ariTime >= 0) {
                                    stopTime[i].ariTime = (trip.stopTimes[i].ariTime + shift + 24 * 3600) % (24 * 3600);
                                }
                            }
                        }
                        setStopTimes(stopTime);
                    }
                }}
                          deleteTime={() => {
                              if (timeEditHook.routeStationID >= 0) {
                                  const stopTime = [...stopTimes];
                                  let st = stopTime.filter(st => st.routeStationID === timeEditHook.routeStationID)[0];
                                  if (timeEditHook.isDep) {
                                      st.depTime = -1;
                                  } else {
                                      st.ariTime = -1;
                                  }
                                  setStopTimes(stopTime);
                              }
                          }}/>
            </div>

        </div>
        </StyledEngineProvider>


    )

}

export function TrainEditTest() {
    const [stations, setStations] = useState<TimeTableStation[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);


    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
            axiosClient.get(`/api/timetablePage/${1}/${8477897770575444}/${0}?timestamp=${new Date().getTime()}`)
                .then(res => {
                    setTrips(res.data.trips);
                    setStations(res.data.stations);

                }).catch(err => {
                console.error(err);
            });

        });
    }, []);
    return (
        <div style={{height: '0px', flexGrow: '1', overflowY: 'auto'}}>
            {trips.length > 35 ?
                <TrainEdit trip={trips[35]} stations={stations}/>
                : null
            }
        </div>
    )

}