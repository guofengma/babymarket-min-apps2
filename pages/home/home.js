// home.js

/**
 * 首页
 */
import ProductSpecification from '../../components/product-specification/product-specification';
import Login from '../login/login';

let { Tool, Storage, RequestReadFactory, Event } = global;

Page({
    data: {
        //海报数据
        bannerArray: [],
        //爆款海报数据
        hotBannerArray: [],
        //码头快报数据
        bulletinContent: [],
        // 当前选中的tab
        currentTab: 0,
        //标签数据
        targetArray: [],
        //一级分类数据
        oneSortData: [],
        inviteCode: ''
    },
    bulletinDatas:'',

    onLoad: function (options) {
        Event.on('loginSuccess', this.reload, this);
        Event.on('LoginOutNotic', this.reload, this);
        this.reload();

        // 存储邀请码
        if (options) {
            let inviteCode = options.fromId;
            if (Tool.isValidStr(inviteCode)) {
                wx.setStorageSync('fromId', inviteCode)
            }
        }
    },

    reload() {
        this.requestTargetData();
        this.requestOneSortData();
        this.requestHomeAdData();
        this.requestHomeBulletinData();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        Event.off('loginSuccess', this.reload)
        Event.off('LoginOutNotic', this.reload);
    },

    onShow() {
        let r = RequestReadFactory.memberInfoRead();
        r.addToQueue();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let self = this;
        wx.getStorage({
            key: 'currentMember',
            success: function (res) {
                self.setData({
                    inviteCode: res.data.InvitationCode
                })
            },
        })

        let title = '老友码头';
        let path = '/pages/home/home?fromId=' + this.data.inviteCode;
        let obj = {
            title: title,
            path: path,
            success: function (res) {
            },
            fail: function (res) {
            }
        };
        return obj;
    },
    /**
     * 获取标签数据
     */
    requestTargetData: function () {
        let task = RequestReadFactory.homeTargetRead();
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;

            this.setData({
                targetArray: responseData
            });

            //循环请求标签的产品
            responseData.forEach((item, index) => {
                this.requestTargetProductData(item.Id, item.ShowTypeKey, index);
            });
        };
        task.addToQueue();
    },

    /**
     * 获取标签产品数据
     */
    requestTargetProductData: function (id, typeId, index) {
        let task = RequestReadFactory.homeTargetProductRead(id, typeId);
        let targetArray = this.data.targetArray;
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            targetArray[index].productData = responseData;
            this.setData({
                targetArray: targetArray
            });
        };
        task.addToQueue();
    },

    /**
     * 获取一级分类数据
     */
    requestOneSortData: function () {
        let task = RequestReadFactory.homeOneSortRead();
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            this.setData({
                oneSortData: responseData
            });

            //循环请求分类的产品
            responseData.forEach((item, index) => {
                if (index > 0) {
                    this.requestOneSortProductData(item.Id, item.MaxShow, index);
                }
            });
        };
        task.addToQueue();
    },
    /**
     * 请求一级分类里面产品数据
     */
    requestOneSortProductData: function (categoryId, maxCount, index) {
        let task = RequestReadFactory.homeOneSortProductRead(categoryId, maxCount);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let oneSortData = this.data.oneSortData;
            oneSortData[index].productData = responseData;
            oneSortData[index].isMore = true;
            if (responseData.length == 0 || responseData.length < oneSortData[index].MaxShow) {
                oneSortData[index].isMore = false;
            }
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
     * 请求分类广告位数据
     */
    requestSortAdData: function (categoryId) {
        let task = RequestReadFactory.sortAdRead(categoryId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let oneSortData = this.data.oneSortData;
            let bodyData = new Object();
            bodyData.adData = responseData;
            let oneSort = oneSortData[this.data.currentTab];
            oneSort.bodyData = bodyData;
            this.setData({
                oneSortData: oneSortData
            });
            //请求商品分类
            this.requestSortCategoryData(oneSort.Id);
        };
        task.addToQueue();
    },
    /**
     * 请求分类里面产品的分类数据
     */
    requestSortCategoryData: function (parentId) {
        let task = RequestReadFactory.homeTwoSortRead(parentId);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                //查询每个分类对应的商品
                this.requestTwoSortProductData(item.Id, index, item.CategoryMaxShow);
            });
            let oneSortData = this.data.oneSortData;
            let bodyData = oneSortData[this.data.currentTab].bodyData;
            bodyData.sortData = responseData;
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
     * 请求分类里面产品数据
     */
    requestTwoSortProductData: function (categoryId, index, maxCount) {
        let task = RequestReadFactory.homeTwoSortProductRead(categoryId, maxCount);
        task.finishBlock = (req) => {
            let responseData = req.responseObject.Datas;
            let oneSortData = this.data.oneSortData;
            let sort = oneSortData[this.data.currentTab].bodyData.sortData[index];
            sort.productData = responseData;
            sort.isMore = true;
            if (responseData.length == 0 || responseData.length < sort.CategoryMaxShow) {
                sort.isMore = false;
            }
            this.setData({
                oneSortData: oneSortData
            });
        };
        task.addToQueue();
    },
    /**
     * 查询首页海报数据
     */
    requestHomeAdData: function () {
        let task = RequestReadFactory.homeAdRead();
        task.finishBlock = (req) => {
            let tempArray = req.responseObject.Datas;
            let bannerArray = [];
            let hotBannerArray = [];
            tempArray.forEach((item, index) => {
                //拆分首页显示海报和爆款海报数据
                if (item.BelowShow == 'True') {
                    hotBannerArray.push(item);
                } else {
                    bannerArray.push(item);
                }
            });
            this.setData({
                bannerArray: bannerArray,
                hotBannerArray: hotBannerArray
            });
        };
        task.addToQueue();
    },
    /**
     * 查询首页码头快报数据
     */
    requestHomeBulletinData: function () {
        let task = RequestReadFactory.homeBulletinRead();
        task.finishBlock = (req) => {
            let bulletinArray = req.responseObject.Datas;
            if (bulletinArray.length > 0) {
                this.setData({
                    bulletinContent: bulletinArray[0].Title,
                    bulletinDatas:bulletinArray[0]
                });
            }
        };
        task.addToQueue();
    },
    /**
     * swiper切换事件
     */
    onTabChangeListener: function (e) {
        let currentIndex = e.detail.current;
        if (currentIndex == undefined) {
            currentIndex = e.currentTarget.dataset.current;
        }
        if (this.data.currentTab != currentIndex) {
            this.setData({
                currentTab: currentIndex
            });

            //如果分类的主体数据为空，那么去请求主体数据
            let oneSort = this.data.oneSortData[currentIndex];
            if (oneSort.bodyData == undefined && currentIndex > 0) {
                Tool.showLoading();
                this.requestSortAdData(oneSort.Id);
            }
        }
    },
    /**
     * 列表子视图点击事件
     */
    onChildClickListener: function (e) {
        let productId = e.currentTarget.dataset.id;
        this.navigateToProductDetail(productId);
    },
    /**
     * 添加到购物车
     */
    onAddCartClickListener: function (e) {
        if (Storage.didLogin()) {
            let productId = e.currentTarget.dataset.id;

            let self = this;
            this.productSpecification = new ProductSpecification(this, productId);
            this.productSpecification.finishBlock = (specificationId, product, count, price) => {
                // global.Tool.showAlert(specificationId);
            };

            this.productSpecification.showWithAction('ShoppingCart');
        } else {
            this.login = new Login(this);
            this.login.show();
        }
    },
    /**
     * 更多
     */
    onMoreClickListener: function (e) {
        let isMore = e.currentTarget.dataset.more;
        if (isMore) {
            let categoryId = e.currentTarget.dataset.id;
            let door = e.currentTarget.dataset.door;
            if (categoryId.length > 0) {
                let title = e.currentTarget.dataset.title;
                //跳到更多
                if (door == 0) {
                    wx.navigateTo({
                        url: '/pages/home/product-more/product-more?id=' + categoryId + "&title=" + title
                    })
                } else if (door == 1) {
                    wx.navigateTo({
                        url: '/pages/home/product-more-category/product-more-category?id=' + categoryId + "&title=" + title
                    })
                } else if (door == 2) {
                    let position = e.currentTarget.dataset.position;
                    let imageId = this.data.targetArray[position].ImgId;
                    wx.navigateTo({
                        url: '/pages/home/product-more-target/product-more-target?id=' + categoryId + "&title=" + title + "&imageId=" + imageId
                    })
                }
            }
        }
    },
    /**
     * 首页海报点击
     */
    homeADClicked: function (e) {
        let position = e.currentTarget.dataset.index;
        let currentTab = this.data.currentTab;
        let bannerData = this.data.bannerArray[position];
        if (currentTab > 0) {
            bannerData = this.data.oneSortData[currentTab].bodyData.adData[position];
        }
        this.onBannerAction(bannerData);
    },
    /**
     * 爆款海报点击
     */
    onHotBannerListener: function (e) {
        let position = e.currentTarget.dataset.index;
        let bannerData = this.data.hotBannerArray[position];
        this.onBannerAction(bannerData);
    },
    /**
     * 海报跳转
     */
    onBannerAction: function (bannerData) {
        let self = this;
        switch (bannerData.LinkTypeKey) {
            case "1":
                // 搜索
                self.navigateToSearch(bannerData.KeyWord);
                break;
            case "2":
                // 商品详情
                self.navigateToProductDetail(bannerData.ProductId);
                break;
            case "3":
                // 活动落地页,专题
                break;
            case "4":
                // 网页
                break;
            case "5":
                // 分类搜索
                break;
            default:
                break;
        }
    },
    /**
     * 跳转到商品详情
     */
    navigateToProductDetail: function (productId) {
        wx.navigateTo({
            url: '/pages/product-detail/product-detail?productId=' + productId
        })
    },
    /**
     * 跳转到搜索
     */
    navigateToSearch: function (keyWord) {
        wx.navigateTo({
            url: '/pages/search/search-result/search-result?keyword=' + keyWord
        })
    },
    /**
     * 搜索点击
     */
    searchClicked: function (e) {
        //跳出搜索界面
        wx.navigateTo({
            url: '/pages/search/search'
        })
    },

    /**
     * 码头快报 点击
     */
    bulletinTap:function(e){
        this.onBannerAction(this.data.bulletinDatas);
    }
})