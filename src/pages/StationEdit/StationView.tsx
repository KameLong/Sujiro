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
    onClick2?: {(stationID:number):void; };
}
export const StationSimpleView: React.FC<StationSimpleViewProps> = ({station,onClick2=undefined}:StationSimpleViewProps):JSX.Element => {
    const onClickEvent=()=>{
        console.log(station.name);
        if(onClick2){
            onClick2(station.id);
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

export const StationView: React.FC<StationSimpleViewProps>=({station,onClick2=undefined}:StationSimpleViewProps):JSX.Element =>{
    return(
        <IonItem onClick={()=>{
            if(onClick2){
                onClick2(station.id);
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

interface StationSelectorModalProps{
    recommendStation:Station[];
    diaData:DiaData;
    onStationSelect?:{(station:Station):void};
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}
export const StationSelectorModal:React.FC<StationSelectorModalProps>=(props:StationSelectorModalProps):JSX.Element=>{
    const modal = useRef<HTMLIonModalElement>(null);
    const [presentAlert] = useIonAlert();
    const onStationSelected=(station:Station)=>{
        console.log(station)
        if(props.onStationSelect===undefined){
            return;
        }
        presentAlert({
            header: '駅挿入',
            message: station.name+'を追加します',
            buttons: [{
                text: 'OK',
                role: 'confirm',
                handler: () => {
                    if(props.onStationSelect===undefined){
                        return;
                    }
                    props.onStationSelect(station);
                    props.onDismiss(null, 'confirm');
                },
            },]
        })
    }
    return(
        <IonPage ref={modal} >
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => props.onDismiss(null, 'cancel')}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>駅選択</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => props.onDismiss(null, 'confirm')}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>推奨駅候補</IonCardTitle>
                        <IonList>
                            {
                                props.recommendStation.map(station=><StationSimpleView onClick2={(stationID)=>onStationSelected(station)}  key={station.id} station={station}/>)
                            }

                        </IonList>
                    </IonCardHeader>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>全駅一覧</IonCardTitle>
                    </IonCardHeader>
                    <StationListView stationList={Object.values(props.diaData.stations)} />
                </IonCard>
            </IonContent>
        </IonPage>
    )
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