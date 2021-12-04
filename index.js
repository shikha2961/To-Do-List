const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const { urlencoded } = require("body-parser");

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-shikha:Rest123@cluster0.jfkif.mongodb.net/todolistDB", {useNewUrlParser: true});
const itemsSchema = {
    name: String
};
const item = mongoose.model("itemSchema" , itemsSchema);
const item1 = new item({
    name: "Welcome to your To Do List"
});
const item2 = new item({
    name: "Click + to add an Item"
});
const item3 = new item({
    name: "<-- Hit to add an Item"
});
const defaultItems = [item1, item2, item3];
const listSchema = {
    name: String,
    item: [itemsSchema]
};
const list = mongoose.model("List" , listSchema);

app.get("/", function (req, res) {
    item.find({}, function(err, foundItems){
        if(foundItems.length===0){
            item.insertMany(defaultItems, function(err){
            if(err) console.log(err);
            else console.log("Successfully Added");
        });
        res.redirect("/");
        }else{
            res.render("list", { listTitle: "Today", newlistitem: foundItems});
        }
     });
});

app.post("/", function (req, res) {
    const itemName = req.body.newitem;
    const listName = req.body.list;
    const Item = new item({
     name: itemName
    });

    if(listName==="Today"){
        Item.save();
        res.redirect("/");
    }else{
        list.findOne({name: listName}, function(err, foundList){
            foundList.item.push(Item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete" , function(req, res){
    const itemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName==="Today"){
        item.findByIdAndRemove(itemId, function(err){
            if(!err) {
                console.log("Successfully Deleted");
                res.redirect("/");
            }
        });
    }else{
        list.findOneAndUpdate({name: listName}, {$pull: {item: {_id: itemId}}}, function(err, foundList ){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }
 
    
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
  
    list.findOne({name:customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                // create a list
                const ist = new list({
                    name: customListName,
                    item: defaultItems
                });
                ist.save();
                res.redirect("/");
            }
            else{
                // show a existing list
                res.render("list", { listTitle: foundList.name, newlistitem: foundList.item })
            }
        }
    });
});
app.get("/about", function (req, res) {
    res.render("about");
})
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", newlistitem: WorklistItems })
});
let port = process.env.PORT;
if(port==null || port=="" ){
    port=3000;
}

app.listen(port, function () {
    console.log("Server started on port 3000");
});
