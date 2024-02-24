import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    TextField
} from "@mui/material";
import {Home} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {Route, RouteStation, Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";
import {axiosClient} from "../Hooks/AxiosHook";
export interface RoutePageProps {
}
export default function RoutePage({}:RoutePageProps) {
    const {companyID} = useRequiredParamsHook<{ companyID: string }>();
    const {routeID} = useRequiredParamsHook<{ routeID: string }>();

    const [route,setRoute]=useState<EditRoute|undefined>(undefined);
    const [stations,setStations]=useState<Station[]>([]);
    const [openInsertStationDialog,setOpenInsertStationDialog]=useState(false);
    const [openChangeStationDialog,setOpenChangeStationDialog]=useState(false);
    const [openSelectStationDialog,setOpenSelectStationDialog]=useState(false);
    const [insertRouteStation,setInsertRouteStation]=useState<RouteStation|undefined>(undefined);

    const [loading,setLoading]=useState(true);
    const [isLogout,setIsLogout]=useState(false);

    const loadRouteFromServer=async()=>{
        axiosClient.get(`/api/RouteEditPage/${companyID}/${routeID}?timestamp=${new Date().getTime()}`
        ).then(res => {
            setRoute(res.data);
        }).catch(err=>{});
    }
    const loadStationFromServer=async()=>{
        axiosClient.get(`/api/station/${companyID}?timestamp=${new Date().getTime()}`,
        ).then(res => {
            setStations(res.data);
        }).catch(err=>{});
    }
    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const loadRoute=loadRouteFromServer();
                const loadStation=loadStationFromServer();
                await Promise.all([loadRoute,loadStation]);
                setLoading(false);
            }else{
                setIsLogout(true);
            }
        });
    },[]);
    const setRouteName=(name:string)=>{
        if(route!==undefined){
            setRoute((route)=>{return {...(route as EditRoute),name:name}})
        }
    }

    if(route===undefined){
        return (<></>
        );
    }
    const appendStation=(routeStation:RouteStation|undefined)=>{
        setInsertRouteStation(routeStation);
        setOpenInsertStationDialog(true);

    }

    return (
        <>
            <TextField fullWidth={true} label={"路線名"}  value={route.name} onChange={e=>setRouteName(e.target.value)}/>
    <List style={{maxHeight: '100%', overflow: 'auto'}}>
    <Divider  component="li" />
        {route.routeStations.map((routeStation) => {
                return (<div key={routeStation.routeStationID}><ListItem onClick={()=>{
                    setInsertRouteStation(routeStation);
                    setOpenSelectStationDialog(true);
                }}><Home /><span>{stations.find(station=>station.stationID===routeStation.stationID)?.name}</span>
                </ListItem><Divider  component="li" />
                </div>)
            })}
        <Button onClick={()=>appendStation(undefined)}>新規追加</Button>

    </List>

    <Dialog open={openInsertStationDialog}　onClose={()=>{setOpenInsertStationDialog(false)}}>
    <DialogTitle>追加する駅を選択</DialogTitle>
    <StationSelector stations={stations} onSelectStation={async (station:Station)=>{
        console.log(station);
        setOpenInsertStationDialog(false);
        const token = await getAuth().currentUser?.getIdToken();

        axiosClient.put(`/api/RouteEditPage/insert/${companyID}/${routeID}`,{stationID:station.stationID,routeStationID:insertRouteStation?.routeStationID})
            .then(res=>{
                loadRouteFromServer();
            }).catch(err=>{});
    }}/>
    </Dialog>
    <Dialog open={openChangeStationDialog}　onClose={()=>{setOpenChangeStationDialog(false)}}>
    <DialogTitle>変更する駅を選択</DialogTitle>
    <StationSelector stations={stations} onSelectStation={async (station:Station)=>{
        console.log(station);
        setOpenChangeStationDialog(false);
        const token = await getAuth().currentUser?.getIdToken();
        if(insertRouteStation===undefined) {
            console.error("おかしい");
            return;
        }
        const routeStation={...insertRouteStation,stationID:station.stationID};
        axiosClient.put(`/api/RouteStation/${companyID}`, routeStation)
            .then(res=>{
                loadRouteFromServer();
            }).catch(err=>{});
    }}/>
    </Dialog>
    <Dialog open={openSelectStationDialog} onClose={()=>{setOpenSelectStationDialog(false);}}>
    <List>
        <ListItem>
            <Button onClick={()=>{
        console.log(insertRouteStation);
        appendStation(insertRouteStation);

        setOpenSelectStationDialog(false);
    }}>駅を挿入する</Button>
    </ListItem>
    <ListItem>
    <Button onClick={()=>{
        setOpenChangeStationDialog(true);

        setOpenSelectStationDialog(false);
    }}>駅を変更する</Button>
    </ListItem>
    <ListItem>
    <Button onClick={async ()=>{
        setLoading(true);
        axiosClient.delete(`/api/RouteStation/${companyID}/${insertRouteStation?.routeStationID}`)
            .then(res=>{
                return loadRouteFromServer();
            })
            .then(res=>{
                setOpenSelectStationDialog(false);
                setLoading(false);
            })
            .catch(err=>{});
    }}>駅を削除する</Button>
    </ListItem>
    </List>

    </Dialog>
    </>
)
}

interface StationSelectorProps {
    stations:Station[];
    onSelectStation:(station:Station)=>void;
}
function StationSelector({stations,onSelectStation}:StationSelectorProps){
    return(
        <DialogContent>
            <List>
                {stations.map((station)=>{
                        return (<ListItem key={station.stationID} onClick={async()=>{
                            onSelectStation(station);
                        }}>{station.name}</ListItem>)
                    })}
        </List>

        </DialogContent>
    )
}


interface RouteEditProps {
    close:()=>void;
    route:Route|undefined;
    companyID:string|undefined
}

function RouteEdit({close,route,companyID}:RouteEditProps){
    const [routeName,setRouteName]=useState(route?.name??"");

    if(route===undefined) {
        return(<div/>);
    }

    return (
        <div>
            <DialogTitle>{"路線名を編集"}</DialogTitle>

        <DialogContent>
        <TextField fullWidth={true} label={"路線名"} required={true} value={routeName} onChange={e=>setRouteName(e.target.value)}/>
    </DialogContent>
    <DialogActions>
    <Button  onClick={async() => {
        if(routeName.length>0) {

            const route2={...route};
            route2.name=routeName;
            axiosClient.put(`/api/route/${companyID}`, route2)
                .then(res=>{
                    close();
                }).catch(err=>{});
        }
    }}>決定</Button>
    </DialogActions>
    </div>
)
}


interface EditRoute extends Route{
    routeStations:RouteStation[]
}