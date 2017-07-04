/**
 * Created by coin on 1/13/17.
 */

import RequestRead from '../base-requests/request-read'
import Operation from '../operation'
import RequestLogin from '../requests/request-login'
import RequestDeliveryInfoRead from '../requests/request-delivery-info-read'

//读取请求具体封装
export default class RequestReadFactory {

    //登陆
    static login(username, pasword) {
        let req = new RequestLogin(username, pasword);
        req.name = '登陆';//用于日志输出
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
        req.items = ['Id', 'ShowName', 'LYPrice', 'SalePrice', 'ImgId', 'Warehouse', 'Des1', 'Des', 'Tax', 'Subtitle', 'NationalKey', 'StoreId', 'TaxRate', 'Import', 'PriceInside'];
        req.preprocessCallback = (req,firstData) => {
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
     * 全部规格
     */
    static allSpecificationRead(theId){
        let operation = Operation.sharedInstance().productSpecificationRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品全部规格';//用于日志输出
        return req;
    }

    /**
     * 搜索规格
     */
    static searchSpecificationRead(theId,specificationsArray){
        let operation = Operation.sharedInstance().productSpecificationRead;
        let bodyParameters = {
            "Operation": operation,
            "ProductId": theId,
        };
        if (global.Tool.isValidArr(specificationsArray)) {
            specificationsArray.forEach((detail) => {
                let keyName = 'SpecificationItem'+ detail.SpecificationKey +'Id';
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
        req.items = ['Id', 'Name', 'ImgId', 'Description'];
        return req;
    }

    //首页-一级分类商品
    static homeOneSortProductRead(categoryId,maxCount) {
        let operation = Operation.sharedInstance().productReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "FirstCategoryId": categoryId,
            "MaxCount": maxCount,
        };
        let req = new RequestRead(bodyParameters);
        req.name = '一级分类商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit', 'Import'];
        return req;
    }

    //首页-二级分类商品
    static homeTwoSortProductRead(categoryId) {
        let operation = Operation.sharedInstance().productReadOperation;
        let condition = "${Product_CategoryId} == '" + categoryId + "'";
        //如果是内部员工
        if (global.Storage.isInsideMember()) {
            condition = "${Product_CategoryId} == '" + categoryId + "' || ${ProductCategoryInsideId} == '" + categoryId + "'";
        }
        let bodyParameters = {
            "Operation": operation,
            "Condition": condition
        };
        let req = new RequestRead(bodyParameters);
        req.name = '二级分类商品';
        req.items = ['Id', 'ShowName', 'ImgId', 'SalePrice', 'LYPrice', 'PriceInside', 'Inv', 'Unit','Import'];
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

        let condition = "${CreatorId} == '" + global.Storage.memberId() + "'";;
        if (typeof (status) != "undefined" && status != "undefined") {
            condition = "${StatusKey} == '" + status + "' && " + condition;
        }

        if (global.Tool.isValidStr(status) && status != "undefined") {
            condition = "${StatusKey} == '" + status + "'";
        }

        let bodyParameters = {
            "Operation": operation,
            "Condition": condition,
            "IsIncludeSubtables": true,
            "Order": "${CreateTime} DESC",
            "MaxCount": '2',
            "StartIndex": index,
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
        req.name = '我的订单查询';
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
}