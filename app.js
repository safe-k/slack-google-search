'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('./utils/Bot');
const request = require('request');
const healthCheckMiddleware = require('healthcheck-ping');

let app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(healthCheckMiddleware());

let bot = new Bot();

app.post('/', (req, res) => {
    // Authenticate request
    if (req.body.token != process.env.SLACK_TOKEN) return res.sendStatus(401);

    let searchQuery = req.body.text;

    // Check if text query was provided
    if (!searchQuery) {
        console.error('No search query provided.');
        return res.send({
            response_type: 'ephemeral',
            text: 'What would you like me to search for?'
        });
    }

    if (searchQuery === 'help') {
        return res.send({
            response_type: 'ephemeral',
            text: 'Type the command followed by some text to search for (e.g. `/google penguins`).'
        });
    }

    let responseUrl = req.body.response_url;

    // Acknowledge request before responding (this is to prevent Slack's 3s timeout)
    res.send({
        response_type: 'ephemeral',
        text: 'Looking that up for you...'
    });

    return delayedResponse(searchQuery, responseUrl);
});

function delayedResponse(searchQuery, responseUrl) {
    // Set default message
    let message = {
        response_type: 'ephemeral',
        text: 'Sorry, that didn\'t work. Please try again.'
    };

    bot.searchGoogle(searchQuery).then((results) => {
        let links = [];
        for (let result of results) {
            links.push({
                title: result.title,
                title_link: result.href,
                text: result.description
            });
        }

        message = {
            response_type: 'in_channel',
            attachments: links
        };
    }).catch((err) => {
        console.error(err);
    }).finally(() => {
        request.post(responseUrl, {json: message}, (err, res, body) => {
            console.log('Delayed response message: ' + JSON.stringify(message));
            console.log('Delayed response status code: ' + res.statusCode);
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
