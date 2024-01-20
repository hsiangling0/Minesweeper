import { useState,useEffect } from "react";
import { Text } from "@chakra-ui/react";

function Time(props){
    const [time,setTime]=useState(0);
    useEffect(()=>{
        setTime(0);
        const intervalTime=setInterval(()=>{setTime((prevTime=>prevTime+1))},1000);
        return () => clearInterval(intervalTime);
    },[props.game])
    return(
        <Text>{time}</Text>
    )
}
export default Time;