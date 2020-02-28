# Driver Incentive eBay API Wrapper

## Run locally
1. Clone the repo
2. Make a .env
3. Add `PORT` to the .env 
   1. Example: `PORT=5000`
4. Add `APPNAME` to the .env
   1. Example: `APPNAME=GET APPNAME FROM NICK`
5. Run `npm install`
6. Run `npm start`

## TODO
* Deploy this service
  
## Documentation
url: `/api/v1/ebay`

params: 
```
{
  keyword: 'technology' // default, max 350 characters,
  maxPrice: // some number or string here
  minPrice: // some number or string here
}
```

returns either an error 😢
or
```
{
  success: true
  ebayResponse: [{
    ebayId // eBay's Id
    title // The title
    ebayLink // The link to visit eBay's page
    price // Price (USD)
    endTime // When the product is no longer available
    photo // The best photo link we can get
  }]
}
```
🎉