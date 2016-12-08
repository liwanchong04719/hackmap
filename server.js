/**
 * Created by zhongxiaoming on 2016/12/2.
 */
var http = require("http");
var fs = require("fs");
var qs = require('querystring');
function onRequest(request, response) {
  var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
  // 数据块接收中
  request.addListener("data", function (postDataChunk) {
    postData += postDataChunk;
  })
  request.addListener("end", function () {
    console.log('数据接收完毕');
    var params = qs.parse(postData)
    var data = params.data;
    if(Object.prototype.toString.apply =='[object Object]'){
      data = JSON.stringify(data);
    }
    //var ajaxoptions = params.ajaxoptions;
    var url = '192.168.3.64'
    //console.log('soapMessage参数:' + soapMessage);
    var options = {
      hostname: url,
      port:8016,
      path: '/getADASbytile',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    };
    var req = http.request(options, function (res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        var startindex = chunk.indexOf('<ns1:return>')
        var endindex = chunk.indexOf('</ns1:return>');
      });
      res.pipe(response);
    });
    req.on('error', function (e) {
      console.log('problem with request: ' + e.message);
    });
    // write data to request body
    req.write(JSON.stringify({"ak":"E485214565fetch087acde70","level":19,"tilex":431460,"tiley":198568}));
    req.end();
    request.pipe(req);
    console.log('parameter=' + JSON.stringify(request.body))
    console.log("Request received.");
    response.writeHead(200, { "Content-Type": 'text/plain', 'charset': 'utf-8', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS' });//可以解决跨域的请求
  });

}

http.createServer(onRequest).listen(8088);

