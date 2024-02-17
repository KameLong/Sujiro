import React, {Dispatch, SetStateAction} from "react";
import style from "./TimeTablePage.module.css";
import {Route, RouteStation, Station, StopTime} from "../SujiroData/DiaData";
import {Button, Dialog, DialogTitle, List, ListItem} from "@mui/material";
import {time2Str, TimeTableStation, TimeTableTrip} from "./TimeTableData";
import {TimetableSelected} from "./TimeTablePage";
import {axiosClient} from "../Common/AxiosHook";
interface TrainViewProps {
    trip:TimeTableTrip;
    stations:TimeTableStation[]
    direct:number;
    selected:TimetableSelected|null;
    setSelected:Dispatch<SetStateAction<TimetableSelected | null>>|null;

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
                axiosClient.delete(`/api/trip/${trip.tripID}`).catch(err=>{});
                break;
            default:
                break;
        }
    };
    const getDepTimeStr=(station:TimeTableStation,stopTimes:StopTime[],stations:TimeTableStation[])=>{
        const index=stations.findIndex(item=>item.routeStationID===station.routeStationID);
        const stopTime=stopTimes.find(item=>item.routeStationID===station.routeStationID);
        if(stopTime===undefined){
            return "e";
        }
        if((station.style& 0x03)===3){
            //発着の時
            if(index+1<stopTimes.length){
                const nextStopTime=stopTimes.find(item=>item.routeStationID===stations[index+1].routeStationID);
                if(nextStopTime!==undefined){
                    if(nextStopTime.stopType===0){
                        return "‥";
                    }
                    if(nextStopTime.stopType===3){
                        return "║";
                    }
                }
            }
        }

        if(stopTime.stopType===0){
            // if((station.style&0x03)===1){
            //     return "┄"
            // }
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
    const getAriTimeStr=(station:TimeTableStation,stopTimes:StopTime[],stations:TimeTableStation[])=>{
        const index=stations.findIndex(item=>item.routeStationID===station.routeStationID);
        const stopTime=stopTimes.find(item=>item.routeStationID===station.routeStationID);
        if(stopTime===undefined){
            return "e";
        }
        if((station.style& 0x03)===3) {
            if (index- 1 >= 0) {
                const befStopTime = stopTimes.find(item=>item.routeStationID===stations[index-1].routeStationID);
                if(befStopTime!==undefined){
                    if (befStopTime.stopType === 0) {
                        return "‥";
                    }
                    if (befStopTime.stopType === 3) {
                        return "║";
                    }
                }
            }
        }


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

                    <div key={station.routeStationID}>
                        {
                            (station.style&0x02)>0?
                            <div className={`${style.timeView}  ${(selected?.tripID===trip.tripID&&selected.stationID===station.routeStationID&&selected.viewID===0)?style.selected:""}`}
                                onClick={(e)=>{
                                    if(setSelected){
                                        setSelected({
                                            tripID:trip.tripID,
                                            stationID:station.routeStationID,
                                            viewID:0
                                        });
                                    }
                                }}
                                 onDoubleClick={(e)=>{
                                        console.log("double click");
                                     onDoubleClick();

                                     e.preventDefault();
                                 }}>
                                {getAriTimeStr(station, trip.stopTimes,showStations)}
                            </div>:null
                        }
                        {
                            (station.style & 0x03) === 3 ?
                                <div style={{borderBottom: "1px solid #000"}}></div>
                                : null
                        }

                        {
                            (station.style&0x01)>0?
                                <div className={`${style.timeView}  ${(selected?.tripID===trip.tripID&&selected.stationID===station.routeStationID&&selected.viewID===2)?style.selected:""}`}
                                     onClick={(e)=>{
                                         if(setSelected) {
                                             setSelected({
                                                 tripID: trip.tripID,
                                                 stationID: station.routeStationID,
                                                 viewID: 2
                                             });
                                         }
                                     }}
                                     onDoubleClick={(e)=>{
                                         console.log("double click");
                                         onDoubleClick();
                                         e.preventDefault();
                                     }}>

                                    {getDepTimeStr(station,trip.stopTimes,showStations)}
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