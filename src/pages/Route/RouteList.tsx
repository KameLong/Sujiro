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
import {EditRoute, Route} from "../../DiaData/Route";
import {Station} from "../../DiaData/Station";
import {DiaData} from "../../DiaData/DiaData";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {diaDataState, routeSelector, routesSelector} from "../../store";
import {AppTitleState} from "../../App";
import {EditStationPage} from "../StationEdit/EditStationPage";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {add} from "ionicons/icons";
import {StationListView} from "../StationEdit/StationList";
import {EditRoutePage} from "./RouteEditPage";
import {SujiroSearchList} from "../../components/SujiroSearchList";
import {StationView} from "../StationEdit/StationView";
import {useHistory} from "react-router-dom";
import {Action, useUndo} from "../../hooks/UndoRedo";



export const RouteListPage: React.FC = ():JSX.Element => {
    try {
        const nav = useHistory().push;
        const [run]=useUndo();

        console.log("RouteListPage");
        const [routes,setRoutes]=useRecoilState(routesSelector);
        const routeList=Object.values(routes);
        const setTitle=useSetRecoilState(AppTitleState);

        const [editModalTitle, setEditModalTitle] = useState('新規路線作成');
        const [editModalRouteID, setEditModalRouteID] = useState(-1);

        // EditRoutePageのモーダルが開いているか？
        const [isModalOpen, setIsModalOpen] = useState(false);

        const [present, dismiss] = useIonModal(EditRoutePage, {
            isOpen: isModalOpen,
            title:editModalTitle,
            routeID:editModalRouteID,
            onDismiss: (data: string, role: string) => {
                setIsModalOpen(false);
                dismiss(data, role)
            },
        });


        useKeyAlt("Insert",(e)=>{
            e.preventDefault();
            console.log(e);
            openNewRoute();
        });
        setTimeout(()=>{setTitle((old)=>"RouteList");
        },0)

        const openNewRoute=()=>{
            let routeID=-1;
            //新規路線作成
            const addNewRoute:Action={
                action:()=>{
                    const route=EditRoute.newRoute();
                    routeID=route.id;
                    const newRoutes={...routes};
                    newRoutes[routeID]=route;
                    setRoutes(newRoutes);
                },
                undo:()=>{
                    const newRoutes={...routes};
                    delete newRoutes[routeID];
                    setRoutes(newRoutes);
                }
            }
            run(addNewRoute);
            //路線編集はモーダルではなくページで行います。
            nav(`/EditRoute?route=${routeID}`);

        }

        const openEditRoute=(route:Route)=>{
            //路線編集はモーダルではなくページで行います。
            nav(`/EditRoute?route=${route.id}`);
        }


        const addNewRoute=()=>{
            openNewRoute();
        }

        const sortRoute=(list:Route[],query:string)=>{
            const queryedRouteList=routeList.filter(route=>route.name.includes(query)||route.id.toString().includes(query));
            return queryedRouteList.sort((a,b)=>{
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
        }
        return (
            <div>
                <SujiroSearchList
                    renderRow={(route:Route,onClicked:(route:Route)=>void)=>
                        (<RouteView  key={route.id} route={route} onClicked={onClicked}/>)}
                    itemList={routeList}
                    sortList={sortRoute}
                    onClicked={openEditRoute}
                />

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




interface RouteViewProps{
    route:Route;
    onClicked?: {(route:Route):void; };
}
export const RouteView: React.FC<RouteViewProps>=({route,onClicked=undefined}):JSX.Element =>{
    return(
        // <IonItem
        // }}
        // >
            <div onClick={()=>{
                    if(onClicked){
                        onClicked(route);
                    }}}
                 style={{display:"flex"}}>

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
        // </IonItem>
    );
}