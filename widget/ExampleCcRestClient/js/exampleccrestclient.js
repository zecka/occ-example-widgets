define([
  "knockout",
  "CCi18n",
  "pageLayout/product",
  "ccConstants",
  "ccRestClient",
  "pageLayout/site",
], function (ko, CCi18n, product, CCConstants, ccRestClient, SiteViewModel) {
  "use strict";

  return {
    testdata: ko.observable(),
    CCi18n: CCi18n,
    CCConstants: CCConstants,
    product: product,
    ccRestClient: ccRestClient,
    items: ko.observable(),
    debugVar: ko.observable(),
    /*
     * Note that "this" is bound to the Widget View Model.
     */
    resourcesLoaded: function (widget) {},

    onLoad: function (widget) {
      widget.getProductAvailability("8000070136328", "8000070136328", null);
      widget.getProductList();
    },

    beforeAppear: function (page) {},
    getProductList: function () {
      // https://github.com/lyracons/doc.oracle/blob/master/Dynamo_Client_Store_web_store.war_shared_js_viewModels_productListingViewModel.js.html
      var data = {};
      data[CCConstants.TOTAL_RESULTS] = true;
      data[CCConstants.TOTAL_EXPANDED_RESULTS] = true;
      data[CCConstants.CATALOG] = null;
      data[CCConstants.OFFSET] = 0;
      data[
        CCConstants.STORE_PRICELISTGROUP_ID
      ] = SiteViewModel.getInstance().selectedPriceListGroup().id;
      var url = CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS;
      ccRestClient.request(
        url,
        data,
        this.successProductList.bind(this),
        function (error) {
          console.error("getProductList", error);
        }
      );
    },
    successProductList: function (success) {
      this.debugVar(success.totalResults);
      this.items(success.items);
      console.log("SUCCESS", success);
    },
    getProductAvailability: function (productId, skuId, catalog) {
      var input = {};

      input[CCConstants.SKU_ID] = skuId; // CCConstants.SKU_ID = “skuId”

      input[CCConstants.CATALOG] = catalog; // CCConstants.CATALOG = “catalogId”

      var pathParam = productId;

      var url = CCConstants.ENDPOINT_GET_PRODUCT_AVAILABILITY; // = “getStockStatus"
      this.requesting = true;

      ccRestClient.request(
        url,
        input,
        function (success) {
          console.log("getProductAvailability", success);
        },
        function (error) {
          console.error("getProductAvailability", error);
        },
        pathParam
      );
    },
  };
});
