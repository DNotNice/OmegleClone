import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom";
import {  Socket, io } from "socket.io-client";

const URL = "http://localhost:3000"

export const Room = ({
  name ,
  localaudiotrack,
  localvideotrack
} : {
   name :string, 
   localaudiotrack : MediaStreamTrack | null,
   localvideotrack  : MediaStreamTrack | null
})=>{
    const [searchParams , setSearchParams] = useSearchParams();
    const[Lobby , setLobby]= useState(true);
    const [socket , setSocket] = useState<null|Socket>(null);
    const [sendingPc , setSendingPC] = useState<null | RTCPeerConnection>(null);
    const [receivingPc , setreceivingPC] = useState<null | RTCPeerConnection>(null);
    const [remotevideotrack , setRemotevideotrack] = useState<null | MediaStreamTrack >(null);
    const [remoteaudiotrack , setremoteaudiotrack] = useState<null | MediaStreamTrack >(null);
    const [remoteMediastream , setremoteMediastream] = useState<null | MediaStream>(null)
    const remotevideoref = useRef<HTMLVideoElement | null >();
    const localvideoref=  useRef<HTMLVideoElement | null >() ;

    useEffect(()=>{
         
        //logic to init user to room
         const socket = io(URL)
        console.log("inside useEffect")
         socket.on("send-offer",async({roomId})=>{
            setLobby(false);
            const pc = new RTCPeerConnection();
            setSendingPC(pc);

            if(localaudiotrack)pc.addTrack(localaudiotrack);
            if(localvideotrack)pc.addTrack(localvideotrack);
            
            pc.onicecandidate = async()=>{
              const sdp = await pc.createOffer();
            
            socket.emit("offer",{
                sdp,
                roomId 
            })}
        });


         socket.on("offer",async({roomId , sdp:remoteSdp})=>{
          setLobby(false);
          const pc = new RTCPeerConnection();
          pc.setRemoteDescription(remoteSdp)
          const sdp =await pc.createAnswer();
          const mediaStream  = new MediaStream();
          if(remotevideoref.current)remotevideoref.current.srcObject = mediaStream
          setremoteMediastream(mediaStream);
          setreceivingPC(pc);
          pc.ontrack = (({track ,type})=>{
            if(type =='audio'){
              //@ts-ignore
              remotevideoref.current.srcObject.addTrack(track)
            }else{
              //@ts-ignore
              remotevideoref.current.srcObject = mediaStream
            }
            //@ts-ignore
            remotevideoref.current.play();
          })
          socket.emit("answer",{
            sdp , roomId
          })

        });



         socket.on("answer",({roomId,sdp :remoteSdp})=>{
            setLobby(false);
            setSendingPC(pc=>{
              pc?.setRemoteDescription({
                type:"answer",
                sdp:remoteSdp
              })
              return pc ;
            })
        })

        
        socket.on("lobby",()=>{
          setLobby(true);
        })
        
        setSocket(socket)

    } ,[name])

    useEffect(()=>{
        if(localvideoref.current) {
        if(localvideotrack){
                  localvideoref.current.srcObject = new MediaStream([localvideotrack]);
                  localvideoref.current.play();
        } 
      }
    },[localvideoref])


    return  <div>
         Hi {name}
         <video autoPlay width={400} height={400} ref= {localvideoref}/>
         {Lobby ?"waiting to connect to someone" : null}
         <video autoPlay width={400} height={400} ref ={remotevideoref}/>
         </div>
}