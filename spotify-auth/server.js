// Simple HTTP server to serve our HTML files
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;

const server = http.createServer((req, res) => {
  // Parse the URL but ignore the query string for file path resolution
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Get the file path
  let filePath = '.' + pathname;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // For callback URL, always serve callback.html regardless of parameters
  if (pathname === '/callback.html') {
    // Keep the file path as callback.html, but ignore any query parameters
    filePath = './callback.html';
  }

  // Determine the content type based on file extension
  const extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        // Page not found
        fs.readFile('./404.html', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Open this URL in your browser to start the authentication process');
});