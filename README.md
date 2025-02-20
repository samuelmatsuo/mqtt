# MQTT - Message Queuing Telemetry Transport

Este projeto demonstra o uso do protocolo MQTT para comunicação entre dispositivos, utilizando o HiveMQ como broker.

## Configuração do Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/samuelmatsuo/mqtt.git
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o broker MQTT:**

   - No arquivo `src/mqttCliente.ts`, substitua o parâmetro `options` do `mqtt.connect` por:
     ```typescript
     mqtt.connect("mqtt://broker.hivemq.com");
     ```
   - Ou crie uma conta gratuita no [HiveMQ Cloud](https://console.hivemq.cloud/) e utilize as credenciais fornecidas.

4. **Execute o projeto:**
   ```bash
   npm run start:tsc
   ```

---

## O que é MQTT?

O MQTT (Message Queuing Telemetry Transport) é um protocolo de comunicação leve baseado em mensagens, projetado para dispositivos de baixa potência e redes instáveis. Ele funciona no modelo publicador/assinante, onde um broker central gerencia as mensagens trocadas entre dispositivos.

### Analogia com Rádio de Comunicação

- **Estação de rádio (publicador):** Transmite uma mensagem em uma frequência específica.
- **Ouvintes (assinantes):** Recebem a mensagem se estiverem sintonizados na mesma frequência.
- **Broker:** Funciona como a torre de transmissão, garantindo que a mensagem chegue aos ouvintes corretos.

---

## Qualidade de Serviço (QoS)

O MQTT oferece três níveis de QoS para garantir a entrega das mensagens:

- **QoS 0 – "No mínimo uma vez":** Entrega de melhor esforço, sem garantia de recebimento.
- **QoS 1 – "Pelo menos uma vez":** Entrega garantida, mas pode haver duplicação.
- **QoS 2 – "Exatamente uma vez":** Entrega segura e única, sem duplicação.

---

## Last Will and Testament (LWT)

O LWT é um recurso do MQTT que informa outros clientes quando um dispositivo se desconecta inesperadamente. É como configurar uma mensagem automática para ser enviada caso o dispositivo se desconecte sem aviso.

### Exemplo de LWT

Imagine que você está em um grupo do WhatsApp, mas sua bateria acaba e você sai sem avisar. Antes de ficar sem bateria, você configura uma mensagem automática: "Se eu sair sem avisar, significa que minha bateria morreu." Quando isso acontece, o WhatsApp automaticamente envia essa mensagem para o grupo.

No MQTT, o LWT funciona da mesma forma. O cliente se inscreve em um tópico, mas se ele se desconectar inesperadamente, o broker publica uma mensagem pré-configurada para avisar os assinantes.

---

## TLS/SSL no MQTT

O TLS (Transport Layer Security) e o SSL (Secure Sockets Layer) são protocolos que garantem a segurança da comunicação no MQTT, criptografando os dados transmitidos entre o cliente e o broker.

### Analogia com Correio

- **Sem TLS/SSL:** Você escreve uma carta e a envia em um envelope transparente. Qualquer pessoa no caminho pode ler o conteúdo.
- **Com TLS/SSL:** Você coloca a carta dentro de um cofre lacrado, e só o destinatário tem a chave para abri-lo.

No MQTT, TLS/SSL criptografa a comunicação, impedindo que terceiros espionem ou modifiquem os dados enviados.

### Resumindo TLS/SSL

O broker e o cliente trocam certificados para verificar a identidade um do outro antes de estabelecer a conexão segura. Isso garante que apenas os dispositivos autorizados possam se comunicar e que os dados estejam protegidos contra interceptação.

---

## Mensagens Retidas (Retained Messages)

No MQTT, uma mensagem retida é aquela que o broker mantém armazenada para que novos assinantes a recebam assim que se conectarem, sem precisar esperar por uma nova publicação.

### Analogia com Quadro de Avisos

- **Sem mensagem retida:** Cada vez que alguém chega, precisa esperar o porteiro dar um recado. Se ninguém estiver falando naquele momento, a pessoa não recebe nenhuma informação.
- **Com mensagem retida:** O porteiro escreve o aviso no quadro. Agora, qualquer pessoa que chegar pode ler a informação imediatamente, mesmo que tenha sido publicada horas antes.

No MQTT, isso significa que o último valor publicado em um tópico fica armazenado no broker e é entregue automaticamente para qualquer novo assinante desse tópico.

## Estrutura do Projeto

### Conexão com o MQTT

A conexão com o MQTT é feita no arquivo `src/mqttClient.ts`, utilizando o HiveMQ Cloud como broker principal.

```typescript
const options: IClientOptions = {
  host: "{URL TLS MQTT}",
  port: "{PORT}",
  protocol: "{PROTOCOLO}",
  username: "{USERNAME_CLOUD}",
  password: "{PASSWORD_CLOUD}",
  will: {
    topic: "{TOPIC_CONTROLL}",
    payload: "{MESSAGE}",
    qos: { QoS_CONTROLL },
    retain: { TRUE_FALSE },
  },
};

mqtt.connect(options);
```

### Publicação e Inscrição

No arquivo `src/pubSub.ts`, são realizadas as operações de publicação, inscrição, escuta e controle de erros.

```typescript
client.on("connect", () => {
  // Inscrição no tópico padrão com QoS 0
  client.subscribe("{TOPIC}");

  // Publicação de mensagem
  client.publish(tableTopic, "{MESSAGE}", { retain: true });

  // Controle de erros
  client.on("error", (error) => console.error(error));
  client.on("offline", () => console.log("Offline"));
});

// Escuta de mensagens
client.on("message", (topic, message) => {
  // Lógica de tratamento das mensagens
});
```

### QoS no MQTT

No arquivo `src/qosInMqtt.ts`, são realizadas as inscrições nos tópicos com QoS 1 e 2, além da verificação de status do cliente.

```typescript
// Removendo todos os listeners para evitar duplicação de mensagens
client.removeAllListeners("message");

// Inscrição no tópico com QoS 1 ou 2
client.subscribe("{TOPIC}", { qos: {1 , 2} });

// Publicação de mensagem com QoS
client.publish("{TOPIC}", "{MESSAGE}", { qos: {1, 2} });

client.on("message", (topic, message) => {
  // Desinscrição do tópico para outras funções
  client.unsubscribe("{TOPIC}");
});
```

---

## Referências

Para mais informações sobre MQTT, QoS, LWT e TLS/SSL, acesse este [artigo](https://acesse.one/EpiPF).

---

Espero que esta versão esteja mais completa e organizada! Se precisar de mais ajustes, é só avisar. 😊
