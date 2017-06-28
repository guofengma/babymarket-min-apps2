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
    static productDetailRead(theId){
        let operation = Operation.sharedInstance().bmProductReadOperation;
        let bodyParameters =  {
            "Operation":operation,
            "Id":theId,
            "MaxCount":'1',
        };
        let req = new RequestRead(bodyParameters);
        req.name = '宝贝码头商品详情';//用于日志输出
        req.items = ['Id','ShowName','LYPrice','SalePrice','ImgId','Warehouse','Des1','Des','Tax','Subtitle','NationalKey','StoreId','TaxRate','Import','PriceInside'];
        return req;
    }

    //附件
    static attachmentsRead(theId,count = 20,index = 0){
        let operation = Operation.sharedInstance().bmAttachmentsReadOperation;
        let bodyParameters =  {
            "Operation":operation,
            "Condition":"${RelevancyId} == '" + theId + "' && ${RelevancyBizElement} == 'Attachments'",
            "MaxCount":count,
            "StartIndex":index,
            "Order":'${CreateTime} ASC'
        };
        let req = new RequestRead(bodyParameters);
        req.name = '附件';//用于日志输出
        req.items = ['Id'];
        return req;
    }

    //老友码头 商品的国家信息
    static productNationRead(theKey){
        let operation = Operation.sharedInstance().bmNationReadOperation;
        let bodyParameters =  {
            "Operation":operation,
            "Value":theKey,
            "MaxCount":1,
            "StartIndex":0
        };
        let req = new RequestRead(bodyParameters);
        req.name = '老友码头 商品的国家信息';//用于日志输出
        req.items = ['Name'];
        return req;
    }

    //老友码头 运费
    static expressRuleRead(warehouseId,city){
        let operation = Operation.sharedInstance().bmExpressRuleReadOperation;
        let bodyParameters =  {
            "Operation":operation,
            "Condition":"StringIndexOf(${Area_Name},'" + city +"') > 0 && ${WarehouseId} == '" + warehouseId + "'",
            "MaxCount":1,
            "StartIndex":0
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
            "Operation": operation
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页海报查询';
        req.items = ['Id', 'ImgId', 'LinkTypeKey', 'KeyWord', 'Url', 'ProductId', 'Name'];
        return req;
    }

    //首页-一级分类
    static homeOneSortRead() {
        let operation = Operation.sharedInstance().homeOneSortReadOperation;
        let bodyParameters = {
            "Operation": operation,
            "Hierarchy": '1',
            "IsShow": 'True',
            "ShowInHomepage": 'True',
            "Order": "${Order} ASC",
        };
        let req = new RequestRead(bodyParameters);
        req.name = '首页-一级分类';
        req.items = ['Id', 'Name', 'ImgId', 'MaxShow'];

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

}