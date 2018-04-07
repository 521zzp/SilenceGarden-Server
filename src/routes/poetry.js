import { GET_POEM } from '../config/url'
import { serverRestful } from '../utils/net'
import { MONGODB_USER, MONGODB_PWD } from '../config/config'
import { resultWrap } from '../utils/net'



var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://zzp:123456@127.0.0.1:27017/silencegarden';



module.exports = function (app) {
	
	app.get(serverRestful(GET_POEM), function (req, res) {
		const title = req.params.title
		console.log('xxxxxxxxxxxx')
		console.log(url)
		console.log(title)
		if (title) { 
			MongoClient.connect(url, function(err, db) {
			     if (err) {
		        	res.send(resultWrap({}, '系统异常，请稍后再试', false))
		        }
			    var dbo = db.db("silencegarden");
			    /*dbo.collection("poetey").find({ "title": title}).toArray(function(err, result) { // 返回集合中所有数据
			        if (err) throw err;
			        console.log(result);
			        res.send(result);
			        db.close();
			    });*/

			    dbo.collection("poetey").find({ "title": title}).toArray(function(err, result) { // 返回集合中所有数据
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
			        db.close();
			    });
			});
		} else {
			res.send({});
		} 
		
		
		
	});
	

};
