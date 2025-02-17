import { connectToBroker } from "./mqttClient";

const client = connectToBroker();
const Qos_1 = "Qos_1";
const Qos_2 = "Qos_2";

const test_qos1 = () => {
  client.subscribe(Qos_1, { qos: 1 }, (err) => {
    if (err) {
      console.error("Erro ao se inscrever no tópico (QoS 1)", err);
    } else {
      console.log("Inscrito com sucesso no tópico QoS 1");
    }
  });

  client.on("message", (topic, message) => {
    if (topic === Qos_1) {
      console.log(
        `Mensagem recebida no tópico ${Qos_1}: ${message.toString()}`
      );
    }
  });

  client.publish(Qos_1, "teste QoS 1", { qos: 1 }, (err) => {
    if (err) {
      console.error("Erro ao publicar a mensagem (QoS 1)", err);
    } else {
      console.log("Mensagem QoS 1 publicada com sucesso");
    }
  });
  client.end();
};
const test_qos2 = () => {
  client.subscribe(Qos_2, { qos: 2 }, (err) => {
    if (err) {
      console.error("Erro ao se inscrever no tópico (QoS 2)", err);
    } else {
      console.log("Inscrito com sucesso no tópico QoS 2");
    }
  });
  let messageCount = 0;

  client.on("message", (topic, message) => {
    if (topic === Qos_2) {
      messageCount++;
      console.log(
        `Mensagem recebida no tópico (QoS 2) ${Qos_2}: ${message.toString()}`
      );
      console.log(`Contagem de mensagens recebidas (QoS 2): ${messageCount}`);
    }
  });

  client.publish(Qos_2, "teste QoS 2", { qos: 2 }, (err) => {
    if (err) {
      console.error("Erro ao publicar a mensagem (QoS 2)", err);
    }
    console.log("Mensagem QoS 2 publicada com sucesso");
  });
};
const clienteOn = () => {
  client.on("connect", () => {
    console.log("Conectado ao broker MQTT");
    test_qos2();
  });

  client.on("error", (error) => {
    console.error("Erro ao conectar ao broker MQTT", error);
  });

  console.log("Tentando conectar ao broker MQTT novamente...");
  client.reconnect();
};
export { test_qos1, test_qos2, clienteOn };
