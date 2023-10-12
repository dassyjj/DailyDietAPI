import http from 'node:http'
import { jsonMiddleware } from './middlewares/jsonMiddleware.js'
import { routes } from './routes/routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
  const {method, url} = req

  await jsonMiddleware(req, res)

  const route = routes.find(route => route.method === method && route.path.test(url))

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res)
  }

  return res.writeHead(400).end()
})

server.listen(3000)