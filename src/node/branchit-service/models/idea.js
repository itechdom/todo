var mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");
var Schema = mongoose.Schema;
let ideaSchema = new Schema({
  tree: String,
  ideas: Array
});
ideaSchema.plugin(findOrCreate);

// set up a mongoose model
module.exports = mongoose.model("Idea", ideaSchema);
