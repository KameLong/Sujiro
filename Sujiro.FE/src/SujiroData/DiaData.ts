export interface Station{
    stationID:number;
    name:string;

}
export interface Route{
    routeID:number;
    name:string;
    color:string;
    companyID:number;
}
export interface RouteStation{
    routeStationID:number;
    routeID:number;
    stationID:number;
    seq:number;
    style:number;

}
export interface Trip{
    tripID:number;
    trainID:number;
    routeID:number;
    typeID:number;
    direct:number;
    number:string;
    name:string;
    seq:number;
}

export interface StopTime{
    stopTimeID:number;
    tripID:number;
    routeStationID:number;
    stopID:number;
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