import { GET_MELODY } from '../config/url'
import { serverRestful } from '../utils/net'
import { resultWrap } from '../utils/net'
import { pool } from '../utils/db'





module.exports = function (app) {
	
	app.get(serverRestful(GET_MELODY), function (req, res) {
		const id = req.params.id
		console.log("获取曲子:"+ id);
		
		if (id == 1) { 
			const obj = {
				name: '爱的忧伤',
				src:   '/assets/audio/爱的忧伤-低音质.mp3',
				img: '四月是你的谎言.png',
				bg_img: '四月是你的谎言-bg.jpg',
			} 
			res.send(resultWrap(obj))
		} else if (id == 2){
			const obj = {
				name: '汐',
				src:   '/assets/audio/汐.mp3',
				img: 'Clannad-汐.png',
				bg_img: 'clannad0313.jpg',
			} 
			res.send(resultWrap(obj))
		} else {
			const obj = {
				name: '神秘园之歌',
				src:   '/assets/audio/10 Song From A Secret Garden.mp3',
				img: 'disk-song-from-a-secret-garden.png',
				bg_img: 'secret-garden-bg.jpg',
			} 
			res.send(resultWrap(obj))
		}
		
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
