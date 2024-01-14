import React, {useEffect, useState} from 'react';
import style from './TimeTablePage.module.css';
import * as signalR from "@microsoft/signalr";
import StationView from "./StationView";
import TrainView from "./TrainView";
import {Station} from "../SujiroData/DiaData";
import {TimeTableTrip} from "./TimeTableData";
import {useParams} from "react-router-dom";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_SERVER_URL}/chatHub`)
    .build();
connection.start().catch((err) => console.error(err));


function TimeTablePage() {
    const [stations, setStations] = useState<Station[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);

    const [selectTrip, setSelectTrip] = useState<number | null>(null);
    const [selectStation, setSelectStation] = useState<number | null>(null);

    const { direct } = useParams<{direct:string}>();

    useEffect(()=>{
        console.log("load");
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res=>res.json())
            .then((res)=>{
                setTrips(res.trips);
                setStations(res.stations);
            })
        connection.on("DeleteTrip", (tripID: number) => {
            console.log("DeleteTrip "+tripID);
            setTrips((prev)=>prev.filter(item=>item.tripID!==tripID));
        });

    },[])


    return (
        <div className={style.timetableMain}>
            <StationView stations={stations} direct={Number(direct)}/>
            <div className={style.trainListLayout}>
                <div className={style.trainListView}>
                    {trips.map((trip) => {
                        return (
                            <TrainView key={trip.tripID} trip={trip} stations={stations} direct={Number(direct)} signalR={connection}/>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}

export default TimeTablePage;
