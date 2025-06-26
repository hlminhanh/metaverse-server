const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

const clients = new Map();

console.log(`✅ WebSocket Server đang chạy tại ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  let username = '';

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      username = data.username;
      clients.set(username, ws);
      console.log(`✅ ${username} đã kết nối`);
    }

    if (data.type === 'move') {
      // Gửi vị trí này tới tất cả người chơi khác
      for (let [name, client] of clients.entries()) {
        if (name !== username && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'playerMove',
            username,
            position: data.position
          }));
        }
      }
    }
  });

  ws.on('close', () => {
    clients.delete(username);
    console.log(`❌ ${username} đã thoát`);
  });
});
