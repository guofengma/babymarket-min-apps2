import ProductSpecification from '../../../components/product-specification/product-specification';

let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productArray: null
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
    this.requestTwoSortProductData(categoryId);
  },
  /**
   * 请求分类里面产品数据
   */
  requestTwoSortProductData: function (categoryId) {
    let task = RequestReadFactory.homeTwoSortProductRead(categoryId);
    task.finishBlock = (req) => {
      let productArray = req.responseObject.Datas;
      this.setData({
        productArray: productArray
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

    let self = this;
    this.productSpecification = new ProductSpecification(this, productId);
    this.productSpecification.finishBlock = (specificationId, product, count, price) => {
      global.Tool.showAlert(specificationId);
    };

    this.productSpecification.showWithAction('ShoppingCart');
  }
})