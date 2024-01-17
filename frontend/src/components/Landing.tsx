import { useEffect, useRef, useState } from "react"
import { Room } from "./Room";

export const Landing = () =>{
    const [name , setName] = useState("")
    const [joined, setJoined] = useState(false);
    const [localaudiotrack , setLocalaudiotrack] = useState<null   | MediaStreamTrack >(null);
    const [localvideotrack , setLocalvideotrack] = useState<null   | MediaStreamTrack >(null);
    const Videoref = useRef<HTMLVideoElement>(null);
    const getCam= async()=>{
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video:true,
            audio:true
        })
        const video =  stream.getVideoTracks()[0];
        const audio = stream.getAudioTracks()[0];
        setLocalvideotrack(video);
        setLocalaudiotrack(audio);
        if(!Videoref.current)return;
        Videoref.current.srcObject = new MediaStream([video])
        Videoref.current.play()
    }
    useEffect(()=>{
        if(Videoref && Videoref.current){
            getCam() }
        },[Videoref])

        if(!joined){
                return <div>
                <video autoPlay ref={Videoref}></video>
                <input type="text" onChange={(e)=>{ setName(e.target.value)}}/>
                <button onClick={()=>{
                    setJoined(true)
                }}>Enter a room </button>
                </div>
            }
        return <Room name={name}  localaudiotrack = {localaudiotrack} localvideotrack = {localvideotrack}/>     
}