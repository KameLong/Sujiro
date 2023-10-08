
export interface Route {
    id: number;
    name: string;
    routeStationIDs: number[];
    tripIDs: number[];
}
export class GetRoute {
    static SQL_TABLE_CREATE:string="CREATE TABLE IF NOT EXISTS route (id int,name text)";
    static SQL_TABLE_INSERT:string="INSERT INTO route(id,name)values(:id,:name)"
    public static insert(route:Route):any{
        return {":id":route.id,":name":route.name};
    }

}
export class EditRoute{
    public static newRoute():Route{
        const res:Route={
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            name:"route",
            routeStationIDs:[],
            tripIDs:[]
        }
        return res;
    }


    public static fromJSONobj(data:any):Route {
        const res:Route= Object.assign(EditRoute.newRoute(),data);
        return res;
    }
}

export interface  RouteStation {
    routeID:number;
    stationID:number;
    id:number;

}
export class GetRouteStation{
    static SQL_TABLE_CREATE:string="CREATE TABLE IF NOT EXISTS route_station (id int,routeID int,stationID int)";
    static SQL_TABLE_INSERT:string="INSERT INTO route_station(id,routeID,stationID)values(:id,:routeID,:stationID)"
    public static insert(routeStation:RouteStation):any{
        return {":id":routeStation.id,":routeID":routeStation.routeID,":stationID":routeStation.stationID};
    }
}
export class EditRouteStation {
    public static newRouteStation(routeID:number,stationID:number):RouteStation{
        return {routeID:routeID,stationID:stationID,
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
        }
    }
    static FROM_SQL_OBJECT(object:any):RouteStation{
        const res=EditRouteStation.newRouteStation(object.routeID,object.stationID);
        res.id=object.id;
        return res;
    }
    public static fromJSONobj(data:any):RouteStation {
        return  Object.assign(EditRouteStation.newRouteStation(data.routeID,data.stationID),data);
    }
}









