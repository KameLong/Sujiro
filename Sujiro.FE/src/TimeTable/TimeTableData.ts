import {StopTime, TrainType, Trip} from "../SujiroData/DiaData";

export interface TimeTableTrip extends Trip{
    stopTimes:StopTime[];
    trainType:TrainType;
}
