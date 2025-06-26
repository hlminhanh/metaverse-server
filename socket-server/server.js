const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

const clients = new Map();

// Thêm dòng log báo server đã khởi động
console.log('✅ WebSocket Server đang chạy tại ws://localhost:3000');

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
