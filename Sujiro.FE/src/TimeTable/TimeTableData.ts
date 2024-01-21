import {StopTime, TrainType, Trip} from "../SujiroData/DiaData";

export interface TimeTableTrip extends Trip{
    stopTimes:StopTime[];
    trainType:TrainType;
}


export const time2Str=(time:number|undefined)=>{
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
export const timeS2int=(time:string)=>{
    if(time.length===0){
        return -1;
    }
    if(time.length>4){
        return -2;
    }
    time=time.padStart(4,"0");
    const hh=Number(time.substr(0,2));
    const mm=Number(time.substr(2,2));
    if(isNaN(hh)||isNaN(mm)){
        return -3;
    }
    return hh*3600+mm*60;
}