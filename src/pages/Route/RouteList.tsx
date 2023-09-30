import React, {useEffect, useState} from "react";
import {
    IonFab, IonFabButton, IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonList,
    IonSearchbar,
    useIonModal
} from "@ionic/react";
import {Route} from "../../DiaData/Route";
import {Station} from "../../DiaData/Station";
import {DiaData} from "../../DiaData/DiaData";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {diaDataState, routeSelector, routesSelector} from "../../store";
import {AppTitleState} from "../../App";
import {EditStationPage} from "../StationEdit/EditStationPage";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {add} from "ionicons/icons";
import {StationListView} from "../StationEdit/StationList";



export const RouteListPage: React.FC = ():JSX.Element => {
    try {
        console.log("RouteListPage");
        const routeList=Object.values(useRecoilValue(routesSelector));
        const setTitle=useSetRecoilState(AppTitleState);

        const [editModalTitle, setEditModalTitle] = useState('新規路線作成');
        const [editModalRouteID, setEditModalRouteID] = useState(-1);

        // const [present, dismiss] = useIonModal(EditRoutePage, {
        //     title:editModalTitle,
        //     routeID:editModalRouteID,
        //     onDismiss: (data: string, role: string) => dismiss(data, role),
        // });

        useKeyAlt("Insert",()=>{
            openNewRoute();
        });


        setTimeout(()=>{setTitle((old)=>"RouteList");
        },0)

        const openNewRoute=()=>{
            setEditModalTitle(()=>"新規駅作成");
            setEditModalRouteID(()=>-1);
            // present();
        }

        const openEditRoute=(stationID:number)=>{
            setEditModalTitle(()=>"駅編集");
            setEditModalRouteID(()=>stationID);
            // present();
        }


        const addNewRoute=()=>{
            openNewRoute();

        }
        return (
            <div>
                <RouteListView  routeList={routeList} onRouteSelected={openEditRoute}/>

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




interface RouteListViewProps{
    routeList:Route[],
    onRouteSelected?:((routeID:number)=>void)
}
export const RouteListView: React.FC<RouteListViewProps> = ({routeList,onRouteSelected}):JSX.Element => {
    try {


        const [query, setQuery] = useState<string>('');
        const [showRouteList,setShowRouteList]=useState<Route[]>([]);
        const [sortedRouteList,setSortedRouteList]=useState<Route[]>([]);
        useEffect(() => {
            if(query.length==0){
                setSortedRouteList((prev)=>routeList);
            }else{
                const queryedRouteList=routeList.filter(route=>route.name.includes(query)||route.id.toString().includes(query));
                const tmp=queryedRouteList.sort((a,b)=>{
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
                setSortedRouteList(()=>tmp);
            }

        }, [query,routeList]);
        useEffect(() => {
            setShowRouteList(()=>sortedRouteList.slice(0,100));
        }, [sortedRouteList]);

        const generateItems = () => {
            console.log("generateItems");
            setShowRouteList((prev)=>{
                return sortedRouteList.slice(0,prev.length+100);
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
                        showRouteList.map(station=>{
                            return <RouteView  key={station.id} route={station} onClicked={(id)=>{
                                if(onRouteSelected!==undefined) {
                                    onRouteSelected(id);
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


interface RouteViewProps{
    route:Route;
    onClicked?: {(routeID:number):void; };
}
export const RouteView: React.FC<RouteViewProps>=({route,onClicked=undefined}):JSX.Element =>{
    return(
        <IonItem onClick={()=>{
            if(onClicked){
                onClicked(route.id);
            }
        }}
        >
            <div style={{display:"flex"}}>
                <div style={{width:"200px"}}>
                    {
                        route.name
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