const venom = require('venom-bot');

venom
  .create()
  .then((client) => {
    client.onMessage(message => {
      client.sendText(message.from, "tome no cu muller")
    })
  })
  .catch((error) => console.log(error));