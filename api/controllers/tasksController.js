const Task = require('../models/task');
const mongoose = require('mongoose');

exports.get_all_tasks = (req, res, next) => {
    Task.find().exec()
        .then(result => {

            res.status(200).json(result);
        })
        .catch(error => res.status(500).json({
            message: error.message
        }));

        async function getByIds(chield_ids) {
        
            model.find({
                '_id': { $in: [
                    mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
                    mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
                    mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
                ]}
            }, function(err, docs){
                 console.log(docs);
            });
        }
};


exports.get_task_by_id = (req, res, next) => {
    const id = req.params.userId;

    Task.findById(id).exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: "Object not found!"
                })
            }

        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
};


exports.create_task = (req, res, next) => {
    Task.find().sort({ task_id: -1 }).limit(1)
        .then(taskWithMaxId => {
            console.log(taskWithMaxId);
            createTask(taskWithMaxId)
        }).catch(error => {
            createTask(error);
        });

    function createTask(taskWithMaxId) {
        const task = new Task({
            _id: mongoose.Types.ObjectId(),
            task_id: ++taskWithMaxId.task_id || 1,
            name: req.body.name,
            description: req.body.description,
            parent_id: req.body.parent_id,
            children_ids: req.body.children_ids,
            user_id: req.body.user_id,
            column_id: req.body.column_id,
            status: req.body.status
        })

        task.save().then(result => {
            res.status(200).json({
                result: result
            })
        }).catch(error => {
            res.status(500).json({
                error: error
            })
        });
    }
};

exports.update_task = (req, res, next) => {
    const id = req.params.taskId;
    const propertiesForUpdate = {};
    for (const prop in req.body) {
        propertiesForUpdate[prop] = req.body[prop];
    }
    Task.update({ _id: id }, { $set: propertiesForUpdate }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => res.status(500).json({
            error: error
        }));
};

exports.delete_task = (req, res, next) => {
    const id = req.params.taskId;
    Task.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => next(error));
};