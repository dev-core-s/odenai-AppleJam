import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Appwrite entrypoint handler
export default async ({ req, res }: any) => {
  // Construct a standard Fetch API Request from Appwrite's req
  const url = new URL(req.url, `${req.scheme}://${req.host}`)
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.bodyRaw,
  })

  // Route the request through Hono
  const response = await app.fetch(request)
  const body = await response.text()

  // Return the response back to Appwrite
  return res.send(body, response.status, Object.fromEntries(response.headers.entries()))
}

// Export app for local dev (src/dev.ts)
export { app }