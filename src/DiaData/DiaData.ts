import {Station, StationEdit, StationGet} from "./Station";
import {EditRoute, EditRouteStation, Route, RouteStation} from "./Route";
// import {Calendar, EditCalendar} from "./Calendar";
import {EditTrip, Trip} from "./Trip";
import {
    EditTimeTable,
    EditTimeTableRoute,
    EditTimeTableRouteStation,
    EditTimeTableStation,
    TimeTable,
    TimeTableRoute,
    TimeTableRouteStation,
    TimeTableStation
} from "./TimeTable";
import initSqlJs from "sql.js"
import {StationTime, StationTimeEdit, StopType} from "./StationTime";

export interface DiaData{
    stations: { [key: number]: Station } ;
    routes: { [key: number]: Route }
    routeStation: { [key: number]: RouteStation }

    trips: { [key: number]: Trip }
    timeTable: { [key: number]: TimeTable }
    timeTableStation: { [key: number]: TimeTableStation }
    timeTableRoute: { [key: number]: TimeTableRoute }
    timeTableRouteStation: { [key: number]: TimeTableRouteStation }
    name: string;
}

export class GetDiaData {
    public static getRoute(diaData:DiaData,routeID: number): Route {
        return diaData.routes[routeID] as Route;
    }
    public static getTrip(diaData:DiaData,tripID:number):Trip{
        return diaData.trips[tripID] as Trip;
    }

    public async saveSqlite(diaData:DiaData) {
        const SQL = await initSqlJs({
            locateFile: file => `https://sql.js.org/dist/${file}`
        });
        const db = new SQL.Database();
        //stationsの追加
        db.exec(StationGet.SQL_TABLE_CREATE);
        const stmt = db.prepare(StationGet.SQL_TABLE_INSERT);
        Object.values(diaData.stations).map(station => {
            stmt.bind(StationGet.insert(station));
            stmt.run();
        });
        const a = db.exec("SELECT * FROM stations");
        console.log(a);
    }


}
export class EditDiaData {
    public static newDiaData() :DiaData{
        return {
            stations:{},
            routes:{},
            routeStation:{},
            trips:{},
            timeTable:{},
            timeTableRouteStation:{},
            timeTableRoute:{},
            timeTableStation:{},
            // stationTimes:{},
            name:""
        }
    }

    public static async loadSQLite() {
        const diaData=EditDiaData.newDiaData();
        const sqlPromise = initSqlJs({
            locateFile: file => `https://sql.js.org/dist/${file}`
        });
        const dataPromise = fetch("./diaData/diaData.sqlite").then(res => res.arrayBuffer());
        const [SQL, buf] = await Promise.all([sqlPromise, dataPromise])
        const db = new SQL.Database(new Uint8Array(buf));
        {
            const res = db.exec("SELECT * FROM stations");
            const stations = res[0].values.map(v => Object.fromEntries(v.map((v2, i) => [res[0].columns[i], v2])));
            stations.forEach(station => {
                const s = StationEdit.FROM_SQL_OBJECT(station);
                diaData.stations[s.id] = s;
            })
        }

        {
            const res = db.exec("SELECT * FROM route");
            const routes: any[] = res[0].values.map(v => Object.fromEntries(v.map((v2, i) => [res[0].columns[i], v2])));
            const routePromise = routes.map(route => {
                const r = EditRoute.newRoute();
                r.id = route.id;
                r.name = route.name;
                diaData.routes[route.id] = r;
            });



        }
        {
            const res = db.exec("SELECT * FROM route_station");
            const routeStations: any[] = res[0].values.map(v => Object.fromEntries(v.map((v2, i) => [res[0].columns[i], v2])));
            routeStations.forEach(rs => {
                const route=diaData.routes[rs.routeID];
                const routeStation=EditRouteStation.FROM_SQL_OBJECT(rs);

                route.routeStationIDs.push(routeStation.id);
                diaData.routeStation[routeStation.id]=routeStation;
            });


        }
        {
            //trip
            const res = db.exec("SELECT * FROM trip");
            const trips: any[] = res[0].values.map(v => Object.fromEntries(v.map((v2, i) => [res[0].columns[i], v2])));
            trips.forEach(t => {
                const route=diaData.routes[t.routeID];
                const trip=EditTrip.FROM_SQL_OBJECT(t);
                route.tripIDs.push(trip.id);
                diaData.trips[trip.id]=trip;
            });
            // Object.values(this.routes).forEach(route => {
            //     Object.values((route as Route).trips).forEach(trip => {
            //         if (!this.trains[trip.trainId]) {
            //             this.trains[trip.trainId] = new Train(calendar);
            //             this.trains[trip.trainId].id=trip.trainId;
            //         }
            //         this.trains[trip.trainId].trips.push(trip);
            //     })
            // })

        }
        console.log(diaData.routes);
        {
            //stationTime
            const res = db.exec("SELECT * FROM station_time");
            const stationTimes: any[] = res[0].values.map(v => Object.fromEntries(v.map((v2, i) => [res[0].columns[i], v2])));
            stationTimes.forEach(st => {
                const trip:Trip=GetDiaData.getTrip(diaData,st.tripID)!;
                const stationTime=StationTimeEdit.FROM_SQL_OBJECT(diaData,st);
                trip.stationTimes[stationTime.routeStationID]=stationTime;
            });


        }

        EditDiaData.debugMakeTimeTable(diaData);
        return diaData;
    }
    /**
     * デバッグ用として使用します。
     * timetableのサンプルを作ります。
     */
    private static debugMakeTimeTable(diaData:DiaData) {
        const timetable = EditTimeTable.newTimeTable();
        timetable.id = 0;
        diaData.timeTable[timetable.id] = timetable;
        const addStation = (stationID: number) => {
            if (diaData.stations[stationID]) {
                const s=EditTimeTableStation.newTimeTableStation(stationID);
                timetable.timeTableStationIDs.push(s.id);
                diaData.timeTableStation[s.id]=s;
            }
        }
        addStation(22828);
        addStation(23036);
        addStation(22751);
        addStation(22914);
        addStation(22807);
        addStation(29818);
        addStation(22709);
        addStation(22556);
        addStation(22566);
        addStation(22602);
        addStation(23126);
        addStation(23244);
        addStation(23205);
        addStation(23289);
        addStation(23368);
        addStation(23316);
        addStation(23291);
        addStation(23251);
        addStation(23096);
        addStation(23304);
        addStation(23238);
        addStation(23234);
        addStation(23298);
        addStation(23091);
        addStation(23269);
        addStation(23156);
        addStation(23124);
        addStation(23098);
        addStation(23285);
        addStation(23271);
        addStation(23324);
        addStation(23363);
        addStation(23452);


        const addRouteStation=(timeTableRoute:TimeTableRoute,routeStationID:number|undefined,type:StopType)=>{
            const res= EditTimeTableRouteStation.newEditTimeTableRouteStation(timeTableRoute.id);
            res.routeStationID=routeStationID;
            res.type=type
            timeTableRoute.timeTableRouteStationIDs.push(res.id);
            diaData.timeTableRouteStation[res.id]=res;

        }
        const keihin=EditTimeTableRoute.newEditTimeTableRoute(timetable.id,4068331810946883,0);
        GetDiaData.getRoute(diaData,keihin.routeID).routeStationIDs.slice(21,36).forEach(routeStationID=>{
            addRouteStation(keihin,routeStationID,StopType.STOP);
        });
        for(let i=0;i<18;i++){
            addRouteStation(keihin,undefined,StopType.NONE);
        }


        const tokai=EditTimeTableRoute.newEditTimeTableRoute(timetable.id,3238131310476439,0);
        const tokaiRoute=GetDiaData.getRoute(diaData,tokai.routeID);
        addRouteStation(tokai,tokaiRoute.routeStationIDs[0],StopType.STOP);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,tokaiRoute.routeStationIDs[1],StopType.STOP);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,tokaiRoute.routeStationIDs[2],StopType.STOP);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,tokaiRoute.routeStationIDs[3],StopType.STOP);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,tokaiRoute.routeStationIDs[4],StopType.STOP);
        addRouteStation(tokai,undefined,StopType.PASS);
        addRouteStation(tokai,undefined,StopType.PASS);
        for(let i=5;i<21;i++){
            addRouteStation(tokai,tokaiRoute.routeStationIDs[i],StopType.STOP);
        }

        const suka=EditTimeTableRoute.newEditTimeTableRoute(timetable.id,4424381226938653,0);
        const sukaRoute=GetDiaData.getRoute(diaData,suka.routeID);
        addRouteStation(suka,sukaRoute.routeStationIDs[0],StopType.STOP);
        addRouteStation(suka,undefined,StopType.PASS);
        addRouteStation(suka,sukaRoute.routeStationIDs[1],StopType.STOP);
        addRouteStation(suka,undefined,StopType.PASS);
        addRouteStation(suka,undefined,StopType.PASS);
        addRouteStation(suka,undefined,StopType.PASS);
        addRouteStation(suka,sukaRoute.routeStationIDs[2],StopType.STOP);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,undefined,StopType.NONE);
        addRouteStation(suka,sukaRoute.routeStationIDs[6],StopType.STOP);
        addRouteStation(suka,sukaRoute.routeStationIDs[7],StopType.STOP);
        addRouteStation(suka,sukaRoute.routeStationIDs[8],StopType.STOP);
        addRouteStation(suka,sukaRoute.routeStationIDs[9],StopType.STOP);
        addRouteStation(suka,sukaRoute.routeStationIDs[10],StopType.STOP);

        for(let i=0;i<14;i++){
            addRouteStation(suka,undefined,StopType.NONE);

        }


        timetable.timeTableRouteIDs.push(keihin.id);
        // timetable.timeTableRouteIDs.push(tokai.id);
        // timetable.timeTableRouteIDs.push(suka.id);
        diaData.timeTableRoute[keihin.id]=keihin;
        diaData.timeTableRoute[tokai.id]=tokai;
        diaData.timeTableRoute[suka.id]=suka;

        Object.values(diaData.trips).forEach(trip=>{
            if(trip.routeID==4068331810946883){
                timetable.tripList[trip.direct].push(trip.id);

            }
        })

    }
    public static fromJSONobj(data:any):DiaData{
        const res:DiaData=Object.assign(EditDiaData.newDiaData(),data);
        Object.values(res.stations).forEach(item=>{
            const resStation:Station=StationEdit.fromJSONobj(item);
            res.stations[resStation.id]=resStation;
        })
        Object.values(res.routes).forEach(item=>{
            const resRoute=EditRoute.fromJSONobj(item);
            res.routes[resRoute.id]=resRoute;
        })
        Object.values(res.routeStation).forEach(item=>{
            const resRouteStation=EditRouteStation.fromJSONobj(item);
            res.routeStation[resRouteStation.id]=resRouteStation;
        })
        Object.values(res.trips).forEach(item=>{
            const resTrip=EditTrip.fromJSONobj(item);
            res.trips[resTrip.id]=resTrip;
        })
        // Object.values(res.stationTimes).forEach(item=>{
        //     const resStationTime=StationTimeEdit.fromJSONobj(item);
        //     res.stationTimes[resStationTime.id]=resStationTime;
        // })
        Object.values(res.timeTable).forEach(item=>{
            const resTimeTable=EditTimeTable.fromJSONobj(item);
            res.timeTable[resTimeTable.id]=resTimeTable;
        })
        Object.values(res.timeTableRoute).forEach(item=>{
            const resTimeTableRoute=EditTimeTableRoute.fromJSONobj(item);
            res.timeTableRoute[resTimeTableRoute.id]=resTimeTableRoute;
        })
        Object.values(res.timeTableRouteStation).forEach(item=>{
            const resTimeTableRouteStation=EditTimeTableRouteStation.fromJSONobj(item);
            res.timeTableRouteStation[resTimeTableRouteStation.id]=resTimeTableRouteStation;
        })
        Object.values(res.timeTableRoute).forEach(item=>{
            const resTimeTableRoute=EditTimeTableRoute.fromJSONobj(item);
            res.timeTableRoute[resTimeTableRoute.id]=resTimeTableRoute;
        })

        return res;
    }



}


