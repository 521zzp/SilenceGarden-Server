import { GET_POEM, GET_POETRY_CATALOG, GET_POETRY_CATALOG_VAGUE } from '../config/url'
import { resultWrap, serverRestful } from '../utils/net'
import { pool } from '../utils/db'


module.exports = function (app) {
	

	// 根据id获取诗词内容
	app.get(serverRestful(GET_POEM), function (req, res) {
		const title = req.params.title
		console.log("获取诗词:"+ title);
		if (title) { 
			const resourcePromise = pool.acquire();
			resourcePromise.then(function(db) {
			    var dbo = db.db("silencegarden");
				dbo.collection("poetry").find({ "title": title}).toArray(function(err, result) { // 返回集合中所有数据
			        if (err) {
			        	res.send(resultWrap({}, '系统异常，请稍后再试', false))
			        } else{
			        	console.log(result);
			        	if (result.length>0) {
			        		res.send(resultWrap(result[0]))
			        	} else {
			        		res.send(resultWrap({}, '该文章未收录！'))
			        	}
			        }
			        pool.release(db);
			    });
			  })
			  .catch(function(err) {
			    res.send(resultWrap({}, '系统异常，请稍后再试', false))
			  });
			
		} else {
			res.send({});
		} 
		
	});

	// 获取所有诗词目录
	app.get(GET_POETRY_CATALOG, function (req, res) {
		console.log("获取目录:");
		const resourcePromise = pool.acquire();
		resourcePromise.then(function(db) {
		    var dbo = db.db("silencegarden");
			dbo.collection("poetry").find().project({ _id: 0, title: 1, poetry: 1, tag: 1 }).toArray(function(err, result) { // 返回集合中所有数据
		        if (err) {
		        	res.send(resultWrap({}, '系统异常，请稍后再试', false))
		        } else{
		        	console.log(result);
		        	if (result.length>0) {
		        		res.send(resultWrap(result))
		        	} else {
		        		res.send(resultWrap({}, '当前无记录！'))
		        	}
		        }
		        pool.release(db);
		    });
		  })
		  .catch(function(err) {
		    res.send(resultWrap({}, '系统异常，请稍后再试', false))
		  });
	});
	
	// 根据关键词查相关诗词目录
	app.get(serverRestful(GET_POETRY_CATALOG_VAGUE), function (req, res) {
		const keyword = req.params.keyword.toString()
		console.log("获取诗词关键字:"+ keyword);

		// 从连接池拿到连接
		const resourcePromise = pool.acquire();
		resourcePromise.then(async function(db) {
			const co = db.db('silencegarden').collection('poetry')
			const list = await new Promise((resolve,reject) => {
				co.find({ $or: [ 
						{ title: { $regex: keyword } }, 
						{ author: { $regex: keyword } }, 
						{ tag: { $regex: keyword } } ,
						{ poetry: { $regex: keyword } } ,
						{ content: { $regex: keyword } } ,
						{ content: { $elemMatch: { $elemMatch:  { $regex: keyword } } } }
					]  }, { _id: 0, title: 1, poetry: 1, tag: 1 }).toArray(function (err, result){
					if (err) {
						reject(resultWrap({}, '系统异常，请稍后再试', false))
					} else {
						if (result.length>0) {
		        			resolve(resultWrap(result))
			        	} else {
			        		resolve(resultWrap({}, '当前无记录！'))
			        	}
					}

				})
			})
			pool.release(db);
			console.log('list', list)
			res.send(list)
		})
		
	});

};
