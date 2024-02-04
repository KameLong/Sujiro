export interface Station{
    stationID:number;
    name:string;
    style:number;

}
export interface Trip{
    tripID:number;
    direct:number;
    number:string;
    name:string;
    type:number;
}

export interface StopTime{
    stopTimeID:number;
    tripID:number;
    stationID:number;
    ariTime:number;
    depTime:number;
    stopType:number;
}

export interface TrainType{
    trainTypeID:number;
    name:string;
    shortName:string;
    color:string;
}

export interface Company{
    companyID:number;
    name:string;
    userID:string;
}