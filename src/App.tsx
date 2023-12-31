import { Redirect, Route } from 'react-router-dom';
import {
    IonApp, IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar,
    setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Test/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import "./App.scss"
/* Theme variables */
import './theme/variables.css';
import React, {useRef} from "react";
import {MenuPage} from "./pages/Menu/MenuPage";
import {TimeTableViewPage} from "./pages/TimeTable/TimeTablePage";
import {StationListPage} from "./pages/StationEdit/StationList";
// import {TimeTableEditPage} from "./pages/TimeTableEdit/TimeTableEditPage";
import {ListConnectorView} from "./pages/Common/ListConnector";

import classes from "./App.module.css"
import {EditStationPage} from "./pages/StationEdit/EditStationPage";
import {atom, useRecoilValue} from "recoil";
import {EditDiaData} from "./DiaData/DiaData";
import {KeyTestPage} from "./pages/Test/KeyTestPage";
import {RouteListPage} from "./pages/Route/RouteList";
import {TimetableListPage} from "./pages/TimeTableEdit/TimetableListPage";
import {TimetableEditPage} from "./pages/TimeTableEdit/TimeTableEditPage";
import {SujiroListTest} from "./components/SujiroSearchList";
import {arrowRedo, arrowUndo} from "ionicons/icons";
import {useUndo} from "./hooks/UndoRedo";
import {useKeyCtrl} from "./hooks/KeyHooks";
import {EditRoutePage} from "./pages/Route/RouteEditPage";
setupIonicReact({
     rippleEffect: true,
    mode: 'ios',
});

export const AppTitleState = atom({
    key: 'AppTitle',
    default: "TOP",
});


const App: React.FC = () => {
    const title=useRecoilValue(AppTitleState);
    const [action,undo,redo,canUndo,canRedo]=useUndo();
    useKeyCtrl("KeyZ",(e)=>{e.preventDefault();undo()});
    useKeyCtrl("KeyY",(e)=>{e.preventDefault();redo()});


    return(
        <IonApp>
            <IonReactRouter>
                <IonSplitPane className={classes.IonSplitPane} contentId="main-content" >
                    <IonMenu className={classes.IonMenu} contentId="main-content" side="start" >
                        <MenuPage />
                    </IonMenu>

                <IonPage id="main-content"  className={classes.noScrollBar}>
                        <IonHeader>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonMenuButton></IonMenuButton>
                                </IonButtons>
                                <IonTitle>{title}</IonTitle>
                                <IonButtons slot="end">
                                <IonButton disabled={!canUndo} onClick={undo}><IonIcon icon={arrowUndo}/></IonButton>
                                    <IonButton disabled={!canRedo} onClick={redo}><IonIcon icon={arrowRedo}/></IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent >
                            <Route exact path="/" component={SujiroListTest}/>
                            <Route exact path="/home">
                            </Route>
                            <Route exact path="/StationList" component={StationListPage} />
                            <Route exact path="/RouteList" component={RouteListPage} />
                            <Route exact path="/EditRoute" component={EditRoutePage} />

                            <Route exact path="/TimetableList" component={TimetableListPage}/>
                            <Route exact path="/TimetableEdit/" component={TimetableEditPage}/>

                            <Route exact path="/LineTimeTable" component={TimeTableViewPage}/>
                            <Route exact path="/KeyTest" component={KeyTestPage}/>
                        </IonContent>
                    </IonPage>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
}
export default App;
