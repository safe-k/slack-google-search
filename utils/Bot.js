'use strict';

const google = require('google');

class Bot {
  constructor() {
    this.google = google;
  }

  searchGoogle(query) {
    return new Promise((resolve, reject) => {
      this.google(query, (err, next, links) => {
          if (err) return reject(err);

          let topFiveLinks = links.slice(0, 6);
          resolve(topFiveLinks);
      });
    });
  }
}

module.exports = Bot;
