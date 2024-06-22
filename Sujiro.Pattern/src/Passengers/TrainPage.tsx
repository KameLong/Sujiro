import {useRecoilValue} from "recoil";
import {stationsAtom, trainsAtom} from "../State";
import {Button} from "@mui/material";
import {time2Str} from "../TimeTable/TimeTableData";
import {PassengerBetweenStationAtom} from "../SujiroData/Passenger";

interface PassengerPath{
    depTime:number;
    ariTime:number;
    trainID:number;
}
interface TrainPath{
    startStationIndex:number;
    endStationIndex:number;
    trainID:number;
}
interface DPObject{
    time:number;
    //train経路のリスト
    trains:TrainPath[];
    //合計乗車時間
    rideTime:number;
}

function useCalcPath():()=>DPObject[][][]{
    const trains=useRecoilValue(trainsAtom);
    const stations=useRecoilValue(stationsAtom);

    const time2Min=(time:number,startTime:number)=>{
        return Math.floor((time-startTime)/60);
    }

    return ()=>{
        const startTime=12*3600;
        const endTime=13*3600;
        const d= performance.now(); // 開始時間
        const dp:DPObject[][][]=JSON.parse(JSON.stringify((new Array(stations.length).fill(0).map(
            ()=>new Array(stations.length).fill(0).map(()=>new Array(120).fill(
                {
                    time:Number.MAX_SAFE_INTEGER,
                    trains:[],
                    rideTime:0
                }
            ))))));

        for(let i=stations.length-2;i>=0;i--){
            //station i を出発する列車の一覧
            const depTrain=trains.filter(train=>train.times[i].stopType===1&&train.times[i].depTime>=0)
                                        .sort((a,b)=>a.times[i].depTime-b.times[i].depTime);
            depTrain.forEach(train=>{
                const depTime=time2Min(train.times[i].depTime,startTime);
                if(depTime<0){
                    return;
                }
                for(let j=i+1;j<stations.length;j++){
                    if(train.times[j].stopType===1&&train.times[j].ariTime>=0){
                        const ariTime=time2Min(train.times[j].ariTime,startTime);
                        if(ariTime<0){
                            continue;
                        }
                        for(let k=Math.min(depTime,119);k>=0;k--){
                            if(dp[i][j][k].time>ariTime){
                                dp[i][j][k].time=ariTime;
                                dp[i][j][k].trains=[{
                                    startStationIndex:i,
                                    endStationIndex:j,
                                    trainID:train.trainID
                                }];
                                dp[i][j][k].rideTime=ariTime-depTime;
                            }else{
                                break;
                            }

                        }
                    }
                    else{
                        continue;

                    }
                }
            })
            for(let j=i+1;j<stations.length;j++){
                for(let k=j+1;k<stations.length;k++){
                    for(let l=0;l<120;l++){
                        const t1=dp[i][j][l].time;
                        if(t1>=0&&t1<120){

                        }else{
                            continue;
                        }
                        const time1=dp[i][k][l];
                        const time2=dp[j][k][t1];
                        const time3=dp[i][j][l];
                        if(time1.time>time2.time){
                            dp[i][k][l].time=time2.time;
                            dp[i][k][l].trains=[...time3.trains,...time2.trains];
                            dp[i][k][l].rideTime=time3.rideTime+time2.rideTime;
                        }else if(time1.time===time2.time){
                            if(time1.trains.length>time2.trains.length+time3.trains.length){
                                dp[i][k][l].time=time2.time;
                                dp[i][k][l].trains=[...time3.trains,...time2.trains];
                                dp[i][k][l].rideTime=time3.rideTime+time2.rideTime;
                            }else if(time1.trains.length===time2.trains.length+time3.trains.length){
                                if(time1.rideTime<time2.rideTime+time3.rideTime){
                                    dp[i][k][l].time=time2.time;
                                    dp[i][k][l].trains=[...time3.trains,...time2.trains];
                                    dp[i][k][l].rideTime=time3.rideTime+time2.rideTime;
                                }
                            }

                        }

                    }
                }
            }
        }
        return dp;

    };


}
function getAveTime(path:DPObject[][][],i:number,j:number){
    let count=0;
    let sum=0;
    for(let k=0;k<60;k++){
        if(path[i][j][k].time<Number.MAX_SAFE_INTEGER){
            count++;
            sum+=path[i][j][k].time-k;
        }
    }
    return sum/count;
}
export function useTotalPoint(){
    const path=useCalcPath();
    const passengers=useRecoilValue(PassengerBetweenStationAtom);
    return ()=>getTotalPoint(path(),passengers[0]);

}

function getTotalPoint(path:DPObject[][][],passenger:PassengerBetweenStationAtom):number{
    let sum=0;
    for(let i=0;i<path.length;i++){
        for(let j=i+1;j<path.length;j++){
            const t=getAveTime(path,i,j);
            sum+=t*passenger.passenger[i][j];
        }
    }
    return sum;
}

export function TrainPage() {
    const stations = useRecoilValue(stationsAtom);
    const trains= useRecoilValue(trainsAtom);
    const calcPath=useCalcPath();
    const path=calcPath();

    const passengers=useRecoilValue(PassengerBetweenStationAtom);






    return (
        <div>
            <h1>駅間別所要時間</h1>
            <h3>{getTotalPoint(path,passengers[0])}</h3>
            <Button onClick={calcPath}>test</Button>
            {stations.map((station,_i) => {
                return stations.slice(_i+1).map((station2,_j) =>
                    <div>
                        {station.name}→{station2.name} 待ち時間を含む平均所要時間({getAveTime(path,_i,_i+1+_j).toFixed(2)})分
                        <div>
                            {/*{*/}
                            {/*    (new Array(60).fill(0)).map((_p, _k) =>*/}

                            {/*        (_k === 0 || JSON.stringify(path[_i][_j + _i + 1][_k]) !== JSON.stringify(path[_i][_j + _i + 1][_k - 1])) ?*/}
                            {/*            <div>*/}
                            {/*                /!*{_k}分発 着時刻 {path[_i][_j+_i+1][_k].time}分 列車は*!/*/}
                            {/*                {path[_i][_j + _i + 1][_k].trains.map((train, _t) =>*/}
                            {/*                    <span>*/}
                            {/*                    {_t == 0 ? <span>*/}
                            {/*                        {stations[train.startStationIndex].name}*/}
                            {/*                    </span> : <span></span>*/}
                            {/*                    }({*/}
                            {/*                        time2Str(trains.filter(t => t.trainID === train.trainID)[0].times[train.startStationIndex].depTime)*/}
                            {/*                    })-&gt;({*/}
                            {/*                        time2Str(trains.filter(t => t.trainID === train.trainID)[0].times[train.endStationIndex].ariTime)*/}
                            {/*                    }) {stations[train.endStationIndex].name} </span>*/}
                            {/*                )}*/}
                            {/*            </div>*/}
                            {/*            : null*/}
                            {/*    )*/}
                            {/*}*/}
                            <div style={{height:'10px'}}> </div>

                        </div>
                    </div>
                )
            })
            }

        </div>
    );
}