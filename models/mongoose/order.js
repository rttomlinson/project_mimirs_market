// models/Order.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrderSchema = new Schema({
    completed: Boolean,
    billingInfo: Schema.Types.Mixed,
    orderItems: [],
    paymentInfo: Schema.Types.Mixed

}, {
    timestamps: true
});

let Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
