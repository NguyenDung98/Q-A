let db = require('../models');

module.exports = {
	createUser(req, res){
		db.User.create(req.body)
			.then(user => {
				res.json(user)
			})
			.catch(error => {
				res.send(error);
			})
	},
	getAllUser(req, res){
		db.User.find()
			.then(users => {
				res.json(users)
			})
			.catch(error => [
				res.send(error)
			])
	},
	updateUser(req, res){
		db.User.findByIdAndUpdate(req.params.userID, req.body, {new: true})
			.then(updateUser => {
				res.json(updateUser)
			})
			.catch(error => {
				res.send(error)
			})
	},
    deleteUser(req, res){
        db.User.findByIdAndDelete(req.params.userID)
            .then(deleteUser => {
                res.json(deleteUser)
            })
            .catch(error => [
                res.send(error)
            ])
    }
};