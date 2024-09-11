const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const Listing = require("../models/listing.js");
module.exports.index = async (req, res) => {
  let alllisting = await Listing.find({});
  res.render("listings/index", { alllisting });
};

module.exports.renderNewform = (req, res) => {
  if (!req.isAuthenticated()) {

    req.flash("error", "you must logged in to create listing");
    return res.redirect("/login");
  }
  res.render("./listings/new.ejs");
};
module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "review",
      populate: { path: 'author' }
    }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing You requested it does not exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New Listing created");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You requested it does not exist");
    res.redirect("/listings");
  }
  if (!req.isAuthenticated()) {

    req.flash("error", "you must logged in to edit listing");
    return res.redirect("/login");
  }

  res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params; // Destructure id from request parameters
  const listing = await Listing.findById(id); // Fetch the listing from the database

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  // Check if the user is the owner of the listing
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit this listing");
    return res.redirect(`/listings/${id}`);
  }
  validateListing

  // Update the listing
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params; // Destructure id from request parameters
  const listing = await Listing.findById(id); // Fetch the listing from the database

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  // Check if the user is the owner of the listing
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to delete this listing");
    return res.redirect(`/listings/${id}`);
  }
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "New Listing deleted");
  res.redirect("/listings");
};