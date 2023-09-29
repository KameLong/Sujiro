/**
 * ここでは時刻表にRouteを紐づけるためのUIを書きます。
 *
 * 要件
 * ・Routeは数珠繋ぎで表現します。
 * ・Routeの駅をrStation、時刻表側の駅をtStationと表現します。
 * ・tStationは固定です。
 * ・rStationの状態は
 * 　　+ 明示的に特定のtStationに紐づいている
 * 　　+ 暗黙的に特定のtStationに紐づいている
 *    + どの駅にも紐づいていない
 *    の3状態となります。
 *
 */


import React, {useState} from "react";
import {useMoveOnDrag} from "../Test/Move";
import {TimeTableStation} from "../../DiaData/TimeTable";
//@ts-ignore
import Path from 'react-svg-path'
interface StationState{
    handleStationIndex:number;
    x:number;
    y:number;
    isHumanHandle:boolean
}

export const Chain: React.FC= ():JSX.Element => {
    const stationList:string[]=["東京","有楽町","新橋","浜松町","田町","品川"];
    const [stationState, setStationState]
        = useState<StationState[]>([
            {handleStationIndex:0,isHumanHandle:false,x:50,y:50},
            {handleStationIndex:1,isHumanHandle:false,x:50,y:100},
            {handleStationIndex:2,isHumanHandle:false,x:50,y:150},
            {handleStationIndex:3,isHumanHandle:false,x:50,y:200},
            {handleStationIndex:4,isHumanHandle:false,x:50,y:250},
            {handleStationIndex:5,isHumanHandle:false,x:50,y:300},
    ]);
    const test=(i:number,x:number,y:number)=>{
        console.log(i,x,y);
        setStationState(state=>{
            const res=[...state];
            res[i].y=y;
            res[i].x=x;
            return res;
        })
    }


    return(
        <svg style={{width:'200',height:'400',backgroundColor:'#FEE'}}>
            {
                stationList.slice(0,stationList.length-1).map((station,i)=> {
                    const path = new Path().M(stationState[i].x,stationState[i].y).L(stationState[i+1].x,stationState[i+1].y);
                        return (
                            <g>
                                <path
                                    id={"path_t_"+i.toString()}
                                    d={path.toString()}
                                    fill="none" />
                                <use xlinkHref={"#path_t_"+i.toString()} stroke="darkBlue" strokeWidth="8"/>
                                <use xlinkHref={"#path_t_"+i.toString()} stroke="white" strokeWidth="5" strokeDasharray="10"/>
                            </g>
                        )
                    }
                )
            }
            {
                stationList.map((station,i)=>
                    <MoveCircle onMouseUp={(x,y)=>test(i,x,y)}
                                stationName={station} state={stationState[i]}
                                key={Math.floor(Number.MAX_SAFE_INTEGER*Math.random())}
                    />
                )
            }
        </svg>
    )
}
export const Chain2: React.FC= ():JSX.Element => {
    const stationList:string[]=["東京","新橋","品川"];
    const [stationState, setStationState]
        = useState<StationState[]>([
        {handleStationIndex:0,isHumanHandle:false,x:50,y:50},
        {handleStationIndex:1,isHumanHandle:false,x:50,y:100},
        {handleStationIndex:2,isHumanHandle:false,x:50,y:150}
    ]);
    const test=(i:number,x:number,y:number)=>{
        console.log(i,x,y);
        setStationState(state=>{
            const res=[...state];
            res[i].y=y;
            res[i].x=x;
            return res;
        })
    }


    return(
        <svg style={{width:'200',height:'400',backgroundColor:'#FEE'}}>
            {
                stationList.slice(0,stationList.length-1).map((station,i)=> {
                        const path = new Path().M(stationState[i].x,stationState[i].y).L(stationState[i+1].x,stationState[i+1].y);
                        return (
                            <g>
                                <path
                                    id={"path_t_"+i.toString()}
                                    d={path.toString()}
                                    fill="none" />
                                <use xlinkHref={"#path_t_"+i.toString()} stroke="darkBlue" strokeWidth="8"/>
                                <use xlinkHref={"#path_t_"+i.toString()} stroke="white" strokeWidth="5" strokeDasharray="10"/>
                            </g>
                        )
                    }
                )
            }
            {
                stationList.map((station,i)=>
                    <MoveCircle onMouseUp={(x,y)=>test(i,x,y)}
                                stationName={station} state={stationState[i]}
                                key={Math.floor(Number.MAX_SAFE_INTEGER*Math.random())}
                    />
                )
            }
        </svg>
    )
}

interface MoveCircleProps{
    state:StationState;
    stationName:string;
    onMouseUp?:{(x:number,y:number):void}

}

const MoveCircle: React.FC<MoveCircleProps> = (props) => {
    const [position, setPosition] = React.useState({ x: props.state.x, y: props.state.y });
    const drag = useMoveOnDrag<HTMLDivElement>(position, setPosition);


    const onUp=()=>{
        if(props.onMouseUp){
            props.onMouseUp(position.x,position.y);

        }
        console.log("onUp()");
    }
    return (
        <g
           transform={`translate(${position.x-40},${position.y-20})`}
            //@ts-ignore
           onPointerDown={drag.onPointerDown}
            //@ts-ignore
           onPointerMove={(e)=>{drag.onPointerMove(e)}}
           onPointerUp={(e)=>{
               //@ts-ignore
               drag.onPointerUp(e);
               onUp();

           }}
            //@ts-ignore
           onTouchStart={drag.onPointerDown}
            //@ts-ignore
           onTouchMove={drag.onPointerMove}
            //@ts-ignore
           onTouchEnd={drag.onPointerUp}

        >
        <ellipse cx={40} cy={20} rx="40" ry="20"
                 style={{fill:'#008'}}
        />
            <text  style={{userSelect: "none"}} x="40" y="30" fontSize="20"  fill="white" textAnchor="middle"  >{props.stationName}</text>        </g>
    );
};

const KlLine: React.FC = () => {
    const [position, setPosition] = React.useState({ x: 10, y: 10 });
    const drag = useMoveOnDrag<HTMLDivElement>(position, setPosition);
    return (
        <div>
            <div
                className="moveme"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    display:'flex',
                    backgroundColor:'darkblue',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width:'50px',
                    height:'30px',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius:'15px'

                }}
                onPointerDown={drag.onPointerDown}
                onPointerMove={drag.onPointerMove}
                onPointerUp={drag.onPointerUp}
            >button
            </div>
        </div>
    );
};
