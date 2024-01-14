import React, {memo, useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import * as signalR from "@microsoft/signalr";
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station} from "../SujiroData/DiaData";
import {TimeTableTrip} from "./TimeTableData";
import {useParams} from "react-router-dom";
import {useKey} from 'react-use';



const MemoTrainView = memo(TrainView);

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



    useEffect(()=>{
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res=>res.json())
            .then((res)=>{
                setTrips(res.trips);
                setStations(res.stations);
            })

    },[])


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

        </div>
    );
}

export default TimeTablePage;


export interface TimetableSelected{
    tripID:number;
    stationID:number;
    viewID:number;
}
