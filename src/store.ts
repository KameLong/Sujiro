import {combineReducers, createStore} from 'redux';
import {configureStore, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DiaData, EditDiaData} from "./DiaData/DiaData";
import {O_O} from "@route-builders/oud-operator";
import {OuDiaConverter} from "./OuDiaConverter/OuDiaConverter";
import {TimeTable, TimeTableRoute, TimeTableRouteStation, TimeTableStation} from "./DiaData/TimeTable";
import {sujiroDataSlice, SujiroState} from "./sujiroReducer";
import {Station, StationEdit} from "./DiaData/Station";
import {Route, RouteStation} from "./DiaData/Route";
import {Trip} from "./DiaData/Trip";
import {StationTime} from "./DiaData/StationTime";
import {atom, RecoilState, RecoilValueReadOnly, selector, selectorFamily, SerializableParam} from "recoil";

export const loadSQL=async ():Promise<DiaData>=>{
    const diaData=await EditDiaData.loadSQLite();
    diaData.name="sql";
    return diaData;
}
export const diaDataState = atom({
    key: 'diaData', // unique ID (with respect to other atoms/selectors)
    default: EditDiaData.newDiaData(), // default value (aka initial value)
});

export const tripSelector : (tripID: number) => RecoilValueReadOnly<Trip>= selectorFamily({
    key: 'tripSelector',
    get: tripID => ({ get }) => {
        return get(diaDataState).trips[tripID];
    },
});

export const timetablesSelector:RecoilValueReadOnly<{ [key:number]:TimeTable }>=selector({
    // 一意のキー
    key: 'timetablesSelector',
    get: ({get}) => get(diaDataState).timeTable,

});
export const timetableSelector : (timetableID: number) => RecoilValueReadOnly<TimeTable>= selectorFamily({
    key: 'timetableSelector',
    get: timetableID => ({ get }) => {
        return get(diaDataState).timeTable[timetableID];
    },
});
export const timetableRouteSelector : (timetableRouteID: number) => RecoilValueReadOnly<TimeTableRoute>= selectorFamily({
    key: 'timetableRouteSelector',
    get: timetableID => ({ get }) => {
        return get(diaDataState).timeTableRoute[timetableID];
    },
});

export const timetableRoutesSelector=selector({
    // 一意のキー
    key: 'timetableRouteSelector',
    get: ({get}) => get(diaDataState).timeTableRoute,
});

export const timetableRouteStationSelector : (timetableRouteStationID: number) => RecoilValueReadOnly<TimeTableRouteStation>= selectorFamily({
    key: 'timetableRouteStationSelector',
    get: timetableRouteStationID => ({ get }) => {
        return get(diaDataState).timeTableRouteStation[timetableRouteStationID];
    },
});
export const timetableStationSelector : (timetableStationID: number) => RecoilValueReadOnly<TimeTableStation>= selectorFamily({
    key: 'timetableStationSelector',
    get: timetableStationID => ({ get }) => {
        return get(diaDataState).timeTableStation[timetableStationID];
    },
});
export const stationsSelector:RecoilState<{ [key:number]:Station }>=selector({
    // 一意のキー
    key: 'stationsSelector',
    get: ({get}) => get(diaDataState).stations,
    set: ({ get,set },newValue) => {
        const res=get(diaDataState);
        return set(diaDataState,{...res,stations:newValue as {[p:number]:Station}});
    },

});
export const stationSelector : (stationID: number) => RecoilState<Station>= selectorFamily({
    key: 'stationSelector',
    get: stationID => ({ get }) => {
        return get(diaDataState).stations[stationID];
    },
    set: stationID => ({ get,set },newValue) => {

        const res=get(diaDataState);
        const stations={...res.stations};
        stations[stationID]=newValue as Station;

        return set(diaDataState,{...res,stations:stations});
    },

});
export const routesSelector:RecoilState<{ [key:number]:Route }>=selector({
    // 一意のキー
    key: 'routesSelector',
    get: ({get}) => get(diaDataState).routes,
    set: ({ get,set },newValue) => {
        const res=get(diaDataState);
        return set(diaDataState,{...res,routes:newValue as {[p:number]:Route}});
    },

});
export const routeSelector : (routeID: number) => RecoilState<Route>= selectorFamily({
    key: 'routeSelector',
    get: routeID => ({ get }) => {
        console.log(get(diaDataState).routes);
        return get(diaDataState).routes[routeID];
    },
    set: () => ({ get,set },newValue) => {

        const res=get(diaDataState);
        const routes={...res.routes};
        routes[(newValue as Route).id]=newValue as Route;

        return set(diaDataState,{...res,routes:routes});
    },
});
export const routeStationsSelector=selector({
    // 一意のキー
    key: 'routeStationsSelector',
    get: ({get}) => get(diaDataState).routeStation,
});
export const routeStationSelector : (routeStationID: number) => RecoilState<RouteStation>= selectorFamily({
    key: 'routeStationSelector',
    get: routeStationID => ({ get }) => {
        return get(diaDataState).routeStation[routeStationID];
    },
    set: () => ({ get,set },newValue) => {

        const res=get(diaDataState);
        const routeStations={...res.routeStation};
        const rs=newValue as RouteStation;
        routeStations[rs.id]=rs;

        return set(diaDataState,{...res,routeStation:routeStations});
    },

});

