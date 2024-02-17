import {
    Divider,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {Route, RouteStation, Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {TreeItem, TreeView} from "@mui/x-tree-view";
import style from "../App.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useParams} from "react-router-dom";
import {axiosClient} from "../Common/AxiosHook";
export interface MenuPageProps {
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




