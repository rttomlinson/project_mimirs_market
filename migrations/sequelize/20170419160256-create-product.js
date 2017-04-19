'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('Products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            sku: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            description: {
                type: Sequelize.STRING
            },
            price: {
                allowNull: false,
                type: Sequelize.FLOAT
            },
            category_id: {
                defaultValue: 999,
                type: Sequelize.INTEGER
            },
            image_url: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')

            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')

            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('Products');
    }
};
