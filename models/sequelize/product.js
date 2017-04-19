'use strict';
module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define('Product', {
        name: DataTypes.STRING,
        sku: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        price: DataTypes.FLOAT,
        category_id: DataTypes.INTEGER,
        image_url: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
                Product.belongsTo(models.Category, {
                    foreignKey: "category_id"
                });
            },

            defaultSearchValue: function() {
                return '';
            },

            defaultMinValue: function() {
                return 0;
            },

            defaultMaxValue: function() {
                return 1000;
            }

        }
    });
    return Product;
};
