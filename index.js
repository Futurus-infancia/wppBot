const venom = require('venom-bot');

const query = require("./query");
const tree = require('./decisionTree');

query.searchWpp(5521995643137)
// query.insertWpp(5521997521661)

// console.log(tree.tree.getInitial())

function printMessage(position){
  let response = `0- Voltar \n`;
  let items = tree.tree.getChildren(position);
  for(var i = 0; i < items.length; i++) {
    var item = items[i];
    response += `${item.name} \n`;
  }
  return response;
}
  

function printInitial(){
  let response = ``;
  let items = tree.tree.getInitial();
  for(var i = 0; i < items.length; i++) {
      var item = items[i];
      response += `${item.name} \n`;
    }
  return response;
}

venom
  .create()
  .then((client) => {
    client.onMessage(async message => {
      if(!message.isGroupMsg){
        let number = message.from.split('@')[0]
        let results = await query.searchWpp(parseInt(number));
        let response = ``;
        let position;
        if (Object.keys(results).length == 0){
          await query.insertWpp(parseInt(number))
          results = await query.searchWpp(parseInt(number));
        }

        result = results[0];
        
        if(result.position == 0 && result.step==0){
            response = printInitial();
            await query.updateWpp(number,null, 1);
        } else if (result.position == 0 && result.step==1){
            let items = tree.tree.getInitial();
            let body = parseInt(message.body);
            
            if(!isNaN(body) && body in [...Array(items.length + 1).keys()]){
              
              position = items[body - 1].id;
              response = printMessage(position)
              await query.updateWpp(number,position)

            } else {
              response = printInitial();
            }
        } else {
          let body = parseInt(message.body);
          if(body==0){
            await query.updateWpp(number,0)
            response = printInitial();
          } else{
            response = printMessage(result.position)
          }
        }
        // else {
        //   let item = tree.getChoice(`${result.position}`);
        //   if(message.body){
        //     response += `${item.name} <br>`;
        //   }
        // }
        client.sendText(message.from, response)
      }
    })
  })
  .catch((error) => console.log(error));