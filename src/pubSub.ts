import { connectToBroker } from "./mqttClient";
import { clienteOn, test_qos1, test_qos2 } from "./qosInMqtt";
//utilizado let no contador pq pode mudar o valor da variável
let contador = 0;
let contadorQoS1 = 0;
let contadorQoS2 = 0;
//instanciando a conexão do mqtt
const client = connectToBroker();
//criando uma váriavel constante do tópico para realizar teste no QoS 0
const tableTopic = "table";

//tratamento de eventos quando o cliente "mqtt" estiver connectando
client.on("connect", () => {
  //se inscrevendo no tópico "table"
  client.subscribe(tableTopic);
  //Publicando mensagem "Ping" para o tópico "table"
  client.publish(tableTopic, "Ping", { retain: true });
  client.on("error", (error) => console.error(error));
  client.on("offline", () => console.log("Offline"));
});
//Recebendo as mensagem que estiverem no tópico
client.on("message", (topic, message) => {
  //setando a message para string na váriavel messageStr
  const messageStr = message.toString();
  if (messageStr === "Ping") {
    //se a mensagem do tópico for Ping vai publicar a mensagem para o subscriber que está setado Pong
    client.publish(topic, "Pong", () => {
      contador++;
      console.log(`${message} ${contador}`);
    });
  } else if (messageStr === "Pong") {
    //se a mensagem do tópico for Pong vai publicar a mensagem para o subscriber que está setado Ping
    client.publish(topic, "Ping", () => {
      contador++;
      console.log(`${message} ${contador}`);
    });
  }
  //se o contador dos publish for 10 vai utilizar a qualidade de serviço nível 1
  if (contador === 10) {
    contadorQoS1++;
    console.log(`passando pela ${contadorQoS1}º no QoS1`);
    client.disconnecting;
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
