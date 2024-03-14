import React, {memo, useCallback, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station, StopTime, Trip} from "../SujiroData/DiaData";
import {TimeTableStation, TimeTableTrip} from "./TimeTableData";
import {
    Button,
    Dialog, Fab,
    List,
    ListItem,
} from '@mui/material';
import {TimeEditView} from "./TimeEditView";
import Box from "@mui/material/Box";
import {Settings} from "@mui/icons-material";

import {
    auth
} from '../firebase';
import {useIdToken} from "react-firebase-hooks/auth";
import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
import {axiosClient} from "../Hooks/AxiosHook";
import {useSignalR} from "../Hooks/SignalrHook";
import {HubConnection} from "@microsoft/signalr";
import {AddNewTripView} from "./AddNewTripView";
import useTimetableSelected from "./TimetableSelectedHook";
import TrainEdit from "./TrainEdit";

const MemoTrainView = memo(TrainView);

function TimeTablePage() {
    const signalR=useSignalR();

    const {companyID} = useRequiredParamsHook<{ companyID: string }>();
    const {routeID} = useRequiredParamsHook<{ routeID: string }>();
    const {direct} = useRequiredParamsHook<{ direct: string }>();

    const [stations, setStations] = useState<TimeTableStation[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);
    const timetableSelected=useTimetableSelected();

    const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (open) {
            return;
        }
        timetableSelected.moveToNextTrip(trips);
        if (e) {
            e.preventDefault();
        }
    };
    const onLeftKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (open) {
            return;
        }
        timetableSelected.moveToPrevTrip(trips);
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
    const loadTimeTableData=async()=>{
        axiosClient.get(`/api/timetablePage/${companyID}/${routeID}/${direct}?timestamp=${new Date().getTime()}`)
            .then(res=>{
                setTrips(res.data.trips);
                setStations(res.data.stations);
            }).catch(err=>{});
    }

    useEffect(() => {
        auth.onAuthStateChanged(async(user) => {
            loadTimeTableData();
            signalR.setOnStart({onStart:(conn:HubConnection)=> {
                console.log("onStart",conn);
                console.trace();
                if(conn===undefined){
                    console.error("signalR");
                    return;
                }
                conn.invoke("Init",companyID);
                conn.off("UpdateStopTimes");
                conn.on("UpdateStopTimes", (stopTimes: StopTime[]) => {
                    console.log(stopTimes);
                    setTrips(prev => {
                        const next=[...prev];
                        stopTimes.forEach(stopTime => {
                            const tripIndex = next.findIndex(item => item.tripID === stopTime.tripID);
                            if (tripIndex < 0) {
                                return;
                            }
                            const stopTimeIndex = next[tripIndex].stopTimes.findIndex(item => item.stopTimeID === stopTime.stopTimeID);
                            if (stopTimeIndex < 0) {
                                return;
                            }
                            next[tripIndex] = {...next[tripIndex]};
                            next[tripIndex].stopTimes = [...next[tripIndex].stopTimes];
                            next[tripIndex].stopTimes[stopTimeIndex] = stopTime;

                        });
                        return next;
                    });
                });

                conn.off("UpdateTrips");
                conn.on("UpdateTrips", async(trips:Trip[]) => {
                    setTrips(prev => {
                        const next=[...prev];
                        trips.forEach(trip => {
                            const tripIndex = next.findIndex(item => item.tripID === trip.tripID);
                            if (tripIndex < 0) {
                                return;
                            }
                            next[tripIndex] = {...next[tripIndex],...trip};

                        });
                        return next;
                    });
                });
                conn.off("DeleteTrips");

                conn.on("DeleteTrips", async() => {
                    await loadTimeTableData();
                });
                conn.off("InsertTrips");

                conn.on("InsertTrips", async() => {
                    await loadTimeTableData();
                });

            }});
            signalR.createConnection();
        });
    }, [direct,routeID,companyID]);

    const [open, setOpen] = React.useState(false);
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

    function keyEvent(e: React.KeyboardEvent<HTMLDivElement>){
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
                if (e.ctrlKey) {
                    //以後の駅をすべて１分遅らせる
                    const addSec = 60;
                    const trip = trips.find(item => item.tripID === timetableSelected.selected?.tripID);
                    if (!trip) return;
                    console.log(trip);
                    let flag = false;
                    for (let i = 0; i < trip.stopTimes.length; i++) {
                        if (trip.stopTimes[i].routeStationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 0) {
                            flag = true;
                        }
                        if (flag && trip.stopTimes[i].ariTime >= 0) {
                            trip.stopTimes[i].ariTime += addSec;
                        }
                        if (trip.stopTimes[i].routeStationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 2) {
                            flag = true;
                        }
                        if (flag && trip.stopTimes[i].depTime >= 0) {
                            trip.stopTimes[i].depTime += addSec;
                        }
                    }
                    axiosClient.put(`/api/timetablePage/UpdateTrip/${companyID}`, trip).catch(err => {});
                    e.preventDefault();

                }
                break;
            case "J":
                if (e.ctrlKey) {
                    const addSec = -60;
                    const trip = trips.find(item => item.tripID === timetableSelected.selected?.tripID);
                    if (!trip) return;
                    let flag = false;
                    for (let i = 0; i < trip.stopTimes.length; i++) {
                        if (trip.stopTimes[i].routeStationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 0) {
                            flag = true;
                        }
                        if (flag && trip.stopTimes[i].ariTime >= 0) {
                            trip.stopTimes[i].ariTime += addSec;
                        }
                        if (trip.stopTimes[i].routeStationID === timetableSelected.selected?.stationID && timetableSelected.selected?.viewID === 2) {
                            flag = true;
                        }
                        if (flag && trip.stopTimes[i].depTime >= 0) {
                            trip.stopTimes[i].depTime += addSec;
                        }
                    }
                    axiosClient.put(`/api/timetablePage/UpdateTrip/${companyID}`, trip).catch(err => {});
                    e.preventDefault();
                }
                break;
            case "c":
                if (e.ctrlKey) {
                    console.log(e);
                    const trip = trips.find(item => item.tripID === timetableSelected.selected?.tripID);
                    if (!trip) return;
                    copyTrip(trip);
                    e.preventDefault();
                }
                break;
            case "v":
                if (e.ctrlKey) {
                    console.log(e);
                    pasteTrip(trips,timetableSelected.selected?.tripID);
                    e.preventDefault();
                }
                break;
            case "Delete":
                if (timetableSelected.selected?.tripID === undefined) {
                    return;
                }
                axiosClient.delete(`/api/trip/${companyID}/${timetableSelected.selected?.tripID}`).catch(err => {});
                e.preventDefault();
                break;

            default:
                break;
        }
    }

    const onDoubleClick=useCallback(()=>{
        setOpenEditTrain(true);
    },[]);

    const [openEditTrain, setOpenEditTrain] = React.useState(false);
    const handleClose2 = () => {
    };

    const copyTrip=(trip:TimeTableTrip)=>{
        localStorage.setItem('copyTrip', JSON.stringify([trip]));
    }
    const pasteTrip=async (tripList:TimeTableTrip[],selectedTripID:number|undefined)=>{

        console.log(selectedTripID);
            let text = localStorage.getItem('copyTrip');
            if(text === null) {
                console.log("text == null");
                return;
            }
            const trips: TimeTableTrip[] = JSON.parse(text);
            const promise=trips.map(trip => {
                if (trip.tripID === undefined) {
                    console.log("tripID is undefined");
                    return;
                }
                trip.tripID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                trip.trainID=Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                trip.stopTimes.forEach(item => {
                    item.stopTimeID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                    item.tripID = trip.tripID;
                });
                const selectedTrip = tripList.find(item => item.tripID === selectedTripID);
                if (!selectedTrip) return;
                console.log({trip: trip, insertTripID: selectedTripID});
                return axiosClient.post(`/api/timetablePage/InsertTrip/${companyID}`,
                    {trip: trip, insertTripID: selectedTripID});
            });
            await Promise.all(promise).catch(err => {});
    }

    return (
        <div className={style.timetableRoot}>
            <div className={style.timetableMain2}>


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
                    <div className={style.trainListView}>
                        {trips.map((trip) => {
                            return (
                                <MemoTrainView key={trip.tripID} trip={trip} stations={stations} direct={Number(direct)}
                                               selected={timetableSelected.selected?.tripID === trip.tripID ? timetableSelected.selected : null}
                                               setSelected={timetableSelected.setSelected}
                                                onDoubleClick={onDoubleClick}/>
                            )
                        })}
                        <AddNewTripView stations={stations} direct={Number(direct)}/>
                    </div>
                </div>
                <Dialog  open={open}   sx={{
                    '.MuiPaper-root': {
                        padding: 5,
                    },
                }}>
                    <TimeEditView close={()=>handleClose("")} focusIndex={timetableSelected.selected?.viewID} stopTime={timetableSelected.selected ? trips.find(item => item.tripID === timetableSelected.selected?.tripID)?.stopTimes.find(item => item.routeStationID === timetableSelected.selected?.stationID)! : null}/>
                </Dialog>
            </div>
            </div>

            {/*{*/}
            {/*    ((timetableSelected.selected!==null) ?*/}
            {/*        <TimeEditView close={undefined} focusIndex={undefined} stopTime={timetableSelected.selected ? trips.find(item => item.tripID === timetableSelected.selected?.tripID)?.stopTimes.find(item => item.routeStationID === timetableSelected.selected?.stationID)! : null}*/}
            {/*        /> : null)*/}
            {/*}*/}
            <div className={style.trainEditRoot}>

            {timetableSelected.selected?.tripID!=null?

                (<TrainEdit trip={trips.filter(item=>item.tripID===timetableSelected?.selected?.tripID)[0]} stations={stations}/>)
            :null}
            </div>
            <Dialog  onClose={handleClose2} open={openEditTrain}>
                <List>
                    <ListItem>
                        <Button
                            onClick={e=>{
                                const trip = trips.find(item => item.tripID === timetableSelected.selected?.tripID);
                                if (!trip) {
                                    setOpenEditTrain(false);
                                    return;
                                }
                                copyTrip(trip);


                                setOpenEditTrain(false);
                        }}
                        >コピー</Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            onClick={e=>{
                                console.log("編集");
                                pasteTrip(trips,timetableSelected.selected?.tripID);
                                setOpenEditTrain(false);
                            }}
                        >貼り付け</Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            onClick={e=>{
                                setOpenEditTrain(false);
                            }}
                        >キャンセル</Button>
                    </ListItem>
                    <ListItem>
                        <Button
                            onClick={e=>{
                                window.location.href="/TimeTablePDF/"+0;
                            }}
                        >PDFにする</Button>
                    </ListItem>
                </List>
            </Dialog>
        </div>

    );
}

export default TimeTablePage;


