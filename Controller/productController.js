const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHander");

const dotenv = require("dotenv");
dotenv.config();


exports.addProduct = catchAsyncError(async (req, res, next) => {
  const { title, description } = req.body;
  if (!(title || description)) {
    return next(new ErrorHander("Title and Description is mandatory"));
  }
  req.body.user = req.user.id;
  req.body.createdAt = new Date().toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });
  req.body.updateAt = new Date().toLocaleString(undefined, {
    timeZone: "Asia/Kolkata",
  });
  await Product.create(req.body)
    .then(() => {
      res.status(201).json({
        message: "notes added successfullly",
        success: true,
      });
    })
    .catch((error) => {
      return next(new ErrorHander(error, 400));
    });
});

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const notes = await Product.find({ _id: id, user: req.user.id });
  if (!notes)
    return next(
      new ErrorHander(
        "Some error is occured or your are not the admin of this note",
        400
      )
    );
    req.body.updateAt = new Date().toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
  await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then(() =>
      res
        .status(200)
        .json({ success: true, message: "Note Update Succesfully" })
    )
    .catch((error) => {
      return next(new ErrorHander(error, 400));
    });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const notes = await Product.find({ _id: id, user: req.user.id });
  if (!notes)
    return next(
      new ErrorHander(
        "Some error is occured or your are not the admin of this note",
        400
      )
    );
  await notes.remove().then(() => {
    res
      .status(200)
      .json({ success: true, message: "Note removed succcessfully" })
      .catch((error) => {
        return next(new ErrorHander(error, 400));
      });
  });
});

exports.getAllProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.find({user:req.user.id});
  res.status(200).json({
    success: true,
    notes: product,
  });
});

