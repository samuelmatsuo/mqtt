import { connectToBroker } from "./mqttClient";
import { clienteOn, test_qos1, test_qos2 } from "./qosInMqtt";

const client = connectToBroker();

const tableTopic = "table";

client.on("connect", () => {
  client.subscribe(tableTopic);

  client.publish(tableTopic, "Ping");
});
let contador = 0;

client.on("message", (topic, message) => {
  const messageStr = message.toString();
  if (messageStr === "Ping") {
    contador++;
    client.publish(topic, "Pong", () => {
      console.log(message + " " + contador);
    });
  } else if (messageStr === "Pong") {
    contador++;
    client.publish(topic, "Ping", () => {
      console.log(message + " " + contador);
    });
  }

  if (contador === 10) {
    test_qos1();
  }
  if (contador === 15) {
    test_qos2();
  }

  if (contador === 40) {
    console.log("aaaaaaaaaaaaaaa");
    clienteOn();
  }

  if (contador === 50) {
    contador = 0;
    client.disconnected;
  }
});
