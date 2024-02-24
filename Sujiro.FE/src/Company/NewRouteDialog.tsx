import React from "react";
import {Button, Card, CardActions, CardContent, Dialog, List, ListItem} from "@mui/material";
import Typography from "@mui/material/Typography";
import {LuFileInput} from "react-icons/lu";
import {axiosClient} from "../Hooks/AxiosHook";
import {useRequiredParamsHook} from "../Hooks/UseRequiredParamsHook";

interface NewRouteDialogProps{
    onClose:(result:string)=>void;
}

export default function NewRouteDialog({onClose}:NewRouteDialogProps) {
    return (
        <React.Fragment>
            <List>
                <ListItem>
                    <Button onClick={()=>{
                        onClose("newRoute");
                    }}>
                        新規路線追加
                    </Button>
                </ListItem>
                <ListItem>
                    <Button onClick={
                        ()=>{
                            onClose("importOudia");
                        }
                    }>
                        OuDiaファイルから取り込み
                    </Button>
                </ListItem>
            </List>
        </React.Fragment>
    );
}

interface ImportOuDiaDialogProps{
    close:()=>void;
}
export function ImportOuDiaDialog({close}:ImportOuDiaDialogProps){
    const {companyID} = useRequiredParamsHook<{ companyID: string }>();

    return (
        <React.Fragment>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        OuDiaファイルの取り込み
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ※現在、路線分岐ありのOuDiaファイルには対応していません。（順次対応予定です）
                    <br/>
                        ※現在、OuDiaSecondのファイルには対応していません。（順次対応予定です）
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        variant="contained"
                        component="label"
                    >
                        Upload File
                        <input
                            type="file"
                            style={{ display: "none" }}
                            accept=".oud"
                            onChange={(e)=>{
                                console.log(e.target.files?.item(0));
                                const file= e.target.files?.item(0);
                                if(file===null || file===undefined){
                                    return;
                                }
                                const formData = new FormData();
                                formData.append('file', file);

                                axiosClient.post(`/api/Import/oudia/${companyID}`,formData,
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    }
                                ).then(res=>{
                                    close();
                                }).catch(err=>{
                                    alert("読み込み時にエラーが発生しました。")
                                    close();
                                    console.error(err);
                                })
                            }}
                        />
                    </Button>
                </CardActions>
            </Card>
        </React.Fragment>
    );
}