/**
 * Created by coin on 1/13/17.
 */

import RequestWrite from '../base-requests/request-write'
import Network from '../network'
import Operation from '../operation'
import Tool from '../../tools/tool'
import RequestUploadTempFile from '../requests/request-upload-temp-file'

//写入请求具体封装
export default class RequestWriteFactory {

    //示例
    static demo() {
        let operation = Operation.sharedInstance().locationUploadOperation;
        let status = Network.sharedInstance().statusNew;

        let params = {
            "Operation": operation,
            "Longitude": '30',
            "Latitude": '120',
            "LongAddress": '浙江省杭州市。。。',
            "Address": '杭照所',
        };

        let req = new RequestWrite(status, 'Location', params, null);
        req.name = '定位信息上传';

        return req;
    }

    //修改购物车数量
    static modifyCartQnty(id, qnty) {
        let operation = Operation.sharedInstance().cartModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": id,
            "Qnty": qnty,
        };

        let req = new RequestWrite(status, 'Shopping_Cart', params, null);
        req.name = '修改购物车数量';

        return req;
    }

    //删除购物车
    static deleteCart(requestData) {
        let operation = Operation.sharedInstance().cartDeleteOperation;
        let status = Network.sharedInstance().statusDelete;

        let req = new RequestWrite(status, 'Shopping_Cart', requestData, operation, null);
        req.name = '删除购物车';

        return req;
    }

    //加入购物车
    static addToShoppingCart(productId, specificationId, qnty = 1) {
        let operation = Operation.sharedInstance().cartAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "ProductId": productId,
            "Qnty": qnty + '',
            "MemberId":global.Storage.currentMember().Id,
        };

        if (global.Tool.isValidStr(specificationId)) {
            params.Product_SId = specificationId;
        }

        let req = new RequestWrite(status, 'Shopping_Cart', params, null);
        req.name = '加入购物车';

        return req;
    }

    //修改地址默认
    static modifyDefaultAddress(id) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Default": "True",
            "Id": id,
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '修改地址默认';

        return req;
    }

    //删除地址
    static deleteAddress(id) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Delete": "True",
            "Id": id,
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '删除地址';

        return req;
    }

    //新增地址
    static addAddress(id,name, mobile, area, address, areaId, card) {
        let operation = Operation.sharedInstance().addressAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Default": "False",
            "MemberId": global.Storage.memberId(),
            "Consignee": name,
            "Mobile": mobile,
            "FullName": area,
            "Address1": address,
            "Address": area + address,
            "DistrictId": areaId,
            "Card": card,
            "Name": "未指定",
            "Id":id,
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '新增地址';

        return req;
    }

    //修改地址
    static modifyDetailAddress(isDefault, name, mobile, area, address, areaId, id, card) {
        let operation = Operation.sharedInstance().addressModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Address": area + address,
            "Address1": address,
            "Card": card,
            "Consignee": name,
            "Default": isDefault,
            "Delete": "False",
            "DistrictId": areaId,
            "FullName": area,
            "Id": id,
            "MemberId": global.Storage.memberId(),
            "Mobile": mobile,
            "Name": "未指定"
        };

        let req = new RequestWrite(status, 'Delivery_address', params, null);
        req.name = '修改地址';

        return req;
    }

    //订单新增
    static orderAddRequest(id, addressId, time) {
        let operation = Operation.sharedInstance().orderAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Formal": "False",
            "CreatorId": global.Storage.memberId(),
            "MemberId": global.Storage.memberId(),
            "Id": id,
            "Delivery_AddressId": addressId,
            "Address_Refresh": time,
        };

        let req = new RequestWrite(status, 'Order', params, null);
        req.name = '订单新增';
        return req;
    }

    //订单明细新增
    static orderLineAddRequest(requestData) {
        let operation = Operation.sharedInstance().orderLineAddOperation;
        let status = Network.sharedInstance().statusNew;

        let req = new RequestWrite(status, 'Order_Line', requestData, operation, null);
        req.name = '订单明细新增';
        return req;
    }

    //删除订单
    static deleteOrder(id) {
        let operation = Operation.sharedInstance().orderModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": id,
            "Delete": "true"
        };

        let req = new RequestWrite(status, 'Order', params, null);
        req.name = '删除订单';
        return req;
    }

    //修改订单状态
    static modifyOrderStatus(id, statusKey) {
        let operation = Operation.sharedInstance().orderModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": id,
            "StatusKey": statusKey,
        };

        let req = new RequestWrite(status, 'Order', params, null);
        req.name = '修改订单状态';
        return req;
    }

    //修改订单
    static modifyOrder(requestData) {
        let operation = Operation.sharedInstance().orderModifyOperation;
        let status = Network.sharedInstance().statusExisted;

        let req = new RequestWrite(status, 'Order', requestData, operation, null);
        req.name = '修改订单';
        return req;
    }

    //绑定支付宝
    static bindAlipayAdd(account, name, checkaccount) {
        let operation = Operation.sharedInstance().alipayAccountAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Name": name,
            "AplipayAccount": account,
            "CheckAccount": checkaccount,
            "MemberId": global.Storage.memberId(),
        };

        let req = new RequestWrite(status, 'AlipayBind', params, null);
        req.name = '绑定支付宝';
        return req;
    }

    //提现
    static withdrawAdd(alipayAccount, money, password, aliplayName) {
        let operation = Operation.sharedInstance().withdrawAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Alipay": alipayAccount,
            "CashMoney": money,
            "Password": password,
            "AlipayName": aliplayName,
            "MemberId": global.Storage.memberId(),
        };

        let req = new RequestWrite(status, 'Cash', params, null);
        req.name = '提现';
        return req;
    }

    //验证码
    static verifyCodeGet(mobile, typeKey) {
        let operation = Operation.sharedInstance().verifyCodeAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Mobile": mobile,
            "TypeKey": typeKey+"",// 1 为找回密码 0 为新用户注册 2 设置支付密码
        };

        let req = new RequestWrite(status, 'Check_Code', params, null);
        req.name = '获取验证码';
        return req;
    }

    //设置支付密码
    static payPasswordSet(checkCode, pwd, confirmPwd, mobile) {
        let operation = Operation.sharedInstance().payPasswordAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "CheckCode": checkCode,
            "NewCode": pwd,
            "CheckPassword": confirmPwd,
            "Mobile": mobile,
            "MemberId": global.Storage.memberId()
        };

        let req = new RequestWrite(status, 'PayCode', params, null);
        req.name = '设置支付密码';
        return req;
    }

    //修改昵称
    static modifyNickName(nickName) {
        let operation = Operation.sharedInstance().memberInfoModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Nickname": nickName,
            "Id": global.Storage.memberId()
        };

        let req = new RequestWrite(status, 'Member', params, null);
        req.name = '修改昵称';
        return req;
    }

    //修改签名
    static modifySign(sign) {
        let operation = Operation.sharedInstance().memberInfoModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Sign": sign,
            "Id": global.Storage.memberId()
        };

        let req = new RequestWrite(status, 'Member', params, null);
        req.name = '修改签名';
        return req;
    }

    //上传图片获取图片临时id
    static uploadTempFile(imageUrl) {
        let req = new RequestUploadTempFile(imageUrl);
        req.name = '上传图片获取图片临时id';
        return req;
    }

    //修改用户头像
    static modifyAcatar(temporaryId) {
        let operation = Operation.sharedInstance().memberInfoModifyOperation;
        let status = Network.sharedInstance().statusExisted;

        // 文件名
        let now = Tool.timeStringForDate(new Date(), "YYYY-MM-DD HH:mm:ss");
        let nowTimeInterval = Tool.timeIntervalFromString(now);
        let fileName = nowTimeInterval + '.png';

        let imgId = Tool.guid();

        let relevancies = [{
            "EntityName": "Attachment",
            "Status": Network.sharedInstance().statusNew,
            "Items": {
                "FileName": fileName,
                "RelevancyId": global.Storage.memberId(),
                "RelevancyType": "Member",
                "RelevancyBizElement": "Picture",
                "$FILE_BYTES": temporaryId,
                "Id": imgId,
            },
        }];

        let params = {
            "Operation": operation,
            "Id": global.Storage.memberId(),
            "PictureId":imgId
        };

        let req = new RequestWrite(status, 'Member', params, operation, relevancies);
        req.name = '修改用户头像';
        return req;
    }

    //修改认证店员信息
    static modifySalesmanAuth(isShopPerson, memberId) {
        let operation = Operation.sharedInstance().memberInfoModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "IsShopPerson": isShopPerson,
            "Id": memberId
        };

        let req = new RequestWrite(status, 'Member', params, null);
        req.name = '修改认证店员信息';
        return req;
    }

    //修改登录密码
    static modifyLoginPassword(mobile,code,password) {
        let operation = Operation.sharedInstance().loginPasswordModifyOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "Mobile": mobile,
            "Check_Code": code,
            "Check": code,
            "Password_New": password,
            "Password_Check": password,
            "Formal": "true",
        };

        let req = new RequestWrite(status, 'Password_Retake', params, null);
        req.name = '修改登录密码';
        return req;
    }

    //申请退款
    static orderRefundAdd(reasonId, reasonText, remark, orderId) {
        let operation = Operation.sharedInstance().refundAddOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "ReasonId": reasonId,
            "ReasonText": reasonText,
            "Remark": remark,
            "OrderId": orderId
        };

        let req = new RequestWrite(status, 'Refund', params, null);
        req.name = '申请退款';
        return req;
    }

    //取消退款
    static orderRefundCancel(refundId) {
        let operation = Operation.sharedInstance().refundModifyOperation;
        let status = Network.sharedInstance().statusExisted;
        let params = {
            "Operation": operation,
            "Id": refundId,
            "Deleted": 'true'
        };

        let req = new RequestWrite(status, 'Refund', params, null);
        req.name = '取消退款';
        return req;
    }

    //消息批量阅读
    static allMessageRead(messageMainTypeKey) {
        let operation = Operation.sharedInstance().allMessageReadModifyOperation;
        let status = Network.sharedInstance().statusNew;
        let params = {
            "Operation": operation,
            "CreatorId": global.Storage.memberId(),
            "MessageMainTypeKey": messageMainTypeKey
        };

        let req = new RequestWrite(status, 'BatchRead', params, null);
        req.name = '消息批量阅读';
        return req;
    }

    //新增会员
    static addMember(mobile, code, password, inviteCode) {
      let operation = Operation.sharedInstance().memberAddOperation;
      let status = Network.sharedInstance().statusNew;
      let params = {
        "Operation": operation,
        "Name": mobile,
        "Mobile": mobile,
        "Nickname": mobile,
        "Code_Input": code,
        "Password": password,
        "Password2": password,
        "YQM": inviteCode
      };

      let req = new RequestWrite(status, 'Member', params, null);
      req.name = '新增会员';

      return req;
    }

    //新增密码修改记录
    /*static addMember(mobile, code, password, inviteCode) {
      let operation = Operation.sharedInstance().memberAddOperation;
      let status = Network.sharedInstance().statusNew;
      let params = {
        "Operation": operation,
        "Name": mobile,
        "Mobile": mobile,
        "Nickname": mobile,
        "Code_Input": code,
        "Password": password,
        "Password2": password,
        "YQM": inviteCode
      };

      let req = new RequestWrite(status, 'Password_Retake', params, null);
      req.name = '新增密码修改记录';

      return req;
    }*/

}