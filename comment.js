const { addCommentStore, getCommentStore } = require('./dao/store')
module.exports = {
    addComment(req, res) {
        addCommentStore(req.body.id, req.body.content, req.body.date, res);
    },
    deleteComment(req, res) {

    },
    getComment(req, res) {
        getCommentStore(req.params.id, res);
    }
}