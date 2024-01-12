import { Socket } from "socket.io";
export interface Users{
    name:string ,
    socket :Socket
}
export class userManager{
    private users : Users[];
    private queue : string[];
    constructor(){
        this.users = []
        this.queue = []
    }
    addUser(name:string ,socket:Socket){
        this.users.push({
            name , socket
        })
        this.queue.push(socket.id)
        this.clearQueue()
    }
    clearQueue(){
        if(this.queue.length < 2 ) return ;
        const user1 = this.users.find(x=>x.socket.id === this.queue.pop());
        const user2 = this.users.find(x=> x.socket.id === this.queue.pop());
       
        user1?.socket.emit("new-room" , {
            type:"send-offer" 
        })
    }
    
    removeUser(socketId  : string){ 
        this.users=  this.users.filter(x => x.socket.id === socketId)
        this.queue = this.queue.filter(x=> x === socketId)
        
    }

}