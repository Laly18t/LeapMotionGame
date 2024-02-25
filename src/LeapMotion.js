const lerp = (a, b, t) => (b - a) * t + a;
const unlerp = (a, b, t) => (t - a) / (b - a);
const map = (t, a1, b1, a2, b2) => lerp(a2, b2, unlerp(a1, b1, t));

const clamp = (input, min, max) => {
  return input < min ? min : input > max ? max : input;
};

const deg2rad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

const rad2deg = (radians) => {
  return (radians * 180) / Math.PI;
};

const debugElement = document.querySelector(".debug");

const mapPositionToViewport = (
  value,
  minInput,
  maxInput,
  minOutput,
  maxOutput
) => {
  const viewportPosition = map(value, minInput, maxInput, minOutput, maxOutput);
  return clamp(viewportPosition, minOutput, maxOutput);
};

// function handleLeapData(position) {

//   const positionX = mapPositionToViewport(
//     position.x,
//     minX,
//     maxX,
//     0,
//     viewportWidth - debugWidth
//   );
//   const positionY =
//     mapPositionToViewport(
//       position.y,
//       minY,
//       maxY,
//       0,
//       viewportHeight - debugHeight
//     ) * -1;

//   debugElement.style.transform = `translate(${positionX}px, ${positionY}px)`;
//   // console.log(position.z)
// }

export default class LeapMotion {
  constructor(callback) {
    this.callback = callback;

    // Créer une connexion WebSocket
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", () => {
      socket.send("app");
    });

    // Écouter les messages
    socket.addEventListener("message", (event) => {
      if (typeof event.data === "string" && event.data === "server") {
        console.log("connecté au serveur");
      } else {
        const data = JSON.parse(event.data);
        this.handleLeapData(data);
      }
    });
  }

  handleLeapData({ x, y }) {
    const minX = 0.16;
    const maxX = -0.2;

    const minY = 1.2;
    const maxY = 0.96;

    const positionX = mapPositionToViewport(x, minX, maxX, 0, 1);

    const positionY = mapPositionToViewport(y, minY, maxY, 0, 1);

    this.callback({
      x: positionX,
      y: positionY,
    });
  }
}
