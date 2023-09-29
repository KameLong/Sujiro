
import {DiaData} from "./DiaData";
export enum StopType {
    NONE= 0,
    STOP= 1,
    PASS= 2,
    NOVIA=3,
}
export enum Direction{
    OUTBOUND=0,
    INBOUND=1
}
export interface StationTime{
    id:number;
    depTime:number;
    ariTime:number;
    type:StopType;
    direct:Direction;
    tripID:number;
    routeStationID:number;
}
export class StationTimeEdit{
    public static newStationTime(tripID:number,routeStationID:number){
        const res:StationTime={
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            tripID:tripID,
            routeStationID:routeStationID,
            depTime:-1,
            ariTime:-1,
            type:StopType.NONE,
            direct:Direction.OUTBOUND
        }
        return res;
    }
    static FROM_SQL_OBJECT(diaData:DiaData,object:any):StationTime{
        const time:StationTime=StationTimeEdit.newStationTime(object.tripID,object.routeStationID);
        time.depTime=object.depTime;
        time.ariTime=object.ariTime;
        time.type=object.type;
        return time;
    }
    public static fromJSONobj(data:any):StationTime {
        return Object.assign({},data);
    }


}
export class StationTimeGet{
    public static getRouteStation(stationTime:StationTime,diaData:DiaData){
        return diaData.routeStation[stationTime.routeStationID];
    }
    public static getStation(stationTime:StationTime,diaData:DiaData){
        console.log(stationTime);
        const rs=StationTimeGet.getRouteStation(stationTime,diaData);
        console.log(rs);
        if(rs===undefined)return undefined;
        return diaData.stations[rs.stationID];
    }

    static SQL_TABLE_CREATE:string="CREATE TABLE IF NOT EXISTS station_time(tripID int,seq int,routeStationID int,depTime int,ariTime int,type int)";
    static SQL_TABLE_INSERT:string="INSERT INTO station_time(tripID,seq,routeStationID,depTime,ariTime,type)values(:tripID,:seq,:routeStationID,:depTime,:ariTime,:type)"
    public static insertSQL(stationTime:StationTime,diaData:DiaData){
        throw new Error("todo");
        // return {"tripID":stationTime.tripID,"seq":diaData.getTrip(stationTime.tripID)?.time.indexOf(stationTime),"routeStationID":stationTime.routeStationID,
        //     "depTime":stationTime.depTime,"ariTime":stationTime.ariTime,"type":stationTime.type};
    }

    public static getStopTime(stationTime:StationTime){
        if(stationTime.depTime<0||stationTime.ariTime<0){
            return 0;
        }
        return stationTime.depTime-stationTime.ariTime;
    }

    public static getTimeDA(stationTime:StationTime){
        if(stationTime.depTime>=0){
            return stationTime.depTime;
        }
        return stationTime.ariTime;
    }
    public static getTimeAD(stationTime:StationTime){
        if(stationTime.ariTime>=0){
            return stationTime.ariTime;
        }
        return stationTime.depTime;
    }

}
