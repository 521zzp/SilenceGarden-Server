var poetry = require("./poetry");
var violin = require("./violin");
var article = require("./article");
var login = require("./login");
import { resultWrap } from '../utils/net'

import { authVali } from '../utils/auth'
import { BASEURL, AUTH } from '../config/url'

module.exports =  function(app){
	app.all(BASEURL + AUTH + '/*', async function (req, res , next) {
		var url = req.originalUrl;
		console.log('拦截器————————————————————————————', url)
		const uuid = req.cookies.uuid
		if (uuid) {
			var user_vali = await authVali(uuid)
			if (user_vali) {
				next();
			} else {
				res.send(resultWrap({}, '您还未登录', 101))
			}
		} else {
			res.send(resultWrap({}, '您还未登录', 101))
		}
		
		
	});
    poetry(app);  
    violin(app);
    article(app);
    login(app);
}