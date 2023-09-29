import {IonCheckbox, IonDatetime, IonInput, IonLabel, IonSegment, IonSegmentButton} from "@ionic/react";
import React, {useState} from "react";
import {StationTime, StationTimeEdit, StationTimeGet, StopType} from "../../DiaData/StationTime";
import classes from "./StationTimeEditor.module.css"
import {diaDataState, tripSelector} from "../../store";
import { useRecoilValue, useSetRecoilState} from "recoil";

interface StationTimeEditView{
    setStationTimeSelectedEvent:(a: (dom:HTMLElement) => void) => void
}
export const StationTimeEditView : React.FC<StationTimeEditView>= ({setStationTimeSelectedEvent}:StationTimeEditView):JSX.Element=>{
    const [selectedStationTime,setSelectedStationTime]=useState({tripID:0,routeStation:0});
    const stationTimeSelectedEvent=(dom:HTMLElement)=>{
        setSelectedStationTime({tripID: Number(dom.dataset.trainid),routeStation:Number(dom.dataset.routestation)});
    };
    setStationTimeSelectedEvent(stationTimeSelectedEvent);

    const setTrip = useSetRecoilState(diaDataState);
    const trip=useRecoilValue(tripSelector(selectedStationTime.tripID));
    const stTime=trip?.stationTimes[selectedStationTime.routeStation]??StationTimeEdit.newStationTime(0,0);
    return(
        <>
        <IonSegment value="default">
            <IonSegmentButton value="default">
                <IonLabel>駅</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="segment">
                <IonLabel>列車</IonLabel>
            </IonSegmentButton>
        </IonSegment>
            <div className="sub-content">
                <div className="sub-section">
                    <div className="sub-header" style={{padding:'5px'}}>{""}</div>
                    <div className="sub-list-container">
                        <div className={classes.formRow}>
                            <div className="form-label" style={{marginLeft:"15px",marginRight:'10px'}}>駅扱い</div>
                            <StopTypeToggleTestView/>
                        </div>
                        <div className="form-row">
                            <span className="form-label">発着番線</span>
                            <select className="form-selector ts-track">
                                <option value="0">1番線</option>
                                <option value="1">2番線</option>
                            </select>
                        </div>
                      <StopTimeTimeEditor stationTime={stTime} onChangeAriTime={(value)=>{
                          setTrip((old)=>{
                              const trips={...old.trips};
                              trips[stTime.tripID]={...(trips[stTime.tripID])};
                              trips[stTime.tripID].stationTimes={... trips[stTime.tripID].stationTimes}
                              trips[stTime.tripID].stationTimes[stTime.routeStationID]={...trips[stTime.tripID].stationTimes[stTime.routeStationID],ariTime:value};
                              return {...old,trips:trips};
                          })
                      }} onChangeDepTime={(value)=>{
                          setTrip((old)=>{
                              const trips={...old.trips};
                              trips[stTime.tripID]={...(trips[stTime.tripID])};
                              trips[stTime.tripID].stationTimes={... trips[stTime.tripID].stationTimes}
                              trips[stTime.tripID].stationTimes[stTime.routeStationID]={...trips[stTime.tripID].stationTimes[stTime.routeStationID],depTime:value};
                              return {...old,trips:trips};
                          })

                      }}/>
                    </div>
                </div>
            </div>
        </>
    )
}

const StopTypeToggleTestView=()=> {
    const [stopType, setStopType] = useState(StopType.STOP);
    return(
        <StopTypeToggle stopType={stopType} onChangeStopType={(type)=>{
            setStopType((prev)=>type);
        }}/>
    )
}
interface StopTypeToggleProps{
    stopType:StopType,
    onChangeStopType:(value:StopType)=>void;
}
const StopTypeToggle=({stopType,onChangeStopType}:StopTypeToggleProps)=> {
    const handleToggle = (element:StopType) => {
        onChangeStopType(element);
    };
    return (
        <div style={{display:"flex"}}>
            <div>
                <label>
                    <div className={classes.customToggle}>
                        <input
                            type="checkbox"
                            checked={stopType===StopType.STOP}
                            onChange={() => handleToggle(StopType.STOP)}
                        />
                        <div className={classes.toggleSwitch}>
                            <div className={classes.toggleSwitchLabel}>○</div>
                            <div className={classes.toggleSwitchLabel}>停車</div>

                        </div>
                    </div>
                </label>
            </div>
            <div>
                <label>
                    <div className={classes.customToggle}>
                        <input
                            type="checkbox"
                            checked={stopType===StopType.PASS}
                            onChange={() => handleToggle(StopType.PASS)}
                        />
                        <div className={classes.toggleSwitch}>
                            <div className={classes.toggleSwitchLabel}>レ</div>
                            <div className={classes.toggleSwitchLabel}>通過</div>

                        </div>
                    </div>
                </label>
            </div>
            <div>
                <label>
                    <div className={classes.customToggle}>
                        <input
                            type="checkbox"
                            checked={stopType===StopType.NONE}
                            onChange={() => handleToggle(StopType.NONE)}
                        />
                        <div className={classes.toggleSwitch}>
                            <div className={classes.toggleSwitchLabel}>・・</div>
                            <div className={classes.toggleSwitchLabel}>なし</div>

                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
}
const StopTimeTimeEditorTestView=()=>{
    const sTime=StationTimeEdit.newStationTime(0,0);
    sTime.ariTime=10*3600+5*60;
    sTime.depTime=10*3600+6*60;
    const [time,setTime]=useState(sTime);
    return(
        <StopTimeTimeEditor stationTime={time}
                            onChangeDepTime={(value)=>{
                                setTime(time=>{
                                    const res={...time};
                                    res.depTime=value;
                                    return res;
                                })
                            }}
                            onChangeAriTime={(value)=>{
                                setTime(time=>{
                                    const res={...time};
                                    res.ariTime=value;
                                    return res;
                                })
                            }}
                            />
    )
}
interface StopTimeTimeEditorProps{
    stationTime:StationTime;
    onChangeDepTime:(value:number)=>void;
    onChangeAriTime:(value:number)=>void;
}
const StopTimeTimeEditor=({stationTime,onChangeDepTime,onChangeAriTime}:StopTimeTimeEditorProps)=>{
    const timeInt2Str=(timeInt:number)=>{
        if(timeInt<0){
            return "";
        }
        const ss=timeInt%60;
        timeInt-=ss;
        timeInt/=60;
        const mm=timeInt%60;
        timeInt-=mm;
        timeInt/=60;
        const hh=timeInt%24;
        return hh.toString().padStart(2,"0")+":"+mm.toString().padStart(2,"0")+":"+ss.toString().padStart(2,"0");
    }
    const timeStr2Int=(timeStr:string)=>{

        const str2=timeStr.split(":");
        if(str2.length<2){
            return -1;
        }
        const hh=Number(str2[0]);
        const mm=Number(str2[1]);
        let ss=0;
        if(str2.length==3){
            ss=Number(str2[2]);
        }
        return hh*3600+mm*60+ss;
    }
    const stopTime=()=>{
        let stopTime=StationTimeGet.getStopTime(stationTime);
        const sign=stopTime<0 ? "-":"";
        stopTime=Math.abs(stopTime);
        const ss=stopTime%60;
        const mm=(stopTime-ss)/60;
        return sign+mm.toString()+":"+ss.toString().padStart(2,'0');
    }
    return (
    <div className={classes.stopTimeEditor}>
        <div>
        <div className={classes.ariTimeBox}>
            <span>到着時刻</span>
            <input style={{marginLeft:"5px",width:'100px'}} type={"time"} step={1} value={timeInt2Str(stationTime.ariTime)}
                   onChange={(event)=>
                onChangeAriTime(timeStr2Int(event.target.value))
            }/>
        </div>
        <div className={classes.depTimeBox}>
            <span>発車時刻</span>
            <input style={{marginLeft:"5px",width:'100px'}} type={"time"} step={1} value={timeInt2Str(stationTime.depTime)}
                   onChange={(event)=>
                       onChangeDepTime(timeStr2Int(event.target.value))
                   }/>
        </div>
        </div>
             <div className={classes.timeEditCenter}></div><input style={{marginLeft:'5px', margin:"0px 0px",width:'70px'}} value={stopTime()} readOnly={true} type={"text"} disabled={true} />

    </div>
    )

    }


