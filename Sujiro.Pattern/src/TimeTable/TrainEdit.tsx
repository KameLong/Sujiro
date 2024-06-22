import { TimeTableTrip} from "./TimeTableData";
import React, {useEffect, useState} from "react";
import {Station, StopTime, Train} from "../SujiroData/DiaData";
import {FormControl, Grid, InputLabel, MenuItem, Select, StyledEngineProvider, TextField} from "@mui/material";
import style from './TrainEdit.module.css';
import TimeEdit from "./TimeEdit";
import {useRecoilState} from "recoil";
import {trainTypesAtom} from "../State";
import {useEditPatternTrain} from "../SujiroData/PatternTrain";
interface TrainEditProps {
    trip: Train;
    stations: Station[];
}

function useTimeEditHook() {
    const [editTime, setEditTime] = useState(-1);
    const [id, setid] = useState(-1);
    const [isDep, setIsDep] = useState(false);
    const [openTimeEdit, setOpenTimeEdit] = useState(false);
    return {editTime, setEditTime, id, setid, isDep, setIsDep,openTimeEdit,setOpenTimeEdit};
}

export default function TrainEdit({trip, stations}: TrainEditProps) {
    // const [stopTimes, setStopTimes] = useState<StopTime[]>([]);
    const [trainTypes] = useRecoilState(trainTypesAtom);
    const editTrain=useEditPatternTrain();
    let stopTimes: StopTime[] = [];
    const timeEditHook = useTimeEditHook();

    if(trip===undefined){
        stopTimes=[];
    }
    const res = stations.map((station) => {
        return trip.times.filter(st => st.stationID === station.id)[0];
    });
    stopTimes=res;


    useEffect(() => {
    }, [trip, stations]);

    useEffect(() => {
        const index = stations.findIndex(st => st.id === timeEditHook.id);
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
                    <div key={stopTimes[i].stationID} className={style.trainEditBody}
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
                        <div key={stopTimes[i].stationID} className={style.trainEditBody}
                             style={{lineHeight: 30 * (i - nowStation) + 'px', height: 30 * (i - nowStation) + 'px'}}>
                            {stopTime(stopTimes[i].depTime, nowTime)}
                        </div>
                    )
                }
                nowTime = stopTimes[i].depTime;
                nowStation = i;
            }
        }
        if(nowStation!=stopTimes.length-1){
            res.push(
                <div key={stopTimes[stopTimes.length-1].stationID} className={style.trainEditBody}
                     style={{lineHeight: 30 * (stopTimes.length-1 - nowStation) + 'px', height: 30 * (stopTimes.length-1 - nowStation) + 'px'}}>

                </div>
            )
        }
        return res;
    }


    function searchNearTime(routeStation: number): number {
        //自分の駅に時刻があればそれを返す
        //なければ、前方の駅を順に探索し、depTimeを優先して返す
        for (let i = stations.findIndex(st => st.id === routeStation); i >= 0; i--) {
            if (stopTimes[i].depTime >= 0) {
                return stopTimes[i].depTime;
            }
            if (stopTimes[i].ariTime >= 0) {
                return stopTimes[i].ariTime;
            }
        }
        for (let i = stations.findIndex(st => st.id === routeStation) + 1; i < stations.length; i++) {
            if (stopTimes[i].ariTime >= 0) {
                return stopTimes[i].ariTime;
            }
            if (stopTimes[i].depTime >= 0) {
                return stopTimes[i].depTime;
            }
        }
        return 0;

    }


    if(stations.length!==stopTimes.length || stopTimes.length===0){
        return <div>駅情報が不正です</div>;
    }

    return (
        <StyledEngineProvider injectFirst>

        <div style={{display: 'flex', flexFlow: 'column', height: '100%', maxWidth: '400px',margin:'0px auto'}}>
            <div style={{height: '0px', flexGrow: '1', overflowY: 'auto'}}>

                <Grid container spacing={2} style={{margin: '0px auto', width: '100%'}}>
                    {/*<Grid*/}
                    {/*    xs={6}*/}
                    {/*    sx={{p:1}}*/}
                    {/*    item*/}
                    {/*>*/}
                    {/*</Grid>*/}
                    <Grid xs={6}
                          sx={{p:1}}
                          item
                    >
                        <FormControl sx={{  width:'100%' }}>
                        <TextField
                            label="列車名"
                            defaultValue=""
                            variant="filled"
                            size={"small"}
                            onChange={(event)=>
                            {
                                const newTrain={...trip};
                                newTrain.name=event.target.value;
                                editTrain.editTrain([newTrain]);
                            }}
                        />
                        </FormControl>
                    </Grid>
                    <Grid xs={6}
                          sx={{p:1}}
                          item
                    >
                        <FormControl sx={{  width:'100%' }}>
                        <InputLabel htmlFor="grouped-native-select">列車種別</InputLabel>
                    <Select
                        label="列車種別"
                        defaultValue=""
                        value={trip.typeID.toString()}
                        size={"small"}
                        style={{width:'100%'}}
                        onChange={(event)=>
                        {
                            const newTrain={...trip};
                            newTrain.typeID=Number.parseInt(event.target.value);
                            editTrain.editTrain([newTrain]);
                        }}
                    >
                        {
                            trainTypes.map(type=>
                                <MenuItem key={type.id} value={type.id.toString()}>{type.name}</MenuItem>
                            )
                        }
                    </Select>
                        </FormControl>
                    </Grid>
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
                                    <div key={station.id}
                                         className={style.trainEditBody}>{station.name}</div>
                                )
                            })}
                    </div>
                    <div style={{width: '24px'}} >
                        <div className={style.trainEditHeader} style={{fontSize:'10px'}}>駅扱</div>
                        {
                            stations.map((station)=>stopTimes.filter(st => st.stationID === station.id)[0]).map(st => {
                                return (
                                    <div key={st.stationID}
                                         className={style.trainEditEditable + " " + style.trainEditBody}>

                                        <select
                                            value={st.stopType}
                                            className={style.test}
                                            onChange={(e) => {
                                                const newTrain:Train=structuredClone(trip);
                                                newTrain.times.filter(item=>item.stationID===st.stationID)[0].stopType=parseInt(e.target.value);
                                                editTrain.editTrain([newTrain]);
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
                                    <div key={station.id}
                                         className={style.trainEditEditable + " " + style.trainEditBody + " " +
                                             (timeEditHook.id === station.id && !timeEditHook.isDep ? style.trainEditEditableSelected : "")}

                                         onClick={(e) => {
                                             let time = stopTimes.filter(st => st.stationID === station.id)[0].ariTime;
                                             timeEditHook.setid(station.id);
                                             timeEditHook.setIsDep(false);
                                             if (time < 0) {
                                                 time = searchNearTime(station.id);
                                                 const newTrain:Train=structuredClone(trip);
                                                 newTrain.times.filter(item=>item.stationID===station.id)[0].ariTime=time;
                                                 editTrain.editTrain([newTrain]);

                                             }

                                             timeEditHook.setEditTime(time);
                                             timeEditHook.setOpenTimeEdit(true);


                                         }}>{
                                        timeInt2Str(stopTimes.filter(st => st.stationID === station.id)[0].ariTime)
                                    }</div>
                                )
                            })}
                    </div>
                    <div style={{width: '48px', height: '100px'}} >
                        <div className={style.trainEditHeader}>停車</div>
                        {
                            stations.map((station) => {
                                return (
                                    <div key={station.id} className={style.trainEditBody}>{
                                        stopTime(
                                            stopTimes.filter(st => st.stationID === station.id)[0].depTime,
                                            stopTimes.filter(st => st.stationID === station.id)[0].ariTime)
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
                                    <div key={station.id} style={{borderRight: '1px solid black'}}
                                         className={style.trainEditEditable + " " + style.trainEditBody + " " +
                                             (timeEditHook.id === station.id && timeEditHook.isDep ? style.trainEditEditableSelected : "")}
                                         onClick={(e) => {
                                             console.log(e);

                                             let time = stopTimes.filter(st => st.stationID === station.id)[0].depTime;
                                             timeEditHook.setid(station.id);
                                             timeEditHook.setIsDep(true);
                                             if (time < 0) {
                                                 time = searchNearTime(station.id);
                                                 const newTrain:Train=structuredClone(trip);
                                                 newTrain.times.filter(item=>item.stationID===station.id)[0].depTime=time;
                                                 editTrain.editTrain([newTrain]);

                                             }
                                             timeEditHook.setEditTime(time);
                                             timeEditHook.setOpenTimeEdit(true);
                                         }
                                    }
                                    >{
                                        timeInt2Str(stopTimes.filter(st => st.stationID === station.id)[0].depTime)
                                    }</div>
                                )
                            })}

                    </div>
                </div>
            </div>
            <div style={{display: (timeEditHook.openTimeEdit&&(timeEditHook.editTime) >= 0) ? 'block' : 'none'}}>
                <TimeEdit time={timeEditHook.editTime} onChange={(shift, kurisage, kuriage) => {
                    if (timeEditHook.id >= 0) {
                        const newTrain:Train=structuredClone(trip);
                        const st=newTrain.times.filter(st=>st.stationID===timeEditHook.id)[0];
                        if (timeEditHook.isDep) {
                            st.depTime = (st.depTime + shift + 24 * 3600) % (24 * 3600);
                        } else {
                            st.ariTime = (st.ariTime + shift + 24 * 3600) % (24 * 3600);
                        }
                        if (kurisage) {
                            if (!timeEditHook.isDep) {
                                st.depTime = (st.depTime + shift + 24 * 3600) % (24 * 3600);
                            }
                            for (let i = stations.findIndex(st => st.id === timeEditHook.id) + 1; i < stopTimes.length; i++) {
                                const st1=newTrain.times[i];
                                if (st1.depTime >= 0) {
                                    st1.depTime = (st1.depTime + shift + 24 * 3600) % (24 * 3600);
                                }
                                if (st1.ariTime >= 0) {
                                    st1.ariTime = (st1.ariTime + shift + 24 * 3600) % (24 * 3600);
                                }
                            }
                        }
                        if (kuriage) {
                            if (timeEditHook.isDep) {
                                st.ariTime = (st.ariTime + shift + 24 * 3600) % (24 * 3600);
                            }
                            for (let i = stations.findIndex(st => st.id === timeEditHook.id) - 1; i >= 0; i--) {
                                const st1=newTrain.times[i];
                                if (st1.depTime >= 0) {
                                    st1.depTime = (st1.depTime + shift + 24 * 3600) % (24 * 3600);
                                }
                                if (st1.ariTime >= 0) {
                                    st1.ariTime = (st1.ariTime + shift + 24 * 3600) % (24 * 3600);
                                }
                            }
                        }
                        editTrain.editTrain([newTrain]);
                    }
                }}
                  deleteTime={() => {
                      const newTrain:Train=structuredClone(trip);
                      if (timeEditHook.id >= 0) {
                          let st = newTrain.times.filter(st => st.stationID === timeEditHook.id)[0];
                          if (timeEditHook.isDep) {
                              st.depTime = -1;
                          } else {
                              st.ariTime = -1;
                          }
                          editTrain.editTrain([newTrain]);
                      }
                  }}
                    closeTimeEdit={() => {
                        console.log("test");
                      timeEditHook.setOpenTimeEdit(false);
                    }}
                />
            </div>

        </div>
        </StyledEngineProvider>


    )

}
