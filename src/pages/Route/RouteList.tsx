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
import {EditRoutePage} from "./RouteEditPage";
import {SujiroSearchList} from "../../components/SujiroSearchList";
import {StationView} from "../StationEdit/StationView";
import {useHistory} from "react-router-dom";



export const RouteListPage: React.FC = ():JSX.Element => {
    try {
        const nav = useHistory().push;

        console.log("RouteListPage");
        const routeList=Object.values(useRecoilValue(routesSelector));
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
            //新規路線作成

            //路線編集はモーダルではなくページで行います。
            nav(`/EditRoute?route=0`);

        }

        const openEditRoute=(route:Route)=>{
            //路線編集はモーダルではなくページで行います。
            nav(`/EditRoute?route=${route.id}`);


            // if(isModalOpen){
            //     return;
            // }
            // setEditModalTitle(()=>"路線編集");
            // setEditModalRouteID(()=>route.id);
            // setIsModalOpen(true);
            // present();
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




// interface RouteListViewProps{
//     routeList:Route[],
//     onRouteSelected?:((routeID:number)=>void)
// }
// export const RouteListView: React.FC<RouteListViewProps> = ({routeList,onRouteSelected}):JSX.Element => {
//     try {
//
//
//         const [query, setQuery] = useState<string>('');
//         const [showRouteList,setShowRouteList]=useState<Route[]>([]);
//         const [sortedRouteList,setSortedRouteList]=useState<Route[]>([]);
//         useEffect(() => {
//             if(query.length==0){
//                 setSortedRouteList((prev)=>routeList);
//             }else{
//                 const queryedRouteList=routeList.filter(route=>route.name.includes(query)||route.id.toString().includes(query));
//                 const tmp=queryedRouteList.sort((a,b)=>{
//                     let score=0;
//
//                     if(a.name===query){
//                         score-=100;
//                     }
//                     if(b.name===query){
//                         score+=100;
//                     }
//                     if(a.name.includes(query)){
//                         score-=10;
//                     }
//                     if(b.name.includes(query)){
//                         score+=10;
//                     }
//                     if(a.id.toString()===query){
//                         score-=20;
//                     }
//                     if(b.id.toString()===query){
//                         score+=20;
//                     }
//                     return score;
//                 })
//                 setSortedRouteList(()=>tmp);
//             }
//
//         }, [query,routeList]);
//         useEffect(() => {
//             setShowRouteList(()=>sortedRouteList.slice(0,100));
//         }, [sortedRouteList]);
//
//         const generateItems = () => {
//             console.log("generateItems");
//             setShowRouteList((prev)=>{
//                 return sortedRouteList.slice(0,prev.length+100);
//             })
//         };
//
//
//         return (
//             <div>
//                 <IonSearchbar value={query} onIonChange={e =>{
//                     console.log(e.detail.value);
//                     setQuery((prev)=>e.detail.value??"");
//                 }}
//                 >
//                 </IonSearchbar>
//                 <IonList>
//                     {
//                         showRouteList.map(route=>{
//                             return <RouteView  key={route.id} route={route} onClicked={(id)=>{
//                                 if(onRouteSelected!==undefined) {
//                                     // onRouteSelected(id);
//                                 }
//                             }}/>
//                         })
//                     }
//                 </IonList>
//                 <IonInfiniteScroll
//                     onIonInfinite={(ev) => {
//                         generateItems();
//                         setTimeout(() => ev.target.complete(), 500);
//                     }}
//                 >
//                     <IonInfiniteScrollContent></IonInfiniteScrollContent>
//                 </IonInfiniteScroll>
//             </div>
//         );
//     }catch(e:any){
//         console.log(e);
//         return (
//             <div>
//                 <div>エラーが発生しました</div>
//                 <div>{e.toString()}</div>
//             </div>
//         );
//     }
// }


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