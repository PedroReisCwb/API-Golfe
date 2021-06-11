import { Server } from 'socket.io'
import AdonisServer from '@ioc:Adonis/Core/Server'

class Socket {
    public io: Server
    private booted = false

    public boot(){
        if( this.booted ){
            return
        }

        this.booted = true
        //this.io = new Server(AdonisServer.instance!)
        this.io = new Server(AdonisServer.instance!, {
            cors: {
                origin: 'http://localhost:3000',
                //methods: ["GET", "POST"]
            //   origin: '*'
            }
        })
    }
}

export default new Socket()
