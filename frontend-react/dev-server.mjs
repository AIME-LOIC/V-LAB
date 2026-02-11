import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || '0.0.0.0';
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || 'http://127.0.0.1:5000';

const MIME = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.ico', 'image/x-icon'],
]);

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Length': Buffer.byteLength(body), ...headers });
  res.end(body);
}

function notFound(res) {
  send(res, 404, 'Not Found', { 'Content-Type': 'text/plain; charset=utf-8' });
}

async function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME.get(ext) || 'application/octet-stream';
  const body = await readFile(filePath);
  res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': body.length });
  res.end(body);
}

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0]);
  const p = decoded === '/' ? '/index.html' : decoded;
  const resolved = path.resolve(root, '.' + p);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

async function proxyApi(req, res) {
  const targetUrl = new URL(req.url, BACKEND_ORIGIN);
  const headers = { ...req.headers };
  delete headers.host;

  const proxyReq = http.request(
    targetUrl,
    {
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (e) => {
    send(
      res,
      502,
      `Bad Gateway: ${String(e.message || e)}\nBackend: ${BACKEND_ORIGIN}\n`,
      { 'Content-Type': 'text/plain; charset=utf-8' }
    );
  });

  req.pipe(proxyReq);
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) return notFound(res);

    if (req.url.startsWith('/api/')) {
      return proxyApi(req, res);
    }

    const filePath = safeJoin(__dirname, req.url);
    if (!filePath) return notFound(res);

    const info = await stat(filePath).catch(() => null);
    if (!info || !info.isFile()) {
      const ext = path.extname(filePath);
      if (!ext) {
        const indexPath = path.join(__dirname, 'index.html');
        return sendFile(res, indexPath);
      }
      return notFound(res);
    }

    return sendFile(res, filePath);
  } catch (e) {
    send(res, 500, `Server Error: ${String(e.message || e)}`, { 'Content-Type': 'text/plain; charset=utf-8' });
  }
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`V-LAB frontend running: http://127.0.0.1:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Proxying /api/* to: ${BACKEND_ORIGIN}`);
});
