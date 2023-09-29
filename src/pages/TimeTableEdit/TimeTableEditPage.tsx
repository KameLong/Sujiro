// import React, {useEffect, useRef, useState} from "react";
//
// import {DiaData} from "../../DiaData/DiaData";
// import {useDispatch, useSelector} from "react-redux";
// import "./TimetableEditPage.css"
// import {
//     AlertButton,
//     IonButton,
//     IonCard,
//     IonCardContent,
//     IonCardHeader,
//     IonCardTitle, IonContent, IonHeader,
//     IonItem,
//     IonList, IonPage,
//     IonRadio,
//     IonRadioGroup, IonTitle, IonToolbar, useIonAlert,
//     useIonModal,
// } from '@ionic/react';
// import {TimeTableStation} from "../../DiaData/TimeTable";
// import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";
// import {StationSelectorModal} from "../StationEdit/StationView";
// import {Station} from "../../DiaData/Station";
// import {RouteListView, RouteSelector} from "../Route/RouteSelector";
// import {Route} from "../../DiaData/Route";
// export const TimeTableEditPage: React.FC = ():JSX.Element => {
//     const dispatch = useDispatch();
//     try {
//         const state= useSelector((state:{diaData:DiaData}) => state);
//         const diaData: DiaData = state.diaData;
//         const [selectedStation, setSelectedStation] = useState<undefined|TimeTableStation>(undefined);
//         const timetable=diaData.timeTable[0];
//         if(!timetable){
//             return (<div>no timetable</div>);
//         }
//         const stations=timetable.timeTableStations;
//         return (
//             <div style={{outline:'none'}}  >
//                 <StationListEditView stations={stations}/>
//                 <TimeTableRouteEditView stations={stations}/>
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
//
// interface StationListEditViewProp{
//     stations:TimeTableStation[]
// }
// const StationListEditView: React.FC<StationListEditViewProp> = (props):JSX.Element => {
//     try {
//         const dispatch = useDispatch();
//         const selectedStationRef = useRef(null);
//         const state = useSelector((state:{diaData:DiaData}) => state);
//         const diaData: DiaData = state.diaData;
//         function openModal() {
//             present({
//                 onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
//                     //todo
//                 },
//             });
//         }
//
//         const [selectedStation, setSelectedStation] = useState<undefined|TimeTableStation>(undefined);
//         const [present, dismiss] = useIonModal(StationSelectorModal, {
//             onDismiss: (data: string, role: string) => dismiss(data, role),
//             // recommendStation:diaData.stations[selectedStation.stationID].getNextStations()??diaData.stations[props.stations.slice(-1)[0].stationID].getNextStations(),
//             diaData:diaData,
//             onStationSelect:(station:Station)=>{
//                 console.log(station.name+"が選択されました。")
//                 //現在選択されている駅を削除します。
//                 const insertStationAction:InsertTimeTableStation={
//                     type:INSERT_TIMETABLE_STATION,
//                     timetableID:0,
//                     stationID:station.id,
//                     insertTimetableStationID:selectedStation?.id
//                 };
//                 dispatch(insertStationAction);
//             }
//         });
//
//         useEffect(() => {
//             if(selectedStationRef.current){
//                 //@ts-ignore
//                 selectedStationRef.current.focus();
//             }
//         },[props.stations.length]);
//         const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
//             const key = e.code;
//             console.log(key);
//             if(key==="Delete"){
//                 //現在選択されている駅を削除します。
//                 if(selectedStation?.stationID===undefined){
//                     //最後の空白駅は削除できません。
//                     return;
//                 }
//                 const deleteStation=selectedStation.id;
//                 // const deleteStationAction:DeleteTimeTableStation={
//                 //     type:DELETE_TIMETABLE_STATION,
//                 //     timetableID:0,
//                 //     timetableStationID:deleteStation
//                 // };
//                 const deleteStationAction:DeleteTimeTableStation=new DeleteTimeTableStation(0,deleteStation);
//                 // 駅を削除する前にselectedStationを一つ先に進めておきます。
//                 setSelectedStation(selected=>{
//                     const deleteIndex=Math.max(...props.stations.map((s,i)=>{
//                         if(s.id===deleteStation)return i;
//                         return -1;
//                     }));
//                     return props.stations[deleteIndex+1];
//                 });
//                 dispatch({...deleteStationAction});
//             }
//             if(key==="Insert"){
//                 //駅選択モーダルを立ち上げます
//                 openModal();
//             }
//         }
//         const getRef=(id:number)=>{
//             if(selectedStation?.id??-1===id){
//                 return selectedStationRef;
//             }
//             return undefined;
//         }
//         return (
//             <div style={{outline:'none'}}　onKeyDown={keyDownHandler}  >
//                 路線作
//                 <IonCard>
//                     <IonCardHeader>
//                         <IonCardTitle>駅リスト作成</IonCardTitle>
//                     </IonCardHeader>
//                     <IonCardContent>時刻表で表示する駅を追加してください</IonCardContent>
//                     <IonRadioGroup  value={(selectedStation?.id??-1).toString()} onIonChange={e=>{
//                         setSelectedStation(s=>{
//                             const res=props.stations.find(station=>station.id===Number(e.detail.value));
//                             if(res){
//                                 return res;
//                             }
//                             return undefined;
//                         })
//                     }}>
//                         <IonList>
//                             {
//                                 props.stations.map((station,i)=>
//                                     <IonItem key={station.id}>
//                                         <IonRadio
//                                             ref={getRef(station.id)}
//                                             autoFocus={true} key={station.id+1} style={{width:'50px'}} value={station.id.toString()} labelPlacement="end" justify="start">
//                                         </IonRadio>
//                                         <div>
//                                             {/*{station.id+"　　　　"+(station.stationID?.name??'')}*/}
//                                         </div>
//
//                                     </IonItem>
//                                 )
//                             }
//                             <IonItem key={-1}>
//                                 <IonRadio ref={getRef(-1)}　autoFocus={true} key={-1} style={{width:'50px'}} value={"-1"} labelPlacement="end" justify="start">
//                                 </IonRadio>
//                                 <div>
//                                 </div>
//                             </IonItem>
//
//                         </IonList>
//                         <IonButton>駅を挿入する</IonButton>
//                         <IonButton>駅を削除する</IonButton>
//
//                     </IonRadioGroup>
//
//                 </IonCard>
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
//
//
//
//
// interface TimeTableRouteEditViewProp{
//
//     stations:TimeTableStation[]
// }
// const TimeTableRouteEditView: React.FC<TimeTableRouteEditViewProp> = ():JSX.Element => {
//     /**
//      * このViewでは左側に駅のリストがあり、右側に書くRouteがその駅にどのように対応するかを示す図を表示します。
//      */
//     try {
//         const [currentRoute, setCurrentRoute] = useState<Route>()
//         const dispatch = useDispatch();
//         const selectedStationRef = useRef(null);
//         const state= useSelector((state:{diaData:DiaData}) => state);
//         const timeTable=state.diaData.timeTable[0];
//
//         const diaData: DiaData = state.diaData;
//         const [presentAlert] = useIonAlert();
//         const [routeDirectionOpen, routeDirectionDismiss] = useIonModal(DirectionSelectorModal, {
//             onDismiss: (direction: number,routeID:number) => {
//                 routeDirectionDismiss();
//                 console.log(direction,routeID);
//             },
//             route:currentRoute
//
//         });
//
//         const addRoute=()=>{
//             routeSelectorOpen({
//                 // onWillDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
//                 // },
//             });
//         }
//
//         const [routeSelectorOpen, routeSelectorDismiss] = useIonModal(RouteSelector, {
//             onDismiss: (routeID: number, role: string) => {
//                 const route=diaData.routes[routeID];
//                 setCurrentRoute(()=>route);
//                 console.log(route.name+"が選択されました。");
//                 routeDirectionOpen();
//                 routeSelectorDismiss(routeID, role);
//
//             }
//         });
//
//
//
//         return (
//                 <IonCard>
//                     <IonCardHeader>
//                         <IonCardTitle>Routeの割り当て</IonCardTitle>
//                     </IonCardHeader>
//                     <IonCardContent>
//                         <div style={{display: 'flex', overflowX: 'scroll'}}>
//                         <IonList style={{width:'200px'}}>
//                             {
//                                 // timeTable.timeTableStations.map(station=>
//                                 //     <IonItem>{station.station.name}</IonItem>
//                                 // )
//                             }
//                         </IonList>
//                             <IonButton style={{height:'50px',verticalAlign:"center"}} onClick={addRoute}>路線を追加する</IonButton>
//
//                         </div>
//
//                    </IonCardContent>
//
//
//                 </IonCard>
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
//
//
// interface DirectionSelectorModalProps{
//     onDismiss: (direction:number, routeID:number) => void;
//     route:Route;
// }
// export const DirectionSelectorModal:React.FC<DirectionSelectorModalProps>=({onDismiss,route}):JSX.Element=>{
//     console.log(route)
//     const modal = useRef<HTMLIonModalElement>(null);
//     const state = useSelector((state:{diaData:DiaData}) => state);
//     return(
//         <IonPage ref={modal} >
//             <IonHeader>
//                 <IonToolbar>
//                     <IonTitle>Route方向選択</IonTitle>
//                 </IonToolbar>
//             </IonHeader>
//             <IonContent className="ion-padding">
//                 <IonCard>
//                     <IonItem onClick={()=>onDismiss(0,route.id)}>
//                         下り
//                     </IonItem>
//                     <IonItem onClick={()=>onDismiss(1,route.id)}>
//                         上り
//                     </IonItem>
//                 </IonCard>
//             </IonContent>
//         </IonPage>
//     )
// }
//
//
//
//
