const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const { required } = require("joi");
const listingController=require("../controllers/listing.js");
const multer=require('multer');
const {storage}=require("../CloudConfig.js");
const upload=multer({storage});

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
      if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      } else {
        next();
      }
    };
  
//listing route
// index route
router.get("/", wrapAsync(listingController.index));
  //new route
  router.get("/new",listingController.renderNewform);
  
  //show route
  router.get("/:id",wrapAsync(listingController.showListings));
  // create route
  router.post("/",
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListings)
  );
  
  //edit route
  router.get("/:id/edit", wrapAsync(listingController.editListing));
  
  // Update route
router.put("/:id",
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing));

  
  // Delete route
  router.delete("/:id",wrapAsync(listingController.destroyListing));
module.exports=router;