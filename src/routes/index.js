var poetry3 = require("./poetry3");
var violin = require("./violin");
var article = require("./article");
import { authLogin } from '../utils/auth'

module.exports =  function(app){
	app.all('*', async function (req, res , next) {
		var url = req.originalUrl;
		console.log('拦截器————————————————————————————', url)
		var user_vali = await authLogin('zzp', '123456')
		if (user_vali) {
			next();
		} else {
			res.send({ code: 100, data: { msg: '无此用户' } })
		}
		
	});
    poetry3(app);  
    violin(app);
    article(app);
}