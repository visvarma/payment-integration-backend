const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const ProductModel = require("./models/Product/schema");
dotenv.config();

const Products = [
  {
    name: "Hair Oil",
    description:
      "Cutting, tapering, texturizing and thinning using any hair type",
    type: "product",
    image_url:
      "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
    category: "Hair",
    price: 200,
  },
  {
    name: "Hair Shampoo",
    description:
      "Cutting, tapering, texturizing and thinning using any hair type",
    type: "product",
    image_url:
      "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
    category: "Hair",
    price: 300,
  },
  {
    name: "Face wash gel",
    description:
      "Cutting, tapering, texturizing and thinning using any hair type",
    type: "product",
    image_url:
      "https://cdn2.iconfinder.com/data/icons/barber-services-in-glyph-style/32/man-haircut-512.png",
    category: "Skin",
    price: 250,
  },
];

const deleteDatabase = async () => {
  console.log("Deleting DB");
  await ProductModel.remove({});
  console.log("Product collection deleted");
  console.log("---DONE---");
};

const createProducts = async () => {
  for (const Product of Products) {
    const product = new ProductModel(Product);
    await product.save();
  }
};

const setupDatabase = async () => {
  const MONGO_CONNECTION = process.env.MONGO_CONNECTION;
  await mongoose.connect(MONGO_CONNECTION, {
    useNewUrlParser: true,
  });
  console.log("DB connected");
  await deleteDatabase();
  console.log("Adding products");
  await createProducts();
  console.log("---DONE---");
  process.exit();
};

setupDatabase();
