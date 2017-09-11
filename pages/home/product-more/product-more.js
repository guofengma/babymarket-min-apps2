
import ProductSpecification from '../../../components/product-specification/product-specification';

let {Tool, Storage, RequestReadFactory, RequestWriteFactory} = global;

Page({

  /**
   * 页面的初始数据
   */
  data: {
      bodyData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let categoryId = options.id;
      wx.setNavigationBarTitle({
          title: options.title
      })
      Tool.showLoading();
      this.requestSortAdData(categoryId);
  }, 
  /**
     * 请求分类广告位数据
     */
  requestSortAdData: function (categoryId) {
      let task = RequestReadFactory.sortAdRead(categoryId);
      task.finishBlock = (req) => {
          let responseData = req.responseObject.Datas;
          responseData.forEach((item, index) => {
              let url = Tool.imageURLForId(item.ImgId);
              item.imageUrl = url;
          });
          let bodyData = new Object();
          bodyData.adData = responseData;
          this.setData({
              bodyData: bodyData
          });
          //请求商品分类
          this.requestSortCategoryData(categoryId);
      };
      task.addToQueue();
  },
  /**
     * 请求分类里面产品的分类数据
     */
  requestSortCategoryData: function (categoryId) {
      let task = RequestReadFactory.homeTwoSortRead(categoryId);
      task.finishBlock = (req) => {
          let responseData = req.responseObject.Datas;
          responseData.forEach((item, index) => {
              //查询每个分类对应的商品
              this.requestTwoSortProductData(item.Id, index);
          });
          let bodyData = this.data.bodyData;
          bodyData.sortData = responseData;
          this.setData({
              bodyData: bodyData
          });
      };
      task.addToQueue();
  },
  /**
   * 请求分类里面产品数据
   */
  requestTwoSortProductData: function (categoryId, index) {
      let task = RequestReadFactory.homeTwoSortProductRead(categoryId);
      task.finishBlock = (req) => {
          let responseData = req.responseObject.Datas;
          let bodyData = this.data.bodyData;
          bodyData.sortData[index].productData = responseData;
          this.setData({
              bodyData: bodyData
          });
      };
      task.addToQueue();
  },
  /**
     * 列表子视图点击事件
     */
  onChildClickListener: function (e) {
      let productId = e.currentTarget.dataset.id;
      wx.navigateTo({
          url: '/pages/product-detail/product-detail?productId=' + productId
      })
  },
  /**
    * 添加到购物车
    */
  onAddCartClickListener: function (e) {
      let productId = e.currentTarget.dataset.id;
      console.log(productId)

      let self = this;
      this.productSpecification = new ProductSpecification(this,productId);
      this.productSpecification.finishBlock = (specificationId,product,count,price) => {
          global.Tool.showAlert(specificationId);
      };

      this.productSpecification.showWithAction('ShoppingCart');
  }
})