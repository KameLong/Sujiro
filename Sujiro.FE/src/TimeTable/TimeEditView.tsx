import {Button, FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {StopTime} from "../SujiroData/DiaData";
import {time2Str, timeS2int} from "./TimeTableData";
import {useRequiredParams} from "../Hooks/useRequiredParams";
import {getAuth} from "firebase/auth";
import {axiosClient} from "../Common/AxiosHook";


interface TimeEditViewProps {
    stopTime:StopTime|null;
    focusIndex:number|undefined;
    close:(()=>void)|undefined;

}






export function TimeEditView({stopTime,focusIndex,close}:TimeEditViewProps){
    const {companyID} = useRequiredParams<{ companyID: string }>();
    const [depTime,setDepTime]=useState(time2Str(stopTime?.depTime));
    const [ariTime,setAriTime]=useState(time2Str(stopTime?.ariTime));
    const ariInput=useRef<HTMLInputElement>(null);
    const depInput=useRef<HTMLInputElement>(null);

    React.useEffect(()=>{
        console.log("useEffect");
        if(stopTime===null||stopTime===undefined){
            return;
        }
        setDepTime(time2Str(stopTime.depTime));
        setAriTime(time2Str(stopTime.ariTime));
    },[stopTime]);
    const updateStopTime=async()=>{
        const newStopTime={...stopTime};
        newStopTime.ariTime=timeS2int(ariTime);
        newStopTime.depTime=timeS2int(depTime);
        console.log(newStopTime);
        if(JSON.stringify(newStopTime)!==JSON.stringify(stopTime)){
            console.log(JSON.stringify(newStopTime),JSON.stringify(stopTime));
            axiosClient.put(`/api/stopTime/${companyID}`,newStopTime)
                .catch(err=>{});
        }
    }





    if(stopTime===null){
        return (<div/>);
    }
    return (
        <div style={{borderTop: '1px solid gray', height: 'auto'}}>
            <div style={{width: "360px", margin: 'auto'}}>
                <br/>
                <div style={{display: "flex", height: '100%'}}>
                    <div style={{width: "150px", backgroundColor: '#FFF', height: '100%'}}>
                        <RadioGroup aria-label="gender" name="gender1" value={stopTime?.stopType}
                                    onChange={async e=>{
                            const newStopTime={...stopTime};
                            newStopTime.stopType=parseInt(e.target.value);
                            axiosClient.put(`/api/stopTime/${companyID}`,newStopTime).catch(err=>{});

                        }}>
                            <FormControlLabel value="0" control={<Radio/>} label="運行なし"/>
                            <FormControlLabel value="1" control={<Radio/>} label="停車"/>
                            <FormControlLabel value="2" control={<Radio/>} label="通過"/>
                            <FormControlLabel value="3" control={<Radio/>} label="経由なし"/>
                        </RadioGroup>

                    </div>
                    <div style={{marginLeft: '10px'}} onKeyDown={e=>{
                        if(e.key==="Enter"){
                            console.log(e);
                            updateStopTime();
                            if(close!==undefined){
                                close();
                            }
                            e.preventDefault();
                        }}}>
                        <TextField  id="outlined-basic" label="着時刻" variant="standard" type={"number"} value={ariTime}
                                   ref={ariInput}
                                   autoFocus={focusIndex===0}
                                   onChange={e=>{
                                       setAriTime(e.target.value);
                                   }}
                                   style={{display:"block",width: '120px', margin: '10px', overflow: "auto"}}

                        />
                        <TextField id="outlined-basic" label="発時刻" variant="standard" type={"number"} value={depTime}
                                   ref={depInput}
                                   autoFocus={focusIndex===2}
                                   onChange={e=>{  setDepTime(e.target.value);}}
                                   style={{display:"block",width: '120px', margin: '10px', overflow: "auto"}}/>

                        <Button onClick={e=>{
                            updateStopTime();
                            if(close!==undefined){
                                close();
                            }
                        }}>OK</Button>

                    </div>


                </div>
            </div>

        </div>
    )
}