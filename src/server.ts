import http, {IncomingMessage, ServerResponse} from 'http'

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  res.write('hello world')
  res.end()
});

const port = process.env.NODE_ENV === 'production' ? 80 : 9090

server.listen(port, () => {
  console.log(`server is listening on localhost: ${port}`)
})
