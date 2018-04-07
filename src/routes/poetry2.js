import { GET_POEM } from '../config/url'
import { serverRestful } from '../utils/net'
import { MONGODB_USER, MONGODB_PWD } from '../config/config'
import { resultWrap } from '../utils/net'



var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://zzp:123456@127.0.0.1:27017/silencegarden';

var generic = require('generic-pool');

var pool = generic.createPool({
    'name': 'mongodb-pool',   // 连接池名称
    'max': 100,             // 最大连接数           
    'min': 5,               // 最小连接数  
    'idleTimeoutMillis ': 30 * 1000,// 空闲等待时间
    'log': false,           // 是否console.log输出日志
    // 创建连接方法
    'create':  function (callback) {
        console.log('pool.mongodb.create--->')

        const promise = new Promise(function(resolve, reject) {
		  // ... some code

			MongoClient.connect(url, function(err, db) { 
	        	console.log('callback11111:')
	        	console.log(callback)
	        	console.log(db)

	        	if (!err){
				    resolve(db);
				  } else {
				    reject();
				  }
	        });
		  
		});

        return  promise
       /* var conn = mysql.createConnection({
            'host': '127.0.0.1',
            'port': 3306,
            'user': 'root',
            'password': 'mysqladmin',
            'database': 'ajax',
            'connectTimeout': 1
        });
        conn.connect();*/
        // 回调，第一个参数为错误对象,第二个为连接
        
    },
    // 销毁方法
    'destroy': function (db) {
        console.log('pool.mongodb.destroy--->')
        db.close();
    }
});


module.exports = function (app) {
	
	app.get(serverRestful(GET_POEM), function (req, res) {
		const title = req.params.title
		console.log('xxxxxxxxxxxx')
		console.log(url)
		console.log(title)
		if (title) { 
			console.log('xxxxxxxxxxxxxxxxxxxxxx')
			const resourcePromise = pool.acquire();
			console.log('mmmmmmmmmmmmmm')
			resourcePromise
			  .then(function(db) {
			   
			    var dbo = db.db("silencegarden");
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
			        pool.release(db);
			    });


			  })
			  .catch(function(err) {
			    // handle error - this is generally a timeout or maxWaitingClients
			    // error
			  });


			/*pool.acquire(function (err, db) {
				console.load('err:');
				console.log(err)
				console.log('db:')
				console.log(db)

				var dbo = db.db("silencegarden");
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
			    });
				pool.release(db);
			});*/


			/*MongoClient.connect(url, function(err, db) {
			     if (err) {
		        	res.send(resultWrap({}, '系统异常，请稍后再试', false))
		        }
			    var dbo = db.db("silencegarden");
			

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
			});*/
		} else {
			res.send({});
		} 
		
		
		
	});
	

};
