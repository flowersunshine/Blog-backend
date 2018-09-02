const mongoose = require('mongoose');

const mongo = mongoose.connect('mongodb://localhost:27017/wangdb');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error!'));
db.once('open', function () {
    console.log('connection success!');
});

const CommentSchema = mongoose.Schema({
    articleID: Number,
    content: String,
    date: Date
});
const Comment = mongoose.model('Comment', CommentSchema);

const AncillaryInfoSchema = mongoose.Schema({
    articleID: Number,
    read: {type: Number, default: 0},
    like: {type: Number, default: 0},
});
const AncillaryInfo = mongoose.model('AncillaryInfo', AncillaryInfoSchema);

const VisitSchema = mongoose.Schema({
    visitNum: {type: Number, default: 0}
});
const Visit = mongoose.model('visit', VisitSchema);

module.exports =  {
    Comment, AncillaryInfo, Visit
}

