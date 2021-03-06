var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// set up a mongoose model
const Todo = mongoose.model(
  "Todo",
  new Schema(
    {
      todo_id: String,
      title: String,
      points: Number,
      date: Date,
      category: String,
      completed: Boolean,
      tags: [String],
      deleted: Boolean
    },
    { timestamps: true }
  )
);

module.exports = Todo;
