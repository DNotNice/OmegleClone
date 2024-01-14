import { Server } from "socket.io";
import { Socket } from "socket.io";
import http from "http"
import { userManager } from "./managers/userManager";

const server = http.createServer(http);
const io = new Server(server , {
  cors : {
    origin:"*"
  }
});
const Usermanager = new userManager();

io.on('connection', (socket : Socket) => {
  console.log('a user connected');
  Usermanager.addUser("user1" , socket);
  socket.on("disconnect",()=>{
    Usermanager.removeUser(socket.id);
  })
});
server.listen(3000, () => {
  console.log('listening on *:3000');
});