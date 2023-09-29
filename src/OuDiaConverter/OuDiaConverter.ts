import { O_O } from "@route-builders/oud-operator";
import {DiaData} from "../DiaData/DiaData";
import {Station} from "../DiaData/Station";
import {Route} from "../DiaData/Route";
import {Trip} from "../DiaData/Trip";
import {TimeTable,  TimeTableRoute, TimeTableStation} from "../DiaData/TimeTable";

export class OuDiaConverter{
    /**
     * O_OからDiaDataに変換します。
     */
    constructor(diaData:DiaData,oudia:O_O) {
        //駅の作成
    //     const diaDataStations=oudia.stations.map(s=>{
    //         const station=new Station(diaData);
    //         station.name=s.name;
    //         diaData.stations[station.id]=station;
    //         return station;
    //     });
    //     // 1oudファイルは1routeに対応します。
    //     const route:Route=new Route();
    //     route.paths=oudia.stations.slice(0,-1).map((s,i)=>
    //         new Path(route.id,diaDataStations[i],diaDataStations[i+1]));
    //     diaData.routes[route.id]=route;
    //     const timeTable=new TimeTable(diaData);
    //     timeTable.name=oudia.name;
    //     diaData.timeTable[timeTable.id]=timeTable;
    // timeTable.timeTableStations=oudia.stations.map((station,index)=>{
    //         const tStation=new TimeTableStation(diaDataStations[index]);
    //
    //         tStation.showDep=[oudia.stations[index].timeType!=20,oudia.stations[index].timeType!=30];
    //         tStation.showAri=[oudia.stations[index].timeType==10||oudia.stations[index].timeType==20,oudia.stations[index].timeType==10||oudia.stations[index].timeType==30];
    //         return tStation;
    //     })
    //     timeTable.timeTablePaths=route.paths.map((path,index)=>
    //         new TimeTablePath(path,index,index+1))
    //
    //
    //     oudia.diagrams.map(diagram=>{
    //         const diaName=diagram.name;
    //         let calendar=diaData.getCalenderFromName(diaName);
    //         if(!calendar){
    //             calendar=new Calendar();
    //             calendar.name=diaName;
    //             diaData.calendar[calendar.id]=calendar;
    //         }
    //         //downTrain
    //         diagram.downStreaks.map(streak=>{
    //             const train=new Train(calendar as Calendar);
    //             train.name=streak.name;
    //
    //             if(streak.no){
    //                 train.number=streak.no;
    //             }
    //             diaData.trains[train.id]=train;
    //             const trip=new Trip(route,0,train.id);
    //             trip.time=route.paths.map((path,index):PathTime=>{
    //                 if(!streak.stHandlings[index]||!streak.stHandlings[index+1]){
    //                     return new PathTime(path,trip);
    //                 }
    //                 const time= new PathTime(path,trip);
    //                 if(streak.stHandlings[index].departure){
    //                     time.depTime=streak.stHandlings[index].departure.getTime();
    //                     time.depType=streak.stHandlings[index].type;
    //                 }
    //                 if(streak.stHandlings[index+1].arrival){
    //                     time.ariTime=streak.stHandlings[index+1].arrival.getTime();
    //                     time.ariType=streak.stHandlings[index+1].type;
    //                 }
    //
    //                 return time;
    //             });
    //             train.trips.push(trip);
    //             route.trips[trip.id]=trip;
    //         })
    //         diagram.upStreaks.map(streak=>{
    //             const train=new Train(calendar as Calendar);
    //             train.name=streak.name;
    //
    //             if(streak.no){
    //                 train.number=streak.no;
    //             }
    //             diaData.trains[train.id]=train;
    //             const trip=new Trip(route,1,train.id);
    //             trip.time=route.paths.map((path,index):PathTime=>{
    //                 index=route.paths.length-index;
    //                 if(!streak.stHandlings[index]||!streak.stHandlings[index+1]){
    //                     return new PathTime(path,trip);
    //                 }
    //                 const time= new PathTime(path,trip);
    //                 if(streak.stHandlings[index].departure){
    //                     time.depTime=streak.stHandlings[index].departure.getTime();
    //                     time.depType=streak.stHandlings[index].type;
    //                 }
    //                 if(streak.stHandlings[index+1].arrival){
    //                     time.ariTime=streak.stHandlings[index+1].arrival.getTime();
    //                     time.ariType=streak.stHandlings[index].type;
    //                 }
    //
    //                 return time;
    //             });
    //             train.trips.push(trip);
    //             route.trips[trip.id]=trip;
    //         })
    //     })
    //     const route2=new Route();
    //     route2.name="ダミー";
    //     diaData.routes[route2.id]=route2;
    //     const  timeTable2=new TimeTable(diaData);
    //     timeTable2.name="ダミー";
    //     diaData.timeTable[timeTable2.id]=timeTable2;
    //



    }
}