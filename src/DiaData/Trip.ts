import {Direction, StationTime, StationTimeEdit} from "./StationTime";

export interface Trip{
    id:number;
    routeID:number;
    direct:Direction;
    stationTimes: { [key: number]: StationTime };
    name:string;

}
export class GetTrip{
    static SQL_TABLE_CREATE:string="CREATE TABLE IF NOT EXISTS trip(id int,routeID int,direct int,name text,trainID int)";
    static SQL_TABLE_INSERT:string="INSERT INTO trip(id,routeID,direct,name,trainID)values(:id,:routeID,:direct,:name,:trainID)"
    public insert():any{
        // return {":id":this.id,":routeID":this.routeID,":direct":this.direct,":name":this.name};
    }
}

export class EditTrip{
    public static newTrip(routeID:number,direct:Direction):Trip{
        return{
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            routeID:routeID,
            direct:direct,
            name:"",
            stationTimes:{}
        }
    }
    public static FROM_SQL_OBJECT(object:any):Trip{
        const trip=EditTrip.newTrip(object.routeID,object.direct);
        trip.id=object.id;
        trip.name=object.name;
        return trip;
    }
    public static fromJSONobj(data:any):Trip {
        if(data.routeID===undefined||data.direct===undefined){
            throw new Error("Invalid tripJSON");
        }
        const res:Trip= data;
        return res;
    }


}

