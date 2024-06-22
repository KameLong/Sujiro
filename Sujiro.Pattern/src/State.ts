import {atom, RecoilState, selector, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Route, Station, StopTime, Train, TrainType} from "./SujiroData/DiaData";
import {UndoRedoItem, useUndoRedoContext} from "./Hooks/UndoRedoHook";
import {patternSettingsAtom, patternTrainsAtom} from "./SujiroData/PatternTrain";
import {PassengerBetweenStationAtom} from "./SujiroData/Passenger";

export const trainTypesAtom:RecoilState<TrainType[]>=atom({
    key: 'trainTypes',
    default: [
        {id: 0, name: "普通", shortName: "", color: "#000000"},
        {id: 1, name: "準急", shortName: "", color: "#008000"},
        {id: 2, name: "急行", shortName: "", color: "#FF8000"},
    ]
});
export const stationsAtom:RecoilState<Station[]>=atom({
    key:'stations',
    default:[
        { id: 10, name:"梅田",style:0x21,type:1 },
        { id: 11, name:"中津",style:0x11,type:0 },
        { id: 12, name:"十三",style:0x33,type:1 },
        { id: 13, name:"三国",style:0x11,type:0 },
        { id: 14, name:"庄内",style:0x11,type:0 },
        { id: 15, name:"服部天神",style:0x11,type:0 },
        { id: 16, name:"曽根",style:0x33,type:0 },
        { id: 17, name:"岡町",style:0x11,type:0 },
        { id: 18, name:"豊中",style:0x12,type:1 },
    ]
})
export const trainsAtom:RecoilState<Train[]>=atom({
    key:'trains',
    default:[] as Train[]
})

export function useSaveData(){
    const trainType=useRecoilValue(trainTypesAtom);
    const stations=useRecoilValue(stationsAtom);
    const trains=useRecoilValue(trainsAtom);
    const patternTrains=useRecoilValue(patternTrainsAtom);
    const patternSettings=useRecoilValue(patternSettingsAtom);
    const passenger=useRecoilValue(PassengerBetweenStationAtom);
    return ()=>{
        localStorage.setItem("trainType",JSON.stringify(trainType));
        localStorage.setItem("stations",JSON.stringify(stations));
        localStorage.setItem("trains",JSON.stringify(trains));
        localStorage.setItem("patternTrains",JSON.stringify(patternTrains));
        localStorage.setItem("patternSettings",JSON.stringify(patternSettings));
        localStorage.setItem("passenger",JSON.stringify(passenger));
    }

}
export function useLoadData(){
    const setTrainType=useSetRecoilState(trainTypesAtom);
    const setStations=useSetRecoilState(stationsAtom);
    const setTrains=useSetRecoilState(trainsAtom);
    const setPatternTrains=useSetRecoilState(patternTrainsAtom);
    const setPatternSettings=useSetRecoilState(patternSettingsAtom);
    const setPassenger=useSetRecoilState(PassengerBetweenStationAtom);
    return ()=>{
        setTrainType(JSON.parse(localStorage.getItem("trainType") as string));
        setStations(JSON.parse(localStorage.getItem("stations") as string));
        setTrains(()=>{
            const trains=JSON.parse(localStorage.getItem("trains") as string)
            return trains;
        });

        setPatternTrains(()=>{
            const trains:Train[][]=JSON.parse(localStorage.getItem("patternTrains") as string)
            trains.forEach(ts=>ts.forEach(t=>{
                if(t.direction===undefined){
                    t.direction=0;
                }
            }))
            return trains;
        });
        setPatternSettings(JSON.parse(localStorage.getItem("patternSettings") as string));
        setPassenger(JSON.parse(localStorage.getItem("passenger") as string));
    }

}




//列車の変更を行います。
//trainIDで管理し、IDが同じ列車に対して処理します。
// export function useEditTrain() {
//     const [train,setTrain] = useRecoilState(trainsAtom);
//     const {execute}=useUndoRedoContext();
//
//     return (newTrains:Train[])=>{
//         const indexs=newTrains.map((newTrain)=>{
//             return{
//                 index:train.findIndex(item=>item.trainID===newTrain.trainID),
//                 newTrain:newTrain,
//                 prevTrain:train.find(item=>item.trainID===newTrain.trainID)
//             }
//         });
//         const editTrains=indexs.filter(item=>item.prevTrain!==undefined) as {index: number,newTrain: Train,prevTrain: Train}[];
//
//
//         const action:UndoRedoItem={
//             task:()=>{
//                 //既存の列車を置き換えます
//                 setTrain(prev=>{
//                     const next=[...prev];
//                     editTrains.forEach(item=>{
//                         next[item.index]=item.newTrain;
//                     })
//                     return next;
//                 })
//             },
//             undo:()=>{
//                 setTrain(next=>{
//                     const prev=[...next];
//                     editTrains.forEach(item=>{
//                         prev[item.index]=item.prevTrain;
//                     })
//                     return prev;
//                 })
//             }
//         }
//         execute(action);
//         const addTrains=indexs.filter(item=>item.index<0);
//         //todo addTarinsの処理
//
//     }
// }


// export function useEditStopTime()
// {
//     const [trains,setTrain] = useRecoilState(trainsAtom);
//     const {execute}=useUndoRedoContext();
//
//     return (trainID:number,newStopTimes:StopTime[])=>{
//         const train=trains.find(item=>item.trainID===trainID);
//         if(train===undefined){
//             console.error("Train has no longer than the train");
//             return;
//         }
//
//         const indexs=newStopTimes.map((newStopTime)=>{
//             return{
//                 index:train.times.findIndex(item=>item.stationID===newStopTime.stationID),
//                 newStopTime:newStopTime,
//                 prevStopTime:train.times.find(item=>item.stationID===newStopTime.stationID)
//             }
//         });
//         const editStopTimes=indexs.filter(item=>item.prevStopTime!==undefined) as {index: number,newStopTime: StopTime,prevStopTime: StopTime}[];
//         const action:UndoRedoItem={
//             task:()=>{
//                 //既存の列車を置き換えます
//                 setTrain(prev=>{
//                     const next=[...prev];
//                     const i=next.findIndex(item=>item.trainID===trainID);
//                     const train={...next[i],times:[...next[i].times]};
//                     editStopTimes.forEach(item=>{
//                         train.times[item.index]=item.newStopTime;
//                     })
//                     next[i]=train;
//                     return next;
//                 })
//             },
//             undo:()=>{
//                 console.log(editStopTimes);
//                 setTrain(next=>{
//                     const prev=[...next];
//                     const i=prev.findIndex(item=>item.trainID===trainID);
//                     const train={...prev[i],times:[...prev[i].times]};
//                     editStopTimes.forEach(item=>{
//                         train.times[item.index]=item.prevStopTime;
//                     })
//                     prev[i]=train;
//                     return prev;
//                 })
//             }
//         }
//         execute(action);
//         const addStopTimes=indexs.filter(item=>item.index<0);
//         //todo addStopTimesの処理
//
//
//
//     }
// }
