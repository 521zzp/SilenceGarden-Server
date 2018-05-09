import { GET_MELODY, GET_MELODY_CATALOG, GET_MELODY_RANDOM } from '../config/url'
import { serverRestful } from '../utils/net'
import { resultWrap } from '../utils/net'
import { pool, dbOperat, singleFilter } from '../utils/db'
import Mock from 'mockjs'





module.exports = function (app) {
	

	app.get(GET_MELODY_CATALOG, function (req, res) {
		console.log("获取曲子目录:");

		const resourcePromise = pool.acquire();
		resourcePromise.then(async function(db) {
		    var dbo = db.db("silencegarden");
		    const result = await new Promise(function (resolve, reject) {
		    	console.log('开始查询')
		    	try {
		    		dbo.collection("music").find().project({ _id: 1, name: 1, album: 1, tag: 1, disk_img: 1 }).toArray(function(err, datas) { // 返回集合中所有数据
				        if (err) {
				        	reject()
				        } else{
				        	console.log('查询结果')
				        	console.log(datas)
				        	resolve(datas)
				        }
			    	})
		    	} finally {
		    		pool.release(db);
				    console.log('已释放连接')
		    	}
		    });
		    res.send(resultWrap(result))
			
		}).catch(function(err) {
		    res.send(resultWrap({}, '查询不知道怎么就中断了o(╥﹏╥)o', false))
		});
		
	});

	//随机播放等
	app.get(serverRestful(GET_MELODY_RANDOM), function (req, res) {
		
		let id;
		try {
			id = req.params.id
			console.log("获取曲子:"+ id);
		} catch (e) {
			res.send(resultWrap({}, '不要乱查询凸(艹皿艹 )', false))
		}

		if (id) {

			const resourcePromise = pool.acquire();
			resourcePromise.then(async function(db) {
			    var dbo = db.db("silencegarden");

			    const list = await new Promise(function (resolve, reject) {
			    	try {
			    		dbo.collection("music").find().toArray(function(err, datas) { // 返回集合中所有数据
					        if (err) {
					        	console.log(err)
					        	reject()
					        } else{
					        	resolve(datas)
					        }
				    	})
			    	} catch (e) {
			    		reject()
			    	} finally {
			    		pool.release(db);
			    		console.log('finally release')
			    	}
			    });
			    let result;
			    const curernt_violin = list.filter((item) => item._id.toString() === id)
			    if (curernt_violin.length === 1) {

			    	const index = list.indexOf(curernt_violin[0])
					list.splice(index, 1)
			    	const obj = Mock.mock({
					  [`target|0-${list.length - 1}`]: 0
					})
					console.log('随机播放：')
					console.log(obj)
			    	result = list[obj.target]
			    } else {
			    	res.send(resultWrap({}, '没有该数据╮(╯﹏╰）╭', false))
			    }

			    console.log('获取结果')
			    res.send(resultWrap(result))
				
			}).catch(function(err) {
				console.log(err)
			    res.send(resultWrap({}, '查询不知道怎么就中断了o(╥﹏╥)o', false))
			});
		} else {
			res.send(resultWrap({}, '不要乱查询凸(艹皿艹 )', false))
		}

		
		
	});

	app.get(serverRestful(GET_MELODY), function (req, res) {
		
		let id;
		try {
			id = req.params.id
			console.log("获取曲子:"+ id);
		} catch (e) {
			res.send(resultWrap({}, '不要乱查询凸(艹皿艹 )', false))
		}

		const resourcePromise = pool.acquire();
		resourcePromise.then(async function(db) {
		    var dbo = db.db("silencegarden");

		    /*const result = await dbOperate(function (resolve, reject) {
		    	dbo.collection("music").find().project({ _id: 0}).toArray(function(err, datas) { // 返回集合中所有数据
			        console.log('查询结束————————————————————————————————————————————————————')
			        if (err) {
			        	resolve(resultWrap({}, '系统异常，请稍后再试1', false))
			        } else{
			        	resolve(datas)
			        }
			         pool.release(db);
		    	})
		    })*/

		    const result = await new Promise(function (resolve, reject) {
		    	try {
		    		dbo.collection("music").find().toArray(function(err, datas) { // 返回集合中所有数据
				        if (err) {
				        	console.log(err)
				        	reject()
				        } else{
				        	resolve(datas)
				        }
			    	})
		    	} catch (e) {
		    		reject()
		    	} finally {
		    		pool.release(db);
		    		console.log('finally release')
		    	}
		    });
		    const current = result.filter((item) => item._id.toString() === id)[0]

		    if (current) {
		    	const index = result.indexOf(current)
		    	const last = index === 0 ? '' : result[index - 1]._id
		    	const next = index === result.length - 1 ? '' : result[index + 1]._id
		    	res.send(resultWrap({ melody: current, last, next }))
		    	return;
		    } else {
		    	res.send(resultWrap({}, '根本不存在的曲子o(╥﹏╥)o', false))
		    	return;
		    }
		    console.log('获取结果')
		    res.send(singleFilter(result))
			
		}).catch(function(err) {
			console.log(err)
		    res.send(resultWrap({}, '查询不知道怎么就中断了o(╥﹏╥)o', false))
		});
		
	});


	/*app.get(GET_POETRY_CATALOG, function (req, res) {
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
		 
		
	});*/
	

};
