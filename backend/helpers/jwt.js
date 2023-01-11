const { expressjwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.APP_URL;

    return expressjwt({
        secret,
        algorithms : ['HS256'],
        isRevoked : isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/user/login`,
            `${api}/user/register`,
        ]
    });
}

async function isRevoked(req, payload) {
    console.log(payload);

    if(payload.isAdmin) {
        return true;
    }

    return false;
}


module.exports = authJwt;