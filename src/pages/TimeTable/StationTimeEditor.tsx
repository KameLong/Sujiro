import React, {useRef} from "react";
import {useSelector} from "react-redux";
import {DiaData} from "../../DiaData/DiaData";
import {
    IonButton,
    IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonCheckbox,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader, IonInput,
    IonItem, IonList,
    IonPage, IonRadio,
    IonRadioGroup,
    IonRow,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {useKey} from "react-use";

export const StationTimeEditor = ({
                          onDismiss,
                      }: {
    onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}) => {
    useKey("Enter",()=>{
        onDismiss("OK", 'confirm');
    })

    return (
        <IonPage style={{hegiht:'400px'}}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton color="medium" onClick={() => onDismiss(null, 'cancel')}>
                            Cancel
                        </IonButton>
                    </IonButtons>
                    <IonTitle>駅時刻</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => onDismiss("OK", 'confirm')}>
                            OK
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent  className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonCard>
                                <IonCardHeader>
                                    <IonCardTitle>駅扱</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <IonRadioGroup style={{color:'black' ,width:'200px'}} value="strawberries">
                                        <IonRadio labelPlacement="end" value="grapes">運行なし(N)</IonRadio>
                                        <br />
                                        <IonRadio labelPlacement="end" value="strawberries">停車(S)</IonRadio>
                                        <br />
                                        <IonRadio labelPlacement="end" value="pineapple">通過(P)</IonRadio>
                                    </IonRadioGroup>

                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                        <IonCol>
                            <IonCard>
                                <IonCardContent style={{color:'black'}}>

                                    <IonInput label="着時刻" placeholder=""></IonInput>
                                    <IonInput label="着時刻" placeholder=""></IonInput>
                                    <br/>
                                    <IonCheckbox labelPlacement="end">時刻の繰上げ</IonCheckbox>
                                    <br/>
                                    <IonCheckbox labelPlacement="end">時刻の繰下げ</IonCheckbox>
                                </IonCardContent>
                            </IonCard>

                        </IonCol>
                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage>
    );
};

