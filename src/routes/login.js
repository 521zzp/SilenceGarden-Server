
import {LOGIN}  from "../config/url";
import {uuid} from '../utils/uuid'




module.exports = function(app){
    app.post(LOGIN, function (req, res) {
		var a = {
			code: 200,
			message: 'success',
			result: {
				token: uuid(),
				user: {
					img: 'http://i0.hdslb.com/bfs/bangumi/f191e5d72e67e14f2f0ad5a40455ec322e9b77b1.jpg@72w_72h.jpg',
					name: 'zzp'
				}
			}
		}
		
		console.log(uuid())
		
		const {account, password} = req.body
		console.log(account + ': ' + password)
		console.log(JSON.stringify(req.body))

	  	res.send(a);
	})

	app.get(LOGIN, function (req, res) {
		var a = {
			code: 200,
			message: 'success',
			result: {
				token: uuid(),
				user: {
					img: 'http://i0.hdslb.com/bfs/bangumi/f191e5d72e67e14f2f0ad5a40455ec322e9b77b1.jpg@72w_72h.jpg',
					name: 'zzp'
				}
			}
		}
		

	  	res.send(a);
	})
};