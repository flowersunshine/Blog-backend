const articleConfig = require("./assets/article/article-config.json");
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const highlight = require('highlight.js');
const { Comment, AncillaryInfo } = require('./dao/model');

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
function getAllBrief(id){
    return new Promise((resolve, reject) => {
        let result = {};
        let AncillaryInfoMark = false;
        let CommentMark = false;
        AncillaryInfo.findOne({articleID: parseInt(id)}, (err, doc) => {
            if(err) return console.error(err);
            console.log(id);
            console.log(doc);
            doc && Object.assign(result, result, doc._doc);
            AncillaryInfoMark = true;
            AncillaryInfoMark && CommentMark && resolve({id: id, ...result});
        });
        Comment.countDocuments({articleID: parseInt(id)}, (err, count) => {
            if(err) return console.error(err);
            result.comments = count;
            CommentMark = true;
            AncillaryInfoMark && CommentMark && resolve({id: id, ...result});
        });
    });
}

module.exports = {
    getPostList(req, res){
        let result = {};
        result = articleConfig;
        result.brief = {};
        console.log(articleConfig);
        const len = Object.keys(articleConfig.postlist).length;
        Object.keys(articleConfig.postlist).forEach((item, index) => {
            getAllBrief(item.id).then(data => {
                len--;
                result.brief = {...result.brief,data};
                if(len === 0){
                    res.send(result);
                }
            });
        });
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