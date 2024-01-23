import React, {memo, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import * as signalR from "@microsoft/signalr";
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station, StopTime} from "../SujiroData/DiaData";
import {TimeTableTrip} from "./TimeTableData";
import {useParams} from "react-router-dom";
import {
    Button,
    Dialog,
    List,
    ListItem,
} from '@mui/material';
import axios from "axios";
import {TimeEditView} from "./TimeEditView";
const MemoTrainView = memo(TrainView);

function TimeTablePage() {
    const {direct} = useParams<{ direct: string }>();

    const [stations, setStations] = useState<Station[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);
    const [connection,setConnection]=useState<signalR.HubConnection>(()=>{
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_SERVER_URL}/ws/chatHub`)
            .build();
        connection.start().catch((err) => console.error(err));
        return connection;
    });



    const [selected, setSelected] = useState<TimetableSelected | null>(null);

    const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        if (open) {
            return;
        }
        console.log(trips);
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
            let stationIndex = stations.findIndex(item => item.stationID === prev.stationID);
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
                            return {tripID: prev.tripID, stationID: stations[stationIndex].stationID, viewID};
                        }
                        break;
                    case 0:
                        if ((stations[stationIndex].style & 0x02) > 0) {
                            return {tripID: prev.tripID, stationID: stations[stationIndex].stationID, viewID};
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
            let stationIndex = stations.findIndex(item => item.stationID === prev.stationID);
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
                            return {tripID: prev.tripID, stationID: stations[stationIndex].stationID, viewID};
                        }
                        break;
                    case 0:
                        if ((stations[stationIndex].style & 0x02) > 0) {
                            return {tripID: prev.tripID, stationID: stations[stationIndex].stationID, viewID};
                        }
                        break;
                }
            }
        });
        e?.preventDefault();
    };



    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res => res.json())
            .then((res) => {
                setTrips(res.trips);
                setStations(res.stations);
            })

    }, [])

    connection.off("UpdateStoptime");
    connection.on("UpdateStoptime", (stoptime: StopTime) => {
        setTrips(prev => {
            const tripIndex = prev.findIndex(item => item.tripID === stoptime.tripID);
            if (tripIndex < 0) {
                console.error("tripIndex<0");
                return prev;
            }
            const stopTimeIndex = prev[tripIndex].stopTimes.findIndex(item => item.stopTimeID === stoptime.stopTimeID);
            if (stopTimeIndex < 0) {
                console.error("stopTimeIndex<0");
                return prev;
            }
            const next = [...prev];
            next[tripIndex] = {...next[tripIndex]};
            next[tripIndex].stopTimes = [...next[tripIndex].stopTimes];
            next[tripIndex].stopTimes[stopTimeIndex] = stoptime;

            return next;
        });
    });
    connection.off("UpdateTripStopTime");

    connection.on("UpdateTripStopTime", (trip: TimeTableTrip) => {
        console.log("UpdateTripStopTime", trip.stopTimes[0].depTime);
        setTrips(prev => {
            const tripIndex = prev.findIndex(item => item.tripID === trip.tripID);
            if (tripIndex < 0) {
                console.error("tripIndex<0");
                return prev;
            }
            const next = [...prev];
            next[tripIndex] = Object.assign({...next[tripIndex]}, trip);
            console.log(next[tripIndex].stopTimes[0].depTime);
            return next;
        });

    });
    connection.off("UpdateTrips");
    connection.on("UpdateTrips", () => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res => res.json())
            .then((res) => {
                setTrips(res.trips);
                setStations(res.stations);
            })

    });
    connection.off("DeleteTrip");

    connection.on("DeleteTrip", (tripID: number) => {

        if (selected?.tripID === tripID) {
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
        }


        setTrips(prev => {
            return prev.filter(item => item.tripID !== tripID);
        });
    });



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
            // handleClose("");
            // e.preventDefault();
        } else {
            console.log("enter");
            handleClickOpen();
            e.preventDefault();
        }
    }
    const onDoubleClick=()=>{
        setOpenEditTrain(true);
    }

    const [openEditTrain, setOpenEditTrain] = React.useState(false);
    const handleClose2 = () => {
    };

    const copyTrip=(trip:TimeTableTrip)=>{
        localStorage.setItem('copyTrip', JSON.stringify([trip]));
    }
    const pasteTrip=(tripList:TimeTableTrip[],selectedTripID:number|undefined)=>{

        console.log(selectedTripID);
            let text = localStorage.getItem('copyTrip');
            if(text === null) {
                console.log("text == null");
                return;
            }
            const trips: TimeTableTrip[] = JSON.parse(text);
            trips.forEach(trip => {
                if (trip.tripID === undefined) {
                    console.log("tripID is undefined");
                    return;
                }
                trip.tripID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
                const selectedTrip = tripList.find(item => item.tripID === selectedTripID);
                if (!selectedTrip) return;
                console.log({trip: trip, insertTripID: selectedTripID});

                axios.post("" + process.env.REACT_APP_SERVER_URL + "/api/timetablePage/insertTrip",
                    {trip: trip, insertTripID: selectedTripID}).then(res => {
                    console.log(res);
                });
            });



    }

    return (
        <div className={style.timetableRoot}>

            <div className={style.timetableMain}
            >
                <StationView stations={stations} direct={Number(direct)}/>
                <div className={style.trainListLayout} tabIndex={-1}
                     onKeyDown={e => {
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
                                     let flag = false;
                                     for (let i = 0; i < trip.stopTimes.length; i++) {
                                         if (trip.stopTimes[i].stationID === selected?.stationID && selected?.viewID === 0) {
                                             flag = true;
                                         }
                                         if (flag && trip.stopTimes[i].ariTime >= 0) {
                                             trip.stopTimes[i].ariTime += addSec;
                                         }
                                         if (trip.stopTimes[i].stationID === selected?.stationID && selected?.viewID === 2) {
                                             flag = true;
                                         }
                                         if (flag && trip.stopTimes[i].depTime >= 0) {
                                             trip.stopTimes[i].depTime += addSec;
                                         }
                                     }
                                     axios.put(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/trip`, trip);
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
                                         if (trip.stopTimes[i].stationID === selected?.stationID && selected?.viewID === 0) {
                                             flag = true;
                                         }
                                         if (flag && trip.stopTimes[i].ariTime >= 0) {
                                             trip.stopTimes[i].ariTime += addSec;
                                         }
                                         if (trip.stopTimes[i].stationID === selected?.stationID && selected?.viewID === 2) {
                                             flag = true;
                                         }
                                         if (flag && trip.stopTimes[i].depTime >= 0) {
                                             trip.stopTimes[i].depTime += addSec;
                                         }
                                     }
                                     axios.put(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/trip`, trip);
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
                                 axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/trip/${selected?.tripID}`);
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
                    <TimeEditView close={()=>handleClose("")} focusIndex={selected?.viewID} stopTime={selected ? trips.find(item => item.tripID === selected.tripID)?.stopTimes.find(item => item.stationID === selected.stationID)! : null}/>
                </Dialog>
            </div>
            {
                ((selected!==null) ?
                    <TimeEditView close={undefined} focusIndex={undefined} stopTime={selected ? trips.find(item => item.tripID === selected.tripID)?.stopTimes.find(item => item.stationID === selected.stationID)! : null}
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
                    <ListItem>
                        <Button
                            onClick={e=>{
                                console.log("編集");
                                setOpenEditTrain(false);
                            }}
                        >削除</Button>
                    </ListItem>
                </List>
            </Dialog>


        </div>

    );
}

export default TimeTablePage;


export interface TimetableSelected{
    tripID:number;
    stationID:number;
    viewID:number;
}
