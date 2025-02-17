import { connectToBroker } from "./mqttClient";
import { clienteOn, test_qos1, test_qos2 } from "./qosInMqtt";

const client = connectToBroker();

const tableTopic = "table";

client.on("connect", () => {
  client.subscribe(tableTopic);

  client.publish(tableTopic, "Ping");
});
let contador = 0;
let contadorQoS1 = 0;
let contadorQoS2 = 0;

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
    contadorQoS1++;
    console.log(`passando pela ${contadorQoS1}º no QoS1`);
    test_qos1(contadorQoS1);
  }
  if (contador === 15) {
    contadorQoS2++;
    console.log(`passando pela ${contadorQoS2}º no QoS2`);
    test_qos2(contadorQoS2);
  }

  if (contador === 20) {
    clienteOn(client);
  }

  if (contador === 25) {
    contador = 0;
  }
});
