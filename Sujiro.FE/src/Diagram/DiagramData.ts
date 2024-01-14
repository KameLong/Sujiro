import {Station, StopTime, TrainType, Trip} from "../SujiroData/DiaData";
export interface DiagramStation extends Station{
    stationTime:number
}
export interface DiagramTrip extends Trip{
    stopTimes:StopTime[];
    trainType:TrainType;
}
export interface DiagramData{
    stations:DiagramStation[];
    upTrips:DiagramTrip[];
    downTrips:DiagramTrip[];
}
