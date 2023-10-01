import React, {useState} from "react";
import {
    IonButton,
    IonButtons, IonCard, IonCheckbox,
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
import {EditRoute, EditRouteStation} from "../../DiaData/Route";
import {EditStationPage} from "../StationEdit/EditStationPage";
import {StationSelectorPage} from "../StationEdit/StationSelectorPage";

interface EditRoutePageProps{
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
    title:string,
    routeID:number
}

export const EditRoutePage: React.FC<EditRoutePageProps> = ({onDismiss,title,routeID}):JSX.Element => {
    const [route,setRoute]=useState(useRecoilValue(routeSelector(routeID))??EditRoute.newRoute());
    const [_,sendRoute]=useRecoilState(routeSelector(routeID));

    const [editRSIndex,setEditRSIndex]=useState(-1);


    const routeStations=useRecoilValue(routeStationsSelector);
    const setRouteStation=useSetRecoilState(routeStationSelector(0));
    const stations=useRecoilValue(stationsSelector);


    const [present, dismiss] = useIonModal(StationSelectorPage, {
        onStationSelected:(stationID:number)=>{
            dismiss();
            const rs=EditRouteStation.newRouteStation(routeID,stationID);
            setRouteStation(rs);
            setRoute(old=>{
                const routeStations=[...old.routeStationIDs];
                if(editRSIndex===-1){
                    routeStations.push(rs.routeID);
                }
                return {...old,routeStationIDs:routeStations};
            })
            console.log(stationID);

        },
    });



    const commitRoute=()=>{
        sendRoute(route);

    }

    const selectStation=()=>{
        present();

    }
    useKeyAlt("Enter",(e) =>{
        commitRoute();
        onDismiss();
    });

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
        <IonButton onClick={() => onDismiss()} color="medium" >
        Cancel
        </IonButton>
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
    <IonButton onClick={() => {
        commitRoute();
        onDismiss();
    }}
    strong={true}>
        決定
        </IonButton>
        </IonButtons>
        </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
    <IonList>
        <IonItem>
            <IonInput  labelPlacement="stacked" label="路線名" placeholder="新規路線" value={route.name}
    onIonInput={(e)=>setRoute(old=>{
        return{...old,name:(e.target).value as string}})}
    />
    </IonItem>
        <IonCard>
            <IonList>
                {
                    route.routeStationIDs.map(rsID=>{
                        return(
                            <IonItem key={rsID}>
                                <div style={{ display: 'flex', alignItems: 'center',width:'100%' }}>
                                <IonCheckbox labelPlacement="end" justify="start" style={{width:'60px'}}>
                                </IonCheckbox>
                                <div style={{flexGrow:"1"}} >
                                    {stations[routeStations[rsID].stationID].name}
                                </div>
                                </div>
                            </IonItem>
                        )
                    })
                }
                <IonItem key={-1}>
                    <div style={{ display: 'flex', alignItems: 'center',width:'100%' }}>
                        <IonCheckbox labelPlacement="end" justify="start" style={{width:'60px'}}>
                        </IonCheckbox>
                        <div style={{height:'30px',cursor: 'pointer',flexGrow:"1"}} onClick={(e)=>{setEditRSIndex(-1);selectStation()}} >

                        </div>
                    </div>

                </IonItem>
            </IonList>
        </IonCard>
    </IonList>
    </IonContent>
    </IonPage>
)
}
