import React from "react";
import style from "./TimeTablePage.module.css";
import {Station, StopTime, TimeTableTrip, Trip} from "./DiaData";
import {Button, Checkbox, Dialog, DialogTitle, List, ListItem, ListItemButton} from "@mui/material";
import axios from "axios";
interface TrainViewProps {
    trip:TimeTableTrip;
    stations:Station[]
    signalR:signalR.HubConnection;
}
function TrainView({trip,stations,signalR}:TrainViewProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedTrip, setSelectedTrip] = React.useState<number>(-1);

    const handleClickOpen = () => {
        setOpen(!open);
    };

    const handleClose = (value: string) => {
        setOpen(false);
        console.log(trip.tripID);
        switch (value) {
            case "edit":
                console.log("edit");
                break;
            case "delete":
                axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/trip/${trip.tripID}`);
                break;
            default:
                break;
        }
    };

    const getStopTime = (stationID:number)=>{
        return trip.stopTimes.filter(item=>item.stationID===stationID)[0];
    }
    const getTimeStr=(station:Station,stopTime:StopTime)=>{
        if(stopTime.stopType==0){
            return "‥";
        }
        if(stopTime.stopType==2){
            return "⇂";
        }
        if(stopTime.stopType==3){
            return "║";
        }
        let time=stopTime.ariTime;
        if(stopTime.depTime>=0){
            time=stopTime.depTime;
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

    return (
        <div className={style.trainView} onTouchEndCapture={(e)=>{
            // console.log("touch")
            // handleClickOpen();
            // e.preventDefault();
        }} onClick={(e)=>{
            // handleClickOpen();
            // e.preventDefault();
        }}
             style={{color:trip.tripColor}}
        >
            <div style={{textAlign:"center"}}>
                <input className={style.checkbox} type={"checkbox"}/>
            </div>
            <div style={{borderBottom: "2px solid #000"}}>
            </div>
            <div className={style.timeView2}>
                {trip.number}
            </div>
            <div className={style.timeView2}>
                {trip.trainTypeShortName}
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={style.trainNameView}>
            </div>
            {
                stations.map(station =>
                    <div key={station.stationID}>
                        {
                            (station.style&0x02)>0?
                            <div className={style.timeView}>
                                {getTimeStr(station, getStopTime(station.stationID))}
                            </div>:null
                        }
                        {
                            (station.style & 0x03) == 3 ?
                                <div style={{borderBottom: "1px solid #000"}}></div>
                                : null
                        }

                        {
                            (station.style&0x01)>0?
                                <div className={style.timeView}>
                                    {getTimeStr(station, getStopTime(station.stationID))}
                                </div>:null
                        }
                    </div>
                )
            }
            <div style={{borderBottom: "2px solid #000"}}></div>
            <SimpleDialog
                open={open}
                onClose={handleClose}
            />
        </div>
    );
}


export interface SimpleDialogProps {
    open: boolean;
    // selectedValue: string;
    onClose: (value: string) => void;
}
function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
        onClose("none");
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>列車選択</DialogTitle>
            <List sx={{ pt: 0 }}>
                    <ListItem disableGutters key={"edit"}>
                        <Button style={{width:'100%'}}onClick={() => handleListItemClick("edit")}>編集</Button>
                    </ListItem>
                <ListItem disableGutters key={"delete"}>
                    <Button style={{width:'100%'}} onClick={() => handleListItemClick("delete")}>削除</Button>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default TrainView;