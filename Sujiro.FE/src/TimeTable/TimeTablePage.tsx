import React, {memo, useCallback, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import * as signalR from "@microsoft/signalr";
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station, StopTime, Trip} from "../SujiroData/DiaData";
import {TimeTableStation, TimeTableTrip} from "./TimeTableData";
import {useParams} from "react-router-dom";
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
import {requiredParamsHook} from "../Hooks/RequiredParamsHook";
import {getAuth} from "firebase/auth";
import {axiosClient} from "../Hooks/AxiosHook";

const MemoTrainView = memo(TrainView);

function TimeTablePage() {
    const {companyID} = requiredParamsHook<{ companyID: string }>();
    const {routeID} = requiredParamsHook<{ routeID: string }>();
    const {direct} = requiredParamsHook<{ direct: string }>();

    const [user] = useIdToken(auth);
    const [stations, setStations] = useState<TimeTableStation[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);
    const [selected, setSelected] = useState<TimetableSelected | null>(null);
    const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (open) {
            return;
        }
        setSelected((prev) => {
            if (prev === null) {
                return null;
            }
            const tripIndex = trips.findIndex(item => item.tripID === prev.tripID);
            const newTrip = trips[tripIndex + 1];
            if (newTrip) {
                return {tripID: newTrip.tripID, stationID: prev.stationID, viewID: prev.viewID};
            }
            return prev;
        });
        if (e) {
            e.preventDefault();
        }

    };
    const onLeftKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (open) {
            return;
        }
        setSelected((prev) => {
            if (prev === null) {
                return null;
            }
            const tripIndex = trips.findIndex(item => item.tripID === prev.tripID);
            const newTrip = trips[tripIndex - 1];
            if (newTrip) {
                return {tripID: newTrip.tripID, stationID: prev.stationID, viewID: prev.viewID};
            }
            return prev;
        });
        e.preventDefault();
    };
    const onUpKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (open) {
            return;
        }
        setSelected((prev) => {
            console.log("s", prev);
            if (prev === null) {
                return null;
            }
            let stationIndex = stations.findIndex(item => item.routeStationID === prev.stationID);
            let viewID = prev.viewID;
            while (true) {
                if (viewID === 0) {
                    stationIndex--;
                    viewID = 3;
                }
                viewID--;
                if (stationIndex < 0) {
                    return prev;
                }
                switch (viewID) {
                    case 2:
                        if ((stations[stationIndex].style & 0x01) > 0) {
                            return {tripID: prev.tripID, stationID: stations[stationIndex].routeStationID, viewID};
                        }
                        break;
                    case 0:
                        if ((stations[stationIndex].style & 0x02) > 0) {
                            return {tripID: prev.tripID, stationID: stations[stationIndex].routeStationID, viewID};
                        }
                        break;
                }
            }
        });
        e.preventDefault();
    };
    const onDownKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (open) {
            return;
        }
        setSelected((prev) => {
            if (prev === null) {
                return null;
            }
            let stationIndex = stations.findIndex(item => item.routeStationID === prev.stationID);
            let viewID = prev.viewID;
            while (true) {
                viewID++;
                if (viewID === 3) {
                    stationIndex++;
                    viewID = 0;
                }
                if (stationIndex >= stations.length) {
                    return prev;
                }
                switch (viewID) {
                    case 2:
                        if ((stations[stationIndex].style & 0x01) > 0) {
                            return {tripID: prev.tripID, stationID: stations[stationIndex].routeStationID, viewID};
                        }
                        break;
                    case 0:
                        if ((stations[stationIndex].style & 0x02) > 0) {
                            return {tripID: prev.tripID, stationID: stations[stationIndex].routeStationID, viewID};
                        }
                        break;
                }
            }
        });
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
            await loadTimeTableData();
            const token = await getAuth().currentUser?.getIdToken()
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(`${process.env.REACT_APP_SERVER_URL}/ws/chatHub`, {accessTokenFactory: () => token ?? ''})
                .build();
            await connection.start();
            connection.invoke("Init",companyID);
            connection.off("UpdateStopTimes");
            connection.on("UpdateStopTimes", (stopTimes: StopTime[]) => {
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

            connection.off("UpdateTrips");
            connection.on("UpdateTrips", async(trips:Trip[]) => {
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
            connection.off("DeleteTrips");

            connection.on("DeleteTrips", async() => {
                await loadTimeTableData();
            });
            connection.off("InsertTrips");

            connection.on("InsertTrips", async() => {
                await loadTimeTableData();
            });
        });
    }, []);










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

            <div className={style.timetableMain}
            >
                <StationView stations={stations} direct={Number(direct)}/>
                <div className={style.trainListLayout} tabIndex={-1}
                     onKeyDown={async e => {
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
                                     const trip = trips.find(item => item.tripID === selected?.tripID);
                                     if (!trip) return;
                                     console.log(trip);
                                     let flag = false;
                                     for (let i = 0; i < trip.stopTimes.length; i++) {
                                         if (trip.stopTimes[i].routeStationID === selected?.stationID && selected?.viewID === 0) {
                                             flag = true;
                                         }
                                         if (flag && trip.stopTimes[i].ariTime >= 0) {
                                             trip.stopTimes[i].ariTime += addSec;
                                         }
                                         if (trip.stopTimes[i].routeStationID === selected?.stationID && selected?.viewID === 2) {
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
                                     const trip = trips.find(item => item.tripID === selected?.tripID);
                                     if (!trip) return;
                                     let flag = false;
                                     for (let i = 0; i < trip.stopTimes.length; i++) {
                                         if (trip.stopTimes[i].routeStationID === selected?.stationID && selected?.viewID === 0) {
                                             flag = true;
                                         }
                                         if (flag && trip.stopTimes[i].ariTime >= 0) {
                                             trip.stopTimes[i].ariTime += addSec;
                                         }
                                         if (trip.stopTimes[i].routeStationID === selected?.stationID && selected?.viewID === 2) {
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
                                     const trip = trips.find(item => item.tripID === selected?.tripID);
                                     if (!trip) return;
                                     copyTrip(trip);
                                     e.preventDefault();
                                 }
                                 break;
                             case "v":
                                 if (e.ctrlKey) {
                                     console.log(e);
                                     pasteTrip(trips,selected?.tripID);
                                     e.preventDefault();
                                 }
                                 break;
                             case "Delete":
                                 if (selected?.tripID === undefined) {
                                     return;
                                 }
                                 axiosClient.delete(`/api/trip/${companyID}/${selected?.tripID}`).catch(err => {});
                                 e.preventDefault();
                                 break;

                             default:
                                 break;
                         }
                     }}
                     onPaste={e => {
                         console.log(e);
                     }}
                >
                    <div className={style.trainListView}>
                        {trips.map((trip) => {
                            return (
                                <MemoTrainView key={trip.tripID} trip={trip} stations={stations} direct={Number(direct)}
                                               selected={selected?.tripID === trip.tripID ? selected : null}
                                               setSelected={setSelected}
                                                onDoubleClick={onDoubleClick}/>
                            )
                        })}
                    </div>
                </div>
                <Dialog  open={open}   sx={{
                    '.MuiPaper-root': {
                        padding: 5,
                    },
                }}>
                    <TimeEditView close={()=>handleClose("")} focusIndex={selected?.viewID} stopTime={selected ? trips.find(item => item.tripID === selected.tripID)?.stopTimes.find(item => item.routeStationID === selected.stationID)! : null}/>
                </Dialog>
            </div>
            {
                ((selected!==null) ?
                    <TimeEditView close={undefined} focusIndex={undefined} stopTime={selected ? trips.find(item => item.tripID === selected.tripID)?.stopTimes.find(item => item.routeStationID === selected.stationID)! : null}
                    /> : null)
            }
            <Dialog  onClose={handleClose2} open={openEditTrain}>
                <List>
                    <ListItem>
                        <Button
                            onClick={e=>{
                                const trip = trips.find(item => item.tripID === selected?.tripID);
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
                                pasteTrip(trips,selected?.tripID);
                                setOpenEditTrain(false);
                            }}
                        >貼り付け</Button>
                    </ListItem>
                    {/*<ListItem>*/}
                    {/*    <Button*/}
                    {/*        onClick={e=>{*/}
                    {/*            console.log("編集");*/}
                    {/*            setOpenEditTrain(false);*/}
                    {/*        }}*/}
                    {/*    >削除</Button>*/}
                    {/*</ListItem>*/}
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
            <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
                <Fab color="primary" aria-label="add" onClick={()=>setOpenEditTrain(true)}>
                    <Settings/>
                </Fab>
            </Box>


        </div>

    );
}

export default TimeTablePage;


export interface TimetableSelected{
    tripID:number;
    stationID:number;
    viewID:number;
}
