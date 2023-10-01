import React, {useEffect, useState} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {routesSelector, timetableSelector, timetablesSelector} from "../../store";
import {AppTitleState} from "../../App";
import {
    IonFab,
    IonFabButton,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent, IonItem,
    IonList,
    IonSearchbar,
    useIonModal
} from "@ionic/react";
import {EditRoutePage} from "../Route/RouteEditPage";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {add} from "ionicons/icons";
import {RouteListView, RouteView} from "../Route/RouteList";
import {Route} from "../../DiaData/Route";
import {TimeTable} from "../../DiaData/TimeTable";
import {useHistory} from "react-router-dom";

export const TimetableListPage: React.FC = ():JSX.Element => {
    try {
        const timetableList=Object.values(useRecoilValue(timetablesSelector));
        const setTitle=useSetRecoilState(AppTitleState);
        const nav = useHistory().push;



        useKeyAlt("Insert",()=>{
            openNewTimetable();
        });


        setTimeout(()=>{setTitle((old)=>"TimeTableList");
        },0)

        const openNewTimetable=()=>{

        }

        const openEditTimetable=(timetableID:number)=>{
            nav(`/TimetableEdit?timetable=${timetableID}`);

        }


        const addNewRoute=()=>{
            openNewTimetable();

        }
        return (
            <div>
                <TimetableListView  timetableList={timetableList} onTimetableSelected={openEditTimetable}/>

                <IonFab style={{margin:"10px"}} slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton onClick={addNewRoute}>
                        <IonIcon icon={add} ></IonIcon>
                    </IonFabButton>
                </IonFab>
            </div>
    );
    }catch(e:any){
        console.log(e);
        return (
            <div>
                <div>エラーが発生しました</div>
            <div>{e.toString()}</div>
            </div>
        );
    }
}


interface TimetableListViewProps{
    timetableList:TimeTable[],
    onTimetableSelected?:((routeID:number)=>void)
}

export const TimetableListView: React.FC<TimetableListViewProps> = ({timetableList,onTimetableSelected}):JSX.Element => {
    try {


        const [query, setQuery] = useState<string>('');
        const [showTimetableList,setShowTimetableList]=useState<TimeTable[]>([]);
        const [sortedTimetableList,setSortedTimetableList]=useState<TimeTable[]>([]);
        useEffect(() => {
            if(query.length==0){
                setSortedTimetableList((prev)=>timetableList);
            }else{
                const queryedTimetableList=timetableList.filter(timetable=>timetable.name.includes(query)||timetable.id.toString().includes(query));
                const tmp=queryedTimetableList.sort((a,b)=>{
                    let score=0;

                    if(a.name===query){
                        score-=100;
                    }
                    if(b.name===query){
                        score+=100;
                    }
                    if(a.name.includes(query)){
                        score-=10;
                    }
                    if(b.name.includes(query)){
                        score+=10;
                    }
                    if(a.id.toString()===query){
                        score-=20;
                    }
                    if(b.id.toString()===query){
                        score+=20;
                    }
                    return score;
                })
                setSortedTimetableList(()=>tmp);
            }

        }, [query,timetableList]);
        useEffect(() => {
            setShowTimetableList(()=>sortedTimetableList.slice(0,100));
        }, [sortedTimetableList]);

        const generateItems = () => {
            console.log("generateItems");
            setShowTimetableList((prev)=>{
                return sortedTimetableList.slice(0,prev.length+100);
            })
        };


        return (
            <div>
                <IonSearchbar value={query} onIonChange={e =>{
                    console.log(e.detail.value);
                    setQuery((prev)=>e.detail.value??"");
                }}
                >
                </IonSearchbar>
                <IonList>

                    {
                        showTimetableList.map(route=>{
                            return <TimetableView key={route.id} timetable={route} onClicked={(id)=>{
                                if(onTimetableSelected!==undefined) {
                                    onTimetableSelected(id);
                                }
                            }}/>
                        })
                    }
                </IonList>
                <IonInfiniteScroll
                    onIonInfinite={(ev) => {
                        generateItems();
                        setTimeout(() => ev.target.complete(), 500);
                    }}
                >
                    <IonInfiniteScrollContent></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            </div>
        );
    }catch(e:any){
        console.log(e);
        return (
            <div>
                <div>エラーが発生しました</div>
                <div>{e.toString()}</div>
            </div>
        );
    }
}









interface TimetableViewProps{
    timetable:TimeTable;
    onClicked?: {(timetableID:number):void; };
}
export const TimetableView: React.FC<TimetableViewProps>=({timetable,onClicked=undefined}):JSX.Element =>{
    return(
        <IonItem onClick={()=>{
            if(onClicked){
                console.log(timetable.id);
                onClicked(timetable.id);
            }
        }}
        >
            <div style={{display:"flex"}}>
                <div style={{width:"200px"}}>
                    {
                        timetable.name
                    }
                </div>
                <div style={{marginLeft:"20px",width:"100px"}}>
                    {
                    }
                </div>
            </div>
        </IonItem>
    );
}