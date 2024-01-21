import {FormControlLabel, Radio, RadioGroup, TextField} from "@mui/material";
import React from "react";
import {StopTime} from "../SujiroData/DiaData";
import axios from "axios";


interface TimeEditViewProps {
    stopTime:StopTime|null;

}

const time2Str=(time:number|undefined)=>{
    if(time===undefined){
        return "";
    }
    if(time<0){
        return "";
    }
    const ss=time%60;
    time-=ss;
    time/=60;
    const mm=time%60;
    time-=mm;
    time/=60;
    const hh=time%24;
    return hh+mm.toString().padStart(2,"0");
}
const timeS2int=(time:string)=>{
    if(time.length===0){
        return -1;
    }
    if(time.length>4){
        return -2;
    }
    time=time.padStart(4,"0");
    const hh=Number(time.substr(0,2));
    const mm=Number(time.substr(2,2));
    return hh*3600+mm*60;
}

export function TimeEditView({stopTime}:TimeEditViewProps){
    console.log(stopTime);
    const [depTime,setDepTime]=React.useState(time2Str(stopTime?.depTime));
    const [ariTime,setAriTime]=React.useState(time2Str(stopTime?.ariTime));
    React.useEffect(()=>{
        if(stopTime===null||stopTime===undefined){
            return;
        }
        setDepTime(time2Str(stopTime.depTime));
        setAriTime(time2Str(stopTime.ariTime));
    },[stopTime]);


    if(stopTime===null){
        return (<div/>);
    }
    return (
        <div style={{borderTop: '1px solid gray', height: 'auto'}}>
            <div style={{width: "360px", margin: 'auto'}}>
                <br/>
                <div style={{display: "flex", height: '100%'}}>
                    <div style={{width: "150px", backgroundColor: '#FFF', height: '100%'}}>
                        <RadioGroup aria-label="gender" name="gender1" value={stopTime?.stopType} onChange={e=>{
                            console.log(e.target.value);
                            const newStopTime={...stopTime};
                            newStopTime.stopType=parseInt(e.target.value);
                            axios.put(`${process.env.REACT_APP_SERVER_URL}/api/stopTime`,newStopTime);
                        }}>
                            <FormControlLabel value="0" control={<Radio/>} label="運行なし"/>
                            <FormControlLabel value="1" control={<Radio/>} label="停車"/>
                            <FormControlLabel value="2" control={<Radio/>} label="通過"/>
                            <FormControlLabel value="3" control={<Radio/>} label="経由なし"/>
                        </RadioGroup>

                    </div>
                    <div style={{marginLeft: '10px'}}>
                        <TextField id="outlined-basic" label="着時刻" variant="standard" type={"number"} value={ariTime} onChange={e=>{  setAriTime(e.target.value);}}
                                   onBlur={e=>{
                                        const newStopTime={...stopTime};
                                        newStopTime.ariTime=timeS2int(ariTime);
                                        axios.put(`${process.env.REACT_APP_SERVER_URL}/api/stopTime`,newStopTime);
                                   }}
                                   style={{width: '120px', margin: '10px', overflow: "auto"}}

                        />
                        <TextField id="outlined-basic" label="発時刻" variant="standard" type={"number"} value={depTime} onChange={e=>{  setDepTime(e.target.value);}}
                                   onBlur={e=>{
                                       const newStopTime={...stopTime};
                                       newStopTime.depTime=timeS2int(depTime);
                                       axios.put(`${process.env.REACT_APP_SERVER_URL}/api/stopTime`,newStopTime);
                                   }}
                                   style={{width: '120px', margin: '10px', overflow: "auto"}}/>
                    </div>


                </div>
            </div>

        </div>
    )
}