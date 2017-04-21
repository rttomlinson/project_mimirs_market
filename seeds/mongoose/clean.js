var mongoose = require('mongoose');

module.exports = () => {
    // Get all collections in db
    var collections = mongoose
        .connection
        .collections;

    // Get collection key names
    var collectionKeys = Object.keys(collections);

    // Store the promises from our
    // remove() calls
    var promises = [];

    // Iterate over all collection
    // removing each and storing the promise
    collectionKeys.forEach((key) => {
        var promise = collections[key].remove();
        promises.push(promise);
    });

    // Return a single promise
    // that resolves when
    // all collections have been
    // removed
    return Promise.all(promises);
};
