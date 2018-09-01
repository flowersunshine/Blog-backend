const express = require('express');

const post = require('./post');
const comment = require('./comment');

const app = express();

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
// 使用中间件支持跨域(设置http的响应头)
app.use(allowCrossDomain);
// express的路径匹配模式支持正则表达式
// 请求文章列表
app.get('/postlist', post.getPostList);
// 根据文章ID请求某个文章的具体内容
app.get('/article/:id', post.getArticleById);

// 添加评论
app.put('/comment', comment.addComment);
// 删除评论
app.delete('/comment', comment.deleteComment);
// 允许加载静态资源
app.use('/static', express.static('assets'));
// 处理404请求
app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that');
});

const server = app.listen(3000, () => {
    const host = server.address().host;
    const port = server.address().port;
    console.log('Example app is listening at http://%s:%s', host, port);
});