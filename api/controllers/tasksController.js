const Task = require('../models/task');
const mongoose = require('mongoose');

exports.get_all_tasks = (req, res, next) => {
    var allTasksTree = [];
    Task.find().exec().then(result => {
        result = result.map(r => {return r._doc;})
            for (let i = 0; i < result.length; i++) {
                result[i].childrens = [];
                if (result[i].children_ids.length) {
                    result[i].childrens= result[i].childrens.concat(getTreeWithoutPromises(result[i], result));
                }
                allTasksTree.push(result[i]);
            }
            res.status(200).json(allTasksTree);
        }).catch(error => res.status(500).json({
            message: error.message
        }));


    function getTreeWithoutPromises(currentTask, allTasks) {
        var res = [];
        allTasks.forEach((task, index) => {
            if (currentTask.children_ids.indexOf(task._id.toString()) > -1) {
                if (task.children_ids.length > 0) {
                    task.childrens = [];
                    task.childrens = task.childrens.concat(getTreeWithoutPromises(task, allTasks));
                }
                res.push(task);
            }
        });
        return res;
    }
};


exports.get_task_by_id = (req, res, next) => {
    const id = req.params.userId;
    var fullName = "";
    findElement(id, req, res, next);
};

function findElement(id, req, res, next) {
    Task.findById(id).exec()
    .then(result => {
        if (result) {
            if (result.parent_id) {

               return result;
            }
            result = result._doc;
            result.fullPath = fullName;
            res.status(200).json(result)
        } else {
            res.status(404).json({
                message: "Object not found!"
            })
        }

    }).then(resultNext => {
        fullName = resultNext.name + "/" +fullName
        return findElement(resultNext.parent_id, req, res, next);
    })
    .catch(error => res.status(500).json({
        message: error.message
    }));
}


exports.create_task = (req, res, next) => {
    Task.find().exec().then(allTasks => {
        var maxId = allTasks.reduce((max, p) => p.task_id > max ? p.task_id : max, allTasks[0].task_id);
        createTask(maxId)
    }).catch(error => {
        // uses for the first create
        createTask();
    });

    function createTask(maxId) {
        const task = new Task({
            _id: mongoose.Types.ObjectId(),
            task_id: ++maxId || 1,
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