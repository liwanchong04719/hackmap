//初始化地图并加载图层116.10202935,39.766424424   116.67517252,39.664857855  116.57969618,39.743630371

$(document).ready(
  function () {

    $("#toggle").click(function () {
      $("#layersContent").toggle();
    });
    var map = L.map('map',{zoomControl:false,minZoom:15}).setView([40.0,116.25], 16);

    var bound = L.latLngBounds(L.latLng(40.0,116.25),L.latLng(40.083333333333336,116.375));

    var bound = [[40.0,116.25],[40,116.375],[40.083333333333336,116.375],[40.083333333333336,116.25],[40.0,116.25]]
    //map.fitBounds(bound);
    L.polyline(bound, {color: "red", weight: 2}).addTo(map);
    $('#myTab li:eq(0) a').tab('show');

    var layerController = new fastmap.mapApi.LayerController({ config: App.layersConfig });

    for (var i = 0, len = layerController.layers.length; i < len; i++) {
      if (layerController.layers[i].options.visible != false) {
        map.addLayer(layerController.layers[i])
      }

    }


    var animationLayer = null;
    var animationdataSet = null;
    var options = {
      fillStyle: 'red',
      coordType: 'bd09mc',
      globalCompositeOperation: "lighter",
      size: 3,
      animation: {
        stepsRange: {
          start: 0,
          end: 550
        },
        trails: 5,
        duration: 5,
      },
      draw: 'simple',
      zIndex:41,
    }
      //MS生成量专题图
      instrumentPanel("guagechartcontainer");
      mscountline("linechartcontainer");
      originalTrackHistogram('originalTrack');
      didiHistogram("didiChart");
      segmentHistogram('segmentChart');
      digPoiHistogram("digChart");
      absSensorHistogram("absSensorChart");
      fireSensorHistogram("sensorChart");
      skipLandHistogram("skipLandChart");
      parkOfNRHistogram("parkOfNRChart");
      // 原始轨迹
      // initBarChart("barChart1");
      // initBarChart("barChart2");
      // initBarChart("barChart3");


    var requestBound = map.getBounds();

    map.on('moveend',function () {
      requestBound = map.getBounds();
    })



    //每隔5秒钟刷新一次轨迹动画信息
    getanimationData()
    setInterval(getanimationData,5000)
    //每隔5秒刷新adaslink数据
    //setInterval(function(){layerController.getLayerById('adasLink').redraw()},5000);


    //调用统计
    getStaticForAccess();
    //四种要素总数
    getStaticTotal();

    function getanimationData () {
      $.post('http://fs.navinfo.com/smap/autoadas/track.json',JSON.stringify({"ak":"E485214565fetch087acde70","bound":[[requestBound.getNorthWest().lng,requestBound.getNorthWest().lat],[requestBound.getSouthEast().lng,requestBound.getSouthEast().lat]]}),function (data) {
        var rs =data.data.track
        var data = [];
        var timeData = [];
        //rs = JSON.parse(rs);
        console.log(rs.length);
        for (var i = 0; i < rs.length; i++) {
          var item = rs[i].geometry.coordinates;
          var coordinates = [];
          for (j = 0; j < item.length; j += 2) {
            var co = item[j]
            coordinates.push(co);
            timeData.push({
              geometry: {
                type: 'Point',
                coordinates: item[j]
              },
              count: 1,
              time: 2 * j
            });
          }
          data.push({

            geometry: {
              type: 'LineString',
              coordinates: coordinates
            },
            count: 30 * Math.random()
          });

        }
        if(animationLayer!=null){
          animationLayer.onRemove();
          animationLayer = null;
        }
        timeData = timeData.splice(0, timeData.length - 1);
        animationdataSet = new mapv.DataSet(timeData);
        animationLayer = new mapv.leafletMapLayer(map, animationdataSet, options);

      },'json');
    }



    var layers = layerController.layers.concat([{ options: { id: 'animation', visible: true, name: "线轨迹" } }])
    //生成图层列表
    createLayerList(layers);
    //图层点击事件


    $('#layersContent input[type="checkbox"]').change(function (e) {
        if (e.target.checked == false) {
          // console.log(e)
          if (e.target.value == 'animation') {
            //map.addLayer(layerController.getLayerById(e.target.value));
            animationLayer.onRemove();
          } else {
            map.removeLayer(layerController.getLayerById(e.target.value));
          }
        } else {
          if (e.target.value == 'animation') {
            animationLayer = new mapv.leafletMapLayer(map, animationdataSet, options);
          }
          else {
            map.addLayer(layerController.getLayerById(e.target.value));
          }
        }
      }
    );
  });



//查询MS生成量
function  getMSCreateCount() {
  Application.Util.ajaxConstruct(Application.serversta+"/stat/second?","GET","JSON",function (data) {

  },function (err) {
    console.log('查询服务出错！')
  })
}



//生成图层列表
function createLayerList(layers) {
  var leftHtml = "";
  var rightHtml = "";
  $.each(layers, function (index, item) {
    if (index <= 3) {
      leftHtml += '<div class="checkbox" style="padding-left: 9px">' +
        '<label>' +
        '<input type="checkbox" ' + (item.options.visible == true ? 'checked' : "") + ' value="' + item.options.id + '">' + item.options.name + '' +
        ' </label>' +
        '</div>';
    } else {
      rightHtml += '<div class="checkbox" style="padding-left: 9px">' +
        '<label>' +
        '<input type="checkbox" ' + (item.options.visible == true ? 'checked' : "") + ' value="' + item.options.id + '">' + item.options.name + '' +
        ' </label>' +
        '</div>';
    }

  });
  $('#leftCheckBox').html(leftHtml);
  $('#rightCheckBox').html(rightHtml);
}

function initBarChart(id) {
  var dom = document.getElementById(id);
  var myChart = echarts.init(dom);
  var app = {};
  var option = {
    backgroundColor: '#fff',
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        mark: { show: false },
        dataView: { show: false, readOnly: false },
        magicType: { show: false, type: ['line', 'bar'] },
        restore: { show: false },
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    legend: {
      orient : 'horizontal',
      x : 'center',
      y:'bottom',
      data:['数据','面积']
    },
    xAxis: [
      {
        type: 'category',
        data: ['数据1', '数据2', '数据3', '数据4', '数据6', '数据7', '数据8', '数据9', '数据10', '数据11', '数据12', '数据13']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '100%',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '单价',
        axisLabel: {
          formatter: '{value}元'
        }
      }
    ],
    series : [
      {
        name:'出租率',
        type:'bar',
        itemStyle:{
          normal:{color:'#0099FF'}
        },
        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 90, 100, 32.6, 20.0, 6.4, 3.3]
      },
      {
        name: '单价',
        type: 'line',
        yAxisIndex: 1,
        itemStyle:{
          normal:{color:'#C06410'}
        },
        data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
      }
    ]
  };

  if (option && typeof option === "object") {
    myChart.setOption(option, true);
  }
}


function mscountline(id) {
  var dom = document.getElementById(id);
  var myChart = echarts.init(dom);
  var app = {};
  var option = null;
  var base = +new Date(2014, 9, 3);
  var oneDay = 24 * 3600 * 1000;
  var date = [];

  var data = [Math.random() * 150];
  var now = new Date(base);

  function addData(shift) {
    now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/');
    date.push(now);
    data.push((Math.random() - 0.4) * 10 + data[data.length - 1]);

    if (shift) {
      date.shift();
      data.shift();
    }

    now = new Date(+new Date(now) + oneDay);
  }

  for (var i = 1; i < 100; i++) {
    addData();
  }

  var option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      boundaryGap: [0, '50%'],
      type: 'value'
    },
    series: [
      {
        name: '成交',
        type: 'line',
        smooth: true,
        symbol: 'none',
        stack: 'a',
        areaStyle: {
          normal: {}
        },
        data: data
      }
    ]
  };

  setInterval(function () {
    addData(true);
    myChart.setOption({
      xAxis: {
        data: date
      },
      series: [{
        name: '成交',
        data: data
      }]
    });
  }, 500);
  if (option && typeof option === "object") {
    myChart.setOption(option, true);
  }
}



function changeDivShow(type) {
    if(type === 'MS') {
        $('#msDiv').css('display', 'block');
        $('#nrDiv').css('display', 'none');
    } else{
        $('#msDiv').css('display', 'none');
        $('#nrDiv').css('display', 'block');
    }
}

//原始轨迹数据柱状图
function originalTrackHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [0,1],
            "objType": 1,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 0) {
                      var linkObj = data.data[0].result.link;
                      for (var key in linkObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(linkObj[key]);
                          } else {
                              option.series[0].data.push(linkObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 1) {
                      var linksObj = data.data[0].result.link;
                      for (var keys in linksObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(linksObj[keys]);
                          } else {
                              option.series[1].data.push(linksObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)

}
// 滴滴订单数据柱状图
function didiHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [0,1],
            "objType": 2,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 0) {
                      var poiObj = data.data[0].result.poi;
                      for (var key in poiObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(poiObj[key]);
                          } else {
                              option.series[0].data.push(poiObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 1) {
                      var poisObj = data.data[0].result.poi;
                      for (var keys in poisObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(poisObj[keys]);
                          } else {
                              option.series[1].data.push(poisObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
// abs 传感器 信息量
function absSensorHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [0,1],
            "objType": 3,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 0) {
                      var absObj = data.data[0].result.abs;
                      for (var key in absObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(absObj[key]);
                          } else {
                              option.series[0].data.push(absObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 1) {
                      var abssObj = data.data[0].result.abs;
                      for (var keys in abssObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(abssObj[keys]);
                          } else {
                              option.series[1].data.push(abssObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
//点火系统 传感器 信息量
function fireSensorHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [0,1],
            "objType": 4,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 0) {
                      var parkObj = data.data[0].result.park;
                      for (var key in parkObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(parkObj[key]);
                          } else {
                              option.series[0].data.push(parkObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 1) {
                      var parksObj = data.data[0].result.park;
                      for (var keys in parksObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(parksObj[keys]);
                          } else {
                              option.series[1].data.push(parksObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
// 截取轨迹段数 NR
function segmentHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [4,5],
            "objType": 1,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 4) {
                      var linkObj = data.data[0].result.link;
                      for (var key in linkObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(linkObj[key]);
                          } else {
                              option.series[0].data.push(linkObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 5) {
                      var linksObj = data.data[0].result.link;
                      for (var keys in linksObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(linksObj[keys]);
                          } else {
                              option.series[1].data.push(linksObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
// 挖掘poi数据 NR
function digPoiHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [4,5],
            "objType": 2,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 4) {
                      var poiObj = data.data[0].result.poi;
                      for (var key in poiObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(poiObj[key]);
                          } else {
                              option.series[0].data.push(poiObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 5) {
                      var poisObj = data.data[0].result.poi;
                      for (var keys in poisObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(poisObj[keys]);
                          } else {
                              option.series[1].data.push(poisObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
// 易滑道路 NR
function skipLandHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [4,5],
            "objType": 3,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 4) {
                      var absObj = data.data[0].result.abs;
                      for (var key in absObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(absObj[key]);
                          } else {
                              option.series[0].data.push(absObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 5) {
                      var abssObj = data.data[0].result.abs;
                      for (var keys in abssObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(abssObj[keys]);
                          } else {
                              option.series[1].data.push(abssObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
//停车点 NR
function parkOfNRHistogram(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var app = {};
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: false },
                dataView: { show: false, readOnly: false },
                magicType: { show: false, type: ['line', 'bar'] },
                restore: { show: false },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        legend: {
            orient : 'horizontal',
            x : 'center',
            y:'bottom',
            data:['接入量','处理量']
        },
        xAxis: [
            {
                type: 'category',
                data: [formateTime()]
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '100%',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: '数量',
                axisLabel: {
                    formatter: '{value}元'
                }
            }
        ],
        series : [
            {
                name:'总量',
                type:'bar',
                itemStyle:{
                    normal:{color:'#0099FF'}
                },
                data:[0]
            },
            {
                name: '处理量',
                type: 'line',
                yAxisIndex: 1,
                itemStyle:{
                    normal:{color:'#C06410'}
                },
                data:[0]
            }
        ]
    };
    setInterval(function () {
        var param = {
            "statType": [4,5],
            "objType": 4,
            "second": parseInt(new Date().getTime()/1000),
            "interval": 2,
        };
        $.get('http://fs.navinfo.com/autoadas/stat/second?parameter=' + JSON.stringify(param),
          function (data) {
              for (var i = 0, len =data.data.length; i<len; i++) {
                  if (data.data[i].statType === 4) {
                      var parkObj = data.data[0].result.park;
                      for (var key in parkObj) {
                          if(option.xAxis[0].data.length > 8) {
                              option.xAxis[0].data.shift();
                              option.xAxis[0].data.push(key);
                          } else {
                              option.xAxis[0].data.push(key);
                          }
                          if(option.series[0].data.length >8) {
                              option.series[0].data.shift();
                              option.series[0].data.push(parkObj[key]);
                          } else {
                              option.series[0].data.push(parkObj[key]);
                          }
                      }
                  }
                  if(data.data[i].statType === 5) {
                      var parksObj = data.data[0].result.park;
                      for (var keys in parksObj) {
                          if(option.series[1].data.length >8) {
                              option.series[1].data.shift();
                              option.series[1].data.push(parksObj[keys]);
                          } else {
                              option.series[1].data.push(parksObj[keys]);
                          }
                      }
                  }
              }
              myChart.setOption(option, true);
          });


    },2000)
}
function formateTime() {
    var date = new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDay() > 10 ? date.getDay().toString() : '0' + date.getDay();
    var hour = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    return year + month + day + hour + minutes + seconds;
}

function instrumentPanel(id) {
    var dom = document.getElementById(id);
    var myChart = echarts.init(dom);
    var option = {
        tooltip : {
            formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
            show: true,
            feature: {
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        series : [
            {
                name: '速度',
                type: 'gauge',
                min: 0,
                max: 220,
                center: ['15%', '25%'],    // 默认全局居中
                splitNumber: 11,
                radius: '30%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic'
                    }
                },
                detail : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 40, name: 'km/h'}]
            },
            {
                name: '速度',
                type: 'gauge',
                min: 0,
                max: 220,
                center: ['45%', '25%'],    // 默认全局居中
                splitNumber: 11,
                radius: '30%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic'
                    }
                },
                detail : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 40, name: 'km/h'}]
            },
            {
                name: '速度',
                type: 'gauge',
                min: 0,
                max: 220,
                center: ['15%', '55%'],    // 默认全局居中
                splitNumber: 11,
                radius: '30%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic'
                    }
                },
                detail : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 40, name: 'km/h'}]
            },
            {
                name: '速度',
                type: 'gauge',
                min: 0,
                max: 220,
                center: ['45%', '55%'],    // 默认全局居中
                splitNumber: 11,
                radius: '30%',
                axisLine: {            // 坐标轴线
                    lineStyle: {       // 属性lineStyle控制线条样式
                        width: 10
                    }
                },
                axisTick: {            // 坐标轴小标记
                    length: 15,        // 属性length控制线长
                    lineStyle: {       // 属性lineStyle控制线条样式
                        color: 'auto'
                    }
                },
                splitLine: {           // 分隔线
                    length: 20,         // 属性length控制线长
                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                        color: 'auto'
                    }
                },
                title : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic'
                    }
                },
                detail : {
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder'
                    }
                },
                data:[{value: 40, name: 'km/h'}]
            }
        ]
    };


}


function getStaticForAccess() {
  $.post('http://fs.navinfo.com/smap/autoadas/s_day.json',JSON.stringify({"ak":"E485214565fetch087acde70","statType":"event","day":new Date().getFullYear()+""+(new Date().getMonth()+1)+new Date().getDay()}),function (data) {
    console.log('-------------')
  },'json');
}


function getStaticTotal() {
  $.post('http://fs.navinfo.com/smap/autoadas/total.json',JSON.stringify({"ak":"E485214565fetch087acde70"}),function (data) {
    console.log('-------------')
  },'json');
}


setInterval(function (){
  option.series[0].data[0].value = (Math.random()*100).toFixed(2) - 0;
  option.series[1].data[0].value = (Math.random()*100).toFixed(2) - 0;
  option.series[2].data[0].value = (Math.random()*2).toFixed(2) - 0;
  option.series[3].data[0].value = (Math.random()*2).toFixed(2) - 0;
  myChart.setOption(option,true);
},2000);