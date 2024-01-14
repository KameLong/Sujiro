import React, {memo, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import * as signalR from "@microsoft/signalr";
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station, StopTime} from "../SujiroData/DiaData";
import {TimeTableTrip} from "./TimeTableData";
import {useParams} from "react-router-dom";
import {useKey} from 'react-use';
import {Button, Dialog, DialogTitle, Input, List, ListItem, ListItemButton} from '@mui/material';
import axios from "axios";

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


    const handleClose = () => {
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
            <div style={{margin:'20px'}}>
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



                handleClose();
            }}>OK</Button>
        </div>
        </Dialog>
    );
}

function TimeTablePage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);
    const { direct } = useParams<{direct:string}>();


    const [selected, setSelected] = useState<TimetableSelected|null>({
        tripID:0,
        stationID:0,
        viewID:1
    });





    useEffect(() => {
        console.log(selected);
    }, [selected]);
    useEffect(() => {

    }, []);
    useKey("ArrowRight",(e)=>{
        let trips:TimeTableTrip[]=[];
        setTrips(prev=>{
            trips=prev;
            return prev;
        })
        setSelected((prev)=>{
            if(prev===null){
                return null;
            }
            const tripIndex=trips.findIndex(item=>item.tripID===prev.tripID);
            const newTrip=trips[tripIndex+1];
            if(newTrip){
                return {tripID:newTrip.tripID,stationID:prev.stationID,viewID:prev.viewID};
            }
            return prev;
        });
        e.preventDefault();

    });
    useKey("ArrowLeft",(e)=>{
        let trips:TimeTableTrip[]=[];
        setTrips(prev=>{
            trips=prev;
            return prev;
        })
        setSelected((prev)=>{
            if(prev===null){
                return null;
            }
            const tripIndex=trips.findIndex(item=>item.tripID===prev.tripID);
            const newTrip=trips[tripIndex-1];
            if(newTrip){
                return {tripID:newTrip.tripID,stationID:prev.stationID,viewID:prev.viewID};
            }
            return prev;
        });
        e.preventDefault();
    });
    useKey("ArrowUp",(e)=>{
        let stations:Station[]=[];
        setStations(prev=>{
            stations=prev;
            return prev;
        })
        setSelected((prev)=>{
            console.log("s",prev);
            if(prev===null){
                return null;
            }
            let stationIndex=stations.findIndex(item=>item.stationID===prev.stationID);
            let viewID=prev.viewID;
            while(true){
                if(viewID==0){
                    stationIndex--;
                    viewID=3;
                }
                viewID--;
                if(stationIndex<0){
                    return prev;
                }
                switch (viewID){
                    case 2:
                        if((stations[stationIndex].style&0x01)>0){
                            return {tripID:prev.tripID,stationID:stations[stationIndex].stationID,viewID};
                        }
                        break;
                    case 0:
                        if((stations[stationIndex].style&0x02)>0){
                            return {tripID:prev.tripID,stationID:stations[stationIndex].stationID,viewID};
                        }
                        break;
                }
            }
            return prev;
        });
        e.preventDefault();

    });

    useKey("ArrowDown",(e)=>{
        if(open){
            return;
        }
        let stations:Station[]=[];
        setStations(prev=>{
            stations=prev;
            return prev;
        })
        setSelected((prev)=>{
            if(prev===null){
                return null;
            }
            let stationIndex=stations.findIndex(item=>item.stationID===prev.stationID);
            let viewID=prev.viewID;
            while(true){
                viewID++;
                if(viewID==3){
                    stationIndex++;
                    viewID=0;
                }
                if(stationIndex>=stations.length){
                    return prev;
                }
                switch (viewID){
                    case 2:
                        if((stations[stationIndex].style&0x01)>0){
                            return {tripID:prev.tripID,stationID:stations[stationIndex].stationID,viewID};
                        }
                        break;
                    case 0:
                        if((stations[stationIndex].style&0x02)>0){
                            return {tripID:prev.tripID,stationID:stations[stationIndex].stationID,viewID};
                        }
                        break;
                }
            }
            return prev;
        });
        e.preventDefault();

    });


    useKey((e)=>{
        if(!!Number(e.key)){
            return true;
        }
        return false;
        },(e)=>{
        if(open){
            return;
        }
        console.log("s");
        e.preventDefault();
    });
    useKey("Enter",(e)=>{
        let open=false;
        setOpen(prev=>{
            open=prev;
            return prev;
        })
        if(open){
            handleClose("");
            e.preventDefault();
        }else{
            console.log("enter");
            handleClickOpen();
            e.preventDefault();

        }
    });



    useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res=>res.json())
            .then((res)=>{
                setTrips(res.trips);
                setStations(res.stations);
            })
        connection.on("UpdateStoptime", (stoptime: StopTime) => {
            console.log("UpdateStoptime",stoptime);
            setTrips(prev=> {
                const tripIndex=prev.findIndex(item=>item.tripID===stoptime.tripID);
                if(tripIndex<0){
                    console.error("tripIndex<0");
                    return prev;
                }
                const stopTimeIndex=prev[tripIndex].stopTimes.findIndex(item=>item.stopTimeID===stoptime.stopTimeID);
                if(stopTimeIndex<0){
                    console.error("stopTimeIndex<0");
                    return prev;
                }
                const next=[...prev];
                next[tripIndex]={...next[tripIndex]};
                next[tripIndex].stopTimes=[...next[tripIndex].stopTimes];
                next[tripIndex].stopTimes[stopTimeIndex]=stoptime;

                return next;
            });
        });


    },[])


    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        setSelectedValue(value);
    };


    return (
        <div className={style.timetableMain}>
            <StationView stations={stations} direct={Number(direct)}/>
            <div className={style.trainListLayout}>
                <div className={style.trainListView}>
                    {trips.map((trip) => {
                        return (
                            <MemoTrainView key={trip.tripID} trip={trip} stations={stations} direct={Number(direct)}  selected={selected?.tripID===trip.tripID?selected:null} setSelected={setSelected}/>
                        )
                    })}
                </div>
            </div>
            <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                stopTime={selected?trips.find(item=>item.tripID===selected.tripID)?.stopTimes.find(item=>item.stationID===selected.stationID)!:null}
                focusIndex={selected?.viewID||0}
            />

        </div>
    );
}

export default TimeTablePage;


export interface TimetableSelected{
    tripID:number;
    stationID:number;
    viewID:number;
}
