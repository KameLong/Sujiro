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


// ここまで削除対象



export interface Route{
    routeID:number;
    name:string;
    stations:Station[];
    trainTypes:TrainType[];



}


export interface TrainType{
    id:number;
    name:string;
    shortName:string;
    color:string;
}

export interface Station{
    id:number;
    name:string;
    style:number;
    type:number;
}


export interface Route{
    routeID:number;
    name:string;
    color:string;
    companyID:number;
}



export interface StopTime{
    stopTimeID:number;
    trainID:number;
    stationID:number;
    stopID:number;
    ariTime:number;
    depTime:number;
    stopType:number;
}
export interface Train{
    trainID:number;
    typeID:number;
    name:string;
    times:StopTime[];
    direction:number;
}
