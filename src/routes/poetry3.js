import { GET_POEM, GET_POETRY_CATALOG } from '../config/url'
import { serverRestful } from '../utils/net'
import { resultWrap } from '../utils/net'
import { pool } from '../utils/db'





module.exports = function (app) {
	
	app.get(serverRestful(GET_POEM), function (req, res) {
		const title = req.params.title
		console.log("获取文章:"+ title);
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
	

};
