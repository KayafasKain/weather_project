const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login/', async ( req, res, next) => {
	try {
		// console.log(req.body.user.login);
		let user = await User.findOne({ 
				login: req.body.user.login 
		});

		if (!user) { throw { name: 'NullUser' }}
		res.json(user);
	} catch (err) {
		switch( err.name ){
			case "NullUser":
		}
		next(err) 
	}
});
 
module.exports = router;
