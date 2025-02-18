import { connectToBroker } from "./mqttClient";

const client = connectToBroker();
const Qos_1 = "Qos_1";
const Qos_2 = "Qos_2";

const test_qos1 = (contadorQoS1: any) => {
  console.log("aaaaaaaaaaaa");

  client.on("connect", () => {
    client.subscribe(Qos_1, { qos: 1 }, () => {
      console.log("Inscrito QoS 1");
    });
    client.publish(Qos_1, contadorQoS1.toString(), { qos: 1 }, () => {
      console.log("Mensagem QoS 1 " + contadorQoS1);
    });
    client.on("error", (error) => console.error("QoS 1: " + error));
    client.on("offline", () => console.log("Offline"));
  });

  client.on("message", (topic, message) => {
    if (topic === Qos_1) {
      console.log(`tópico: ${Qos_1}, mensagem: ${message}`);
    }
  });
  console.log("aaaaaaaaaaaaaaaaaaaaaaasssssa");

  //client.end();
};
const test_qos2 = (contadorQoS2: any) => {
  client.subscribe(Qos_2, { qos: 2 }, (err) => {
    if (err) {
      console.error("Erro ao se inscrever no tópico (QoS 2)", err);
    } else {
      console.log("Inscrito no tópico QoS 2");
    }
  });
  client.on("message", (topic, message) => {
    if (topic === Qos_2) {
      console.log(`tópico: ${Qos_2}, mensagem: ${message.toString()} `);
    }
  });

  client.publish(Qos_2, contadorQoS2.toString(), { qos: 2 }, (err) => {
    if (err) {
      console.error("Erro ao publicar a mensagem (QoS 2)", err);
    }
    console.log("Mensagem QoS 2: " + contadorQoS2);
  });
};
const clienteOn = (clienteConnection: any) => {
  if (clienteConnection.connected) {
    return console.log("Cliente já conectado? " + clienteConnection.connected);
  }
  client.on("connect", () => {
    console.log("Conectado ao broker MQTT");
    //test_qos2();
  });

  client.on("error", (error) => {
    console.error("Erro ao conectar ao broker MQTT", error);
  });

  console.log("Tentando conectar ao broker MQTT novamente...");
  client.reconnect();
};
export { test_qos1, test_qos2, clienteOn };
