const http = require('http');
const fs = require('fs');
const url = require('url');

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname;
    const timeStamp = new Date().toISOString();

    fs.appendFile('log.txt', `${timeStamp} - ${path}\n`, (err) => {
        if (err) throw err;
    });

    if (path === '/documentation') {
        fs.readFile('documentation.html', (err, data) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Error loading documentation.html');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    } else {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Error loading index.html');
            } else {
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            }
        });
    }
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});
