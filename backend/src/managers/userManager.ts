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
        this.clearQueue()
        this.initHandlers(socket )
    }
    clearQueue(){
        if(this.queue.length < 2 ) return ;
        const user1 = this.users.find(x=>x.socket.id === this.queue.pop());
        const user2 = this.users.find(x=> x.socket.id === this.queue.pop());
        if(!user1 || !user2) return
        const room = this.roomManager.createRoom(user1 , user2)
    }
    
    removeUser(socketId  : string){ 
        this.users=  this.users.filter(x => x.socket.id === socketId)
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