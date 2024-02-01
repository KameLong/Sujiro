import React from 'react';
import {Button} from "@mui/material";
import {
    GoogleAuthProvider,
    signInWithPopup,
    UserCredential,
    signOut, getAuth,
} from 'firebase/auth';
import { auth } from "../firebase";
const Signin = () => {
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
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
            <div className="login">
                <h1>ログイン</h1>
            </div>
            <div className="signin_button">
                <Button  onClick={()=>loginWithGoogle()} >google signin</Button>
            </div>
        </div>
    );
}

export default Signin