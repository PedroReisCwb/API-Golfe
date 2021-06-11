import Socket from 'App/Services/Socket'
import Redis from '@ioc:Adonis/Addons/Redis'

Socket.boot()

var clients = {}

Socket.io.on('connection', socket => {
    socket.on('joinSocket', async ( userID ) => {
        clients[ socket.id ] = userID;
        socket.emit('lockList')
        //console.log('ID conectado: ' + clients[ socket.id ] + ' - Socket: ' + socket.id)
    })

    socket.on('lockTime', async (data, expire) => {
        await Redis.set(`GLF-LT-${data.id_user}`, JSON.stringify(data), 'ex', expire )
        socket.broadcast.emit('lockList')
        socket.emit('lockList')
    })

    socket.on('unlockTime', async user => {
        await Redis.del(`GLF-LT-${user}`)
        socket.broadcast.emit('lockList')
        socket.emit('lockList')
    })

    socket.on('disconnect', async () => {
        if( clients[ socket.id ]){
            //console.log('ID Desconectado: ' + clients[ socket.id ] + ' - Socket: ' + socket.id);

            await Redis.del(`GLF-LT-${clients[socket.id]}`)
            socket.broadcast.emit('lockList')
            delete clients[socket.id];
            socket.disconnect()
        }
    });
})
