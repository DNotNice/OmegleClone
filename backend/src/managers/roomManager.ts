import { Users } from "./userManager";
let GLOBAL_ROOM_ID = 1;
export interface Room {
    user1 : Users , 
    user2 : Users
}
export class roomManager{
    private rooms : Map<string , Room>
    constructor(){
        this.rooms = new Map<string , Room>();
    }

    generateId(){ return GLOBAL_ROOM_ID++;  }
    
    createRoom(user1 :Users , user2 : Users ){
        const roomId = this.generateId();
        this.rooms.set(roomId.toString() ,{user1 , user2 })
         
        user1?.socket.emit("send-offer" , {
            roomId
        })
    }

    onOffer(roomId : string , sdp:string){
        const user2 = this.rooms.get(roomId)?.user2;
        user2?.socket.emit("offer",{
            sdp,roomId
        })

    }
    onAnswer(roomId : string , sdp:string){
        const user1= this.rooms.get(roomId)?.user1;
        user1?.socket.emit("answer",{
            sdp,roomId
        })

    }
    
}