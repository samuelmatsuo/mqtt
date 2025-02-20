# mqtt

baixe o projeto com o git clone https://github.com/samuelmatsuo/mqtt.git
depois instale os arquivos necessários com npm install
Dentro do arquivo mqttCliente.ts {src/mqttCliente.ts} substitua o parametro "options" do mqtt.connect por "mqtt://broker.hivemq.com" URL padrão de teste do HiveMq ou cria a conta gratuitamente ("https://console.hivemq.cloud/?utm_source=hivemq-com&utm_medium=download-page&utm_campaign=cloud&__hstc=184124345.4794427ec2d1c0f33fbf32d130e38c85.1739272164994.1740052510745.1740057499352.19&__hssc=184124345.1.1740057499352&__hsfp=3863904346&_gl=1*1i80soq*_gcl_au*ODcwNTgwMjM0LjE3MzkyNzI0Nzk.*_ga*MjEzODk2ODgwNy4xNzM5MjcyMTYz*_ga_P96XGQCLE4*MTc0MDA1NzQ5Ni4yNS4xLjE3NDAwNTc0OTkuNTcuMC4w")
Após isso execute o projeto com o comando npm run start:tsc

O que é MQTT (Message Queuing Telemetry Transport)

é um protocolo leve de comunicação baseado em mensagens, projetado para dispositivos de baixa potência e redes instáveis. Ele funciona no modelo publicador/assinante, onde um broker central gerencia as mensagens trocadas entre dispositivos.

Imagine um rádio de comunicação:

Uma estação de rádio (publicador) transmite uma mensagem em uma frequência específica.
Qualquer pessoa sintonizada nessa frequência (assinantes) recebe a mensagem.
O broker seria como a torre de transmissão, garantindo que a mensagem chegue aos ouvintes corretos.

Dentro do mqtt possui QoS´s (Quality of Service) de três níveis diferentes.

QoS 0 – "No mínimo uma vez" (Entrega Melhor Esforço)
é como enviar uma carta comum pelo correio sem rastreamento. Se chegar ótimo. Se não, não há como saber.

QoS 1 – "Pelo menos uma vez" (Entrega Garantida, mas pode duplicar)

Enviar uma carta registrada, mas sem saber se o destinatário vai receber várias cópias.

QoS 2 – "Exatamente uma vez" (Entrega Segura e Única)
Enviar uma carta registrada com aviso de recebimento e um processo para garantir que ela não seja entregue duas vezes.

Pode conferir mais basta acessar este artigo. (https://acesse.one/EpiPF)

O que é LWT (Last Will and Testament)

é um recurso do MQTT que informa outros clientes quando um dispositivo se desconecta inesperadamente.

Imagine que você está em um grupo do WhatsApp, mas sua bateria acaba e você sai sem avisar.
Antes de ficar sem bateria, você configura uma mensagem automática: "Se eu sair sem avisar, significa que minha bateria morreu."
Quando isso acontece, o WhatsApp automaticamente envia essa mensagem para o grupo.
O LWT funciona exatamente assim. O cliente se inscreveu a um tópico mas ele se desconectar inesperadamente, o broker publica essa mensagem para avisar os assinantes.

O que é TLS/SSL no MQTT?

O TLS (Transport Layer Security) e o SSL (Secure Sockets Layer) são protocolos que garantem a segurança da comunicação no MQTT, criptografando os dados transmitidos entre o cliente e o broker.

Imagine que você está enviando uma carta importante pelo correio:

Sem TLS/SSL: Você escreve a carta e a envia em um envelope transparente. Qualquer pessoa no caminho pode ler o conteúdo.

Com TLS/SSL: Você coloca a carta dentro de um cofre lacrado, e só o destinatário tem a chave para abri-lo.

No MQTT, TLS/SSL criptografa a comunicação, impedindo que terceiros espionem ou modifiquem os dados enviados.

Resumindo, o broker e o cliente trocam certificados para verificar a identidade um do outro antes de estabelecer a conexão segura.

Mensagens Retidas (Retained Messages) no MQTT

No MQTT, uma mensagem retida é aquela que o broker mantém armazenada para que novos assinantes a recebam assim que se conectarem, sem precisar esperar por uma nova publicação.
Agora que você entendeu na teoria como funciona o MQTT, QoS, LWT e TLS/SSL vamo partir para explicação documentada do código

Imagine que você tem um quadro de avisos na entrada de um prédio:

Sem mensagem retida: Cada vez que alguém chega, precisa esperar o porteiro dar um recado. Se ninguém estiver falando naquele momento, a pessoa não recebe nenhuma informação.

Com mensagem retida: O porteiro escreve o aviso no quadro. Agora, qualquer pessoa que chegar pode ler a informação imediatamente, mesmo que tenha sido publicada horas antes.

No MQTT, isso significa que o último valor publicado em um tópico fica armazenado no broker e é entregue automaticamente para qualquer novo assinante desse tópico.

A connexão com o MQTT está sendo feita dentro do mqttClient.ts {src/mqttClient.ts} aonde está usando o HiveMq Cloud como broker principal

criado options com váriavel para connexão com MQTT
const options: IClientOptions = {
host: {URL TLS MQTT}
port: {PORT}
protocol: {PROTOCOLO},
username: {USERNAME_CLOUD} ,
password: {PASSWORD_CLOUD},
will: {
topic: {TOPIC_CONTROLL},
payload: {MESSAGE},
qos: {QoS_CONTROLL},
retain: {TRUE_FALSE},
},
};

connectando ao mqtt com options

mqtt.connect(options)

No arquivo pubSub.ts {src/pubSub.ts} é feito a publicação, inscrição, escutando e fazendo controle de erros

client.on("connect", () => {
SE INSCREVENDO POR PADRÃO SE INSCREVE NO QOS 0
client.subscribe("{TOPIC}");
PUBLICANDO
client.publish(tableTopic, "{MESSAGE}", { retain: true });
CONTROLE DE ERROS ETC...
client.on("error", (error) => console.error(error));
client.on("offline", () => console.log("Offline"));
});

ESCUTANDO AS MENSAGENS CONFORME O TÓPICO QUE O ASSINANTE ESTÁ ESCRITO
client.on("message", (topic, message) => {
LÓGICA DE TRATAMENTO DAS MENSAGENS
})

No arquivo qosInMqtt.ts {src/qosInMqtt.ts} é feito a inscrição nos tópico de QoS 1 e 2 e também a verificação se o cliente está online

REMOVENDO TODAS AS MENSAGEMS ASSIM GARANTINDO QUE AS MENSAGENS NÃO SEJA REGISTRADO UM MONTE DE VEZES
client.removeAllListeners("message");

SE INSCREVENDO NO TÓPICO COM QOS´S
client.subscribe("{TOPIC}", { qos: {1 , 2} });

PUBLICANDO MENSSAGEM NO TÓPICO ESPECIFICO COM QOS
client.publish("{TOPIC}", "{MESSAGE}", { qos: {1, 2} });

client.on("message", (topic, message) => {
SE DESISNCREVENDO NO TÓPICO PARA OUTRAS FUNÇÕES PODER FUNCIONAR BEM
client.unsubscribe("{TOPIC}");
});
