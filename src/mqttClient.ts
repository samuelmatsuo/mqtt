import mqtt from "mqtt";
import dotenv from "dotenv";

dotenv.config();

const connectToBroker = () => {
  const brokerUrl = process.env.BROKER_URL || "mqtt://broker.hivemq.com";

  const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  };

  const client = mqtt.connect(brokerUrl, options);

  client.on("connect", () => {
    console.log("Connectado ao broker MQTT");
  });

  client.on("error", (error) => {
    console.error("Erro ao conectar ao broker MQTT", error);
  });

  return client;
};

export { connectToBroker };
