export const BASEURL = '/api'  //服务器地址

export const IMG = '/assets/image' //图片地址

export const GET_ARTICLE_DETAILS = BASEURL + '/article/details/{id}' //获取文章详情
export const GET_REVISE_ARTICLE_DETAILS = BASEURL + '/revise/article/details/{id}' //获取文章详情
export const GET_ARTICLE_CATALOG = BASEURL + '/article/catalog' //获取文章目录
export const ARTICLE_SAVE = BASEURL + '/article/save' //文章保存
export const ARTICLE_IMAGE_UPLOAD = BASEURL + '/article/image/upload' //写文章图片上传

export const GET_POETRY_CATALOG = BASEURL + '/poetry_catalog' //诗词目录
export const GET_POEM = BASEURL + '/poem/{title}' //获取诗词


export const GET_MELODY_CATALOG = BASEURL + '/violin_catalog' //获取音频目录
export const GET_MELODY = BASEURL + '/melody/{id}'  	//	获取音频信息
export const GET_MELODY_RANDOM = BASEURL + '/melody/ramdom/{id}'    //随机播放
