const express = require('express');
const router = express.Router();
const Category = require('./Category');
const Article = require('../articles/Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');



router.get("/admin/categories", adminAuth, (req, res) => {
   Category.findAll({raw:true, order:[
      ['id','ASC'],
   ]}).then(categories => {
      res.render("admin/categories/index", {categories:categories});
   });
});
   

router.get("/admin/categories/new", adminAuth, (req, res) => {
   res.render("admin/categories/new");
});

router.post("/categories/save", (req, res) => {
   let title = req.body.title;
   if (title!=undefined) {
      let slug = "na";
   Category.create({ 
       title: title,
       slug: slugify(title) //optimized version of title with no spaces for url
   }).then(() => {
       res.redirect("/admin/categories/");

   });
   }else{
      res.redirect("admin/categories/index")
   }
});  

router.post("/categories/delete", (req, res) => {
   let id = req.body.id;
   if(id!=undefined) {
      if(!isNaN(id)) {

         Article.destroy({
            where: {
               categoryId: id   
         }});

         Category.destroy({ 
            where: {
              id:id
           }}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
                 if(rowDeleted === 1){
                    console.log('Deleted successfully');
                    res.redirect("/admin/categories");
                 }
                 
            }, function(err){
                console.log(err); 
            });

      }else{
         res.redirect("/admin/categories/index")

      }
   }else{
      res.redirect("/admin/categories/index")
      }
   
});


router.post("/categories/update", (req, res) => {
   let id = req.body.id;
   let title = req.body.title;

   Category.update( {title: title, slug: slugify(title)},{
      where:{
         id:id 
      }
      }).then(() => {
         console.log('Updated successfully');
         res.redirect("/admin/categories")
      })

});


router.get("/admin/categories",  adminAuth,  (req,res) => {
   res.render("admin/categories/index")
});


router.get("/admin/categories/edit/:id",  adminAuth, (req,res) => {
   let id = req.params.id;

   if(isNaN(id)){
      res.redirect("/admin/categories")
   }

   Category.findByPk(id).then(category => {
      if(category !=undefined){

         res.render("admin/categories/edit",{category:category})


      }else{
         res.redirect("/admin/categories")
      }

   }).catch(erro =>{
      res.redirect("/admin/categories")
   })
});




module.exports = router;
