/**
 * Created by coin on 1/13/17.
 */

import RequestWrite from '../base-requests/request-write'
import Network from '../network'
import Operation from '../operation'
import Tool from '../../tools/tool'

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

}