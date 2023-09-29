import React from "react";
import {Trip} from "../../DiaData/Trip";
import {
    TimeTableRoute,
    TimeTableRouteStation,
    TimeTableStation
} from "../../DiaData/TimeTable";
import {
    stationSelector, timetableRouteSelector, timetableRoutesSelector, timetableRouteStationSelector,
    timetableSelector,
    timetableStationSelector,
    tripSelector,
} from "../../store";
import {RouteComponentProps, useLocation} from "react-router";
import {StationTimeEdit, StopType} from "../../DiaData/StationTime";
import classes from "./TimeTablePage.module.scss"
import {useFocusControl} from "../Test/useFocusController";
import {Station} from "../../DiaData/Station";
import {StationTimeEditView} from "./StationTimeEditView";
import {useRecoilValue} from "recoil";
export class StationInfo{
    public timetableStation:TimeTableStation;
    public ttrStation:TimeTableRouteStation[]=[];
    public station:Station;
    constructor(tts:TimeTableStation,station:Station) {
        this.timetableStation=tts;
        this.station=station;
    }
}

interface TimeTableViewPageProps
    extends RouteComponentProps<{
        id: string;
    }> {
}
export const TimeTableViewPage: React.FC<TimeTableViewPageProps>= (params) => {
    try {
        const searchParams = new URLSearchParams(useLocation().search);
        const timeTableID = Number(searchParams.get("timetable"));
        const direction = Number(searchParams.get("direct"));
        const {register,test} = useFocusControl(
            (input)=>{
            }
        );
        const timeTable=useRecoilValue(timetableSelector(timeTableID));
        const timetableRoutes=useRecoilValue(timetableRoutesSelector);
        if(timeTable===undefined){
            return(
                <div>Invalid timetableID</div>
            )
        }
        const ttRoutes=timeTable.timeTableRouteIDs.map(id=> timetableRoutes[id]);
        const tripIDs=timeTable.tripList[0];
        let i=0;
        return (
            <div style={{paddingTop:'10px',height:'100%'}}>

                {/*<StationView stations={stationInfos}/>*/}

                <div className={classes.noScrollBar} style={{display: 'flex',flexShrink:'1',overflowX: 'scroll',borderBottom:'2px solid black'}}>
                    {
                        tripIDs.map((val) => {
                            i++;
                            return (<TrainView columnIndex={i-1} tripID={val} register={register} timeTableID={timeTable?.id??0}
                                               key={Math.floor(Math.random() * 10000000)}/>);
                        })
                    }
                </div>
                <div style={{width:'100%',flexShrink:'0'}}>
                    <StationTimeEditView
                        setStationTimeSelectedEvent={test}
                        ></StationTimeEditView>
                </div>
            </div>

        );
    }catch(e){
        console.log(e);
        return (
            <div></div>
        );
   }
}


interface TrainViewProps {
    tripID:number,
    columnIndex:number
    timeTableID:number

    register: (
        rowIndex: number,
        columnIndex: number,
    ) => {
        onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
        ref: (element: HTMLInputElement) => void;
    };
}
const TrainView: React.FC<TrainViewProps> = (props) => {
    const timeTable=useRecoilValue(timetableSelector(props.timeTableID));
    const trip:Trip = useRecoilValue(tripSelector(props.tripID));
    const stationInfos = timeTable.timeTableStationIDs.map((s, index) => {
        const tts=useRecoilValue(timetableStationSelector(s));
        let station = new StationInfo(tts,useRecoilValue(stationSelector(tts.stationID)));
        station.ttrStation=timeTable.timeTableRouteIDs.map(ttr=>useRecoilValue(timetableRouteSelector(ttr)).timeTableRouteStationIDs[index])
            .map(ttrs=>useRecoilValue(timetableRouteStationSelector(ttrs)));
        return station;
    });
    const times= stationInfos.map(station => {
        const routeStations: number[] = station.ttrStation.map(rs => rs.routeStationID).filter(s => s !== undefined) as number[];
        const st = routeStations.filter(s => s !== undefined).map(s => trip.stationTimes[s]).find(s => s !== undefined);
        if (st === undefined) {
            return StationTimeEdit.newStationTime(trip.id, -1);
        }
        return st;
    });
    //通過駅の処理を行う。
    const startStation=times.findIndex(t=>t.type===1);
    const endStation=times.findLastIndex(t=>t.type===1);
    for(let i=startStation;i<endStation;i++){
        if(times[i].type===0){
            const ttr:TimeTableRoute=timeTable.timeTableRouteIDs.map(ttrID=>useRecoilValue(timetableRouteSelector(ttrID)))
                .find(ttr=>(ttr.routeID===trip.routeID)&&ttr.direct===trip.direct)as TimeTableRoute;
            times[i].type=useRecoilValue(timetableRouteStationSelector(ttr.timeTableRouteStationIDs[i])).type;
        }
        if(times[i].type===0){
            times[i].type=StopType.NOVIA;
        }
    }

    const time=(depTime:number,ariTime:number,type:number)=>{
        if(type==0){
            return " ･･ ";
        }
        if(type==3)
        {
            return "||"
        }
        if(type==2){
            return "\u202Fﾚ"
        }
        if(depTime==-1){
            if(ariTime>=0){
                depTime=ariTime;
            }else{
                return " ◯ ";
            }
        }
        const ss=depTime%60;
        const mm=Math.floor(depTime/60%60).toString();
        const hh=Math.floor(depTime/3600%24).toString();
        return hh+mm.padStart( 2, '0');

    }
    let fontSize=12;

    const depTime=(station:StationInfo)=>{
        const stationTime=times[stationInfos.indexOf(station)];
        if(!stationTime){
            return " ･･ ";
        }
        return time(stationTime.depTime,stationTime.ariTime,stationTime.type);

    }
    return (
        <div>
            {/*<button onClick={deleteTrain}>削除</button>*/}
            <div style={{minWidth:Math.floor(fontSize*2.5)+'px',borderRight:'1px solid gray',lineHeight:Math.floor(fontSize*1.2)+'px',fontSize:fontSize+'px'}}>
                {
                    stationInfos.map((station,i)=>{
                        return(<div data-trainid={props.tripID} data-routestation={times[i]?.routeStationID??0} {...props.register(i-1,props.columnIndex)} tabIndex={0} className={classes.selectableCell} style={{textAlign:"center"}} key={Math.floor(Math.random()*10000000)}> {
                            depTime(station)
                        }</div>)
                    })
                }
            </div>
        </div>
    );
}
// function  timetableSorter(original:TrainData[],sortIndex:number):TrainData[]{
//     original=[...original];
//     original.sort((a,b)=>{
//          let at=a.time[sortIndex].depTime;
//          if(at<0){
//              at=a.time[sortIndex].ariTime;
//          }
//          if(at<0){
//              at=1000000;
//          }
//         let bt=b.time[sortIndex].depTime;
//         if(bt<0){
//             bt=b.time[sortIndex].ariTime;
//         }
//         if(bt<0){
//             bt=1000000;
//         }
//         return at-bt;
//     })
//     const result:TrainData[]=[];
//     for(let i=0;i<original.length;i++){
//         if(original[i].time[sortIndex].depTime>=0||original[i].time[sortIndex].ariTime>=0){
//             result.push(original[i]);
//             original.splice(i,1);
//             i--;
//         }
//     }
//     if(original.length===0){
//         return result;
//     }
//     const stationCount=original[0].time.length;
//     for(let stationIndex=sortIndex+1;stationIndex<stationCount;stationIndex++){
//         for(let i=0;i<original.length;i++){
//             if(StationTimeGet.getTimeDA(original[i].time[stationIndex])>=0) {
//                 const time=StationTimeGet.getTimeDA(original[i].time[stationIndex]);
//                 for(let j=result.length-1;j>=0;j--){
//                     if(StationTimeGet.getTimeAD(result[j].time[stationIndex])>=0&&time>=StationTimeGet.getTimeAD(result[j].time[stationIndex])){
//                         result.splice(j+1,0,original[i]);
//                         original.splice(i,1);
//                         i--;
//                         break;
//                     }
//                     if(j===0){
//                         result.splice(0,0,original[i]);
//                         original.splice(i,1);
//                         i--;
//                         break;
//                     }
//                 }
//
//             }
//         }
//     }
//
//     return result;
//
// }

interface StationViewProps{
    stations:StationInfo[]
}
const StationView: React.FC<StationViewProps> = (props) => {
    let fontSize=12;

    const data=(station:StationInfo)=>{
        return (station.station.name);
    }

    const deleteTrain =()=> {
        // const a=new DeleteTrain(props.train.id)
        // dispatch(a);
    }

    return (
        <div>
            {/*<button onClick={deleteTrain}>削除</button>*/}
            <div className={classes.stationNameDivNormal} style={{width:Math.floor(fontSize*5)+'px',lineHeight:Math.floor(fontSize*1.2)+'px',fontSize:fontSize+'px'}}>
                {

                    props.stations.map(station=>{
                        return(<div  tabIndex={0} className={classes.selectableCell} style={{textAlign:"center"}} key={Math.floor(Math.random()*10000000)}> {
                            data(station)
                        }</div>)
                    })
                }
            </div>
        </div>
    );
}

// public ArrayList<Train> sort(int stationIndex){
//     ArrayList<Train> result = new ArrayList<>();
//
//     try {
//         loopNum = 0;
//         for (int i = 0; i < sortBefore.size(); i++) {
//             if (trainList[sortBefore.get(i)].getPredictionTime(stationIndex) > 0 && !trainList[sortBefore.get(i)].checkDoubleDay()) {
//                 //今からsortAfterに追加する列車の基準駅の時間
//                 int baseTime = trainList[sortBefore.get(i)].getPredictionTime(stationIndex);
//                 int j;
//                 for (j = sortAfter.size(); j > 0; j--) {
//                     if (trainList[sortAfter.get(j - 1)].getPredictionTime(stationIndex) < baseTime) {
//                         break;
//                     }
//                 }
//                 sortAfter.add(j, sortBefore.get(i));
//                 sortBefore.remove(i);
//                 i--;
//             }
//         }
//         sorted[stationIndex] = true;
//         if (direction == Train.DOWN) {
//             sortDown(stationIndex);
//         } else {
//             sortUp(stationIndex);
//         }
//         sortAfter.addAll(sortBefore);
//         for (int i : sortAfter) {
//             result.add(trainList[i]);
//         }
//         return result;
//     }catch (Exception e){
//         SDlog.log(e);
//     }
//     result=new ArrayList<>();
//     for (int i : sortBefore) {
//         result.add(trainList[i]);
//     }
//     return result;
// }