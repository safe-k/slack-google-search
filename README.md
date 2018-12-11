# Slack Google Search

_Note: This is an updated/modified version of [camwhite/slack-google](https://github.com/camwhite/slack-google)._

A Slack bot that posts the top 5 Google search results for the provided query.

![example-screenshot](https://i.imgur.com/ENeKSHk.png)

## Installation & Setup

### Local

- Add your unique Slack app token as an environment variable (`.env`):
```
PORT=<your-port>
SLACK_TOKEN=<unique-slack-token>
```
- Run `npm i ; node run start:dev`
- Access app through `localhost:PORT`
- Test by sending a POST request to `localhost:PORT` with a `text` and `token` body params:
```json
{
  "text": "what is google",
  "token": "<unique-slack-token>"
}
```

### Slack

- Create a Slack app and configure a [slash command](https://api.slack.com/slash-commands) for it
- Run the app on a server (`npm run start`)
- Set the slash command URL to the app URL
- Test the command: `/google what is slack`
