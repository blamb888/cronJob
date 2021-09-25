"use strict";
require("dotenv").config();
const Shopify = require("shopify-api-node");
// const express = require('express');

// const app = express();

const productSuffixArr = [
  " Buy!",
  " Amazing!",
  " Stellar!",
  " Incredible!",
  " Outstanding!",
  " Wonderful!",
  " Red!",
  " Angry!",
  " Random!",
  " Blue!",
  " Brown!",
  " Marvel!",
  " Dungeons&Dragons",
  " Wishful~thinking!",
];

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_NODE_DOMAIN,
  apiKey: process.env.SHOPIFY_API_NODE_KEY,
  password: process.env.SHOPIFY_API_NODE_SECRET,
});

const shopifyChangeProductTitle = async () => {
  try {
    let params = { limit: 13 };
    const productsArr = await shopify.product.list(params);

    for (let i = 0; i < productsArr.length; i++) {
      let suffix =
        productSuffixArr[Math.floor(Math.random() * productSuffixArr.length)];
      let product_id = productsArr[i].id;
      let product_title = productsArr[i].title;
      console.log(product_id);
      console.log(product_title);
      let updatedProductTitle = product_title.replace(/\s+\S*$/, suffix);
      const updatedProducts = await shopify.product
        .update(product_id, {
          title: `${updatedProductTitle}`,
        })
        .catch((err) => console.log(err));
      console.log(updatedProducts.title);
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(
        {
          message: "You successfully updated a product title.",
        },
        null,
        2
      ),
    };
  } catch (e) {
    console.error(e);
  }
};

// const CronJob = require('cron').CronJob;
// function updateTitles() {
//   const job = new CronJob('* * * * * *', function() {
//       shopifyChangeProductTitle();
//       console.log('You will see this message every second');
//     }, null, true, 'America/Los_Angeles');
// }

// updateTitles()
// app.listen(3000);

shopifyChangeProductTitle();

module.exports = {
  // updateTitles,
  shopifyChangeProductTitle,
};
