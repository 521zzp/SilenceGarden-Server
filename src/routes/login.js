import { LOGIN }  from "../config/url";
import { pool } from '../utils/db'
import { resultWrap } from '../utils/net'
import Mock from 'mockjs'
const assert = require('assert');

module.exports = function(app){
    app.post(LOGIN, function (req, res) {
		console.log('登录')
		const {account, password} = req.body
		const { uuid } = Mock.mock({
			uuid: '@guid'
		})
		const resourcePromise = pool.acquire();
		resourcePromise.then(async function(db) {
			const co = db.db('silencegarden').collection('user')
			const obj = await new Promise((resolve,reject) => {
				co.updateOne({ account, password }, { $set: { uuid } }, function(err, result) {
					if (err) {
						reject()
					} else if (result.result.n === 1) {
						resolve(resultWrap({ uuid }, '登录成功！'))
					} else {
						resolve(resultWrap({}, '账号或密码错误！', false))
					}
				})
			})
			pool.release(db);
			res.send(obj)
		}).catch(function(err) {
		    res.send(resultWrap({}, '系统异常，请稍后再试', false))
		});

	})

};