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

}