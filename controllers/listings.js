const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};

  // 🌍 Forward Geocoding step
  const locationQuery = req.body.listing.location;
  const geoRes = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(locationQuery)}.json`,
    { params: { key: process.env.MAP_API } }
  );
  const coords = geoRes.data.features[0].geometry.coordinates; // [lng, lat]
  newListing.geometry = {
    type: "Point",
    coordinates: coords
  };
  // console.log("Coordinates for", locationQuery, ":", coords);
  
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Can't edit non exixting listing");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_100");
  res.render("listings/edit.ejs", { listing , originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
  }
  
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "listing deleted");
  res.redirect("/listings");
};
