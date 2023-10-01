import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";
// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "#FFF",
        color: "black",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
    },
});

import React from "react";

// Create Document Component
function BasicDocument() {
    const r:string[]=[];
    const c:string[]=[];
    for(let i=0;i<20;i++){
        c.push(i.toString().padStart(1,"0"));
    }
    for(let i=0;i<100;i++){
        r.push(i.toString().padStart(2,"0"));
    }





    return (
        <PDFViewer style={{width:'100%',height:'100%'}}>
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={{ marginLeft:'10px',flexDirection: "row",fontSize: 8}}>
                    {
                        c.map(i=>{
                            return <View>
                                {
                                r.map(j=>{
                                return <Text style={{width:'20px'}}>{i+j}</Text>;
                            })
                                }
                            </View>;
                        })

                    }
                </View>


            </Page>
        </Document>
        </PDFViewer>
    );
}
export default BasicDocument;