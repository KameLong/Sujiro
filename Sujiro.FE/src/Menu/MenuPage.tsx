import {
    Backdrop,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Fab,
    List,
    ListItem,
    TextField
} from "@mui/material";
import {Add, Home} from "@mui/icons-material";
import Box from "@mui/material/Box";
import React, {useContext, useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {Route, RouteStation, Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import { GiRailway } from "react-icons/gi";
import {useRequiredParams} from "../Hooks/useRequiredParams";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {TreeItem, TreeView} from "@mui/x-tree-view";
import style from "../App.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useParams} from "react-router-dom";
import {axiosClient} from "../Common/AxiosHook";
export interface MenuPageProps {
    // companyID:string|undefined
}
export default function MenuPage({}:MenuPageProps) {
    const {companyID} = useParams<{ companyID: string }>();
    const {routeID} = useParams<{ routeID: string }>();
    const [routes,setRoutes] = useState<Route[]>([]);
    console.log(companyID,routeID);

    const loadMenuDataFromServer=async()=>{
        if(companyID===undefined){
            return;
        }
        console.log(companyID);
        axiosClient.get(`/api/MenuPage/company/${companyID}?timestamp=${new Date().getTime()}`
        ).then(res => {
            setRoutes(res.data);
        }).catch(err=>{});
    }

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            await loadMenuDataFromServer();
        });
    },[]);

    return (
        <div >
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    MENU
                </Typography>

            </Toolbar>
            <Divider/>
            <TreeView defaultExpanded={[routeID?.toString()??""]}
                      aria-label="file system navigator"
                      className={style.nav}
                      defaultCollapseIcon={<ExpandMoreIcon/>}
                      defaultExpandIcon={<ChevronRightIcon/>}
            >
                {
                    routes.map((route) => {
                        return (
                            <TreeItem key={route.routeID} nodeId={route.routeID.toString()} label={route.name}>
                                <TreeItem nodeId="111" label="下り時刻表" onClick={e => {
                                    window.location.href = `/TimeTable/${companyID}/${route.routeID}/0`
                                }}/>
                                <TreeItem nodeId="112" label="上り時刻表" onClick={e => {
                                    window.location.href = `/TimeTable/${companyID}/${route.routeID}/1`
                                }}/>
                                <TreeItem nodeId="113" label="ダイヤグラム"
                                          onClick={e => {
                                              window.location.href = `/Diagram/${companyID}/${route.routeID}`
                                          }}
                                />
                            </TreeItem>
                        )
                    })
                }

                <TreeItem style={{marginTop: '10px'}} nodeId={"200"} label={"LICENSE"}
                          onClick={e => {
                              window.location.href = "/License"
                          }}
                />
            </TreeView>

        </div>
    )
}

interface StationSelectorProps {
    stations: Station[];
    onSelectStation: (station: Station) => void;
}

function StationSelector({stations, onSelectStation}: StationSelectorProps) {
    return (
        <DialogContent>
            <List>
                {stations.map((station) => {
                    return (<ListItem onClick={async () => {
                        onSelectStation(station);
                    }}>{station.name}</ListItem>)
                })}
            </List>

        </DialogContent>
    )
}


interface RouteEditProps {
    close: () => void;
    route: Route | undefined;
    companyID: string | undefined
}

function RouteEdit({close, route, companyID}: RouteEditProps) {
    const [routeName, setRouteName] = useState(route?.name ?? "");

    if (route === undefined) {
        return (<div/>);
    }

    return (
        <div>
            <DialogTitle>{"路線名を編集"}</DialogTitle>

            <DialogContent>
                <TextField fullWidth={true} label={"路線名"} required={true} value={routeName}
                           onChange={e => setRouteName(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={async () => {
                    if (routeName.length > 0) {

                        const route2 = {...route};
                        route2.name = routeName;
                        await axiosClient.put(`/api/route/${companyID}`, route2);
                        close();
                    }
                }}>決定</Button>
            </DialogActions>
        </div>
    )
}


interface EditRoute extends Route{
    routeStations:RouteStation[]
}