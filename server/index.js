const crypto = require('crypto');
const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

const server = createServer(app);
const wss = new WebSocket.Server({ server });

function byteArrayToNumbers(byteArray) {
  // Créer un tableau de nombres à partir du tableau de bytes
  var numbersArray = new Uint8Array(byteArray);
  return Array.from(numbersArray);
}

function byteArrayToFloatArray(byteArray) {
  // Vérifier que la longueur du tableau est un multiple de 4 (chaque float est représenté par 4 bytes)
  if (byteArray.length % 4 !== 0) {
      console.error("La longueur du tableau de bytes n'est pas valide pour une conversion en float.");
      return null;
  }

  var floatArray = new Float32Array(byteArray.length / 4);
  var byteBuffer = new Uint8Array(4);

  for (var i = 0; i < byteArray.length; i += 4) {
      // Lire 4 bytes consécutifs dans le tableau de bytes
      byteBuffer[0] = byteArray[i];
      byteBuffer[1] = byteArray[i + 1];
      byteBuffer[2] = byteArray[i + 2];
      byteBuffer[3] = byteArray[i + 3];

      // Convertir les 4 bytes en un nombre flottant et l'assigner à la position correspondante dans le tableau de float
      floatArray[i / 4] = new DataView(byteBuffer.buffer).getFloat32(0, true); // true pour spécifier little-endian
  }

  return floatArray;
}

let appWebsocket = null;

wss.on('connection', function(ws) {
  console.log("client joined.");

  ws.on('message', function(data) {
    if (typeof(data) === "string") {
     
      if (data === "app") {
        ws.send("server");
        appWebsocket = ws;
      }

    } else {
      const leapData = byteArrayToFloatArray(data);

      const hand = {
        id: leapData[0],
        x: leapData[1],
        y: leapData[2],
        z: leapData[3],
      }

      if (appWebsocket !== null) {
        appWebsocket.send(JSON.stringify(hand));
      }
    }
  });

  ws.on('close', function() {
    console.log("client left.");
    // clearInterval(textInterval);
    // clearInterval(binaryInterval);
  });
});

server.listen(port, function() {
  console.log(`Listening on http://localhost:${port}`);
});
