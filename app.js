'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('./utils/Bot');
const request = require('request');

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let bot = new Bot();

app.post('/', (req, res) => {
    // Authenticate request
    if (req.body.token != process.env.SLACK_TOKEN) return res.sendStatus(401);

    // Check if text query was provided
    if (!req.body.text) {
        console.error('No search query provided.');
        return res.send({
            response_type: 'ephemeral',
            text: 'What would you like me to search for?'
        });
    }

    // Acknowledge request before responding (this is to prevent Slack's 3s timeout)
    res.send({
        response_type: 'ephemeral',
        text: 'Looking that up for you...'
    });

    return delayedResponse(req, res);
});

function delayedResponse(req, res) {
    let message = {
        response_type: 'ephemeral',
        text: 'Sorry, that didn\'t work. Please try again.'
    };

    bot.searchGoogle(req.body.text).then((results) => {
        let links = [];
        for (let result of results) {
            let link = {
                title: result.title,
                title_link: result.href,
                text: result.description
            };

            // Exclude dead links to Images, News, and Books
            if (!/^Images/.test(result.title) && !/^News/.test(result.title) && !/^Books/.test(result.title)) {
                links.push(link);
            }
        }

        message = {
            response_type: 'in_channel',
            attachments: links
        };
    }).catch((err) => {
        console.error(err);
        if (err.response) {
            res.sendStatus(err.response.status);
        }
    }).finally(() => {
        console.log('Message: ' + JSON.stringify(message));

        request.post(req.body.response_url, { json: message }, (err, res, body) => {
            console.log('statusCode: ' + res.statusCode);
            console.log(body);
            if (err) {
                console.error(err);
            }
        });
    });
}

let port = process.env.PORT;
app.listen(port, () => {
  console.log('Express app listening on port ' + port)
});
