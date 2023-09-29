import React from "react";
import {IonIcon, IonItem, IonList} from "@ionic/react";
import {informationCircle} from "ionicons/icons";

export const ListConnectorView:React.FC=():JSX.Element=>{
    const list1=["東京","有楽町","新橋","浜松町","田町","高輪ゲートウェイ","品川"]
    const list2=["東京","新橋","品川"]
    return(
        <div style={{display: 'flex', overflowX: 'scroll'}}>
            <IonList style={{width:'150px'}}>
                {
                    list1.map(item=>
                    <IonItem >

                        {item}
                        <IonIcon icon={informationCircle} slot="end"></IonIcon>

                    </IonItem>)
                }
            </IonList>
            <IonList style={{width:'150px'}}>
                {
                    list2.map(item=>
                        <IonItem>
                            <IonIcon icon={informationCircle} slot="start"></IonIcon>
                            {item}
                        </IonItem>)
                }

            </IonList>
        </div>

    )

}