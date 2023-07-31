const Product = require("../models/product");
const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    res.json(await new Sub({ name, parent, slug: slugify(name) }).save());
  } catch (err) {
    res.status(400).send("Create Sub Category failed");
  }
};

exports.list = async (req, res) =>
  res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());

exports.read = async (req, res) => {
  try {
    let sub = await Sub.findOne({ slug: req.params.slug }).exec();

    if (!sub) {
      return res.status(404).json({ error: "Sub category not found" });
    }

    const products = await Product.find({ subs: sub })
      .populate("category")
      .exec();

    res.json({
      sub,
      products,
    });
  } catch (error) {
    console.error("Error fetching Subcategory and products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    res.json(
      await Sub.findOneAndUpdate(
        { slug: req.params.slug },
        { name, parent, slug: slugify(name) },
        { new: true }
      )
    );
  } catch (err) {
    res.status(400).send("Sub Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (err) {
    res.status(400).send("Sub Category delete failed");
  }
};
