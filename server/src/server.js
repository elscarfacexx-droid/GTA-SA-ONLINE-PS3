const net = require("net"); const PORT = 7777; 
const MAX_PLAYERS = 64; const players = new Map(); 
let nextId = 1; function broadcast(message, 
exceptId) {
  for (const [id, player] of players) { if (id !== 
    exceptId && !player.socket.destroyed) {
      player.socket.write(message + "\n");
    }
  }
}
const server = net.createServer((socket) => { if 
  (players.size >= MAX_PLAYERS) {
    socket.end("Servidor cheio\n"); return;
  }
  const id = nextId++; const player = { id, name: 
    `Jogador${id}`, x: 0, y: 0, z: 0, socket
  };
  players.set(id, player); 
  socket.setEncoding("utf8"); 
  socket.write(`BEM-VINDO ID:${id} 
  NOME:${player.name}\n`); 
  console.log(`${player.name} conectado`); 
  socket.on("data", (data) => {
    const messages = data.toString().split("\n"); 
    for (const line of messages) {
      const message = line.trim(); if (!message) 
      continue; if (message.startsWith("NOME:")) {
        player.name = 
        message.slice(5).trim().slice(0, 20); 
        socket.write(`NOME_ATUALIZADO:${player.name}\n`);
      }
      if (message.startsWith("POS:")) { const 
        coords = 
        message.slice(4).split(",").map(Number); if 
        (coords.length === 3 && 
        coords.every(Number.isFinite)) {
          [player.x, player.y, player.z] = coords; 
          broadcast(
            `POSICAO:${id},${player.name},${player.x},${player.y},${player.z}`, 
            id
          );
        }
      }
      if (message === "LISTA") { for (const p of 
        players.values()) {
          socket.write( 
            `PLAYER:${p.id},${p.name},${p.x},${p.y},${p.z}\n`
          );
        }
      }
    }
  });
  socket.on("close", () => { players.delete(id); 
    broadcast(`SAIU:${id}`, id); 
    console.log(`${player.name} desconectado`);
  });
  socket.on("error", () => { players.delete(id);
  });
});
server.listen(PORT, "0.0.0.0", () => { 
  console.log("GTA SA Online iniciado!"); 
  console.log("Porta:", PORT); 
  console.log("Limite:", MAX_PLAYERS);
});0

