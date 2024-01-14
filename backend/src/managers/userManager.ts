import { Socket } from "socket.io";
import { roomManager } from "./roomManager";

export interface Users{
    name:string ,
    socket :Socket
}



export class userManager{
    private users : Users[];
    private queue : string[];
    private roomManager:roomManager
    constructor(){
        this.users = []
        this.queue = []
        this.roomManager = new roomManager()
    }


    addUser(name:string ,socket:Socket){
        this.users.push({
            name , socket
        })
        this.queue.push(socket.id)
        socket.send("lobby");
        this.clearQueue()
        this.initHandlers(socket )
    }


    clearQueue(){
        console.log("inside queue");
        console.log(this.queue.length);
        if(this.queue.length < 2 ) return ;

        console.log(this.users);
        console.log(this.queue);
        const id1 = this.queue.pop();
        const id2 = this.queue.pop();

        const user1 = this.users.find(x=>x.socket.id === id1);
        const user2 = this.users.find(x=> x.socket.id === id2);
        
        if(!user1 || !user2) return
        
        console.log("creating room");
        console.log("user1 ->" , user1)
        const room = this.roomManager.createRoom(user1 , user2);
        this.clearQueue()
    }
    

    removeUser(socketId  : string){ 
        const user=this.users.find(x=>x.socket.id === socketId); 
        this.users=  this.users.filter(x => x.socket.id !== socketId)
        this.queue = this.queue.filter(x=> x === socketId)
        
    }


    initHandlers( socket  : Socket){
        socket.on("offer",({sdp , roomId}: {sdp :string , roomId : string})=>{
             this.roomManager.onOffer(roomId ,sdp)
        })
        socket.on("answer",({sdp , roomId}: {sdp :string , roomId : string})=>{
             this.roomManager.onAnswer(roomId ,sdp)
        })
    }

}