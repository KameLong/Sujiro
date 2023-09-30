import React, {useState} from "react";
import {useKey} from "react-use";

export const KeyTestPage: React.FC = ():JSX.Element => {
    const [out,setOut]=useState("");
    useKey(e=>{
        setOut(()=>`key=$(e.key)`);

        return true;
    },()=>{})
    return(
        <div>
            {out}
        </div>
    )

}
