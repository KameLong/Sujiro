import React, {useEffect, useState} from 'react';
import * as signalR from "@microsoft/signalr";
import {Station, StopTime, Trip} from "../SujiroData/DiaData";
import * as PIXI from 'pixi.js'
import {DisplayObject, ICanvas} from "pixi.js";
import {DiagramData, DiagramStation, DiagramTrip} from "./DiagramData";
const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_SERVER_URL}/chatHub`)
    .build();
connection.start().catch((err) => console.error(err));

function DiagramPage() {
    const SCALE:number=3;
    const [stations, setStations] = useState<DiagramStation[]>([]);

    const [downTrips, setDownTrips] = useState<DiagramTrip[]>([]);
    const [upTrips, setUpTrips] = useState<DiagramTrip[]>([]);


    const [app,setApp]=useState<PIXI.Application>();
    const [downLines,setDownLines]=useState<DiagramLine[]>([]);
    const [upLines,setUpLines]=useState<DiagramLine[]>([]);

    const makeDiagramLine=(trips:DiagramTrip[]):DiagramLine[]=>{
        const diagramLines:DiagramLine[]=[];
        trips.forEach(trip=>{

            let diagramLine:DiagramLine={
                color:0x000000,
                points:[],
                number:trip.number,
                number2 : new PIXI.Text(trip.number , { fontSize:48,fill: 0x000000 }),

            };
            switch(trip.type){
                case 0:
                    diagramLine.color=0x000000;
                    break;
                case 1:
                    diagramLine.color=0x008000;
                    break;
                case 2:
                    diagramLine.color=0xFF8000;
                    break;
            }
            const stopTimes=trip.direct==0?trip.stopTimes:[...trip.stopTimes].reverse();
            for(let i=0;i<stopTimes.length;i++){
                const st=stopTimes[i];
                if(st.ariTime>=0){
                    diagramLine.points.push({
                        x:st.ariTime,
                        y:stations.filter(item=>item.stationID===st.stationID)[0].stationTime
                    });
                }
                if(st.depTime>=0) {
                    diagramLine.points.push({
                        x: st.depTime,
                        y:stations.filter(item=>item.stationID===st.stationID)[0].stationTime
                    });
                }
            }
            diagramLines.push(diagramLine);
        })
        return diagramLines;

    }

    const [transform,setTransform]=useState<DiagramTransform>({
        x:3600*6,
        y:0,
        xScale:0.03*SCALE,
        yScale:0.1*SCALE
    });
    const [diaRect,setDiaRect]=useState<DiagramRect>({
        yStart:0,
        yEnd:0,
        xStart:3600*3,
        xEnd:3600*27
    });
    const [gesture,setGesture]=useState<Gesture>({
        isDrag:false,
        start1:{x:0,y:0},
        moveing1:{x:0,y:0}
    });
    const [gesture2,setGesture2]=useState<Gesture2>({
        isXDrag:false,
        isYDrag:false,
        transform:transform,
        start1:{x:0,y:0},
        moveing1:{x:0,y:0},
        start2:{x:0,y:0},
        moveing2:{x:0,y:0}
    });

    useEffect(()=>{
        console.log("load");
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/DiagramPage/0`).then(res=>res.json())
            .then((res:DiagramData)=>{
                setDownTrips(res.downTrips);
                setUpTrips(res.upTrips);
                setStations(res.stations);
                setDiaRect(prevState => {
                    return {
                        xStart: prevState.xStart,
                        xEnd: prevState.xEnd,
                        yStart: res.stations[0].stationTime,
                        yEnd: res.stations[res.stations.length - 1].stationTime
                    }
                })
            })
        connection.on("UpdateStoptime", (stoptime: StopTime) => {
            console.log("UpdateStoptime",stoptime);
            setUpTrips(prev=> {
                const tripIndex=prev.findIndex(item=>item.tripID===stoptime.tripID);
                if(tripIndex<0){
                    console.error("tripIndex<0");
                    return prev;
                }
                const stopTimeIndex=prev[tripIndex].stopTimes.findIndex(item=>item.stopTimeID===stoptime.stopTimeID);
                if(stopTimeIndex<0){
                    console.error("stopTimeIndex<0");
                    return prev;
                }
                const next=[...prev];
                next[tripIndex]={...next[tripIndex]};
                next[tripIndex].stopTimes=[...next[tripIndex].stopTimes];
                next[tripIndex].stopTimes[stopTimeIndex]=stoptime;
                return next;
            });
            setDownTrips(prev=> {
                const tripIndex=prev.findIndex(item=>item.tripID===stoptime.tripID);
                if(tripIndex<0){
                    console.error("tripIndex<0");
                    return prev;
                }
                const stopTimeIndex=prev[tripIndex].stopTimes.findIndex(item=>item.stopTimeID===stoptime.stopTimeID);
                if(stopTimeIndex<0){
                    console.error("stopTimeIndex<0");
                    return prev;
                }
                const next=[...prev];
                next[tripIndex]={...next[tripIndex]};
                next[tripIndex].stopTimes=[...next[tripIndex].stopTimes];
                next[tripIndex].stopTimes[stopTimeIndex]=stoptime;
                return next;
            });
        });


    },[])

    useEffect(()=>{
        setDownLines(makeDiagramLine(downTrips));
    },[downTrips])
    useEffect(()=>{
        setUpLines(makeDiagramLine(upTrips));
    },[upTrips])




    useEffect(() => {
        const canvas=(document.getElementById("test") as  HTMLCanvasElement);
        canvas.width=canvas.clientWidth*SCALE;
        canvas.height=canvas.clientHeight*SCALE;

        // キャンバスサイズと背景色を指定してステージを作成
        const app = new PIXI.Application({
            width:canvas.width,
            height:canvas.height,
            view : (document.getElementById("test") as  HTMLCanvasElement),
            backgroundColor: 0xFFFFFF,
            antialias:true,
        });
        setApp(app);
    }, []);
    useEffect(() => {
        if(app==null){
            return;
        }
        app.stage.removeChildren();
        for(let h=3;h<28;h++){
            const line = new PIXI.Graphics();
            line.lineStyle(4, 0x808080, 1);
            line.moveTo((h*3600-transform.x)*transform.xScale*SCALE, (diaRect.yStart-transform.y)*transform.yScale*SCALE);
            line.lineTo((h*3600-transform.x)*transform.xScale*SCALE, (diaRect.yEnd-transform.y)*transform.yScale*SCALE);
            app.stage.addChild(line as DisplayObject);
        }
        for(let station of stations){
            const line = new PIXI.Graphics();
            let width=1;
            if(station.style==(3|3<<4)){
                width=2;
            }
            if(stations[0]==station||stations.slice(-1)[0]==station){
                width=2;
            }
            line.lineStyle(width, 0x808080, 1);
            line.moveTo((diaRect.xStart-transform.x)*transform.xScale*SCALE, (station.stationTime-transform.y)*transform.yScale*SCALE);
            line.lineTo((diaRect.xEnd-transform.x)*transform.xScale*SCALE, (station.stationTime-transform.y)*transform.yScale*SCALE);
            app.stage.addChild(line as DisplayObject);

        }
        downLines.forEach(item=>{
            if(item.points.length<2){
                return;
            }
            var line = new PIXI.Graphics();
            line.lineStyle(SCALE, item.color, 1);
            line.moveTo((item.points[0].x-transform.x)*transform.xScale*SCALE, (item.points[0].y-transform.y)*transform.yScale*SCALE);
            for(let i=1;i<item.points.length;i++){
                line.lineTo((item.points[i].x-transform.x)*transform.xScale*SCALE, (item.points[i].y-transform.y)*transform.yScale*SCALE);
            }
            app.stage.addChild(line as DisplayObject);
            const numberText=item.number2;
            numberText.anchor.set(-1,1);
            numberText.x = (item.points[0].x-transform.x)*transform.xScale*SCALE;
            numberText.y = (item.points[0].y-transform.y)*transform.yScale*SCALE;
            numberText.rotation=Math.atan2((item.points[1].y-item.points[0].y)*transform.yScale,(item.points[1].x-item.points[0].x)*transform.xScale)
            app.stage.addChild(numberText as DisplayObject);
        })
        upLines.forEach(item=>{
            if(item.points.length<2){
                return;
            }
            var line = new PIXI.Graphics();
            line.lineStyle(SCALE, item.color, 1);
            line.moveTo((item.points[0].x-transform.x)*transform.xScale*SCALE, (item.points[0].y-transform.y)*transform.yScale*SCALE);
            for(let i=1;i<item.points.length;i++){
                line.lineTo((item.points[i].x-transform.x)*transform.xScale*SCALE, (item.points[i].y-transform.y)*transform.yScale*SCALE);
            }
            app.stage.addChild(line as DisplayObject);
            const numberText=item.number2;
            numberText.anchor.set(-1,1);
            numberText.x = (item.points[0].x-transform.x)*transform.xScale*SCALE;
            numberText.y = (item.points[0].y-transform.y)*transform.yScale*SCALE;
            numberText.rotation=Math.atan2((item.points[1].y-item.points[0].y)*transform.yScale,(item.points[1].x-item.points[0].x)*transform.xScale)
            app.stage.addChild(numberText as DisplayObject);
        })

        const stationViewWidth=250;
        var stationView = new PIXI.Graphics();
        stationView.beginFill(0xFFFFFF);
        stationView.drawRect(0, 0, stationViewWidth, 1000*SCALE);
        stationView.endFill();
        app.stage.addChild(stationView as DisplayObject);
        const line = new PIXI.Graphics();
        line.lineStyle(4, 0x808080, 1);
        line.moveTo(stationViewWidth, (diaRect.yStart-transform.y)*transform.yScale*SCALE);
        line.lineTo(stationViewWidth, (diaRect.yEnd-transform.y)*transform.yScale*SCALE);
        app.stage.addChild(line as DisplayObject);

        for(let station of stations){
            const line = new PIXI.Graphics();
            let width=1;
            if(station.style==(3|3<<4)){
                width=2;
            }
            if(stations[0]==station||stations.slice(-1)[0]==station){
                width=2;
            }
            line.lineStyle(width, 0x808080, 1);
            line.moveTo(0, (station.stationTime-transform.y)*transform.yScale*SCALE);
            line.lineTo(stationViewWidth, (station.stationTime-transform.y)*transform.yScale*SCALE);
            app.stage.addChild(line as DisplayObject);

            const text=new PIXI.Text(station.name , { fontSize:40,fill: 0x000000 });
            text.anchor.set(0,1);
            text.x=20;
            text.y=(station.stationTime-transform.y)*transform.yScale*SCALE;
            app.stage.addChild(text as DisplayObject);


        }




    }, [downLines,upTrips,transform]);



    return (
        <canvas id="test"  style={{width:'100%',height:'100%',overflowY:'hidden'}}
            onTouchStart={(e)=>{
                if(e.touches.length==1) {
                    setGesture({
                        isDrag:true,
                        start1:{x:e.touches[0].clientX,y:e.touches[0].clientY},
                        moveing1:{x:e.touches[0].clientX,y:e.touches[0].clientY}
                    });
                }
                if(e.touches.length==2) {
                    setGesture2({
                        isXDrag:Math.abs(e.touches[0].clientX-e.touches[1].clientX)>100,
                        isYDrag:Math.abs(e.touches[0].clientY-e.touches[1].clientY)>100,
                        transform:transform,
                        start1:{x:e.touches[0].clientX,y:e.touches[0].clientY},
                        moveing1:{x:e.touches[0].clientX,y:e.touches[0].clientY},
                        start2:{x:e.touches[1].clientX,y:e.touches[1].clientY},
                        moveing2:{x:e.touches[1].clientX,y:e.touches[1].clientY}
                    });
                }
            }}
            onTouchMove={(e)=>{
                if(e.touches.length==1) {
                    setTransform(prev => {
                        const res = {
                            x: prev.x - (e.touches[0].clientX - gesture.moveing1.x) / prev.xScale,
                            y: prev.y - (e.touches[0].clientY - gesture.moveing1.y) / prev.yScale,
                            xScale: prev.xScale,
                            yScale: prev.yScale
                        }
                        return res;

                    })
                    setGesture(prev=>{return{
                        isDrag: true,
                        start1: prev.start1,
                        moveing1: {x: e.touches[0].clientX, y: e.touches[0].clientY}
                    }});
                }
                if(e.touches.length==2) {
                    const nowPos1={x:e.touches[0].clientX,y:e.touches[0].clientY};
                    const nowPos2={x:e.touches[1].clientX,y:e.touches[1].clientY};
                    const prevTransform=gesture2.transform;

                    let scaleX=Math.abs(prevTransform.xScale*(nowPos1.x-nowPos2.x)/(gesture2.start1.x-gesture2.start2.x));
                    let scaleY=Math.abs(prevTransform.yScale*(nowPos1.y-nowPos2.y)/(gesture2.start1.y-gesture2.start2.y));
                    if(Math.abs(nowPos2.y-nowPos1.y)<100) {
                        scaleY = transform.yScale;
                    }
                    if(Math.abs(nowPos2.x-nowPos1.x)<100) {
                        scaleX = transform.xScale;
                    }
                    let x1=prevTransform.x+gesture2.start1.x/prevTransform.xScale-nowPos1.x/scaleX;
                    let y1=prevTransform.y+gesture2.start1.y/prevTransform.yScale-nowPos1.y/scaleY;
                    let x2=prevTransform.x+gesture2.start2.x/prevTransform.xScale-nowPos2.x/scaleX;
                    let y2=prevTransform.y+gesture2.start2.y/prevTransform.yScale-nowPos2.y/scaleY;
                    let x=(x1+x2)/2;
                    let y=(y1+y2)/2;


                    setGesture2(prev=>{return{
                        isXDrag:Math.abs(e.touches[0].clientX-e.touches[1].clientX)>100,
                        isYDrag:Math.abs(e.touches[0].clientY-e.touches[1].clientY)>100,
                        transform:prev.transform,
                        start1: prev.start1,
                        start2: prev.start2,
                        moveing1: nowPos1,
                        moveing2: nowPos2
                    }});
                    setTransform(prev => {
                        const res = {
                            x: x ,
                            y: y,
                            xScale: scaleX,
                            yScale: scaleY
                        }
                        return res;

                    });

                }

            }}
                onTouchEnd={(e)=>{
                    if(e.touches.length==1) {
                        setGesture({
                            isDrag:true,
                            start1:{x:e.touches[0].clientX,y:e.touches[0].clientY},
                            moveing1:{x:e.touches[0].clientX,y:e.touches[0].clientY}
                        });
                    }
                    if(e.touches.length==2) {
                        setGesture2({
                            isXDrag:Math.abs(e.touches[0].clientX-e.touches[1].clientX)>100,
                            isYDrag:Math.abs(e.touches[0].clientY-e.touches[1].clientY)>100,
                            transform:transform,
                            start1:{x:e.touches[0].clientX,y:e.touches[0].clientY},
                            moveing1:{x:e.touches[0].clientX,y:e.touches[0].clientY},
                            start2:{x:e.touches[1].clientX,y:e.touches[1].clientY},
                            moveing2:{x:e.touches[1].clientX,y:e.touches[1].clientY}
                        });
                    }
                }}
        >
        </canvas>
    );
}

export default DiagramPage;

const getAD=(stopTime:StopTime)=>{
    if(stopTime.ariTime>=0){
        return stopTime.ariTime;
    }
    return stopTime.depTime;
}
const getDA=(stopTime:StopTime)=>{
    if(stopTime.depTime>=0){
        return stopTime.depTime;
    }
    return stopTime.ariTime;
}
const hasTime=(stopTime:StopTime)=>{
    return stopTime.depTime>=0||stopTime.ariTime>=0;
}


interface DiagramLine{
    color:number;
    number:string;
    number2:PIXI.Text;
    points:Point[];
}

interface DiagramTransform{
    x:number;
    y:number;
    xScale:number;
    yScale:number;
}

interface Point{
    x:number;
    y:number;
}
interface Gesture{
    isDrag:boolean;
    start1:Point;
    moveing1:Point;
}
interface Gesture2{
    isXDrag:boolean;
    isYDrag:boolean;
    transform:DiagramTransform;
    start1:Point;
    start2:Point;
    moveing1:Point;
    moveing2:Point;
}
interface DiagramRect{
    xStart:number;
    xEnd:number;
    yStart:number;
    yEnd:number;
}