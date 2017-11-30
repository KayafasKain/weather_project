'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config.json');
const User = require("../models/user.js");

module.exports = {
    TokenGenerate: (id) => {
        return jwt.sign({id}, config['security'].token_secret,
                {
                  expiresIn: token_life_minutes * 60
                }
            );
    },
    TokenVerifyMiddleware: async (ctx, next) => {
        try {
            const id = jwt.verify(ctx.request.header.accesstoken, config['security'].token_secret).id;
            ctx.user = await User.findOne({
                where:{
                    id: id
                },
                include: [Student]
            });

            if(!ctx.user) throw {name: 'NullUser'};
        } catch(err) {
            ctx.user = null;
        }

        await next();
    }
};