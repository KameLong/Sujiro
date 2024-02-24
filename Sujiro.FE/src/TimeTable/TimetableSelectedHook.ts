import {useState} from "react";
import {TimeTableStation, TimeTableTrip} from "./TimeTableData";

export interface TimetableSelected{
    tripID:number;
    stationID:number;
    viewID:number;
}

export default function useTimetableSelected(){
    const [selected, setSelected] = useState<TimetableSelected | null>(null);
    const moveToNextTrip=(trips:TimeTableTrip[])=>{
        if(selected){
            const tripIndex = trips.findIndex(trip=>trip.tripID===selected.tripID);
            if(tripIndex>=0){
                const nextTrip = trips[tripIndex+1];
                if(nextTrip){
                    setSelected({...selected, tripID:nextTrip.tripID});
                }
            }
        }
    }
    const moveToPrevTrip=(trips:TimeTableTrip[])=>{
        if(selected){
            const tripIndex = trips.findIndex(trip=>trip.tripID===selected.tripID);
            if(tripIndex>=0){
                const prevTrip = trips[tripIndex-1];
                if(prevTrip){
                    setSelected({...selected, tripID:prevTrip.tripID});
                }
            }
        }
    }
    const moveToPrevStation=(stations:TimeTableStation[])=>{
            if (selected === null) {
                return;
            }
            let stationIndex = stations.findIndex(item => item.routeStationID === selected.stationID);
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
                            setSelected({...selected,stationID:stations[stationIndex].routeStationID,viewID:viewID});
                            return;
                        }
                        break;
                    case 0:
                        if ((stations[stationIndex].style & 0x02) > 0) {
                            setSelected({...selected,stationID:stations[stationIndex].routeStationID,viewID:viewID});
                            return;
                        }
                        break;
                }
            }
    }
    const moveToNextStation=(stations:TimeTableStation[])=>{
        if (selected === null) {
            return;
        }
        let stationIndex = stations.findIndex(item => item.routeStationID === selected.stationID);
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
                        setSelected({...selected,stationID:stations[stationIndex].routeStationID,viewID:viewID});
                        return;
                    }
                    break;
                case 0:
                    if ((stations[stationIndex].style & 0x02) > 0) {
                        setSelected({...selected,stationID:stations[stationIndex].routeStationID,viewID:viewID});
                        return;
                    }
                    break;
            }
        }

    }


    return {
        selected,
        setSelected,
        moveToNextTrip,
        moveToPrevTrip,
        moveToNextStation,
        moveToPrevStation
    };
}
