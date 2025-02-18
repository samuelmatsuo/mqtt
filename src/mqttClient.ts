import mqtt, { QoS, IClientOptions } from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const connectToBroker = () => {
  //Configurando o option com o will que é o LSW
  const options: IClientOptions = {
    //Utilizando a URL do hiveMq Cloud porta
    //URL está com TLS MQTT URL
    host:
      process.env.BROKER_URL || "olivebumble-inw1po.a01.euc1.aws.hivemq.cloud",
    port: 8883,
    //utilizando o mqtss que é o mqtt com SSL/TLS assim tendo uma proteção melhor doq usando somente MQTT
    //O protocolo deve ser utilizado mqtts junto com a URL se ela for TLS
    protocol: "mqtts",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    will: {
      topic: "Qos_1",
      payload: "Cliente desconectado inesperadamente",
      qos: 1 as QoS,
      retain: true,
    },
  };
  //configurando o client "mqtt" com as configurações options
  const client = mqtt.connect(options);
  //Conectando o cliente e retornando um log de mensagem para ter mais certeza
  client.on("connect", () => {
    console.log("Connectado ao broker MQTT");
  });
  //Tratamento de erro durante a conexão
  client.on("error", (error) => console.error(error));
  //Tratamento se por acaso ficar offline o cliente
  //Segunda validação, pois o LSW também vai verificar se está offline, mas somente com o QoS2
  client.on("offline", () => console.log("Offline"));
  //retornando o client para funções poder utilizar o mesmo.
  return client;
};

export { connectToBroker };
