const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category')

const Article = connection.define('articles',{
    title:{
        type:Sequelize.STRING,
        allowNull:false
    },slug:{
        type:Sequelize.STRING,
        allowNull:false
    },
    body:{
        type:Sequelize.TEXT,
        allowNull:false
    }
})

//Relationship 1 to N;
Category.hasMany(Article);
//Relationship 1 to 1; 
Article.belongsTo(Category);// ONE article belong to a category

//Article.sync({force:false}); force Article creation

module.exports = Article;