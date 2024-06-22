import React, {memo, useCallback, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import StationView from "./StationView";
import TrainView from "./TrainView";
import {
    Button,
    Dialog, List,
    ListItem,
} from '@mui/material';

import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
import useTimetableSelected from "./TimetableSelectedHook";
import TrainEdit from "./TrainEdit";
import {useUndoRedoContext} from "../Hooks/UndoRedoHook";
import {useRecoilState, useRecoilValue} from "recoil";
import {stationsAtom, trainsAtom, trainTypesAtom} from "../State";
import {Train} from "../SujiroData/DiaData";
import {AddNewTrainView} from "./AddNewTrainView";
import {patternTrainsAtom, useEditPatternTrain, usePatternTrainAtomChangedEffect} from "../SujiroData/PatternTrain";
import {PatternSettingView} from "./PatternSetting";
import {useTotalPoint} from "../Passengers/TrainPage";

const MemoTrainView = memo(TrainView);

function TimeTablePage() {

    usePatternTrainAtomChangedEffect();
    const totalPoint=useTotalPoint();
    const {direct} = useRequiredParamsHook<{ direct: number }>();
    const stations = useRecoilValue(stationsAtom);
    const patTrains = useRecoilValue(patternTrainsAtom)[0];
    const trains = useRecoilValue(trainsAtom);
    const trainTypes = useRecoilValue(trainTypesAtom);

    const timetableSelected = useTimetableSelected();

    const editPatterTrain = useEditPatternTrain();
    const undoRedo = useUndoRedoContext();
    const [open, setOpen] = React.useState(false);




    const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (open) {
            return;
        }
        timetableSelected.moveToNextTrip(patTrains);
        e?.preventDefault();
    };
    const onLeftKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (open) {
            return;
        }
        timetableSelected.moveToPrevTrip(patTrains);
        e.preventDefault();
    };
    const onUpKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (open) {
            return;
        }
        timetableSelected.moveToPrevStation(stations);
        e.preventDefault();
    };
    const onDownKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (open) {
            return;
        }
        timetableSelected.moveToNextStation(stations);
        e?.preventDefault();
    };
    const copyTrain=()=>{
        //checkedの列車をコピーする
        const trips=patTrains.filter(item=>timetableSelected.trainChecked.includes(item.trainID));
        localStorage.setItem('copyTrip', JSON.stringify(trips));
    }
    const deleteTrain=()=>{
//checkedの列車を削除する
        const trips=patTrains.filter(item=>timetableSelected.trainChecked.includes(item.trainID));
        console.log(trips);
        editPatterTrain.deleteTrain(trips);

    }



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        onDownKeyDown(undefined);
    };
    const onEnterKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (open) {
        } else {
            console.log("enter");
            handleClickOpen();
            e.preventDefault();
        }
    }

    function keyEvent(e: React.KeyboardEvent<HTMLDivElement>) {
        console.log(e.key);
        switch (e.key) {
            case "Enter":
                onEnterKeyDown(e);
                break;
            case "ArrowDown":
                onDownKeyDown(e);
                break;
            case "ArrowUp":
                onUpKeyDown(e);
                break;
            case "ArrowRight":
                onRightKeyDown(e);
                break;
            case "ArrowLeft":
                onLeftKeyDown(e);
                break;
            case "L":
                console.log(e);
                if (e.ctrlKey) {
                    //以後の駅をすべて１分遅らせる
                    const addSec = 60;
                    const trip = patTrains.find(item => item.trainID === timetableSelected.selected?.tripID);
                    if (!trip) return;
                    const newTrain: Train = structuredClone(trip);

                    let flag = false;
                    for (let i = 0; i < trip.times.length; i++) {
                        if (newTrain.times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 0) {
                            flag = true;
                        }
                        if (flag && trip.times[i].ariTime >= 0) {
                            newTrain.times[i].ariTime += addSec;
                        }
                        if (newTrain.times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 2) {
                            flag = true;
                        }
                        if (flag && trip.times[i].depTime >= 0) {
                            newTrain.times[i].depTime += addSec;
                        }
                    }
                    editPatterTrain.editTrain([newTrain]);
                    e.preventDefault();
                }
                break;
            case "J":
                if (e.ctrlKey) {
                    //以後の駅をすべて１分遅らせる
                    const addSec = -60;
                    const trip = patTrains.find(item => item.trainID === timetableSelected.selected?.tripID);
                    if (!trip) return;
                    const newTrain = structuredClone(trip);

                    let flag = false;
                    for (let i = 0; i < trip.times.length; i++) {
                        if (newTrain.times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 0) {
                            flag = true;
                        }
                        if (flag && trip.times[i].ariTime >= 0) {
                            newTrain.times[i].ariTime += addSec;
                        }
                        if (newTrain.times[i].stationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 2) {
                            flag = true;
                        }
                        if (flag && trip.times[i].depTime >= 0) {
                            newTrain.times[i].depTime += addSec;
                        }
                    }
                    editPatterTrain.editTrain([newTrain]);
                    e.preventDefault();
                }
                break;
            case "c":
                if (e.ctrlKey) {
                    copyTrain();
                    e.preventDefault();
                }
                break;
            case "v":
                if (e.ctrlKey) {
                    console.log(e);
                    pasteTrip(patTrains, timetableSelected.selected?.tripID);
                    e.preventDefault();
                }
                break;
            case "z":
                if (e.ctrlKey) {
                    console.log(e);
                    undoRedo.undo();
                    e.preventDefault();
                }
                break;

            case "Delete":
                console.log("Delete")
                deleteTrain();
                e.preventDefault();
                break;

            default:
                break;
        }
    }

    const onDoubleClick = useCallback(() => {
        setOpenEditTrain(true);
    }, []);

    const [openEditTrain, setOpenEditTrain] = React.useState(false);
    const handleClose2 = () => {
    };

    const pasteTrip = async (tripList: Train[], selectedTripID: number | undefined) => {
        console.log(selectedTripID);
        let text = localStorage.getItem('copyTrip');
        if (text === null) {
            console.log("text == null");
            return;
        }
        const trips: Train[] = JSON.parse(text);
        console.log(trips);
        // undoRedo.execute({
        //     task: () => {
        //         const promise = trips.map(trip => {
        //             if (trip.trainID === undefined) {
        //                 console.log("tripID is undefined");
        //                 return;
        //             }
        //             trip.trainID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        //             trip.trainID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        //             trip.times.forEach(item => {
        //                 item.stopTimeID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        //                 item.trainID = trip.trainID;
        //             });
        //             const selectedTrip = tripList.find(item => item.trainID === selectedTripID);
        //             if (!selectedTrip) return;
        //             console.log({trip: trip, insertTripID: selectedTripID});
        //         });
        //         Promise.all(promise).catch(err => {
        //         });
        //
        //     },
        //     undo: () => {
        //         console.log("test");
        //         trips.map(trip => {
        //         })
        //     }
        // })
    }
    return (
        <div className={style.timetableRoot}>
            <div className={style.timetableMain2}>
                    <PatternSettingView/>
                合計所要時間（待ち時間を含む）：{totalPoint().toFixed(2)}

                <div className={style.timetableMain}>
                    <StationView stations={stations} direct={Number(direct)}/>
                    <div className={style.trainListLayout} tabIndex={-1}
                         onKeyDown={async e => {
                             keyEvent(e);
                         }}
                         onPaste={e => {
                             console.log(e);
                         }}

                    >
                        <div className={style.trainListView}
                        >
                            {patTrains.map((train) => {
                                return (
                                    <MemoTrainView key={train.trainID} trip={train} stations={stations}
                                                   direct={Number(direct)}
                                                   selected={timetableSelected.selected?.tripID === train.trainID ? timetableSelected.selected : null}
                                                   setSelected={timetableSelected.setSelected}
                                                   trainType={trainTypes[train.typeID]}
                                                   onDoubleClick={onDoubleClick}
                                                   trainChecked={timetableSelected.trainChecked}
                                                   changeTrainChecked={(trainID:number,checked:boolean)=>{
                                                       timetableSelected.setTrainChecked((prev)=>
                                                       {
                                                              if(checked){
                                                                return [...prev,trainID];
                                                              }else{
                                                                return prev.filter(item=>item!==trainID);
                                                              }
                                                       })}}
                                    />
                                )
                            })}
                            <AddNewTrainView stations={stations} direct={Number(direct)}/>
                            {trains.map((trip) => {
                                return (
                                    <MemoTrainView key={trip.trainID} trip={trip} stations={stations}
                                                   direct={Number(direct)}
                                                   selected={null}
                                                   setSelected={null}
                                                   trainType={trainTypes[trip.typeID]}
                                                   onDoubleClick={onDoubleClick}
                                                   trainChecked={timetableSelected.trainChecked}
                                                   changeTrainChecked={(trainID:number,checked:boolean)=>{
                                                       timetableSelected.setTrainChecked((prev)=>
                                                       {
                                                           if(checked){
                                                               return [...prev,trainID];
                                                           }else{
                                                               return prev.filter(item=>item!==trainID);
                                                           }
                                                       })}}
                                    />
                                )
                            })}
                        </div>
                    </div>

                    <Dialog open={open} sx={{
                        '.MuiPaper-root': {
                            padding: 5,
                        },
                    }}>
                        {/*<TimeEditView close={()=>handleClose("")} focusIndex={timetableSelected.selected?.viewID} stopTime={timetableSelected.selected ? patTrains.find(item => item.tripID === timetableSelected.selected?.tripID)?.stopTimes.find(item => item.routeStationID === timetableSelected.selected?.stationID)! : null}/>*/}
                    </Dialog>
                </div>
            </div>

            <div className={style.trainEditRoot}>

                {timetableSelected.selected?.tripID != null ?

                    (<TrainEdit trip={patTrains.filter(item => item.trainID === timetableSelected?.selected?.tripID)[0]}
                                stations={stations}/>)
                    : null}
            </div>
            <Dialog onClose={handleClose2} open={openEditTrain}>
                <List>
                    <ListItem>
                        <Button
                            onClick={e => {
                                copyTrain();
                                setOpenEditTrain(false);
                            }}
                        >コピー</Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            onClick={e => {
                                console.log("編集");
                                pasteTrip(patTrains, timetableSelected.selected?.tripID);
                                setOpenEditTrain(false);
                            }}
                        >貼り付け</Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            onClick={e => {
                                setOpenEditTrain(false);
                            }}
                        >キャンセル</Button>
                    </ListItem>

                </List>
            </Dialog>
        </div>

    );
}


export default TimeTablePage;


