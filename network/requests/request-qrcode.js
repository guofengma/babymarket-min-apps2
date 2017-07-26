import Request from '../base-requests/request'
import Network from '../network'

export default class RequestQRcode extends Request {

    constructor(path, width) {
        super({});
        this.baseUrl = Network.sharedInstance().qrcodeURL;
        this.urlParam = {
            "appid": global.TCGlobal.AppId,
            "secret": global.TCGlobal.Secret,
            "path": path,
            "width": width
        };
        this.requestMethod = 'GET';
    }
}