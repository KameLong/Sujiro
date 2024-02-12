import React, { useEffect, useState} from 'react';
import {Station} from "../../SujiroData/DiaData";
import {TimeTableStation, TimeTableTrip} from "../TimeTableData";
import {useParams} from "react-router-dom";
import PDFStationView from "./PDFStationView";
import PDFTrainView from './PDFTrainView';


import {Page, PDFViewer, Document, Font,StyleSheet,View} from "@react-pdf/renderer";
import {Button, Dialog, Fab, TextField} from "@mui/material";
import {Settings} from "@mui/icons-material";
import Box from "@mui/material/Box";
export function TimeTablePDF() {
    const {direct} = useParams<{ direct: string }>();
    const [settingOpen, setSettingOpen] = useState(false);

    const [stations, setStations] = useState<TimeTableStation[]>([]);
    const [upTrips, setUpTrips] = useState<TimeTableTrip[]>([]);
    const [downTrips, setDownTrips] = useState<TimeTableTrip[]>([]);
    const [layout,setLayout]=useState<PDFTimeTableLayout>({
        marginTop:30,
        marginLeft:5,
        pageMargin:20,
        stationWidth:22,
        trainPerPage:29,

        fontSize:70,
        trainWidth:60,
        lineHeight:102
    });



    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/1`).then(res => res.json())
            .then((res) => {
                setUpTrips(res.trips);
                setStations(res.stations);
            })
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/timetablePage/0/0`).then(res => res.json())
            .then((res) => {
                setDownTrips(res.trips);
            })

    }, [])
    const getPage=()=>{
        const tripnum=Math.max(upTrips.length,downTrips.length);
        if(settingOpen){

            return  [...Array(1)].map((_, i) => i)
        }
        // return  [...Array(1)].map((_, i) => i)
       return  [...Array(Math.ceil(tripnum/layout.trainPerPage))].map((_, i) => i)
    }





    // ttfファイルのフォント定義
    Font.register({
        family: "NotoSansJP",
        src: "/font/NotoSansJP.ttf",
    });
    Font.register({
        family: "DiaPro",
        src: "/font/DiaPro-Regular.ttf",
    });
    const styles = StyleSheet.create({
        tableCell: {
            fontSize: (layout.fontSize*0.1)+'pt',
            fontFamily: "NotoSansJP",
        },
    });

    return (
        <div style={{height:'100%',width:'100%'}}>
            <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
                <Fab color="primary" aria-label="add" onClick={()=>setSettingOpen(true)}>
                    <Settings/>
                </Fab>
            </Box>
            <Dialog open={settingOpen} onClose={e=>{}}>
                <TextField label={"余白(上)"} sx={{m:2}} value={layout.marginTop} onChange={e=>{
                    setLayout(()=> {
                        let top= parseInt(e.target.value);
                        if(top<0||isNaN(top)){
                            top=0;
                        }
                        return {...layout, marginTop: top}
                    });
                }}></TextField>
                <TextField label={"余白(左)"} sx={{m:2}} value={layout.marginLeft}
                           onChange={e=>{
                               setLayout(()=> {
                                   let left= parseInt(e.target.value);
                                   if(left<0||isNaN(left)){
                                       left=0;
                                   }
                                   return {...layout, marginLeft: left}
                               });
                           }}></TextField>
                <TextField label={"余白(ページ間)"}sx={{m:2}} value={layout.pageMargin}
                           onChange={(e)=>{
                               setLayout(()=> {
                                   let margin= parseInt(e.target.value);
                                   if(margin<0||isNaN(margin)){
                                       margin=0;
                                   }
                                   return {...layout, pageMargin: margin}
                               });
                           }}
                ></TextField>
                <TextField label={"文字サイズ(×0.1pt)"} sx={{m:2}} value={layout.fontSize}
                           onChange={(e)=>{
                               setLayout(()=> {
                                   let size= parseInt(e.target.value);
                                   if(size<0||isNaN(size)){
                                       size=0;
                                   }
                                   return {...layout, fontSize: size}
                               });
                           }}></TextField>
                <TextField label={"1行の高さ(目安：文字サイズ*1.5)"} sx={{m:2}} value={layout.lineHeight}
                           onChange={(e)=>{
                               setLayout(()=> {
                                   let height= parseInt(e.target.value);
                                   if(height<0||isNaN(height)){
                                       height=0;
                                   }
                                   return {...layout, lineHeight: height}
                               });
                           }}></TextField>
                <TextField label={"駅名の幅"} sx={{m:2}} value={layout.stationWidth}
                           onChange={(e)=>{
                               setLayout(()=> {
                                   let width= parseInt(e.target.value);
                                   if(width<0||isNaN(width)){
                                       width=0;
                                   }
                                   return {...layout, stationWidth: width}
                               });
                           }}></TextField>
                <TextField label={"1列車の幅"} sx={{m:2}} value={layout.trainWidth}
                           onChange={(e)=>{
                               setLayout(()=> {
                                   let width= parseInt(e.target.value);
                                   if(width<0||isNaN(width)){
                                       width=0;
                                   }
                                   return {...layout, trainWidth: width}
                               });
                           }}></TextField>
                <TextField label={"1ページの列車数"} sx={{m:2}} value={layout.trainPerPage}
                           onChange={(e)=>{
                               setLayout(()=> {
                                   let num= parseInt(e.target.value);
                                   if(num<0||isNaN(num)){
                                       num=0;
                                   }
                                   return {...layout, trainPerPage: num}
                               });
                           }}></TextField>
                <Button onClick={e=>{
                    setSettingOpen(false);
                }}>OK</Button>

            </Dialog>
            <PDFViewer style={{height:'calc(100% - 10px)',width:'100%'}}>
                <Document>
                    {
                        getPage().map((page)=> {
                            return(
                                <Page size="A4" style={styles.tableCell} >

                                    <View wrap={false} style={{
                                        marginTop:layout.marginTop+'mm',
                                        marginLeft:layout.marginLeft+'mm',
                                        display:"flex",flexDirection: "row"}}>
                                        <View style={{alignItems:'stretch',borderLeft:"1px solid black"}}/>
                                        <div style={{width:layout.stationWidth+'mm'}}>
                                            <PDFStationView lineHeight={layout.lineHeight} fontSize={layout.fontSize} stations={stations} direct={Number(direct)}/>
                                        </div>
                                        <View>
                                            <View style={{display:"flex",flexDirection: "row"}}>
                                                {downTrips.slice(page*layout.trainPerPage,(page+1)*layout.trainPerPage).map((trip) => {
                                                    return (
                                                        <PDFTrainView width={layout.trainWidth} key={trip.tripID} trip={trip} stations={stations}
                                                                      lineHeight={layout.lineHeight} direct={Number(direct)}
                                                        />
                                                    )
                                                })}
                                            </View>
                                        </View>
                                        <View style={{alignItems:'stretch',borderLeft:"0.5px solid black"}}/>
                                    </View>
                                    <View wrap={false} style={{
                                        marginTop: layout.pageMargin + 'mm',
                                        marginLeft: layout.marginLeft + 'mm',
                                        display: "flex", flexDirection: "row"
                                    }}>
                                        <View style={{alignItems: 'stretch', borderLeft: "1px solid black"}}/>
                                        <div style={{width: layout.stationWidth + 'mm'}}>
                                            <PDFStationView lineHeight={layout.lineHeight} fontSize={layout.fontSize} stations={stations} direct={1}/>
                                        </div>
                                            <View>
                                                <View style={{display: "flex", flexDirection: "row"}}>
                                                    {upTrips.slice(page * layout.trainPerPage, (page+1)*layout.trainPerPage).map((trip) => {
                                                        return (
                                                            <PDFTrainView lineHeight={layout.lineHeight} width={layout.trainWidth} key={trip.tripID} trip={trip}
                                                                          stations={stations}
                                                                          direct={1}
                                                            />
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                            <View style={{alignItems: 'stretch', borderLeft: "0.5px solid black"}}/>
                                    </View>
                                </Page>

                        )
                        })
                    }
                </Document>
            </PDFViewer></div>
    );
}

interface PDFTimeTableLayout{
    marginTop:number;
    marginLeft:number;
    pageMargin:number;
    fontSize:number;
    stationWidth:number;
    trainWidth:number;
    trainPerPage:number;
    lineHeight:number;

}



