let db = require('../models');
const userType = require("../models/userType");

module.exports = {
	createUser(req, res){
        if (req.body.role !== userType.admin) {
            db.User.create(req.body)
                .then(session => {
                    res.json(session)
                })
                .catch(error => {
                    res.send(error)
                })
        } else {
            res.send(new Error("Can not create user ADMIN!"));
        }
	},
	getAllUser(req, res){
		db.User.find()
			.then(users => {
				const filteredUsers = users.filter(user => user.role !== userType.admin);
                res.json(filteredUsers);
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
    },
	verifyUser(username, password) {
		return db.User.findOne({username, password})
			.then(user => {
				return user;
			})
			.catch(error => {
				return new Error(error);
			})
	}
};