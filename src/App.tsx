import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonButtons,
    IonContent,
    IonHeader,
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
import Home from './pages/Home';

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
import Example from "./pages/TimeTableEdit/ModalSample";
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
                            </IonToolbar>
                        </IonHeader>
                        <IonContent >
                            <Route exact path="/" component={ListConnectorView}/>
                            <Route exact path="/home">
                                <Example />
                            </Route>
                            <Route exact path="/StationList" component={StationListPage} />
                            <Route exact path="/RouteList" component={RouteListPage} />
                            {/*<Route exact path="/NewStation" component={EditStationPage}/>*/}
                            <Route exact path="/LineTimeTable" component={TimeTableViewPage}/>
                            <Route exact path="/KeyTest" component={KeyTestPage}/>
                            {/*<Route exact path="/RouteTimeTablePDF" component={RouteTimeTablePDF } />*/}
                            {/*<Route path="/TimeTableEdit" component={TimeTableEditPage } />*/}
                        </IonContent>
                    </IonPage>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
}
export default App;
