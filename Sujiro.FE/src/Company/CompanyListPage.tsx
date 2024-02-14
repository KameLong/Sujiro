import React, {useContext, useEffect, useState} from 'react';
import {
    Button, Card, CardActions, CardContent, Container,
    Dialog,  DialogContent, DialogTitle,
    Grid, Paper,  DialogActions, TextField,
} from '@mui/material';
import axios from "axios";
import {Add} from "@mui/icons-material";

import {
    auth
} from '../firebase';
import Typography from "@mui/material/Typography";
import {Company} from "../SujiroData/DiaData";
import {getAuth} from "firebase/auth";
import {statusContext} from "../Common/UseStatusContext";
function CompanyListPage() {
    const [myCompany,setMyCompany]=useState<Company[]>([]);
    const [editCompany,setEditCompany]=useState<Company|undefined>(undefined);

    const [openEditor,setOpenEditor]=useState(false);
    const ctx = useContext(statusContext);

    const close=async()=>{
        setOpenEditor(false);
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const token=await user.getIdToken();
            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/company/getAll?timestamp=${new Date().getTime()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).then(res => {
                console.log(res.data);
                setMyCompany(res.data);
            })


        }else{

            console.error("ログインされていない");
        }

    }

    useEffect(() => {
        auth.onAuthStateChanged(async(user) => {
            if (user) {
                const token=await user.getIdToken();
                axios.get(`${process.env.REACT_APP_SERVER_URL}/api/company/getAll?timestamp=${new Date().getTime()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                ).then(res => {
                    console.log(res.data);
                    setMyCompany(res.data);
                })


            }else{
                console.error("ログインされていない");
                // ctx.setLogined(false);
            }
        });
    }, []);
    // const [open, setOpen] = React.useState(false);
    return (
        <div>
            <Container>
                <Paper sx={{ padding: 4, marginY: 2 }}>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                    >管理しているCompany一覧</Typography>
                    <Grid container>
                    {myCompany.map(company=>(
                        <Grid item key={company.companyID} xs={12} md={6} lg={4} sx={{padding:1}}>
                            <Card variant="outlined" style={{height:'100%',backgroundColor:'#EEF5FF',boxShadow:'0 5px 5px 0 rgba(0, 0, 0, .3)'}}>
                            <CardContent style={{height:'100%'}}>
                                <Typography  color="textSecondary" gutterBottom>
                                </Typography>
                                <Typography variant="h5" component="h2" >
                                    <a href={`../company/${company.companyID}`} >
                                        {company.name}
                                    </a>
                                </Typography>
                                <Typography  color="textSecondary">
                                    {/*管理者*/}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    管理者
                                </Typography>
                                <CardActions>
                                    <Button size="small" onClick={()=>{
                                        setEditCompany(company);
                                        setOpenEditor(true);
                                    }}>編集する</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                        </Grid>
                ))}
                        <Grid item xs={12} md={6} lg={4} sx={{padding:1}}>
                            <Card  variant="outlined" style={{height:'100%'}}>
                                <CardContent style={{textAlign:'center',cursor:'pointer'}}
                                             onClick={()=>{
                                                 setEditCompany({companyID:Math.floor(Math.random()*Number.MAX_SAFE_INTEGER),name:"",userID:""})
                                            setOpenEditor(true);
                                            console.log("now")}}>
                                    <Add style={{ color:'darkblue',fontSize: '40px'}}></Add>
                                    <Typography variant="body2" component="p">
                                        新規作成
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>


                </Paper>

            </Container>


            <Dialog open={openEditor} onClose={()=>{setOpenEditor(false)}} >
                <CompanyEdit
                    company={editCompany}
                    close={close}/>
            </Dialog>
        </div>

    );
}

interface CompanyEditProps {
    close:()=>void;
    company:Company|undefined;
}

function CompanyEdit({close,company}:CompanyEditProps){
    const [companyName,setCompanyName]=useState(company?.name??"");

    if(company===undefined) {
        return(<div/>);
    }

    return (
        <div>
            <DialogTitle>{"Company名を編集"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth={true} label={"Company名"} required={true} value={companyName} onChange={e=>setCompanyName(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button  onClick={async() => {
                        if(companyName.length>0) {
                            const company2={...company};
                            company2.name=companyName;
                            const auth = getAuth();
                            const user = auth.currentUser;
                            if(company2.userID.length===0){
                                company2.userID=user?.uid??"";
                            }

                            const token=await user?.getIdToken()
                            await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/company`, company2,{headers: {Authorization: `Bearer ${token}`}});
                            close();
                        }
                    }}>決定</Button>
                </DialogActions>
        </div>
    )
}

export default CompanyListPage;
