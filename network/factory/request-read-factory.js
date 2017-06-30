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
        // req.items = ["SerialNumber", "CreateTime", "HJSL", "Total", "Id", "StatusKey", "LogisticsNumber", "LogisticsCode", "LogisticsName", "Contact", "Mobile", "Address"];
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
            "Order": "${CreateTime} DESC",
            "MaxCount": '1',
            "StartIndex": 0,
            "Subtables": [
                "Line"
            ]
        };
        let req = new RequestRead(bodyParameters);
        req.name = '我的订单查询';
        // req.items = ["Id", "SerialNumber", "CreatorId", "HJSL", "Default", "NewModel",
        //     "Total", "StatusKey", "CreateTime", "Contact", "Mobile", "Address",
        //     "LogisticsNumber", "LogisticsCode", "LogisticsName"];
        return req;
    }

    //物流详情查询
    static orderDeliveryInfoRead(deliveryNo, companyNo) {
        let req = new RequestDeliveryInfoRead(deliveryNo, companyNo);
        req.name = '物流详情查询';
        return req;
    }


}