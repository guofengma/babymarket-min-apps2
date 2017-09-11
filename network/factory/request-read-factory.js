/**
 * Created by coin on 1/13/17.
 */

import RequestRead from '../base-requests/request-read'
import Operation from '../operation'
import RequestLogin from '../requests/request-login'
import RequestDeliveryInfoRead from '../requests/request-delivery-info-read'
import RequestQRcodeRead from '../requests/request-qrcode'

//读取请求具体封装
export default class RequestReadFactory {

    //登陆
    static login(username, pasword) {
        let req = new RequestLogin(username, pasword);
        req.name = '登陆';//用于日志输出
        return req;
    }

    /**
     * 查询手机号是否被注册
     * @param phone
     * @returns {RequestRead}
     */
    static checkMemberByPhone(phone){
        let operation = Operation.sharedInstance().memberInfoReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Mobile": phone,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '查询手机号是否被注册';//用于日志输出
        req.items = ['Id'];
        return req;
    }

    /**
     * 查询验证码
     * @param phone 
     * @param code
     * @returns {RequestRead}
     */
    static checkCode(phone,code) {
      let operation = Operation.sharedInstance().checkCodeOperation;
      let bodyParameters = {
        "Operation": operation,
        "Mobile": phone,
        "Code":code,
        "MaxCount": '1'
      };
      let req = new RequestRead(bodyParameters);
      req.name = '查询验证码';//用于日志输出
      req.items = ['Id'];
      return req;
    }

    /**
     * 查询邀请码
     * @param code
     * @returns {RequestRead}
     */
    static checkInvite(code) {
      let operation = Operation.sharedInstance().memberInfoReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "InvitationCode": code,
        "MaxCount": '1'
      };
      let req = new RequestRead(bodyParameters);
      req.name = '查询邀请码';//用于日志输出
      req.items = ['Id'];
      return req;
    }

    /**
     * 获取验证码
     * @param phone
     * @typeKey 0 为新用户注册 1 为找回密码 2 设置支付密码
     * @returns {RequestRead}
     */
    static acquireSMSCode(phone,typeKey = '0'){
        let operation = Operation.sharedInstance().memberInfoReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Mobile": phone,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '获取验证码';//用于日志输出
        req.items = ['Id'];
        return req;
    }

    //积分查询
    static pointUploadRead(theId) {
        let operation = Operation.sharedInstance().pointReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Id": theId,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '积分查询';//用于日志输出
        req.items = ['Id', 'Reason', 'SFJHCG'];
        return req;
    }

    //宝贝码头商品详情
    static productDetailRead(theId) {
        let operation = Operation.sharedInstance().bmProductReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Id": theId,
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品详情';//用于日志输出
        req.items = ['Id', 'ShowName', 'LYPrice', 'SalePrice', 'ImgId', 'Warehouse', 'Des1', 'Des', 'Tax', 'Subtitle', 'NationalKey', 'StoreId', 'TaxRate', 'Import', 'PriceInside', 'LimitQnty'];
        req.preprocessCallback = (req, firstData) => {
            if (global.Tool.isValidObject(firstData)) {
                if (global.Storage.didLogin()) {
                    let tempPrice = firstData.SalePrice;
                    firstData.SalePrice = firstData.LYPrice;
                    firstData.LYPrice = tempPrice;
                }
                else {
                    firstData.LYPrice = "0";
                }
            }
        }
        return req;
    }

    /**
     * 规格组
     */
    static specificationGroup(theId){
        let operation = Operation.sharedInstance().productSpecificationGroupRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
            "IsReturnTotal":true,
            "IsIncludeSubtables":true,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品规格组';//用于日志输出

        return req;
    }

    /**
     * 全部规格
     */
    static allSpecificationRead(theId) {
        let operation = Operation.sharedInstance().productSpecificationRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
            "IsReturnTotal":true,
            "IsIncludeSubtables":true,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品全部规格';//用于日志输出
        req.preprocessCallback = (req)=>{
            let {Tool:t} = global;

            let {Datas} = req.responseObject;
            if (t.isValidArr(Datas)) {
                Datas.forEach((specification) => {
                    let _levelPrice = '';
                    let member = global.Storage.currentMember();

                    let price = specification.Price;
                    if (t.isValidArr(specification.ShopLevelPrice)) {
                        specification.ShopLevelPrice.forEach((p)=>{
                            if (p.ShopLevelKey === member.LevelKey) {
                                price = p.Price2;
                            }
                        })
                    }
                    _levelPrice = price;

                    //普通会员显示老尤价（LYPrice）
                    if (global.Storage.didLogin() && member.MemberTypeKey === "0") {
                        _levelPrice = specification.LYPrice;
                    }
                    specification.levelPrice = _levelPrice;
                })
            }
        }
        return req;
    }

    /**
     * 搜索规格
     */
    static searchSpecificationRead(theId, specificationsArray) {
        let operation = Operation.sharedInstance().productSpecificationRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
        };
        if (global.Tool.isValidArr(specificationsArray)) {
            specificationsArray.forEach((detail) => {
                let keyName = 'SpecificationItem' + detail.SpecificationKey + 'Id';
                bodyParameters[keyName] = detail.Id;
            });
        }
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头 搜索特定的规格';//用于日志输出
        return req;
    }

    //附件
    static attachmentsRead(theId, count = 20, index = 0) {
        let operation = Operation.sharedInstance().bmAttachmentsReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${RelevancyId} == '" + theId + "' && ${RelevancyBizElement} == 'Attachments'",
            "MaxCount": count,
            "StartIndex": index,
            "Order": '${CreateTime} ASC'
        };
        let req = new RequestRead(bodyParameters);
        req.name = '附件';
        req.items = ['Id'];

        //修改返回结果，为返回结果添加imageUrls字段
        req.preprocessCallback = (req) => {
            let Datas = req.responseObject.Datas;
            let imageUrls = [];
            if (global.Tool.isValidArr(Datas)) {
                Datas.forEach((data) => {
                    data.imageUrl = global.Tool.imageURLForId(data.Id);
                    imageUrls.push(data.imageUrl);
                });
            }
            req.responseObject.imageUrls = imageUrls;
        }
        return req;
    }

    //老友码头 商品的国家信息
    static productNationRead(theKey) {
        let operation = Operation.sharedInstance().bmNationReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Value": theKey,
            "MaxCount": 1,
            "StartIndex": 0
        };
        let req = new RequestRead(bodyParameters);
        req.name = '老友码头 商品的国家信息';//用于日志输出
        req.items = ['Name'];
        return req;
    }

    //老友码头 运费
    static expressRuleRead(warehouseId, city) {
        let operation = Operation.sharedInstance().bmExpressRuleReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "StringIndexOf(${Area_Name},'" + city + "') > 0 && ${WarehouseId} == '" + warehouseId + "'",
            "MaxCount": 1,
            "StartIndex": 0
        };
        let req = new RequestRead(bodyParameters);
        req.name = '老友码头 运费';//用于日志输出
        req.items = ['Express_Fee'];
        return req;
    }

    //登录用户信息查询
    static memberInfoRead() {
        let operation = Operation.sharedInstance().memberInfoReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Id": global.Storage.memberId(),
        };
        let req = new RequestRead(bodyParameters);
        req.name = '登录用户信息查询';
        req.preprocessCallback = (req,data) => {
            if (global.Tool.isValid(data)) {
                global.Storage.setCurrentMember(data);
            }
        }
        return req;
    }

    //首页海报查询
    static homeAdRead() {
      let operation = Operation.sharedInstance().homeAdReadOperation;
      let bodyParameters = {
        "Operation": operation,
        "IsHomePageShow": 'True'
      };
      let req = new RequestRead(bodyParameters);
      req.name = '首页海报查询';
      req.items = ['Id', 'ImgId', 'LinkTypeKey', 'KeyWord', 'Url', 'ProductId', 'Name'];
      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.imageUrl = global.Tool.imageURLForId(item.ImgId);
        });
      }
      return req;
    }

    //首页码头快报查询
    static homeBulletinRead() {
        let operation = Operation.sharedInstance().homeBulletinReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${CreateTime} DESC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页码头快报查询';
        req.items = ['Id', 'Title', 'LinkTypeKey', 'ProductId', 'SubjectId', 'CategoryId', 'KeyWord'];
        return req;
    }

    //分类海报查询
    static sortAdRead(categoryId) {
        let operation = Operation.sharedInstance().homeAdReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "ProductCategoryId": categoryId
        };
        let req = new RequestRead(bodyParameters);
        req.name = '分类海报查询';
        req.items = ['Id', 'ImgId', 'LinkTypeKey', 'KeyWord', 'Url', 'ProductId', 'Name'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
            });
        }
        return req;
    }

    //首页-标签
    static homeTargetRead() {
      let operation = Operation.sharedInstance().homeTargetReadOperation;
      let bodyParameters = {
        "Operation": operation
      };
      let req = new RequestRead(bodyParameters);
      req.name = '首页-标签';
      req.items = ['Id', 'Name', 'ImgId', 'ShowTypeKey'];
      //修改返回结果
      req.preprocessCallback = (req) => {
        let responseData = req.responseObject.Datas;
        responseData.forEach((item, index) => {
          item.imageUrl = global.Tool.imageURLForId(item.ImgId);
        });
      }
      return req;
    }

    //首页-标签产品
    static homeTargetProductRead(id,typeId) {
      let operation = Operation.sharedInstance().homeTargetProductReadOperation;
      let maxCount = 0;
      if(typeId==1){
        maxCount=4;
      }else{
        maxCount = 3;
      }
      let bodyParameters = {
        "Operation": operation,
        "TargetId":id,
        "MaxCount": maxCount,
        "Appendixes": {
          "+Product": [
            "Name",
            "ImgId",
            "SalePrice", 
            "Subtitle", 
            "Inv", 
            "LYPrice"
          ]
        }
      };
      let req = new RequestRead(bodyParameters);
      req.name = '首页-标签产品';
      req.items = ['Id', 'Name', 'ProductId'];
      req.appendixesKeyMap = { 'Product': 'ProductId' };//可以多个
      //修改返回结果
      req.appendixesBlock = (item, appendixe, key, id) => {
          let url = global.Tool.imageURLForId(appendixe.ImgId);
          item.imageUrl = url;
          item.productId = id;
          item.ShowName = appendixe.Name;
          item.subtitle = appendixe.Subtitle;
          item.stock = appendixe.Inv;
          item.isLogin = global.Storage.didLogin();
          if (item.isLogin) {
            item.showPrice = "¥" + appendixe.LYPrice;
          } else {
            item.showPrice = "¥" + appendixe.SalePrice;
          }
          //未登录时,旧价格不显示,登陆后显示SalePrice
          if (item.isLogin) {
            item.oldPrice = "¥" + appendixe.SalePrice;
            //如果销售价格和老友价都一样，那么为0，0的时候界面默认不显示
            if (appendixe.SalePrice == appendixe.LYPrice || appendixe.SalePrice == 0) {
              item.oldPrice = 0;
            }
          } else {
            item.oldPrice = 0;
          }
      };
      return req;
    }

    //首页-一级分类
    static homeOneSortRead() {
        let operation = Operation.sharedInstance().homeSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Hierarchy": '1',
            "IsShow": 'True',
            "ShowInHomepage": 'True',
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-一级分类';
        req.items = ['Id', 'Name', 'ImgId', 'MaxShow'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
            });
            let home = new Object();
            home.Name = "首页";
            responseData.unshift(home);
        }
        return req;
    }

    //首页-单个一级分类
    static homeOneSortSingleRead() {
        let operation = Operation.sharedInstance().homeSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Hierarchy": '1',
            "IsShow": 'True',
            "ShowInHomepage": 'True',
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-一级分类';
        req.items = ['Id', 'Name', 'ImgId', 'MaxShow'];
        return req;
    }

    //首页-二级分类
    static homeTwoSortRead(parentId) {
        let operation = Operation.sharedInstance().homeSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "ParentId": parentId,
            "IsShow": 'True',
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-二级分类';
        req.items = ['Id', 'Name', 'ImgId', 'Description','CategoryMaxShow'];
        return req;
    }

    //首页-一级分类商品
    static homeOneSortProductRead(categoryId, maxCount) {
        let operation = Operation.sharedInstance().productReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "FirstCategoryId": categoryId,
            "MaxCount": maxCount,
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '一级分类商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        //修改返回结果
        let that = this;
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            that.parseProductInfo(responseData);
        }
        return req;
    }

    //首页-二级分类商品
    static homeTwoSortProductRead(categoryId,maxCount) {
        let operation = Operation.sharedInstance().productReadOperation;
        let condition = "${Product_CategoryId} == '" + categoryId + "'";
        //如果是内部员工
        if (global.Storage.isInsideMember()) {
            condition = "${Product_CategoryId} == '" + categoryId + "' || ${ProductCategoryInsideId} == '" + categoryId + "'";
        }
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "MaxCount": maxCount,
            "Order": "${Order} ASC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '二级分类商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        //修改返回结果
        let that = this;
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            that.parseProductInfo(responseData);
        }
        return req;
    }

    //首页-搜索商品
    static searchProductRead(keyword) {
        let operation = Operation.sharedInstance().productReadOperation;
        let condition = "${KeyWord} like %" + keyword + "% || ${ShowName} like %" + keyword + "%";
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '搜索商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        //修改返回结果
        let that = this;
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            that.parseProductInfo(responseData);
        }
        return req;
    }

    //热门搜索查询
    static hotSearchRead() {
        let operation = Operation.sharedInstance().searchHotReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "MaxCount": '20',
            "Order": "${Count} DESC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '热门搜索查询';
        req.items = ['Id', 'Keyword', 'HightLight', 'DateTime'];
        return req;
    }

    //专题查询
    static specialRead() {
        let operation = Operation.sharedInstance().specialReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Deleted": "False"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '专题查询';
        req.items = ['Id', 'ImgId', 'Img2Id', 'Name', 'Title', 'Subtitle', 'PriceDes','ProductId'];
        //修改返回结果
        req.preprocessCallback = (req) => {
            let responseData = req.responseObject.Datas;
            responseData.forEach((item, index) => {
                item.imageUrl = global.Tool.imageURLForId(item.ImgId);
                item.imageHeadUrl = global.Tool.imageURLForId(item.Img2Id);
            });
        }
        return req;
    }

    //查询购物车视图
    static cartViewRead() {
        let operation = Operation.sharedInstance().cartViewReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "View": {
                "EntityName": "ShoppingCart_View",
            }
        };
        let req = new RequestRead(bodyParameters);
        req.name = '查询购物车视图';
        return req;
    }

    //查询购物车
    static cartRead() {
        let operation = Operation.sharedInstance().cartReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": "${MemberId} == '" + global.Storage.memberId() + "' && ${Useful} == 'True'",
            "Order": "${CreateTime} DESC",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '查询购物车';
        return req;
    }

    //收货地址查询
    static addressRead() {
        let operation = Operation.sharedInstance().addressReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${Default} DESC",
            "Condition": "${MemberId} == '" + global.Storage.memberId() + "'",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '收货地址查询';
        return req;
    }

    //区域查询
    static areaRead(condition) {
        let operation = Operation.sharedInstance().areaReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '区域查询';
        req.items = ['Id', 'Name', 'FullName', 'ZJS'];
        return req;
    }

    //地址查询（按默认排序）
    static addressDefaultRead() {
        let operation = Operation.sharedInstance().addressReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${Default} DESC",
            "Condition": "${MemberId} == '" + global.Storage.memberId() + "'",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '地址查询（按默认排序）';
        return req;
    }

    //我的订单查询
    static myOrderRead(status, index) {
        let operation = Operation.sharedInstance().orderReadOperation;

        let condition ="${Formal} == 'True'";
        if (typeof (status) != "undefined" && status != "undefined") {
            condition = "${StatusKey} == '" + status + "' && " + condition;

            if (status <= 0) {//待付款
                condition = condition + " && ${Child_Order} == 'False'"
            } else {
                condition = condition + " && (${Child_Order} == 'True' || ${History} == 'True')"
            }
        }else{//全部订单
            operation = Operation.sharedInstance().allOrderReadOperation;
        }

        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "IsIncludeSubtables": true,
            "Order": "${CreateTime} DESC",
            "MaxCount": '20',
            "StartIndex": index
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我的订单查询';
        return req;
    }

    //订单详情查询
    static orderDetailRead(orderId) {
        let operation = Operation.sharedInstance().orderReadOperation;

        let condition = "${Id} == '" + orderId + "'";

        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "IsIncludeSubtables": true,
            "MaxCount": '1',
            "StartIndex": 0,
            "Subtables": [
                "Line"
            ]
        };
        let req = new RequestRead(bodyParameters);
        req.name = '订单详情查询';
        // req.items = ["Id", "OrderNo", "Money", "StatusKey", "Freight", "Due", "Discount", "ExpressSum", "Formal", "Qnty", "Tax", "Total", "Cross_Order", "Tax2", "CrossFee", "Credit", "UseCredit", "Balance", "UseBalance", "Money1", "Money2", "PaywayName", "BuyerCommission"];
        return req;
    }

    //物流详情查询
    static orderDeliveryInfoRead(deliveryNo, companyNo) {
        let req = new RequestDeliveryInfoRead(deliveryNo, companyNo);
        req.name = '物流详情查询';
        return req;
    }

    //优惠劵查询
    static couponRead(condition) {
        let operation = Operation.sharedInstance().couponReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "Order": "${Date} DESC"
        };
        let req = new RequestRead(bodyParameters);
        req.name = '优惠劵查询';
        req.items = ["Id", "Money", "Useful_Line", "Min_Money", "Overdue", "Used"];
        return req;
    }

    //商品收藏查询
    static productFavRead(index) {
        let operation = Operation.sharedInstance().favReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${CreateTime} DESC",
            "MaxCount": '20',
            "StartIndex": index,
            "MemberId": global.Storage.memberId(),
            "FavoriteObjectType": 'Product'
        };
        let req = new RequestRead(bodyParameters);
        req.name = '商品收藏查询';
        req.items = ["Id", "Product_Name", "Price", "CreateTime", "ImgId"];
        return req;
    }

    //处理商品信息
    static parseProductInfo(responseData) {
        responseData.forEach((item, index) => {
            let url = global.Tool.imageURLForId(item.ImgId);
            item.imageUrl = url;
            item.productId = item.Id;
            //未登录时,显示的价格为SalePrice,登陆后显示老友价（LYPrice)
            item.isLogin = global.Storage.didLogin();
            if (item.isLogin) {
                item.showPrice = "¥" + item.LYPrice;
            } else {
                item.showPrice = "¥" + item.SalePrice;
            }
            //未登录时,旧价格不显示,登陆后显示SalePrice
            if (item.isLogin) {
                item.oldPrice = "¥" + item.SalePrice;
                //如果销售价格和老友价都一样，那么为0，0的时候界面默认不显示
                if (item.SalePrice == item.LYPrice || item.SalePrice == 0) {
                    item.oldPrice = 0;
                }
            } else {
                item.oldPrice = 0;
            }
        });
        //9d7093c03c3fb18a9e9d8216e355f0a93ed6604d
    }

    //绑定的支付宝账号查询
    static alipyAccountRead() {
        let operation = Operation.sharedInstance().alipayAccountReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Order": "${CreateTime} DESC",
            "MemberId": global.Storage.memberId(),
            "MaxCount": '1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '绑定的支付宝账号查询';
        req.items = ["Id", "Name", "AplipayAccount"];
        return req;
    }

    //我的资产查询
    static myPropertyRead(index) {
        let operation = Operation.sharedInstance().balanceLogMonthReadOperation;

        let bodyParameters = {
            "Operation": operation,
            "IsIncludeSubtables": true,
            "Order": "${Month} DESC",
            "MaxCount": '20',
            "StartIndex": index,
            "MemberId": global.Storage.memberId(),
            // "Subtables": ["Detail"]
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我的资产查询';
        return req;
    }

    //收到的奖励查询
    static awardRead(index) {
        let operation = Operation.sharedInstance().awardReadOperation;

        let bodyParameters = {
            "Operation": operation,
            "Order": "${OrderDate} DESC",
            "MaxCount": '20',
            "StartIndex": index,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '收到的奖励查询';
        return req;
    }

    //已省金额查询
    static saveRead(index) {
        let operation = Operation.sharedInstance().saveReadOperation;

        let bodyParameters = {
            "Operation": operation,
            "Order": "${OrderDate} DESC",
            "MaxCount": '20',
            "StartIndex": index,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '已省金额查询';
        return req;
    }

    //我邀请的好友查询
    static myInviteFriendsRead(index, keyword, firstId) {
        let operation = Operation.sharedInstance().invitedFriendsReadOperation;
        let condition = "${FirstId} == '" + firstId + "'";
        if (keyword != '' && keyword != 'undefined'){
            condition = condition + "&& (StringIndexOf(${Name},'" + keyword + " ') > 0 || StringIndexOf(${Nickname},'" + keyword + "') > 0)";
        }

        let bodyParameters = {
            "Operation": operation,
            "StartIndex": index,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我邀请的好友查询';
        req.items = ["Id", "Name", "Nickname", "PictureId"];
        return req;
    }

    //我的店员查询
    static mysalesmanRead(index) {
        let operation = Operation.sharedInstance().invitedFriendsReadOperation;
        let condition = "${FirstId} == '" + global.Storage.memberId() + "' && ${IsShopPerson} == 'true'";

        let bodyParameters = {
            "Operation": operation,
            "MaxCount": '20',
            "StartIndex": index,
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我的店员查询';
        req.items = ["Id", "Name", "Nickname", "PictureId", "FirstFriend"];
        return req;
    }

    //我的店员管理查询
    static mysalesmanManageRead(index, keyword) {
        let operation = Operation.sharedInstance().invitedFriendsReadOperation;
        let condition = "${FirstId} == '" + global.Storage.memberId() + "'";
        if (keyword != '' && keyword != 'undefined') {
            condition = condition + "&& (StringIndexOf(${Name},'" + keyword + " ') > 0 || StringIndexOf(${Nickname},'" + keyword + "') > 0)";
        }

        let bodyParameters = {
            "Operation": operation,
            "MaxCount": '20',
            "StartIndex": index,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我的店员管理查询';
        req.items = ["Id", "Name", "Nickname", "PictureId","IsShopPerson"];
        return req;
    }

    //验证码检验
    static checkCodeRead(code, mobile) {
        let operation = Operation.sharedInstance().checkCodeOperation;

        let condition = "${Mobile} == '" + mobile + "' && ${Code} == '" + code + "'";
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '验证码检验';
        return req;
    }

    //退款原因
    static refundReasonRead() {
        let operation = Operation.sharedInstance().refundReasonReadOperation;

        let bodyParameters = {
            "Operation": operation
        };
        let req = new RequestRead(bodyParameters);
        req.name = '退款原因';
        return req;
    }

    //退款记录查询
    static refundRecordRead(orderId) {
        let operation = Operation.sharedInstance().refundReadOperation;

        let condition = "${OrderId} == '" + orderId + "'";

        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '退款记录查询';
        req.items = ["Id"];
        return req;
    }

    //消息查询
    static messageRead(index, messageType) {
        let operation = Operation.sharedInstance().messageReadOperation;
        let condition = "${ReceiverId} == '" + global.Storage.memberId() + "' && ${MessageMainTypeKey} == '" + messageType + "'";

        let bodyParameters = {
            "Operation": operation,
            "MaxCount": '20',
            "StartIndex": index,
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '消息查询';
        return req;
    }

    //未读消息条数查询
    static messageRead(messageType) {
        let operation = Operation.sharedInstance().messageReadOperation;
        let condition = "${IsReaded} == 'false' && ${ReceiverId} == '" + global.Storage.memberId() + "' && ${MessageMainTypeKey} == '" + messageType + "'";

        let bodyParameters = {
            "Operation": operation,
            "MaxCount": '1',
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '未读消息条数查询';
        req.items = ["Id"];
        return req;
    }

    //获取二维码
    static qrcodeRead(path, width) {
        let req = new RequestQRcodeRead(path, width);
        req.name = '获取二维码';
        return req;
    }
}