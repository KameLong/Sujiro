import {
    Divider,
} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {Company, Route, RouteStation, Station} from "../SujiroData/DiaData";
import {auth} from "../firebase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {TreeItem, TreeView} from "@mui/x-tree-view";
import style from "../App.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useNavigate, useParams} from "react-router-dom";
import {axiosClient} from "../Hooks/AxiosHook";
export interface MenuPageProps {
}
export default function MenuPage({}:MenuPageProps) {
    const {companyID} = useParams<{ companyID: string }>();
    const {routeID} = useParams<{ routeID: string }>();
    const [routes,setRoutes] = useState<Route[]>([]);
    const [company,setCompany] = useState<Company|undefined>();
    console.log(companyID,routeID);
    const navigate = useNavigate();

    const loadMenuDataFromServer=async()=>{
        if(companyID===undefined){
            return;
        }
        axiosClient.get(`/api/MenuPage/company/${companyID}?timestamp=${new Date().getTime()}`
        ).then(res => {
            console.log(res.data);
            if(res.data.routes){
                setRoutes(res.data.routes);
            }
            if(res.data.company){
                setCompany(res.data.company);
            }
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
                <Typography variant="h6" noWrap component="div" onClick={()=>{
                    window.location.href=`/Company/${companyID}`
                }}>
                    {company?.name??"Loading"}
                </Typography>

            </Toolbar>
            <Divider/>
            <TreeView defaultExpanded={[routeID?.toString()??""]}
                      aria-label="file system navigator"
                      className={style.nav}
                      defaultCollapseIcon={<ExpandMoreIcon/>}
                      defaultExpandIcon={<ChevronRightIcon/>}
            >
                <TreeItem nodeId={"100"} label={"種別"} onClick={e => {
                    navigate(`/TrainType/${companyID}`);
                }
                }/>
                {
                    routes.map((route) => {
                        return (
                            <TreeItem key={route.routeID} nodeId={route.routeID.toString()} label={route.name}>
                                <TreeItem nodeId={route.routeID+"0"} label="駅一覧" onClick={e => {
                                    navigate(`/route/${companyID}/${route.routeID}`);
                                }}/>
                                <TreeItem nodeId={route.routeID+"1"} label="下り時刻表" onClick={e => {
                                    navigate(`/TimeTable/${companyID}/${route.routeID}/0`);
                                }}/>
                                <TreeItem nodeId={route.routeID+"2"} label="上り時刻表" onClick={e => {
                                    navigate(`/TimeTable/${companyID}/${route.routeID}/1`);
                                }}/>
                                <TreeItem nodeId={route.routeID+"3"} label="ダイヤグラム"
                                          onClick={e => {
                                              navigate(`/Diagram/${companyID}/${route.routeID}`);
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




