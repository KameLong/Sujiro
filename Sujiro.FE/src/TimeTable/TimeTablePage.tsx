import React, {memo, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import * as signalR from "@microsoft/signalr";
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station, StopTime} from "../SujiroData/DiaData";
import {TimeTableTrip} from "./TimeTableData";
import {useParams} from "react-router-dom";
import {useKey, useLongPress} from 'react-use';
import {
    Button,
    Dialog,
    DialogTitle,
    FormControlLabel,
    Input,
    List,
    ListItem,
    ListItemButton,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material';
import axios from "axios";
import {TimeEditView} from "./TimeEditView";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_SERVER_URL}/chatHub`)
    .build();
connection.start().catch((err) => console.error(err));


const MemoTrainView = memo(TrainView);

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
    stopTime:StopTime|null;
    focusIndex:number;
}
function SimpleDialog(props: SimpleDialogProps) {

    const { onClose, selectedValue, open,stopTime,focusIndex } = props;


    console.log(open);

    const handleClose = () => {
        const dep=timeS2int(depTime);
        const ari=timeS2int(ariTime);
        if(dep<-1||ari<-1) {
            console.error("異常な値");
            return;
        }
        console.log(dep,ari);
        //stopTimeの更新
        if(stopTime===null) {
            return;
        }
        const newStopTime:StopTime={
            stopTimeID:stopTime.stopTimeID,
            stationID:stopTime.stationID,
            tripID:stopTime.tripID,
            stopType:stopTime.stopType,
            depTime:dep,
            ariTime:ari
        };
        console.log(newStopTime);
        axios.put(`${process.env.REACT_APP_SERVER_URL}/api/stopTime`,newStopTime);




        onClose(selectedValue);
    };
    const time2Str=(time:number|undefined)=>{
        if(time===undefined){
            return "";
        }
        if(time<0){
            return "";
        }
        const ss=time%60;
        time-=ss;
        time/=60;
        const mm=time%60;
        time-=mm;
        time/=60;
        const hh=time%24;
        return hh+mm.toString().padStart(2,"0");
    }
    const timeS2int=(time:string)=>{
        if(time.length===0){
            return -1;
        }
        if(time.length>4){
            return -2;
        }
        time=time.padStart(4,"0");
        const hh=Number(time.substr(0,2));
        const mm=Number(time.substr(2,2));
        return hh*3600+mm*60;
    }
    const [depTime,setDepTime]=useState(time2Str(stopTime?.depTime));
    const [ariTime,setAriTime]=useState(time2Str(stopTime?.ariTime));
    useEffect(()=>{
        setDepTime(time2Str(stopTime?.depTime));
        setAriTime(time2Str(stopTime?.ariTime));
    },[stopTime])



    return (
        <Dialog  onClose={handleClose} open={open}>
            <div style={{margin:'20px'}} onKeyDown={e=>{if(open&&e.key==="Enter"){console.log(e);handleClose();e.preventDefault()}}}>
                <DialogTitle>駅時刻編集</DialogTitle>
            <List sx={{ pt: 0 }} >
                <ListItem >
                    着時刻
                    <Input type={"number"} style={{marginLeft:'20px',width:'4em'}} autoFocus={focusIndex===0} value={ariTime} onChange={e=>setAriTime(e.target.value)}/>
                </ListItem>
                <ListItem >
                    発時刻
                    <Input type={"number"} style={{marginLeft:'20px',width:'4em'}}  autoFocus={focusIndex===2} value={depTime} onChange={e=>setDepTime(e.target.value)}/>
                </ListItem>
            </List>
            <Button onClick={()=> {
                handleClose();
            }}>OK</Button>
        </div>
        </Dialog>
    );
}

function TimeTablePage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);
    const {direct} = useParams<{ direct: string }>();



    const [selected, setSelected] = useState<TimetableSelected | null>(null);
    useEffect(() => {
        console.log(selected);
    }, [selected]);
    const onRightKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {
        let open = false;
        setOpen(prev => {
            open = prev;
            return prev;
        })
        if (open) {
            return;
        }

        let trips: TimeTableTrip[] = [];
        setTrips(prev => {
            trips = prev;
            return prev;
        })
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
        let open = false;
        setOpen(prev => {
            open = prev;
            return prev;
        })
        if (open) {
            return;
        }

        let trips: TimeTableTrip[] = [];
        setTrips(prev => {
            trips = prev;
            return prev;
        })
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
        let open = false;
        setOpen(prev => {
            open = prev;
            return prev;
        })
        if (open) {
            return;
        }

        let stations: Station[] = [];
        setStations(prev => {
            stations = prev;
            return prev;
        })
        setSelected((prev) => {
            console.log("s", prev);
            if (prev === null) {
                return null;
            }
            let stationIndex = stations.findIndex(item => item.stationID === prev.stationID);
            let viewID = prev.viewID;
            while (true) {
                if (viewID == 0) {
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
            return prev;
        });
        e.preventDefault();
    };
    const onDownKeyDown = (e: React.KeyboardEvent<HTMLDivElement> | undefined) => {

        let open = false;
        setOpen(prev => {
            open = prev;
            return prev;
        })
        if (open) {
            return;
        }
        let stations: Station[] = [];
        setStations(prev => {
            stations = prev;
            return prev;
        })
        setSelected((prev) => {
            if (prev === null) {
                return null;
            }
            let stationIndex = stations.findIndex(item => item.stationID === prev.stationID);
            let viewID = prev.viewID;
            while (true) {
                viewID++;
                if (viewID == 3) {
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
            return prev;
        });
        e?.preventDefault();
    };



    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res => res.json())
            .then((res) => {
                setTrips(res.trips);
                setStations(res.stations);
            })
        connection.on("UpdateStoptime", (stoptime: StopTime) => {
            console.log("UpdateStoptime", stoptime);
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
        connection.on("UpdateTrips", () => {
            console.log("UpdateTrips");
            fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res => res.json())
                .then((res) => {
                    setTrips(res.trips);
                    setStations(res.stations);
                })

        });
        connection.on("DeleteTrip", (tripID: number) => {
            let selected: TimetableSelected | null = {tripID: -1, stationID: 0, viewID: 0};
            setSelected(prev => {
                selected = prev;
                return prev;
            });

            if (selected?.tripID === tripID) {
                console.log("DeleteTrip", tripID);
                let trips: TimeTableTrip[] = [];
                setTrips(prev => {
                    trips = prev;
                    return prev;
                })
                setSelected((prev) => {
                    if (prev === null) {
                        return null;
                    }
                    const tripIndex = trips.findIndex(item => item.tripID === prev.tripID);
                    console.log(tripIndex)
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


    }, [])


    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

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

    // const onLongPress = () => {
    //     console.log("test");
    //     setOpenEditTrain(true);
    // };
    const [onDoubleClick,setOnDoubleClick]=useState(()=>()=>{
        setOpenEditTrain(true);
    });


    const defaultOptions = {
        isPreventDefault: false,
        delay: 300,
    };
    // const longPressEvent = useLongPress(onLongPress, defaultOptions);

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
                                     console.log(e);
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
                                     console.log(trip);
                                     axios.put(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/trip`, trip);
                                     e.preventDefault();

                                 }
                                 break;
                             case "J":
                                 if (e.ctrlKey) {
                                     console.log(e);
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
                                     console.log(trip);
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
                <SimpleDialog
                    selectedValue={selectedValue}
                    open={open}
                    onClose={handleClose}
                    stopTime={selected ? trips.find(item => item.tripID === selected.tripID)?.stopTimes.find(item => item.stationID === selected.stationID)! : null}
                    focusIndex={selected?.viewID || 0}
                />

            </div>
            {
                ((selected!==null) ?
                    <TimeEditView  stopTime={selected ? trips.find(item => item.tripID === selected.tripID)?.stopTimes.find(item => item.stationID === selected.stationID)! : null}
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