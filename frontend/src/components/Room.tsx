import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import {  io } from "socket.io-client";

const URL = "http://localhost:3000"

export const Room = ()=>{
    const [searchParams , setSearchParams] = useSearchParams();
    const name =  searchParams.get('name');
    const[Lobby , setLobby]= useState(true);
    useEffect(()=>{
         
        //logic to init user to room
         const socket = io(URL)

         socket.on("send-offer",({roomId})=>{
            setLobby(false);
            alert("send offer pls");
            socket.emit("offer",{
                sdp:"",
                roomId 
            })
        })
         socket.on("offer",({roomId , offer})=>{
          alert("send answer pls");
          setLobby(false);
          socket.emit("answer",{
            sdp:"",
            roomId
          })

        })
         socket.on("answer",({roomId,offer})=>{
            setLobby(false);
          alert("connection done");
        })
         socket.on("lobby",()=>{
            setLobby(true);
         })
      
    } ,[name])
    if(Lobby) return <div>wait to get connected to someone</div>
    return  <div>
         Hi {name}
         <video width={400} height={400}/>
         <video width={400} height={400}/>
         </div>
}