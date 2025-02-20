import { connectToBroker } from "./mqttClient";
import { faker } from "@faker-js/faker";

const client = connectToBroker();
//setando os tópico

export function test_qos1() {
  const Qos_1 = "Qos_1";
  const msg = faker.word.sample();

  client.removeAllListeners("message");

  client.subscribe(Qos_1, { qos: 1 }, () => {
    console.log("Inscrito no tópico QoS 1");
  });

  client.on("message", (topic, message) => {
    if (topic === Qos_1) {
      console.log(`tópico: ${Qos_1}, mensagem: ${message}`);
    }
    // Não está mais inscrito no tópico do QoS1
    client.unsubscribe(Qos_1);
  });

  client.publish(Qos_1, msg, { qos: 1 }, () => {
    console.log("Mensagem QoS 1 " + msg);
  });

  client.on("error", (error) => console.error("QoS 1: " + error));
  client.on("offline", () => console.log("Offline Qos1"));
}

export function test_qos2() {
  const Qos_2 = "Qos_2";
  const msg = faker.word.sample();

  client.removeAllListeners("message");

  client.subscribe(Qos_2, { qos: 2 }, () => {
    console.log("Inscrito no tópico QoS 2");
  });

  client.on("message", (topic, message) => {
    if (topic === Qos_2) {
      console.log(`tópico: ${Qos_2}, mensagem: ${message.toString()} `);
    }
    client.unsubscribe(Qos_2);
  });

  client.publish(Qos_2, msg, { qos: 2 }, () => {
    console.log("Mensagem QoS 2: " + msg);
  });

  client.on("error", (error) => console.error("QoS 2: " + error));
  client.on("offline", () => console.log("Offline QoS2"));
}

export function clienteOn(clienteConnection: any) {
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
}
