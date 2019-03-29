const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const wishlistSchema = new mongoose.Schema({
  name: String,
  items: [{name: String, link: String,}],
});

wishlistSchema.virtual('id')
  .get(function(){
    return this._id.toHexString();
  });

wishlistSchema.set('toJSON',{
  virtuals: true,
});

// Create a model for the wishlist

const Wishlist = mongoose.model('Wishlist',wishlistSchema);

// Add a new wishlist to the database.
router.post('/',async (req,res) => {
  const wishlist = new Wishlist({
    name: req.body.name,
    items: [],
  });
  try{
    await wishlist.save();
    res.send(wishlist);
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete a wishlist from the database.
router.delete('/:id',async (req, res)=>{
  try{
    await Wishlist.deleteOne({
      _id: req.params.id,
    });
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all the wishlists in the database.
router.get('/',async(req, res)=>{
  try{
    let wishlists = await Wishlist.find();
    res.send(wishlists);
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

// Add an item to a wishlist.
router.put('/:id',async(req, res)=>{
  try{
    let wishlist = await Wishlist.findOne({
      _id: req.params.id,
    });
    let item = {
      name: req.body.name,
      link: req.body.link,
    }
    console.log('Wishlist ' + wishlist._id + ' acquired.');
    console.log('Item {' + item.name + ', ' + item.link +'} acquired.');
    wishlist.items.push(item);
    await wishlist.save();
    res.sendStatus(200);
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete an item from a wishlist.
router.delete('/:id/:name',async (req, res) =>{
  console.log("Delete called.");
  console.log("Attempting to delete " + req.params.name);
  console.log("in wishlist " + req.params.id + '.');
  try{
    let wishlist = await Wishlist.findOne({
      _id: req.params.id,
    });
    wishlist.items = wishlist.items.filter(function(i){
      return i.name.toLowerCase() != req.params.name.toLowerCase();
    });
    await wishlist.save();
    res.sendStatus(200)
  }catch(error){
    console.log(error);
    res.sendStatus(500);
  }
})

module.exports = router;
