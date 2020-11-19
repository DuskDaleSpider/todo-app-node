const monk = require('monk');
const url = 'mongodb://root:root@localhost:27017';
const db = monk(url);

const users = db.get('users');

users.insert({username: 'dakota', password: 'password'}).then(response => {
    console.log(response);
}).catch(err => {
    console.log(err);
}).then(() => db.close());
