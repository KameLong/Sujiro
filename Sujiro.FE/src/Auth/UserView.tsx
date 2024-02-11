import React, {useEffect} from 'react';
import {Button, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {
    GoogleAuthProvider,
    signInWithPopup,
    UserCredential,
    signOut, getAuth, User,
} from 'firebase/auth';
import { auth } from "../firebase";

import firebase from "firebase/compat";
import {Login, Logout, Person, Settings} from "@mui/icons-material";
import axios from "axios";
export default function UserView(){
    const [user, setUser] = React.useState<User|null>(null);
    useEffect(() => {
        auth.onAuthStateChanged(async (user:User|null) => {
            setUser(user);
            //ユーザーが有効かチェックする
            let loginRes=await axios.get( `${process.env.REACT_APP_SERVER_URL}/api/user/registered?timestamp=${new Date().getTime()}`,
                {
                    headers: {
                        Authorization: `Bearer ${await user?.getIdToken()}`
                    }
                }
            );
            switch(loginRes.status){
                case 200:
                    break;
                case 204:
                    alert("現在ユーザーの新規登録を受け付けておりません。")
                    break;
                case 401:
                    alert("認証に失敗しました(401)")
                    break;
                default:
                    alert("認証に失敗しました()")
            }
        });
    },[]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setOpen(false);
    };


    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({
            prompt: 'select_account', // 追加
        });
        try {
            let a=await signInWithPopup(auth,provider)

            console.log(a);
            const userRecord = getAuth().currentUser;
            console.log(userRecord?.displayName);

        } catch (error) {
            alert(error)
        }
    }


    return (
        <div>
            {
                user===null?<Button  onClick={()=>{
                        loginWithGoogle();
                    }} style={{color:'white'}} ><Login/>ログイン</Button>
                    :<div onClick={(e)=>{
                        handleClick(e);
                    }}
                          style={{display: 'inline-flex',alignItems: 'center',fontSize:'12px'}}
                    ><Person fontSize={'small'}/>{user.displayName?.slice(0,10)}
                                {
                                    user.displayName?.length??0>10?"...":""
                                }</div>
            }
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/*<MenuItem onClick={handleClose}>*/}
                {/*    <ListItemIcon>*/}
                {/*        <Settings fontSize="small" />*/}
                {/*    </ListItemIcon>*/}
                {/*    Settings*/}
                {/*</MenuItem>*/}
                <MenuItem onClick={async()=>{
                    let res=await signOut(auth);
                    console.log(res);
                    handleClose();
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
}
