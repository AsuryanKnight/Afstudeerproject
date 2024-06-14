const jsonServer = require('json-server')
const path = require('path')
const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Custom routes
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// Add this before server.use(router)
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
}))

server.use(router)
server.listen(4000, () => {
  console.log('JSON Server is running on port 4000')
})
