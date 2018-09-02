const { Comment, AncillaryInfo, Visit } = require('./model');

function addCommentStore(id, content, date, res) {
    const comment = new Comment({articleID: id, content, date: new Date(date)});
    comment.save((error, data) => {
        if(error) return console.error(error);
        res.send('ok');
    });
}
function increaseReadStore(id, res) {
    AncillaryInfo.updateOne({articleID: id}, {$inc: {read: 1}}, (err, raw) => {
        if(err) return console.error(err);
        if(raw.nModified === 0) return res.send(new AncillaryInfo({articleID: id, read: 1}).save());
        res.send(raw);
    });
}
function increaseLikeStore(id, res) {
    AncillaryInfo.updateOne({articleID: id}, {$inc: {like: 1}}, (err, raw) => {
        if(err) return console.error(err);
        if(raw.nModified === 0) return res.send(new AncillaryInfo({articleID: id, like: 1}).save());
        res.send(raw);
    });
}
function increaseVisitStore(res) {
    Visit.updateOne({}, {$inc: {visitNum: 1}}, (err, raw) => {
        if(err) return console.error(err);
        if(raw.nModified === 0) return res.send(new Visit({visitNum: 1}).save());
        res.send(raw); 
    });
}
function getAncillaryInfoAndCommentStore(id, res) {
    let result = {};
    let AncillaryInfoMark = false;
    let CommentMark = false;
    AncillaryInfo.findOne({articleID: id}, (err, doc) => {
        if(err) return console.error(err);
        Object.assign(result, result, doc);
        AncillaryInfoMark = true;
        AncillaryInfoMark && CommentMark && res.send(result);
    });
    Comment.count({articleID: id}, (err, count) => {
        if(err) return console.error(err);
        result.count = count;
        CommentMark = true;
        AncillaryInfoMark && CommentMark && res.send(result);
    });
}
function getVisitStore(res) {
    Visit.findOne({}, (err, doc) => {
        if(err) return console.error(err);
        res.send(doc);
    });
}
function getCommentStore(id, res) {
    Comment.find({articleID: id}, (err, docs) => {
        if(err) return console.error(err);
        res.send(docs);
    });
}
module.exports = {
    addCommentStore, increaseReadStore, increaseLikeStore, increaseVisitStore, getAncillaryInfoAndCommentStore, getVisitStore, getCommentStore
}