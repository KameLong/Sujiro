import React, {useState} from "react";
import {
    IonButton,
    IonButtons,
    IonContent, IonGrid,
    IonHeader,
    IonInput,
    IonItem, IonList,
    IonPage, IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {useRecoilState, useRecoilValue} from "recoil";
import {routeSelector, stationSelector} from "../../store";
import {StationEdit} from "../../DiaData/Station";
import {useKey} from "react-use";
import {useKeyAlt} from "../../hooks/KeyHooks";
import {EditRoute} from "../../DiaData/Route";

interface EditRoutePageProps{
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
    title:string,
    routeID:number
}

export const EditRoutePage: React.FC<EditRoutePageProps> = ({onDismiss,title,routeID}):JSX.Element => {
    const [route,setRoute]=useState(useRecoilValue(routeSelector(routeID))??EditRoute.newRoute());
    const [_,sendRoute]=useRecoilState(routeSelector(routeID));

    const commitRoute=()=>{
        sendRoute(route);

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
    onInput={(e)=>setRoute(old=>{
        return{...old,name:(e.target as HTMLInputElement).value as string}})}
    />
    </IonItem>
    </IonList>
    </IonContent>
    </IonPage>
)
}
