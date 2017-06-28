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