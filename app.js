'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('./utils/Bot');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let bot = new Bot();

app.post('/', (req, res) => {
  if (req.body.token != process.env.SLACK_TOKEN) return res.sendStatus(401);

  bot.searchGoogle(req.body.text).then((results) => {
    let message = {
      response_type: 'in_channel',
      attachments: []
    };

    for (var result of results) {
      let attachment = {
        title: result.title,
        title_link: result.href,
        text: result.description
      };

      // Exclude dead links to Images, News, and Books
      if(!/^Images/.test(result.title) && !/^News/.test(result.title) && !/^Books/.test(result.title)) {
        message.attachments.push(attachment);
      }
    }

    res.json(message);
  })
  .catch((err) => {
      console.log(err);
      if (err.response) {
          res.sendStatus(err.response.status);
      }
  });
});

let port = process.env.PORT;
app.listen(port, () => {
  console.log('Express app listening on port ' + port)
});
