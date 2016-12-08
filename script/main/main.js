//初始化地图并加载图层

$(document).ready(
  function () {


    $("#toggle").click(function () {
      $("#layersContent").toggle();
    });
    var map = L.map('map').setView([39.88642, 116.37452], 18);

    var layerController = new fastmap.mapApi.LayerController({ config: App.layersConfig });

    for (var i = 0, len = layerController.layers.length; i < len; i++) {
      if (layerController.layers[i].options.visible != false) {
        map.addLayer(layerController.layers[i])
      }

    }

    //var transform = new fastmap.mapApi.MecatorTranform();

    var animationLayer = null;
    var animationdataSet = null;
      var options = {
          fillStyle: 'rgba(255, 250, 250, 0.2)',
          coordType: 'bd09mc',
          globalCompositeOperation: "lighter",
          size: 3,
          animation: {
              stepsRange: {
                  start: 0,
                  end: 150
              },
              trails: 5,
              duration: 15,
          },
          draw: 'simple'
      };
      initBarChart("barChart");
      initBarChart("barChartOfNR");

    $.get('data/beijing-link', function (rs) {
      var data = [];
      var timeData = [];
      rs = JSON.parse(rs);
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

      timeData = timeData.splice(0, timeData.length - 1);
      animationdataSet = new mapv.DataSet(timeData);
      animationLayer = new mapv.leafletMapLayer(map, animationdataSet, options);
    });

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
  option = {
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
function changeDivShow(type) {
    if(type === 'MS') {
        $('#msDiv').css('display', 'block');
        $('#nrDiv').css('display', 'none');
    } else{
        $('#msDiv').css('display', 'none');
        $('#nrDiv').css('display', 'block');
    }
}