// basic route (http://localhost:8080)
const express = require('express');
var busboy = require('connect-busboy');

var apiRoutes = express.Router();

export default function ({
  app,
  Todo
}) {

  //busboy is for uploading multipart forms (csv files here)
  app.use(busboy());

  apiRoutes.get('/', function (req, res) {
    res.send('Hello! this is budgetqt backend!');
  });

  apiRoutes.get('/todos', function (req, res) {
    Todo.find({}).sort('-date').exec((err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.send(data);
    });
  });

  const findOrUpdateTodo = (todo) => {
    return new Promise((resolve, reject) => {
      Todo.findOneAndUpdate({ title: todo.title}, todo, {
        upsert: true
      }, function (err, doc) {
        if (err) return reject(err);
        return resolve(todo);
      });
    })
  }
  apiRoutes.post('/todos', function (req, res) {
    let todos = req.body.todos;
    let updateTodoPromises = todos.map(todo => findOrUpdateTodo(todo));
    Promise.all(updateTodoPromises).then((values) => {
      res.send(values)
    }).catch(err => {
      res.status(500).send(err);
    })
  });

  apiRoutes.put('/todos', (req, res) => {
    //take the imported todo, format it and add it to the todos collection
    let todo = req.body;
    let newTodo = { title: todo.title, amount: todo.amount, date: todo.date, tags: todo.tags }
    Todo.findOneAndUpdate({ _id: todo._id }, newTodo, {
      upsert: false
    }, function (err, doc) {
      if (err) return res.send(500, { error: err });
      res.send(newTodo);
    });
  });

  apiRoutes.delete('/todos', (req, res) => {
    let todo = req.body;
    //remove the imported todo
    Todo.find({
      _id: todo["_id"]
    }).remove().exec((err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send();
    });
  });

  apiRoutes.get('/todos/export/csv', (req, res) => {
    Todo.find({}, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.setHeader('Content-disposition', 'attachment; filename=todos.csv');
      res.set('Content-Type', 'text/csv');
      let csvFile = csvConverter(data);
      res.status(200).send(csvFile);
    });
  });

  apiRoutes.post('/todos/upload/csv', function (req, res) {
    if (req.busboy) {
      req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        file.pipe(csv()).on('data', (entry) => {

          var todo = parser({
            entry
          });

          todo.title = filename;

          if (!hasPaymentTags(todo.tags)) {
            return Todo.update(
              { date: todo.date, amount: todo.amount, tags: { $in: todo.tags } },
              { $setOnInsert: todo },
              { upsert: true },
              function (err, numAffected) {
                if (err) {
                  return console.log("ERROR", err);
                }
              }
            );
          }
        })
      });
      req.busboy.on('field', function (key, value, keyTruncated, valueTruncated) { });
      req.pipe(req.busboy);
    }
    res.send('You have uploaded the file!');
  });

  return apiRoutes;
}
