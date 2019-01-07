const sm = require("sitemap");
const fs = require("fs");
const path = require("path");

const urls = [
  { url: "configure" },
  { url: "cart" },
  { url: "configurable" },
  { url: "support" },
  { url: "faqs" },
  { url: "contact" }
];

const getDynamicData = () => {
  return {
    pages: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 },
      { id: 10 }
    ],
    products: [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 },
      { id: 9 },
      { id: 10 }
    ],
    collections: [
      {
        id: "collection_1",
        child: ["child_1", "child_2", "child_3", "child_4"]
      },
      { id: "collection_2", child: ["child_5", "child_6", "child_7"] },
      { id: "collection_3", child: ["child_8", "child_9", "child_10"] }
    ]
  };
};

const generateSitemap = async (request, response) => {
  const hostname = `${request.protocol}://${request.get("host")}`;

  const { pages, collections, products } = await getDynamicData();

  pages.map(page => urls.push({ url: `page/${page.id}` }));
  products.map(product => urls.push({ url: `product/${product.id}` }));
  collections.map(collection => {
    collection.child.map(name =>
      urls.push({ url: `category/${collection.id}/${name}` })
    );
  });

  const sitemap = sm.createSitemap({
    hostname,
    cacheTime: 600000,
    urls
  });

  const filePath = path.resolve("./src/sitemap.xml");

  try {
    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, sitemap.toString());
      response.status(200).json({ message: "Generated successfully" });
    } else {
      response.status(404).json({ message: "File doesn't exists" });
    }
  } catch (e) {
    response.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = generateSitemap;
