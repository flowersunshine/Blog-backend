const articleConfig = require("./assets/article/article-config.json");
const fs = require('fs')
const marked = require('marked')
const path = require('path')
const highlight = require('highlight.js')

marked.setOptions({
    highlight: function(code) {
        return highlight.highlightAuto(code).value;
      },
});

function getArticle(id) {
    return (item, index, array) => {
        return item.id == id;     
    }   
}

module.exports = {
    getPostList(req, res){
        console.log(articleConfig);
        res.send(articleConfig);
    },
    getArticleById(req, res){
        console.log(req.params.id)
        const article = articleConfig.postlist.find(getArticle(req.params.id));
        const tempPath = __dirname + '/assets/article/' + article.path
        console.log(tempPath)
        const fileData = fs.readFileSync(tempPath,{encoding: 'utf-8'});
        console.log(fileData)
        const html = marked(fileData)
        console.log(html)
        res.send({html,title: article.title})
    }
}