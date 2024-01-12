export interface Station{
    stationID:number;
    name:string;
    style:number;
}
export interface Trip{
    tripID:number;
    number:string;
    stopTimes:StopTime[];
    type:number;
}
export interface TimeTableTrip extends Trip{
    tripColor:string;
    trainTypeName:string;
    trainTypeShortName:string;

}
export interface StopTime{
    stopTimeID:number;
    ariTime:number;
    depTime:number;
    stationID:number;
    tripID:number;
    stopType:number;
}