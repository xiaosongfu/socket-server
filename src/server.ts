import http, {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  res.write('hello world')
  res.end()
});

server.listen(9090, () => {
  console.log("server is listening")
})
