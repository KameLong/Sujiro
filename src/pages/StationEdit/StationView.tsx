import React, {useRef} from "react";

import {DiaData} from "../../DiaData/DiaData";
import {Station} from "../../DiaData/Station";

import {
    IonApp, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent,
    IonHeader, IonInput,
    IonItem,
    IonLabel,
    IonList, IonModal, IonPage,
    IonRouterOutlet, IonSearchbar,
    IonSplitPane, IonTitle, IonToolbar,
    setupIonicReact, useIonAlert
} from '@ionic/react';
import {StationListView} from "./StationList";


interface StationSimpleViewProps{
    station:Station;
    onClicked?: {(stationID:number):void; };
}
export const StationSimpleView: React.FC<StationSimpleViewProps> = ({station,onClicked=undefined}:StationSimpleViewProps):JSX.Element => {
    const onClickEvent=()=>{
        if(onClicked){
            onClicked(station.id);
        }
    }
    return(
        <IonItem >
            <div  onClick={onClickEvent}>
                {
                    station.name
                }
            </div>
        </IonItem>
    )
}

export const StationView: React.FC<StationSimpleViewProps>=({station,onClicked=undefined}:StationSimpleViewProps):JSX.Element =>{
    return(
        <IonItem onClick={()=>{
            if(onClicked){
                onClicked(station.id);
            }
            }}
            >
            <div style={{display:"flex"}}>
                <div style={{width:"200px"}}>
                {
                    station.name
                }
                </div>
                <div style={{marginLeft:"20px",width:"100px"}}>
                    {
                        station.address
                    }
                </div>
            </div>
        </IonItem>
    );
}



export const ModalExample = ({
                          onDismiss,
                      }: {
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
    const inputRef = useRef<HTMLIonInputElement>(null);
    console.log("ModalExample");
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="medium" onClick={() => onDismiss(null, 'cancel')}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Welcome</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDismiss(inputRef.current?.value, 'confirm')} strong={true}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput ref={inputRef} labelPlacement="stacked" label="Enter your name" placeholder="Your name" />
                </IonItem>
            </IonContent>
        </IonPage>
    );
};