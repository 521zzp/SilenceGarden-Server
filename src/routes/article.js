import { GET_ARTICLE_DETAILS, GET_ARTICLE_CATALOG, ARTICLE_SAVE,
		 ARTICLE_IMAGE_UPLOAD, GET_REVISE_ARTICLE_DETAILS  } from '../config/url'
import { ARTICLE_UPLOAD_FOLDER } from '../config/config'
import { pool } from '../utils/db'
import { resultWrap, serverRestful } from '../utils/net'
import formidable  from 'formidable';
import Mock from 'mockjs'


var ObjectId = require('mongodb').ObjectId
const assert = require('assert');

module.exports = function (app) {

	// 新增文章和修改文章
	app.post(ARTICLE_SAVE, function (req, res) {
		console.log('文章保存：')
		const { id, title, tags, markdown, html } = req.body
		const resourcePromise = pool.acquire();
		resourcePromise.then(function(db) {
		    var dbo = db.db("silencegarden");
			const collection = dbo.collection("article")
			if (id) {
				collection.update( { _id: ObjectId(id) }, { $set: { title, tags, markdown, html } }, function(err, result) {
				    assert.equal(err, null);
				    res.send(resultWrap({}))
				    //pool.release(db);
				});
			} else {
				// 没有已知ID插入内容
				collection.insert( { title, tags, markdown, html, time: new Date() }, function(err, result) {
				    assert.equal(err, null);
				    assert.equal(1, result.result.n);
				    assert.equal(1, result.ops.length);
				    res.send(resultWrap({}))
				    //pool.release(db);
				});
			}
			pool.release(db);
			console.log('插入、更新文档释放连接')
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

	// 获取需要修改的文章详情
	app.get(serverRestful(GET_REVISE_ARTICLE_DETAILS), function (req, res) {
		const id = req.params.id
		const resourcePromise = pool.acquire();
		resourcePromise.then(function(db) {
		    var dbo = db.db("silencegarden");
			dbo.collection("article").find({ _id: ObjectId(id) }).project({  _id: 0, title: 1, tags: 1, markdown: 1 }).toArray(function(err, result) { // 返回集合中所有数据
		        if (err) {
		        	res.send(resultWrap({}, '系统异常，请稍后再试inner', false))
		        } else{
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
		    res.send(resultWrap({},'系统异常，请稍后再试out', false))
		  });
	})

	// 阅读文章获取详情
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

	//图片上传
	app.post(ARTICLE_IMAGE_UPLOAD, function (req, res) {
		var form = new formidable.IncomingForm();   //创建上传表单
		form.encoding = 'utf-8';        //设置编辑
		form.uploadDir = ARTICLE_UPLOAD_FOLDER;     //设置上传目录
		form.keepExtensions = true;     //保留后缀
		form.maxFieldsSize = 20 * 1024 * 1024;   //文件大小	
		form.hash = 'md5'  //文件校验
		//验证参数合法及更改文件名
		form.on('fileBegin', function(name, file) {
			try {
				assert.equal(name, 'image', '参数不正确');
				const arr = file.name.split('.')
				const file_type = arr.pop()
				file.name = (arr.join('.') + '-' + Mock.mock('@guid').split('-')[0].toLowerCase() + '.' + file_type).replace(/\s/g, '')
				file.path = form.uploadDir + '/' + file.name
			} catch (e) {
				res.send(resultWrap({}, '参数不正确', false))
			}
			
		})
		//解析与保存到数据库
		form.parse(req, function(err, fields, files) {
			if (err) {
		     res.send(mockWrap({ msg: '只支持png和jpg格式图片' }));
		    }
		    const image = files.image ? files.image.name : undefined
		    const insert_obj = { image, time: new Date() }
		    if (image) {
		    	console.log('上传记录保存：')
		    	const resourcePromise = pool.acquire();
				resourcePromise.then(function(db) {
				    var dbo = db.db("silencegarden");
					const collection = dbo.collection("article_image")
					collection.insert(insert_obj, function(err, result) {
					    assert.equal(err, null);
					    assert.equal(1, result.result.n);
					    assert.equal(1, result.ops.length);
					    res.send(resultWrap({ image }));
					    pool.release(db);
					  });
				  })
				  .catch(function(err) {
				    res.send(resultWrap({}, '系统异常，请稍后再试', false))
				  });
		    } 
			
		});
	})

}