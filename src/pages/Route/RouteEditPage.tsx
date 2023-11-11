import React, {useState} from "react";
import {
    IonButton,
    IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox,
    IonContent, IonGrid,
    IonHeader,
    IonInput,
    IonItem, IonLabel, IonList,
    IonPage, IonRow,
    IonTitle,
    IonToolbar, useIonModal
} from "@ionic/react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    routeSelector,
    routeStationSelector,
    routeStationsSelector,
    stationSelector,
    stationsSelector
} from "../../store";
import {StationEdit} from "../../DiaData/Station";
import {useKey} from "react-use";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {EditRoute, EditRouteStation, RouteStation} from "../../DiaData/Route";
import {EditStationPage} from "../StationEdit/EditStationPage";
import {StationSelectorPage} from "../StationEdit/StationSelectorPage";
import {SujiroSearchList} from "../../components/SujiroSearchList";
import {SujiroList} from "../../components/SujiroList";
import {useLocation} from "react-router";

interface EditRoutePageProps{
}

export const EditRoutePage: React.FC<EditRoutePageProps> = ():JSX.Element => {
    const searchParams = new URLSearchParams(useLocation().search);
    const routeID = Number(searchParams.get("route"));

    console.log(routeID);
    const [route,setRoute]=useState(useRecoilValue(routeSelector(routeID))??EditRoute.newRoute());
    console.log(route);

    const routeStations=useRecoilValue(routeStationsSelector);
    const setRouteStation=useSetRecoilState(routeStationSelector(0));
    const stations=useRecoilValue(stationsSelector);

    const routeStation=route.routeStationIDs.map(rsID=>routeStations[rsID]);
    console.log(route);
    console.log(routeStation);

    useKeyAlt("Insert",(e)=>{console.log(e),e.preventDefault()});



    // const [_,sendRoute]=useRecoilState(routeSelector(routeID));

    // const [editRSIndex,setEditRSIndex]=useState(-1);




    const [present, dismiss] = useIonModal(StationSelectorPage, {
        onStationSelected:(stationID:number)=>{
            dismiss();
            const rs=EditRouteStation.newRouteStation(routeID,stationID);
            setRouteStation(rs);
            setRoute(old=>{
                const routeStations=[...old.routeStationIDs];
                // if(editRSIndex===-1){
                //     routeStations.push(rs.id);
                // }
                return {...old,routeStationIDs:routeStations};
            })
            console.log(stationID);

        },
    });



    const commitRoute=()=>{
        if(route.id>=0){
            // sendRoute(route);
        }
    }

    const selectStation=()=>{
        present();

    }
    useKeyAlt("Enter",(e) =>{
        commitRoute();
    });

    return(
        <IonContent className="ion-padding">
    <IonList>
        <IonItem>
            <IonInput  labelPlacement="stacked" label="路線名" placeholder="新規路線" value={route.name}
    onIonInput={(e)=>setRoute(old=>{
        return{...old,name:(e.target).value as string}})}
    />
    </IonItem>
        <IonCard>
            <IonCardHeader>
                <IonCardSubtitle>駅リスト</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <SujiroList
                    renderRow={(rs:RouteStation)=>(
                                        <div style={{flexGrow:"1"}} >
                                            {stations[rs.stationID].name}
                                        </div>
)
                    }
                    itemList={routeStation}
                />

            </IonCardContent>
        </IonCard>
    </IonList>
    </IonContent>
)
}
