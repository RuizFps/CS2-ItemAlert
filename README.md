<H3>CSGO NEW ITEM NOTIFICATION</h3>
Um bot vinculado com Discord que te notifica sempre quando receber um item novo em suas contas. Ele utiliza a biblioteca discord.js para interagir com o Discord e as bibliotecas steam-user, globaloffensive e steamcommunity para se conectar à API da Steam e obter informações sobre os inventários.

<H3>Funcionalidades</h3>
Enviar notificações no canal do Discord sempre que uma conta receber um novo item no inventario do CS:GO.


<h3>Configuração</h3>
Você precisa ter Node.js instalado em seu computador.
Antes de executar o bot, certifique-se de realizar as seguintes configurações:
Preencha o arquivo config.json com as informações necessárias, incluindo os dados de autenticação das contas Steam e as configurações do Discord.

```
{
  "steam": {
    "accounts": [
      {
        "username": "steam_username1",
        "password": "steam_password1",
        "shared_secret": "steam_shared_secret1",
        "identity_secret": "steam_identity_secret1",
        "display_name": "Account 1"
      },
      {
        "username": "steam_username2",
        "password": "steam_password2",
        "shared_secret": "steam_shared_secret2",
        "identity_secret": "steam_identity_secret2",
        "display_name": "Account 2"
      }
    ]
  },
  "discord": {
    "token": "discord_bot_token",
    "channel_id": "discord_channel_id"
  }
}
```

Instale as dependências necessárias executando o comando npm install.
Execute o bot com o comando node index.js ou abra o aquivo start.bat.
Certifique-se de ter as permissões corretas para os canais do Discord em que o bot será utilizado.




