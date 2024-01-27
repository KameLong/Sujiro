import React, {memo, useEffect, useState} from 'react';
import style from '../TimeTablePage.module.css';
import {Station, StopTime} from "../../SujiroData/DiaData";
import {TimeTableTrip} from "../TimeTableData";
import {useParams} from "react-router-dom";
import PDFStationView from "./PDFStationView";
import PDFTrainView from './PDFTrainView';


import {Page, PDFViewer, Document, Text, Font,StyleSheet,View} from "@react-pdf/renderer";
export function TimeTablePDF() {
    const {direct} = useParams<{ direct: string }>();

    const [stations, setStations] = useState<Station[]>([]);
    const [trips, setTrips] = useState<TimeTableTrip[]>([]);



    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/${direct}`).then(res => res.json())
            .then((res) => {
                setTrips(res.trips);
                setStations(res.stations);
            })

    }, [])
    const getPage=()=>{
       return  [...Array(Math.ceil(trips.length/17))].map((_, i) => i)
    }


    const [open, setOpen] = React.useState(false);



        // ttfファイルのフォント定義
        // フォント「ナス レギュラー」
        Font.register({
            family: "NotoSansJP",
            src: "/font/NotoSansJP.ttf",
        });
    Font.register({
        family: "DiaPro",
        src: "/font/DiaPro-Regular.ttf",
    });

        // フォント「ナス 太字」

        const styles = StyleSheet.create({

            tableCell: {
                margin: 5,
                fontSize: 10,
                fontFamily: "NotoSansJP",
            },
        });



    return (
        <PDFViewer style={{height:'100%'}}>
            <Document>
                <Page size="A4" style={styles.tableCell} >
                    {
                        getPage().map((page)=> {
                            return(
                                <View wrap={false} style={{margin:'10px',display:"flex",flexDirection: "row"}}>
                                    <View style={{alignItems:'stretch',borderLeft:"2px solid black"}}/>
                                    <PDFStationView stations={stations} direct={Number(direct)}/>
                                    <View>
                                        <View style={{display:"flex",flexDirection: "row"}}>
                                            {trips.slice(page*17,page*17+17).map((trip) => {
                                                return (
                                                    <PDFTrainView key={trip.tripID} trip={trip} stations={stations}
                                                                  direct={Number(direct)}
                                                    />
                                                )
                                            })}
                                        </View>
                                    </View>
                                    <View style={{alignItems:'stretch',borderLeft:"1px solid black"}}/>
                                </View>

                            )
                        })
                    }
                </Page>
            </Document>
        </PDFViewer>

    );
}



