import ProductSpecification from '../../../components/product-specification/product-specification';

let { Tool, Storage, RequestReadFactory, RequestWriteFactory } = global;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productArray: null,
    imageUrl:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let categoryId = options.id;
    let imageUrl = Tool.imageURLForId(options.imageId);
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      imageUrl: imageUrl
    });
    Tool.showLoading();
    this.requestTargetProductData(categoryId, -1);
  },
  /**
   * 获取标签产品数据
   */
  requestTargetProductData: function (id, typeId, index) {
    let task = RequestReadFactory.homeTargetProductRead(id, typeId);
    task.finishBlock = (req) => {
      let responseData = req.responseObject.Datas;
      this.setData({
        productArray: responseData
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