import {useEffect, useState} from "react";
import {Station, Train} from "../SujiroData/DiaData";

export interface TimetableSelected{
    tripID:number;
    stationID:number;
    viewID:number;
}

export default function useTimetableSelected(){
    const [selected, setSelected] = useState<TimetableSelected | null>(null);

    //checkBoxがONの列車のリスト　trainIDを書き込む
    const [trainChecked,setTrainChecked]=useState<number[]>([])

    useEffect(()=>{
        setTrainChecked((prev)=>{
            if(selected?.tripID){
                return [selected.tripID]
            }
            return prev
        })
    },[selected])
    const moveToNextTrip=(trips:Train[])=>{
        if(selected){
            const tripIndex = trips.findIndex(trip=>trip.trainID===selected.tripID);
            if(tripIndex>=0){
                const nextTrip = trips[tripIndex+1];
                if(nextTrip){
                    setSelected({...selected, tripID:nextTrip.trainID});
                }
            }
        }
    }
    const moveToPrevTrip=(trips:Train[])=>{
        if(selected){
            const tripIndex = trips.findIndex(trip=>trip.trainID===selected.tripID);
            if(tripIndex>=0){
                const prevTrip = trips[tripIndex-1];
                if(prevTrip){
                    setSelected({...selected, tripID:prevTrip.trainID});
                }
            }
        }
    }
    const moveToPrevStation=(stations:Station[])=>{
            if (selected === null) {
                return;
            }
            let stationIndex = stations.findIndex(item => item.id === selected.stationID);
            let viewID = selected.viewID;
            while (true) {
                if (viewID === 0) {
                    stationIndex--;
                    viewID = 3;
                }
                viewID--;
                if (stationIndex < 0) {
                    return;
                }
                switch (viewID) {
                    case 2:
                        if ((stations[stationIndex].style & 0x01) > 0) {
                            setSelected({...selected,stationID:stations[stationIndex].id,viewID:viewID});
                            return;
                        }
                        break;
                    case 0:
                        if ((stations[stationIndex].style & 0x02) > 0) {
                            setSelected({...selected,stationID:stations[stationIndex].id,viewID:viewID});
                            return;
                        }
                        break;
                }
            }
    }
    const moveToNextStation=(stations:Station[])=>{
        if (selected === null) {
            return;
        }
        let stationIndex = stations.findIndex(item => item.id === selected.stationID);
        let viewID = selected.viewID;
        while (true) {
            if (viewID === 2) {
                stationIndex++;
                viewID = -1;
            }
            viewID++;
            if (stationIndex >= stations.length) {
                return;
            }
            switch (viewID) {
                case 2:
                    if ((stations[stationIndex].style & 0x01) > 0) {
                        setSelected({...selected,stationID:stations[stationIndex].id,viewID:viewID});
                        return;
                    }
                    break;
                case 0:
                    if ((stations[stationIndex].style & 0x02) > 0) {
                        setSelected({...selected,stationID:stations[stationIndex].id,viewID:viewID});
                        return;
                    }
                    break;
            }
        }

    }


    return {
        selected,
        trainChecked,
        setSelected,
        setTrainChecked,
        moveToNextTrip,
        moveToPrevTrip,
        moveToNextStation,
        moveToPrevStation
    };
}
