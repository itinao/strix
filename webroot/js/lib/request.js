/**
 * 非同期通信を行うライブラリ
 *
 * @sample
 * request.setBaseURL('http://hogehoge.com/');
 * => クロスドメインでアクセスしたい場合はbaseUrlをセットする
 *
 * request.get('hoge.json', {e:"b"}, function(response){});
 * => http://hogehoge.com/hoge.json?e=bというGETリクエストをする
 */
var request = {
  baseUrl: null,

  /**
   * APIのリクエスト先URLを設定する
   * @param {String} url
   */
  setBaseURL: function (url) {
    this.baseUrl = url;
  },

  /**
   * GETリクエストを実行する
   * @param {String} url
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} errorCallback
   */
  get: function (url, params, successCallback, errorCallback) {
    var _params = this.buildQuery(params);
    var _url = url + (_params ? '?' + _params : '');
    this.request('GET', _url, null, successCallback, errorCallback, {});
  },

  /**
   * POSTリクエストを実行する
   * @param {String} url
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} errorCallback
   */
  post: function (url, params, successCallback, errorCallback) {
    var _headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var _params = this.buildQuery(params);
    this.request('POST', url, _params, successCallback, errorCallback, _headers);
  },

  /**
   * 非同期通信の事前処理
   * @param {String} method
   * @param {String} url
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} errorCallback
   * @param {Object} headers
   */
  request: function (method, url, params, successCallback, errorCallback, headers) {
    params = params || {};
    if (method !== 'GET' && method !== 'POST') {
      throw new Error('unknown method: ' + method);
    }
    var callback = this.createCallback(method, url, params, successCallback, errorCallback);
    var baseUrl = this.baseUrl || '';
    this.ajax(baseUrl + url, method, params, callback, headers);
  },

  /**
   * 非同期通信を実行
   * @param {String} url
   * @param {String} method
   * @param {Object} params
   * @param {Function} callback
   * @param {Object} headers
   * @return {Object} xhr
   */
  ajax: function (url, method, params, callback, headers) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    for (var key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    xhr.onload = function(e) {
      callback(xhr, 'success');
    };
    xhr.onerror = function(e) {
      callback(xhr, 'error');
    };
    xhr.onabort = function(e) {
      callback(xhr, 'abort');
    };
    xhr.send(params);
    return xhr;
  },

  /**
   * リクエストパラメータを生成
   * @param {Object} params
   * @return {String} リクエストパラメータ
   */
  buildQuery: function (params) {
    var query = [];
    for (var key in params) {
      var value = params[key];
      if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          query.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(value[i]));
        }
      } else {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      }
    }
    return query.join('&');
  },

  /**
   * callbackを生成
   * @param {String} method
   * @param {String} url
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} errorCallback
   * @return {Function} callback
   */
  createCallback: function (method, url, params, successCallback, errorCallback) {
    var callback = function(xhr, textStatus) {
      var responseText = xhr.responseText;
      var responseObject;
      if (textStatus !== 'success') {
        this.fatalCallback(method, url, params, successCallback, errorCallback, textStatus)
        return;
      }
      try {
        responseObject = JSON.parse(responseText);
        if (responseObject.error) {
          this.errorCallback(url, params, errorCallback, responseObject);
        } else {
          this.successCallback(url, params, successCallback, responseObject);
        }
      } catch (error) {
        this.fatalCallback(method, url, params, successCallback, errorCallback, responseText);
      }
    };
    return callback.bind(this);
  },

  /**
   * 想定外のエラー時のcallback
   * @param {String} method
   * @param {String} url
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Function} errorCallback
   * @param {String} textStatus
   */
  fatalCallback: function (method, url, params, successCallback, errorCallback, textStatus) {
    // TODO: ちゃんと実装する
    console.log("fatal error");
    errorCallback && errorCallback(textStatus);
  },

  /**
   * 成功時のcallback
   * @param {String} url
   * @param {Object} params
   * @param {Function} successCallback
   * @param {Object} responseObject
   */
  successCallback: function(url, params, successCallback, responseObject) {
    successCallback && successCallback(responseObject);
  },

  /**
   * 通常のエラー時のcallback
   * @param {String} url
   * @param {Object} params
   * @param {Function} errorCallback
   * @param {Object} responseObject
   */
  errorCallback: function(url, params, errorCallback, responseObject) {
    errorCallback && errorCallback(responseObject);
  } 
};
