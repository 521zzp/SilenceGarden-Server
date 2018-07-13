import { GET_ARTICLE_DETAILS, GET_ARTICLE_CATALOG, ARTICLE_SAVE  } from '../config/url'
import { pool } from '../utils/db'
import { resultWrap, serverRestful } from '../utils/net'
var ObjectId = require('mongodb').ObjectId
const assert = require('assert');

module.exports = function (app) {
	app.post(ARTICLE_SAVE, function (req, res) {
		console.log('文章保存：')
		console.log(req.body)

		const obj = req.body
		const resourcePromise = pool.acquire();
		resourcePromise.then(function(db) {
		    var dbo = db.db("silencegarden");
			const collection = dbo.collection("article")
			collection.insert(Object.assign(obj, { time: new Date() }), function(err, result) {
			    assert.equal(err, null);
			    assert.equal(1, result.result.n);
			    assert.equal(1, result.ops.length);
			    res.send({});
			    pool.release(db);
			  });
		  })
		  .catch(function(err) {
		    res.send(resultWrap({}, '系统异常，请稍后再试', false))
		  });
	})

	app.get(GET_ARTICLE_CATALOG, function (req, res) {
		const resourcePromise = pool.acquire();

		resourcePromise.then(function(db) {
		    var dbo = db.db("silencegarden");
			dbo.collection("article").find().project({ _id: 1, title: 1, tags: 1 }).toArray(function(err, result) { // 返回集合中所有数据
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
		    res.send(resultWrap({},'系统异常，请稍后再试', false))
		  });
	})

	app.get(serverRestful(GET_ARTICLE_DETAILS), function (req, res) {
		const id = req.params.id
		console.log("获取文章:"+ id);
		if (id) { 
			const resourcePromise = pool.acquire();
			resourcePromise.then(function(db) {
			    var dbo = db.db("silencegarden");

			    console.log('聚合开始--------------------------------')
			    try { 
			    	dbo.collection("article").aggregate([ 
			    		{ $match: { '_id': ObjectId(id) } },
			    		{	

			    			$project: {
			    				time: 
			    					{ 
				    					$dateToString: 
				    						{ 
				    							format: "%Y-%m-%d %H:%M:%S", 
				    							date: "$time",
				    							timezone: "+08"
				    						} 
			    					},
			    				title: 1,
			    				tags: 1,
			    				html: 1
			    			}
			    		}
			    	], function (err, result) {
			    		//pool.release(db);
			    		console.log('释放连接llllllllllllllllllllll')
			    		if (err) {
			    			console.log(err)
			    			console.log('聚合异常xxxxxxxxxxxxxxxxxxxxxxx')
			    			res.send(resultWrap({}, '系统异常，请稍后再试out', false))
			    		}
			    		result.toArray(function (err, result) {
				    			console.log('----------------------')
						        if (err) {
						        	console.log(err)
						        	res.send(resultWrap({}, '系统异常，请稍后再试inner', false))
						        } else {
						        	//console.log(result);
						        	if (result.length>0) {
						        		res.send(resultWrap(result[0]))
						        	} else {
						        		res.send(resultWrap({}, '该文章未收录！'))
						        	}
						        }
						        pool.release(db);
							}) 

			    	})
			    } catch (err) {
			    	console.log(err)
					res.send(resultWrap({}, '系统异常，请稍后再试out', false))
			    } 
			    console.log('聚合结束================================') 
			})
				/*dbo.collection("article").find({ _id: ObjectId(id) }, { 
						html: 1, title: 1, tags: 1, date: 1 
					}).toArray(function(err, result) { // 返回集合中所有数据
			        console.log('----------------------')
			        if (err) {
			        	console.log(err)
			        	res.send(resultWrap({}, '系统异常，请稍后再试inner', false))
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
			  	console.log(err)
			    res.send(resultWrap({}, '系统异常，请稍后再试out', false))
			  });*/
			
		} else {
			res.send({});
		} 
	})

}