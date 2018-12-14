# Slack Google Search

A Slack app that posts the top 5 Google search results for the provided query.

![example-screenshot](https://i.imgur.com/ENeKSHk.png)

## Installation & Setup

- Create a Slack app and configure a [slash command](https://api.slack.com/slash-commands) for it
- Run the app on a server (`npm run start`)
- Set a `SLACK_TOKEN` environment variable with your app's verification token 
- Set the slash command URL to the app URL
- Test the command: `/google what is slack`
