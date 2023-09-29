import {Direction, StopType} from "./StationTime";

/**
 * 表示できる一つの時刻表を示します。
 */
export interface TimeTable{
    id:number;
    name:string;
    timeTableStationIDs:number[];
    timeTableRouteIDs:number[];
    tripList:number[][];
}
export class GetTimeTable{
    public _id:number=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);


}
export class EditTimeTable{
    public static newTimeTable():TimeTable{
        return {
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            name:"",
            timeTableStationIDs:[],
            timeTableRouteIDs:[],
            tripList:[[],[]]
        }
    }
    public static fromJSONobj(data:any):TimeTable {
        const res:TimeTable= Object.assign(EditTimeTable.newTimeTable(),data);
        return res;
    }
}


export interface TimeTableRoute{
    id:number;
    timeTableRouteStationIDs:number[];
    timeTableID:number;
    routeID:number;
    direct:Direction;
}

export class GetTimeTableRoute{
}
export class EditTimeTableRoute{
    public static newEditTimeTableRoute(timetableID:number,routeID:number,direct:Direction):TimeTableRoute{
        return{
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            timeTableID:timetableID,
            routeID:routeID,
            direct:direct,
            timeTableRouteStationIDs:[],
        }
    }
    public static fromJSONobj(data:any):TimeTableRoute {
        const res:TimeTableRoute= Object.assign(EditTimeTableRoute.newEditTimeTableRoute(data.timetableID,data.routeID,data.direct),data);
        return res;
    }

}

export interface TimeTableRouteStation{
    id:number;
    type:StopType;
    routeStationID:number|undefined;
    timeTableRouteID:number;

}
export class GetTimeTableRouteStation{
    private _id:number=Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);

    constructor(public timetableRouteID:number,) {
    }
}
export class EditTimeTableRouteStation{
    public static newEditTimeTableRouteStation(timetableRouteID:number):TimeTableRouteStation{
        return{
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            timeTableRouteID:timetableRouteID,
            type:StopType.STOP,
            routeStationID:undefined
        }
    }
    public static fromJSONobj(data:any):TimeTableRouteStation {
        const res:TimeTableRouteStation= Object.assign(EditTimeTableRouteStation.newEditTimeTableRouteStation(data.timeTableRouteID),data);
        return res;
    }
}

export interface TimeTableStation{
    id:number;
    showDep:boolean[];
    showAri:boolean[];
    stationID:number;
}
export class EditTimeTableStation{
    public static newTimeTableStation(stationID:number):TimeTableStation{
        return {
            id:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),
            showDep:[true,true],
            showAri:[true,true],
            stationID:stationID
        }
    }
    public static fromJSONobj(data:any):TimeTableStation {
        const res:TimeTableStation= Object.assign(EditTimeTableStation.newTimeTableStation(data.stationID),data);
        return res;
    }

}
export class GetTimeTableStation{


}

