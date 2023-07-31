const Category = require("../models/category");
const slugify = require("slugify");
const Sub = require("../models/sub");
const Product = require("../models/product");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    res.json(await new Category({ name, slug: slugify(name) }).save());
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Category.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug }).exec();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const products = await Product.find({ category })
      .populate("category")
      .exec();

    res.json({
      category,
      products,
    });
  } catch (error) {
    console.error("Error fetching category and products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    res.json(
      await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name, slug: slugify(name) },
        { new: true }
      )
    );
  } catch (err) {
    res.status(400).send("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Category delete failed");
  }
};
exports.getSubs = async (req, res) => {
  try {
    const subs = await Sub.find({ parent: req.params._id }).exec();
    res.json(subs);
  } catch (err) {
    console.log(err.message);
  }
};
