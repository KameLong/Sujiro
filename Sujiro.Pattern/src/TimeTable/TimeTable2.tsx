export function A(){
    return(<div/>);
}
// import React, {memo, useCallback, useEffect, useState} from 'react';
// import style from './TimeTablePage.module.css';
// import StationView from "./StationView";
// import TrainView from "./TrainView";
// import {
//     Button,
//     Dialog, List,
//     ListItem,
// } from '@mui/material';
//
// import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
// import useTimetableSelected from "./TimetableSelectedHook";
// import TrainEdit from "./TrainEdit";
// import {useUndoRedoContext} from "../Hooks/UndoRedoHook";
// import {useRecoilState, useRecoilValue} from "recoil";
// import {stationsAtom, trainsAtom, trainTypesAtom, useEditStopTime} from "../State";
// import {Train} from "../SujiroData/DiaData";
//
// const MemoTrainView = memo(TrainView);
//
// function TimeTablePage() {
//     const {direct} = useRequiredParamsHook<{ direct: string }>();
//
//     const stations = useRecoilValue(stationsAtom);
//     const trips = useRecoilValue(trainsAtom);
//     const trainTypes = useRecoilValue(trainTypesAtom);
//
//
//
//     const timetableSelected=useTimetableSelected();
//     const editStopTime=useEditStopTime();
//
//
//     const undoRedo=useUndoRedoContext();
//
//     const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
//         if (open) {
//             return;
//         }
//         timetableSelected.moveToNextTrip(trips);
//         if (e) {
//             e.preventDefault();
//         }
//     };
//     const onLeftKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//         if (open) {
//             return;
//         }
//         timetableSelected.moveToPrevTrip(trips);
//         e.preventDefault();
//     };
//     const onUpKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//         if (open) {
//             return;
//         }
//         timetableSelected.moveToPrevStation(stations);
//         e.preventDefault();
//     };
//     const onDownKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
//         if (open) {
//             return;
//         }
//         timetableSelected.moveToNextStation(stations);
//         e?.preventDefault();
//     };
//
//
//     useEffect(() => {
//
//     }, [direct]);
//
//     const [open, setOpen] = React.useState(false);
//     const handleClickOpen = () => {
//         setOpen(true);
//     };
//
//     const handleClose = (value: string) => {
//         setOpen(false);
//         onDownKeyDown(undefined);
//     };
//     const onEnterKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//         if (open) {
//         } else {
//             console.log("enter");
//             handleClickOpen();
//             e.preventDefault();
//         }
//     }
//
//     function keyEvent(e: React.KeyboardEvent<HTMLDivElement>){
//         switch (e.key) {
//             case "Enter":
//                 onEnterKeyDown(e);
//                 break;
//             case "ArrowDown":
//                 onDownKeyDown(e);
//                 break;
//             case "ArrowUp":
//                 onUpKeyDown(e);
//                 break;
//             case "ArrowRight":
//                 onRightKeyDown(e);
//                 break;
//             case "ArrowLeft":
//                 onLeftKeyDown(e);
//                 break;
//             case "L":
//                 console.log(e);
//                 if (e.ctrlKey) {
//                     //以後の駅をすべて１分遅らせる
//                     const addSec = 60;
//                     const trip = trips.find(item => item.trainID === timetableSelected.selected?.tripID);
//                     if (!trip) return;
//                     const times=structuredClone(trip.times);
//
//                     let flag = false;
//                     for (let i = 0; i < trip.times.length; i++) {
//                         if (times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 0) {
//                             flag = true;
//                         }
//                         if (flag && trip.times[i].ariTime >= 0) {
//                             times[i].ariTime += addSec;
//                         }
//                         if (times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 2) {
//                             flag = true;
//                         }
//                         if (flag && trip.times[i].depTime >= 0) {
//                             times[i].depTime += addSec;
//                         }
//                     }
//                     editStopTime(trip.trainID,times);
//                     e.preventDefault();
//                 }
//                 break;
//             case "J":
//                 if (e.ctrlKey) {
//                     //以後の駅をすべて１分遅らせる
//                     const addSec = -60;
//                     const trip = trips.find(item => item.trainID === timetableSelected.selected?.tripID);
//                     if (!trip) return;
//                     const times=structuredClone(trip.times);
//
//                     let flag = false;
//                     for (let i = 0; i < trip.times.length; i++) {
//                         if (times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 0) {
//                             flag = true;
//                         }
//                         if (flag && trip.times[i].ariTime >= 0) {
//                             times[i].ariTime += addSec;
//                         }
//                         if (times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 2) {
//                             flag = true;
//                         }
//                         if (flag && trip.times[i].depTime >= 0) {
//                             times[i].depTime += addSec;
//                         }
//                     }
//                     editStopTime(trip.trainID,times);
//                     e.preventDefault();
//                 }
//                 break;
//             case "c":
//                 if (e.ctrlKey) {
//                     console.log(e);
//                     const trip = trips.find(item => item.trainID === timetableSelected.selected?.tripID);
//                     if (!trip) return;
//                     copyTrip(trip);
//                     e.preventDefault();
//                 }
//                 break;
//             case "v":
//                 if (e.ctrlKey) {
//                     console.log(e);
//                     pasteTrip(trips,timetableSelected.selected?.tripID);
//                     e.preventDefault();
//                 }
//                 break;
//             case "z":
//                 if (e.ctrlKey) {
//                     console.log(e);
//                     undoRedo.undo();
//                     e.preventDefault();
//                 }
//                 break;
//
//             case "Delete":
//                 if (timetableSelected.selected?.tripID === undefined) {
//                     return;
//                 }
//                 e.preventDefault();
//                 break;
//
//             default:
//                 break;
//         }
//     }
//
//     const onDoubleClick=useCallback(()=>{
//         setOpenEditTrain(true);
//     },[]);
//
//     const [openEditTrain, setOpenEditTrain] = React.useState(false);
//     const handleClose2 = () => {
//     };
//
//     const copyTrip=(trip:Train)=>{
//         localStorage.setItem('copyTrip', JSON.stringify([trip]));
//     }
//     const pasteTrip=async (tripList:Train[],selectedTripID:number|undefined)=>{
//
//         console.log(selectedTripID);
//             let text = localStorage.getItem('copyTrip');
//             if(text === null) {
//                 console.log("text == null");
//                 return;
//             }
//             const trips: Train[] = JSON.parse(text);
//         undoRedo.execute({
//             task:()=>{
//                 const promise=trips.map(trip => {
//                     if (trip.trainID === undefined) {
//                         console.log("tripID is undefined");
//                         return;
//                     }
//                     trip.trainID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//                     trip.trainID=Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//                     trip.times.forEach(item => {
//                         item.stopTimeID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//                         item.trainID = trip.trainID;
//                     });
//                     const selectedTrip = tripList.find(item => item.trainID === selectedTripID);
//                     if (!selectedTrip) return;
//                     console.log({trip: trip, insertTripID: selectedTripID});
//                 });
//                 Promise.all(promise).catch(err => {});
//
//             },
//             undo:()=>{
//                 console.log("test");
//                 trips.map(trip=>{
//                 })
//             }
//         })
//     }
//     return (
//         <div className={style.timetableRoot}>
//             <div className={style.timetableMain2}>
//             <div className={style.timetableMain}>
//                 <StationView stations={stations} direct={Number(direct)}/>
//                 <div className={style.trainListLayout} tabIndex={-1}
//                      onKeyDown={async e => {
//                          keyEvent(e);
//                      }}
//                      onPaste={e => {
//                          console.log(e);
//                      }}
//                 >
//                     <div className={style.trainListView}>
//                         {trips.map((trip) => {
//                             return (
//                                 <MemoTrainView key={trip.trainID} trip={trip} stations={stations} direct={Number(direct)}
//                                                selected={timetableSelected.selected?.tripID === trip.trainID ? timetableSelected.selected : null}
//                                                setSelected={timetableSelected.setSelected}
//                                                trainType={trainTypes[trip.typeID]}
//                                                 onDoubleClick={onDoubleClick}/>
//                             )
//                         })}
//                     </div>
//                 </div>
//                 <Dialog  open={open}   sx={{
//                     '.MuiPaper-root': {
//                         padding: 5,
//                     },
//                 }}>
//                     {/*<TimeEditView close={()=>handleClose("")} focusIndex={timetableSelected.selected?.viewID} stopTime={timetableSelected.selected ? trips.find(item => item.tripID === timetableSelected.selected?.tripID)?.stopTimes.find(item => item.routeStationID === timetableSelected.selected?.stationID)! : null}/>*/}
//                 </Dialog>
//             </div>
//             </div>
//
//             <div className={style.trainEditRoot}>
//
//             {timetableSelected.selected?.tripID!=null?
//
//                 (<TrainEdit trip={trips.filter(item=>item.trainID===timetableSelected?.selected?.tripID)[0]} stations={stations}/>)
//             :null}
//             </div>
//             <Dialog  onClose={handleClose2} open={openEditTrain}>
//                 <List>
//                     <ListItem>
//                         <Button
//                             onClick={e=>{
//                                 const trip = trips.find(item => item.trainID === timetableSelected.selected?.tripID);
//                                 if (!trip) {
//                                     setOpenEditTrain(false);
//                                     return;
//                                 }
//                                 copyTrip(trip);
//
//
//                                 setOpenEditTrain(false);
//                         }}
//                         >コピー</Button>
//                     </ListItem>
//                     <ListItem>
//                         <Button
//                             onClick={e=>{
//                                 console.log("編集");
//                                 pasteTrip(trips,timetableSelected.selected?.tripID);
//                                 setOpenEditTrain(false);
//                             }}
//                         >貼り付け</Button>
//                     </ListItem>
//                     <ListItem>
//                         <Button
//                             onClick={e=>{
//                                 setOpenEditTrain(false);
//                             }}
//                         >キャンセル</Button>
//                     </ListItem>
//                     <ListItem>
//                         <Button
//                             onClick={e=>{
//                                 window.location.href="/TimeTablePDF/"+0;
//                             }}
//                         >PDFにする</Button>
//                     </ListItem>
//                 </List>
//             </Dialog>
//         </div>
//
//     );
// }
//
//
//
//
//
//
//
// export default TimeTablePage;
//
//
