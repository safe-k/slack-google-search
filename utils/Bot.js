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

                // Exclude dead links and links to Images, News, and Books
                links = links.filter(link => {
                    let deadLink = (/^Images/.test(link.title) || /^News/.test(link.title) || /^Books/.test(link.title));
                    let invalidResult = (!link.description && !link.href);

                    return (!deadLink && !invalidResult);
                });

                // Return top five links
                return resolve(links.slice(0, 6));
            });
        });
    }
}

module.exports = Bot;
