const net = require("net");
const readline = require("readline");

const socket = net.connect(7777, "127.0.0.1");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

socket.setEncoding("utf8");

socket.on("connect", () => {
  console.log("Jogador conectado!");
  console.log("Comandos: nome Vinny | pos 100 200 30 | lista");
});

socket.on("data", data => console.log(data.toString()));

rl.on("line", line => {
  const p = line.trim().split(" ");

  if (p[0] === "nome") {
    socket.write("NOME:" + p.slice(1).join(" ") + "\n");
  } else if (p[0] === "pos" && p.length === 4) {
    socket.write("POS:" + p[1] + "," + p[2] + "," + p[3] + "\n");
  } else if (p[0] === "lista") {
    socket.write("LISTA\n");
  }
});
