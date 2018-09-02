const { increaseReadStore, increaseLikeStore, increaseVisitStore, getAncillaryInfoAndCommentStore, getVisitStore } = require('./dao/store');

module.exports = {
    increaseRead(req, res) {
        increaseReadStore(req.params.id, res);
    },
    increaseLike(req, res) {
        increaseLikeStore(req.params.id, res);
    },
    increaseVisit(req, res) {
        increaseVisitStore(res);
    },
    getAncillaryInfoAndComment(req, res) {
        getAncillaryInfoAndCommentStore(req.params.id, res);
    },
    getVisit(req, res) {
        getVisitStore(res);
    }
}