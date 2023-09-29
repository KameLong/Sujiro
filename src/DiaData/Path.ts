// import { Route } from "./Route";
// import {Station} from "./Station";
// import {DiaData} from "./DiaData";
//
//
// export interface PathSqlObject{
//     id:number;
//     routeID:number;
//     "startStation":number;
//     "endStation":number;
// }
// export class Path{
//     private _id:number=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
//     public get id():number{
//         return this._id;
//     }
//
//
//     public startStation:Station;
//     public endStation:Station;
//     public routeId:number;
//     constructor(routeId:number,start:Station,end:Station) {
//         this.routeId=routeId;
//         this.startStation=start;
//         this.endStation=end;
//     }
//
//     static SQL_TABLE_CREATE:string="CREATE TABLE IF NOT EXISTS path(id int,routeID int,startStation int,endStation int)";
//     static SQL_TABLE_INSERT:string="INSERT INTO path(id,routeID,startStation,endStation)values(id,routeID,startStation,endStation)"
//     public get insert():PathSqlObject{
//         return {"id":this.id,"routeID":this.routeId,"startStation":this.startStation.id,"endStation":this.endStation.id};
//     }
//
//     static FROM_SQL_OBJECT(object:PathSqlObject,diaData:DiaData):Path{
//         const path=new Path(object.routeID,diaData.stations[object.startStation],diaData.stations[object.endStation]);
//         path._id=object.id;
//         return path;
//     }
//
// }