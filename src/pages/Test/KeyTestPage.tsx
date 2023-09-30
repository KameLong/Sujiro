import React, {useState} from "react";
import {useKey} from "react-use";

export const KeyTestPage: React.FC = ():JSX.Element => {
    const [out,setOut]=useState("");
    useKey(e=>{
        console.log(e);
        setOut(()=>`key=${e.key}\ncode=${e.code}`);

        return true;
    },()=>{})
    return(
        <div>
            {
                out.split("\n").map(item=>{
                    return(<div>{item}</div>)
                    }
                )
            }
        </div>
    )

}
