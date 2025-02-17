import mqtt from "mqtt";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const connectToBroker = () => {
  const brokerUrl = process.env.BROKER_URL || "ssl://broker.hivemq.com";
  const options = {
    protocol: "mqtts",
    host: "broker.hivemq.com",
    port: 8883,
    ca: [fs.readFileSync("/path/to/ca.crt")],
    cert: fs.readFileSync("/path/to/client.crt"),
    key: fs.readFileSync("/path/to/client.key"),
  };

  const client = mqtt.connect(options);

  client.on("connect", () => {
    console.log("Connectado ao broker MQTT");
  });

  client.on("error", (error) => {
    console.error("Erro ao conectar ao broker MQTT", error);
  });

  return client;
};

export { connectToBroker };
