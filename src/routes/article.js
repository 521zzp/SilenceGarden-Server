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
				dbo.collection("article").find({ _id: ObjectId(id) }).toArray(function(err, result) { // 返回集合中所有数据
			        console.log('----------------------')
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
			  	console.log(err)
			    res.send(resultWrap({}, '系统异常，请稍后再试', false))
			  });
			
		} else {
			res.send({});
		} 
	})

}