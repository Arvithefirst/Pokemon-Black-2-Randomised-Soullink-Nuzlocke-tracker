const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`📄 Request for: ${req.url}`);
    
    // Serve index.html
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        
        console.log(`🔍 Looking for file at: ${filePath}`);
        console.log(`📁 Current directory: ${__dirname}`);
        console.log(`📋 Files in directory:`, fs.readdirSync(__dirname));
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.error('❌ index.html NOT FOUND!');
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                <body style="background:#121212;color:#fff;font-family:sans-serif;padding:20px;">
                    <h1>❌ Error: index.html not found</h1>
                    <p>The server couldn't find index.html</p>
                    <p><strong>Expected location:</strong> ${filePath}</p>
                    <p><strong>Files in folder:</strong> ${fs.readdirSync(__dirname).join(', ')}</p>
                    <p>Make sure your HTML file is named "index.html" and is in the same folder as server.js</p>
                </body>
                </html>
            `);
            return;
        }
        
        // Read and serve the file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('❌ Error reading file:', err);
                res.writeHead(500);
                res.end('Error reading index.html: ' + err.message);
                return;
            }
            console.log('✅ Serving index.html');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

let gameState = {
    pairs: [],
    sliderState: {
        statWeight: 0.5,
        typeWeight: 0.5,
        wildDangerMultiplier: 1.0
    },
    playerNames: { p1: 'Player 1', p2: 'Player 2' },
    levelCaps: []
};

wss.on('connection', (ws) => {
    console.log('🟢 Client connected. Total:', wss.clients.size);
    
    // Send current state
    ws.send(JSON.stringify({
        type: 'fullSync',
        data: gameState
    }));
    
    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);
            
            if (msg.type === 'updatePairs') {
                gameState.pairs = msg.data;
                broadcast({ type: 'pairsSync', data: gameState.pairs }, ws);
            } else if (msg.type === 'updateSliders') {
                gameState.sliderState = msg.data;
                broadcast({ type: 'sliderSync', data: gameState.sliderState }, ws);
            } else if (msg.type === 'namesSync') {
                gameState.playerNames = msg.data;
                broadcast({ type: 'namesSync', data: gameState.playerNames }, ws);
            } else if (msg.type === 'levelCapsSync') {
                gameState.levelCaps = msg.data;
                broadcast({ type: 'levelCapsSync', data: gameState.levelCaps }, ws);
            }
        } catch (error) {
            console.error('Message error:', error);
        }
    });
    
    ws.on('close', () => {
        console.log('🔴 Client disconnected. Total:', wss.clients.size);
    });

    ws.on('error', (err) => {
        console.error('⚠️ WebSocket client error:', err.message);
    });
});

function broadcast(message, exclude = null) {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (127.0.0.1) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost'; // fallback if nothing found
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running! Have your friends connect to: ws://${getLocalIP()}:${PORT}`);
    console.log('========================================');
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`📋 Files available: ${fs.readdirSync(__dirname).join(', ')}`);
    console.log('========================================');
});