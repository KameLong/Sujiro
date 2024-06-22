import React, {Dispatch, SetStateAction} from "react";
import style from "./TimeTablePage.module.css";
import {Station, StopTime, Train, TrainType} from "../SujiroData/DiaData";
import {Button, Dialog, DialogTitle, List, ListItem} from "@mui/material";
import {time2Str} from "./TimeTableData";
import {axiosClient} from "../Hooks/AxiosHook";
import {TimetableSelected} from "./TimetableSelectedHook";
interface TrainViewProps {
    trip:Train;
    stations:Station[]
    trainType:TrainType,
    direct:number;
    selected:TimetableSelected|null;
    setSelected:Dispatch<SetStateAction<TimetableSelected | null>>|null;

    onDoubleClick:()=>void;
    trainChecked:number[];
    changeTrainChecked:(trainID:number,checked:boolean)=>void;
}
function TrainView({trip,trainType,stations,direct,selected,setSelected,onDoubleClick,trainChecked,changeTrainChecked}:TrainViewProps) {
    const [open, setOpen] = React.useState(false);
    const showStations=(direct===0)?stations: [...stations].reverse();

    const handleClose = (value: string) => {
        setOpen(false);
        console.log(trip.trainID);
        switch (value) {
            case "edit":
                break;
            case "delete":
                break;
            default:
                break;
        }
    };
    const getDepTimeStr=(station:Station,stopTimes:StopTime[],stations:Station[])=>{
        const index=stations.findIndex(item=>item.id===station.id);
        const stopTime=stopTimes.find(item=>item.stationID===station.id);
        if(stopTime===undefined){
            return "e";
        }
        if((station.style& 0x03)===3){
            //発着の時
            if(index+1<stopTimes.length){
                const nextStopTime=stopTimes.find(item=>item.stationID===stations[index+1].id);
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
    const getAriTimeStr=(station:Station,stopTimes:StopTime[],stations:Station[])=>{
        const index=stations.findIndex(item=>item.id===station.id);
        const stopTime=stopTimes.find(item=>item.stationID===station.id);
        if(stopTime===undefined){
            return "e";
        }
        if((station.style& 0x03)===3) {
            if (index- 1 >= 0) {
                const befStopTime = stopTimes.find(item=>item.stationID===stations[index-1].id);
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
    // console.log("render");

    return (
        <div className={style.trainView} onTouchEndCapture={(e)=>{
            // console.log("touch")
            // handleClickOpen();
            // e.preventDefault();
        }} onClick={(e)=>{
            // handleClickOpen();
            // e.preventDefault();
        }}
             style={{color:trainType.color,borderTop:'1px solid black'}}
        >
            <div style={{textAlign:"center"}}>
                <input className={style.checkbox} type={"checkbox"} checked={trainChecked.includes(trip.trainID)}
                    onChange={(e)=>{
                        changeTrainChecked(trip.trainID,e.target.checked);
                    }}/>
            </div>
            <div style={{borderBottom: "2px solid #000"}}>
            </div>
            <div className={`${style.timeView2} ${viewIndex===1?style.selected:""}`}>
                {trainType.shortName}
            </div>
            <div className={`${style.trainNameView} ${viewIndex === 2 ? style.selected : ""}`}>
                <div style={{ marginLeft: 'auto',
                    marginRight: 'auto'}}>{trip.name}</div>
            </div>
            {
                showStations.map(station =>

                    <div key={station.id}>
                        {
                            (station.style&0x02)>0?
                            <div className={`${style.timeView}  ${(selected?.tripID===trip.trainID&&selected.stationID===station.id&&selected.viewID===0)?style.selected:""}`}
                                onClick={(e)=>{
                                    if(setSelected){
                                        setSelected({
                                            tripID:trip.trainID,
                                            stationID:station.id,
                                            viewID:0
                                        });
                                    }
                                }}
                                 onDoubleClick={(e)=>{
                                        console.log("double click");
                                     onDoubleClick();

                                     e.preventDefault();
                                 }}>
                                {getAriTimeStr(station, trip.times,showStations)}
                            </div>:null
                        }
                        {
                            (station.style & 0x03) === 3 ?
                                <div style={{borderBottom: "1px solid #000"}}></div>
                                : null
                        }

                        {
                            (station.style&0x01)>0?
                                <div className={`${style.timeView}  ${(selected?.tripID===trip.trainID&&selected.stationID===station.id&&selected.viewID===2)?style.selected:""}`}
                                     onClick={(e)=>{
                                         if(setSelected) {
                                             setSelected({
                                                 tripID: trip.trainID,
                                                 stationID: station.id,
                                                 viewID: 2
                                             });
                                         }
                                     }}
                                     onDoubleClick={(e)=>{
                                         console.log("double click");
                                         onDoubleClick();
                                         e.preventDefault();
                                     }}>

                                    {getDepTimeStr(station,trip.times,showStations)}
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