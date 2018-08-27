const express = require('express');

const post = require('./post');
const comment = require('./comment');

const app = express();

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