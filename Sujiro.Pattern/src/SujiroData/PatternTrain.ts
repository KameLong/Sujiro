import {UndoRedoItem, useUndoRedoContext} from "../Hooks/UndoRedoHook";
import {atom, RecoilState, selector, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Route, Station, StopTime, Train, TrainType} from "./DiaData";
import {useEffect} from "react";
import {trainsAtom} from "../State";



export const patternTrainsAtom:RecoilState<Train[][]>=atom({
    key:'patterntrains',
    default:[[{
        direction:0,
        trainID:10,
        typeID:2,
        name:"",
        times:[
            {
                stopTimeID:0,
                stationID:10,
                trainID:0,
                stopID:0,
                stopType:1,
                ariTime:-1,
                depTime:43200
            },
            {
                stopTimeID:1,
                stationID:11,
                trainID:0,
                stopID:0,
                stopType:2,
                ariTime:-1,
                depTime:-1
            }
            ,
            {
                stopTimeID:2,
                stationID:12,
                trainID:0,
                stopID:0,
                stopType:1,
                ariTime:43380,
                depTime:43380
            }
            ,
            {
                stopTimeID:3,
                stationID:13,
                trainID:0,
                stopID:0,
                stopType:2,
                ariTime:-1,
                depTime:-1
            }
            ,
            {
                stopTimeID:4,
                stationID:14,
                trainID:0,
                stopID:0,
                stopType:2,
                ariTime:-1,
                depTime:-1
            }
            ,
            {
                stopTimeID:5,
                stationID:15,
                trainID:0,
                stopID:0,
                stopType:2,
                ariTime:-1,
                depTime:-1
            },
            {
                stopTimeID:6,
                stationID:16,
                trainID:0,
                stopID:0,
                stopType:2,
                ariTime:-1,
                depTime:-1
            },
            {
                stopTimeID:7,
                stationID:17,
                trainID:0,
                stopID:0,
                stopType:2,
                ariTime:-1,
                depTime:-1
            },
            {
                stopTimeID:8,
                stationID:18,
                trainID:0,
                stopID:0,
                stopType:1,
                ariTime:43860,
                depTime:-1
            }
        ]
    },
        {
            direction:0,
            trainID:11,
            typeID:0,
            name:"",
            times:[
                {
                    stopTimeID:0,
                    stationID:10,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:-1,
                    depTime:43260
                },
                {
                    stopTimeID:1,
                    stationID:11,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:43380,
                    depTime:43380
                }
                ,
                {
                    stopTimeID:2,
                    stationID:12,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:43500,
                    depTime:43560
                }
                ,
                {
                    stopTimeID:3,
                    stationID:13,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:43680,
                    depTime:43680
                }
                ,
                {
                    stopTimeID:4,
                    stationID:14,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:43800,
                    depTime:43860
                }
                ,
                {
                    stopTimeID:5,
                    stationID:15,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:43920,
                    depTime:43980
                },
                {
                    stopTimeID:6,
                    stationID:16,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:44040,
                    depTime:44100
                },
                {
                    stopTimeID:7,
                    stationID:17,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:44160,
                    depTime:44220
                },
                {
                    stopTimeID:8,
                    stationID:18,
                    trainID:0,
                    stopID:0,
                    stopType:1,
                    ariTime:44280,
                    depTime:-1
                }

            ]
        }
    ]
        ,[]
        ]
})

interface PatternSetting{
    // 繰り返しの周期(sec)
    period:number;
    //繰り返し回数
    repetitionNum:number;
}


export function usePatternTrainAtomChangedEffect() {
    const patternTrain = useRecoilValue(patternTrainsAtom);
    const patternSetting=useRecoilValue(patternSettingsAtom);
    const [trains,setTrains]=useRecoilState(trainsAtom);
    useEffect(() => {
        setTrains((old)=>{
            const newTrains:Train[]=[];
            for(let i=0;i<patternSetting.repetitionNum;i++) {
                for(let j=0;j<patternTrain[0].length;j++) {
                    const train:Train=structuredClone(patternTrain[0][j]);
                    train.trainID=train.trainID+(i+1)*10000;
                    train.times.forEach(time=>{
                        if(time.ariTime>=0){
                            time.ariTime+=patternSetting.period*i;
                        }
                        if(time.depTime>=0){
                            time.depTime+=patternSetting.period*i;
                        }
                    })
                    newTrains.push(train);
                }
            }
            return newTrains;
        })
    }, [patternTrain,patternSetting]);
}




//列車の変更を行います。
//trainIDで管理し、IDが同じ列車に対して処理します。
export function useEditPatternTrain() {
    const [trains,setTrain] = useRecoilState(patternTrainsAtom);
    const {execute}=useUndoRedoContext();
    const editTrain=(newTrains:Train[])=>{
        const indexs=newTrains.map((newTrain)=>{
            if(trains[0].findIndex(item=>item.trainID===newTrain.trainID)>=0){
                return{
                    index:[0,trains[0].findIndex(item=>item.trainID===newTrain.trainID)],
                    newTrain:newTrain,
                    prevTrain:trains.flat().find(item=>item.trainID===newTrain.trainID)
                }
            }else{
                return{
                    index:[1,trains[1].findIndex(item=>item.trainID===newTrain.trainID)],
                    newTrain:newTrain,
                    prevTrain:trains.flat().find(item=>item.trainID===newTrain.trainID)
                }
            }
        });
        const editTrains=indexs.filter(item=>item.prevTrain!==undefined) as {index: number[],newTrain: Train,prevTrain: Train}[];


        const action:UndoRedoItem={
            task:()=>{
                //既存の列車を置き換えます
                setTrain(prev=>{
                    const next=prev.map(p=>[...p]);

                    editTrains.forEach(item=>{
                        next[item.index[0]][item.index[1]]=item.newTrain;
                    })
                    return next;
                })
            },
            undo:()=>{
                setTrain(next=>{
                    const prev=[...next];
                    editTrains.forEach(item=>{
                        prev[item.index[0]][item.index[1]]=item.prevTrain;
                    })
                    return prev;
                })
            }
        }
        execute(action);
        const addTrains=indexs.filter(item=>item.prevTrain===undefined);
        //todo addTarinsの処理

    }
    const addTrain= (newTrains:Train[],direction:number,index:number|undefined)=>{

        const action:UndoRedoItem={
            task:()=>{
                setTrain(prev=>{
                    const next=prev.map(p=>[...p]);
                    if(index===undefined||index<0){
                        //末尾に追加する
                        next[direction].push(...newTrains);
                    }
                    return next;
                })
            },
            undo:()=>{
                setTrain(next=>{
                    const prev=next.map(p=>[...p]);
                    prev[direction].splice(prev[direction].length-newTrains.length,newTrains.length);
                    return prev;
                })
            }
        }


        execute(action);

    }
    const deleteTrain=(deleteTrains:Train[])=>{
        const indexs=deleteTrains.map((train)=>{
            console.log(train);
            return trains[train.direction].findIndex(item=>item.trainID===train.trainID);
        });
        const action:UndoRedoItem={
            task:()=>{
                setTrain(prev=>{
                    const next=prev.map(p=>[...p]);
                    deleteTrains.forEach(train=>{
                        const index=next[train.direction].findIndex(item=>item.trainID===train.trainID);
                        if(index>=0){
                            next[train.direction].splice(index,1);
                        }
                    })
                    return next;
                })
            },
            undo:()=>{
                setTrain(next=>{
                    const prev=next.map(p=>[...p]);
                    deleteTrains.forEach((train,_i)=>{
                        prev[train.direction].splice(indexs[_i],0,train);
                    })
                    return prev;
                })
            }
        }
        execute(action);
    }

    return{
        editTrain,
        addTrain,
        deleteTrain

    }
}

export const patternSettingsAtom:RecoilState<PatternSetting>=atom(
    {
        key:'patternSettings',
        default:{
            period:600,
            repetitionNum:12
        }
    }
)