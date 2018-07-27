import { pool } from './db'

export const authLogin = async (account, password) => {
	const resourcePromise = pool.acquire();
	return await resourcePromise.then(async function(db) {
		const co = db.db('silencegarden').collection('user')
		const vali = await new Promise((resolve,reject) => {
			co.find({ account, password }, { id_: false }).toArray(function (err, result){
				console.log('auth vali', result)
				if (err) {
					reject('无此用户')
				} else {
					resolve(result.length > 0)
				}

			})
		})
		pool.release(db);
		return vali
	})
}