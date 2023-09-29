import {DiaData} from "./DiaData";
import {Route} from "./Route";

export interface Station {
    id: number;

    name: string;
    address: string;
}


export class StationGet{

    static SQL_TABLE_CREATE:string="CREATE TABLE stations (id int,name text)";
    static SQL_TABLE_INSERT:string="INSERT INTO stations(id,name)values(:id,:name)"
    public static  insert(station:Station):any{
        return {":id":station.id,":name":station.name};
    }

    /**
     * この駅を停車駅に持つrouteを返します。
     */
    public static getRoutes(station:Station,diaData:DiaData):Route[]{
        throw new Error("todo");
        // return Object.values(diaData.routes).filter(route=>
        //     route.routeStation.some(rStation=>rStation.stationID===station.id)
        // )
    }
    /**
     * この駅の隣の駅のリストを返します。
     */
    public static getNextStations():Station[]{
        // return Array.from(new Set(this.getRoutes().map(route=> {
        //     return route.routeStation.map((rStation,index)=>{
        //         if(rStation.station===this){
        //
        //         }
        //
        //         return undefined;
        //     });
        // }).flat())).filter(s=>s!==undefined) as Station[];
        //todo
        return [];
    }


}
export class StationEdit{
    public static newStation(){
        const res:Station=
            {id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
                name:"",
                address:""};
        return res;
    }
    public static FROM_SQL_OBJECT(object:any):Station{
        const station=StationEdit.newStation();
        station.id=object.id;
        station.name=object.name;
        if(station.name.includes('(')){
            station.address=station.name.substring(station.name.indexOf('(')+1,station.name.indexOf(')'));
            station.name=station.name.substring(0,station.name.indexOf('('));
        }
        return station;
    }
    public static fromJSONobj(data:any):Station {
        return Object.assign(StationEdit.newStation(),data);
    }


}