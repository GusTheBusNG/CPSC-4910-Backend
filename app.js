const dotenv = require('dotenv');
dotenv.config();

import express from 'express';
import axios from 'axios';

const app = express();

app.get('/api/v1/ebay', async (req, res) => {
  let items = [];
  try {
    let url = 'https://svcs.ebay.com/services/search/FindingService/v1'
    const { keywords, maxPrice, minPrice } = req.query;
    
    if (maxPrice && minPrice) url += `?itemFilter(0).paramName=Currency&itemFilter(0).paramValue=USD&itemFilter(0).name=MaxPrice&itemFilter(0).value=${maxPrice}&itemFilter(1).paramName=Currency&itemFilter(1).paramValue=USD&itemFilter(1).name=MinPrice&itemFilter(1).value=${minPrice}`;
    else if (maxPrice) url += `?itemFilter.paramName=Currency&itemFilter.paramValue=USD&itemFilter.name=MaxPrice&itemFilter.value=${maxPrice}`;
    else if (minPrice) url += `?itemFilter.paramName=Currency&itemFilter.paramValue=USD&itemFilter.name=MinPrice&itemFilter.value=${minPrice}`

    const result = await axios({
      method: 'get',
      url,
      params: {
        'OPERATION-NAME': 'findItemsByKeywords',
        'SERVICE-VERSION': '1.13.0',
        'SECURITY-APPNAME': process.env.APPNAME,
        'RESPONSE-DATA-FORMAT': 'JSON',
        keywords: keywords || 'technology'
      }
    });

    items = result.data.findItemsByKeywordsResponse[0].searchResult[0].item.map(item => ({
      ebayId: item.itemId[0],
      title: item.title[0],
      ebayLink: item.viewItemURL[0],
      price: item.sellingStatus[0].currentPrice[0].__value__,
      endTime: item.listingInfo[0].endTime[0],
      photo: item.galleryPlusPictureURL ? item.galleryPlusPictureURL[0] : (item.galleryURL && item.galleryURL[0])
    }))
  } catch (error) {
    res.status(500).send({ success: false, error })
  }

  res.set('Access-Control-Allow-Origin', '*');
  res.status(200).send({
    success: true,
    ebayResponse: items
  })
});

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});