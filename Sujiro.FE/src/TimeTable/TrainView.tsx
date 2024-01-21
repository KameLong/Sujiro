import React, {Dispatch, SetStateAction, useContext} from "react";
import style from "./TimeTablePage.module.css";
import {Station, StopTime} from "../SujiroData/DiaData";
import {Button, Checkbox, Dialog, DialogTitle, List, ListItem, ListItemButton} from "@mui/material";
import axios from "axios";
import {time2Str, TimeTableTrip} from "./TimeTableData";
import {TimetableSelected} from "./TimeTablePage";
interface TrainViewProps {
    trip:TimeTableTrip;
    stations:Station[]
    direct:number;
    selected:TimetableSelected|null;
    setSelected:Dispatch<SetStateAction<TimetableSelected | null>>;
    onDoubleClick:()=>void;
}
function TrainView({trip,stations,direct,selected,setSelected,onDoubleClick}:TrainViewProps) {
    const [open, setOpen] = React.useState(false);
    const showStations=(direct===0)?stations: [...stations].reverse();

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
    const getDepTimeStr=(station:Station,stopTime:StopTime)=>{
        if(stopTime.stopType===0){
            return "‥";
        }
        if(stopTime.stopType===2){
            return "⇂";
        }
        if(stopTime.stopType===3){
            return "║";
        }
        let time=stopTime.ariTime;
        if(stopTime.depTime>=0){
            time=stopTime.depTime;
        }
        return time2Str(time);

    }
    const getAriTimeStr=(station:Station,stopTime:StopTime)=>{
        if(stopTime.stopType===0){
            return "‥";
        }
        if(stopTime.stopType===2){
            return "⇂";
        }
        if(stopTime.stopType===3){
            return "║";
        }
        let time=stopTime.depTime;
        if(stopTime.ariTime>=0){
            time=stopTime.ariTime;
        }
        return time2Str(time);
    }



    let viewIndex=5;
    console.log("render");

    return (
        <div className={style.trainView} onTouchEndCapture={(e)=>{
            // console.log("touch")
            // handleClickOpen();
            // e.preventDefault();
        }} onClick={(e)=>{
            // handleClickOpen();
            // e.preventDefault();
        }}
             style={{color:trip.trainType.color}}
        >
            <div style={{textAlign:"center"}}>
                <input className={style.checkbox} type={"checkbox"}/>
            </div>
            <div style={{borderBottom: "2px solid #000"}}>
            </div>
            <div className={`${style.timeView2} ${viewIndex===0?style.selected:""}`} onClick={
                    (e)=>{
                        console.log(viewIndex);
                        e.preventDefault();
                }
            }>
                {trip.number}
            </div>
            <div className={`${style.timeView2} ${viewIndex===1?style.selected:""}`}>
                {trip.trainType.shortName}
            </div>
            <div style={{borderBottom: "1px solid #000"}}></div>
            <div className={`${style.trainNameView} ${viewIndex===2?style.selected:""}`}>
            </div>
            {
                showStations.map(station =>

                    <div key={station.stationID}>
                        {
                            (station.style&0x02)>0?
                            <div className={`${style.timeView}  ${(selected?.tripID===trip.tripID&&selected.stationID===station.stationID&&selected.viewID===0)?style.selected:""}`}
                                onClick={(e)=>{
                                    setSelected({
                                        tripID:trip.tripID,
                                        stationID:station.stationID,
                                        viewID:0
                                    });
                                }}
                                 onDoubleClick={(e)=>{
                                        console.log("double click");
                                     onDoubleClick();

                                     e.preventDefault();
                                 }}>
                                {getAriTimeStr(station, getStopTime(station.stationID))}
                            </div>:null
                        }
                        {
                            (station.style & 0x03) == 3 ?
                                <div style={{borderBottom: "1px solid #000"}}></div>
                                : null
                        }

                        {
                            (station.style&0x01)>0?
                                <div className={`${style.timeView}  ${(selected?.tripID===trip.tripID&&selected.stationID===station.stationID&&selected.viewID===2)?style.selected:""}`}
                                     onClick={(e)=>{
                                         setSelected({
                                             tripID:trip.tripID,
                                             stationID:station.stationID,
                                             viewID:2
                                         });
                                     }}
                                     onDoubleClick={(e)=>{
                                         console.log("double click");
                                         onDoubleClick();
                                         e.preventDefault();
                                     }}>

                                    {getDepTimeStr(station, getStopTime(station.stationID))}
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