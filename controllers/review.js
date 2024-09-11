const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.createReview=async (req, res) => {
    try {
      let listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).send("Listing not found");
      }
      let newReview = new Review(req.body.review);
      newReview.author=req.user._id;
      console.log(newReview);
      await newReview.save(); // Save the review first
      listing.review.push(newReview._id); // Push the ID of the new review to the listing's review array
      await listing.save(); // Then save the updated listing
      req.flash("success","New Review created");
      res.redirect(`/listings/${listing._id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };

  module.exports.destroyReview= async(req, res) => {
    const { id, reviewId } = req.params;

    if (!res.locals.currUser) {
      req.flash("error", "You need to be logged in to delete a review");
      return res.redirect(`/listings/${id}`);
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      req.flash("error", "Review not found");
      return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not authorized to delete this review");
      return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}