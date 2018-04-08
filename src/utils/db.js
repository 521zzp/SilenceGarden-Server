var MongoClient = require('mongodb').MongoClient;
import { MONGODB_USER, MONGODB_PWD, MONGODB_IP, MONGODB_PORT, MONGODB_DB } from '../config/config'
var generic = require('generic-pool');
var url = `mongodb://${MONGODB_USER}:${MONGODB_PWD}@${MONGODB_IP}:${MONGODB_PORT}${MONGODB_DB}`;

const pool = generic.createPool({
    'name': 'mongodb-pool',   // 连接池名称
    'max': 100,             // 最大连接数           
    'min': 5,               // 最小连接数  
    'idleTimeoutMillis ': 30 * 1000,// 空闲等待时间
    'log': false,           // 是否console.log输出日志
    // 创建连接方法
    'create':  function (callback) {

        const db = new Promise(function(resolve, reject) {
		  // ... some code

			MongoClient.connect(url, function(err, db) { 

	        	if (!err){
				    resolve(db);
				  } else {
				    reject();
				  }
	        });
		  
		});

        return  db
      
    },
    // 销毁方法
    'destroy': function (db) {
        db.close();
    }
});

export { pool }