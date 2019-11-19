import http, {IncomingMessage, ServerResponse} from 'http'
import socketIO from 'socket.io'
import pino from 'pino'
import pinoHttp from 'pino-http'

const logger = pino({
  level: "debug",
})
const loggerHttp = pinoHttp({
  logger: logger,
})

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  loggerHttp(req, res)
  req.log.info('pino-http-test')

  res.write('hello world')
  res.end()
});

// 给本连接发送消息： socket.emit()
// 给某个房间内的所有人发送消息： io.in(room).emit()
// 除本连接外，给某个房间内所有人发送消息：socket.to(room).emit()
// 除本连接外，给所有人发送消息：socket.broadcast.emit()
const io = socketIO.listen(server)
io.on('connection', socket => {
  logger.debug(`${socket.id} connect!`)

  // disconnect 是内置事件
  socket.on('disconnect', args => {
    logger.debug(`${socket.id} disconnect!`)
  })

  // -----------------------------------------
  // -----------------------------------------

  // join 是自定义事件
  socket.on('join', (roomName, userName) => {
    // 进入房间
    socket.join(roomName)

    // 发广播通知用户加入
    socket.to(roomName).emit('joined', roomName, userName)
    logger.debug(`${socket.id} joined!`)
  })
  // leave 是自定义事件
  socket.on('leave', (roomName, userName) => {
    // 退出房间
    socket.leave(roomName)

    // 发广播通知用户离开
    socket.to(roomName).emit('leaved', roomName, userName)
    logger.debug(`${socket.id} leaved!`)
  })
  // message 是自定义事件
  socket.on('message', (roomName, userName, msg) => {
    socket.to(roomName).emit('message', roomName, userName, msg)
  })
})

const port = process.env.PORT || 9090
server.listen(port, () => {
  logger.debug(`server is listening on localhost: ${port}`)
})
