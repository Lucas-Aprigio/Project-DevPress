const express = require('express');
const app = express();
const connection = require('./database/database');
const session = require('express-session');


app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.set('view engine','ejs');
app.use(express.static('public'));

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require('./articles/Article');
const Category = require('./categories/Category');
const User = require ('./users/User');

connection
    .authenticate()
    .then(()=> {
	    console.log("Connected successfully to database");
    }).catch((error) => {
	    console.log(error)
    })
//Session
app.use(session({
    secret: 'youwillneverguess', cookie:{maxAge: 300000000}
}));

app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/", usersController);


app.get("/", (req,res) => {
    Article.findAll({
        order: [
            ['id','DESC']
        ],
        limit:5
        
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });
        
    });
})

app.get("/:slug", (req,res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article!= undefined) {
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else {
            res.redirect("/");
        }     
    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    let slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if (category!= undefined) {
            Category.findAll().then(categories => {
                res.render("index",{articles:category.articles, categories:categories})
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
})


app.listen(8080, () => {
	console.log("The server is running on port 8080");
})
