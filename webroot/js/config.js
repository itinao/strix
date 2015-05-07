/**
 * 設定だったり色々。
 */
var Constant = {
    api_url: "http://strix-api.itinao.net/",
    har_url: "harviewer/index.php?path=http://strix-api.itinao.net/getHarp/%%HAR_DATA_ID%%"
//    api_url: "http://localhost:3001/",
//    har_url: "harviewer/index.php?path=http://localhost:3001/getHarp/%%HAR_DATA_ID%%"
};

//
request.setBaseURL(Constant.api_url);
