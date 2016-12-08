//初始化地图并加载图层

$(document).ready(
  function () {



    $("#toggle").click(function () {
      $("#layersContent").toggle();
    });

    var map = L.map('map').setView([39.88642, 116.37452], 18);

    var layerController = new fastmap.mapApi.LayerController({config: App.layersConfig});

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
    }
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

    var layers = layerController.layers.concat([{options: {id: 'animation', visible: true, name: "线轨迹"}}])
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







  })


//生成图层列表
function createLayerList(layers) {
  var leftHtml = "";
  var rightHtml = "";
  $.each(layers, function (index, item) {
// <<<<<<< HEAD
//       html+= '<div class="checkbox"> <label> <input type="checkbox" '+ (item.options.visible == true?'checked':"")
// +' value="'+item.options.id+'">'+item.options.name+' </label> </div>' =======
    if (index <= 3) {
      leftHtml += '<div class="checkbox" style="padding-left: 9px">' +
        '<label>' +
        '<input type="checkbox" ' + (item.options.visible == true ? 'checked' : "") + ' value="' + item.options.id + '">' + item.options.name + '' +
        ' </label>' +
        '</div>';
    } else {
      rightHtml = '<div class="checkbox" style="padding-left: 9px">' +
        '<label>' +
        '<input type="checkbox" ' + (item.options.visible == true ? 'checked' : "") + ' value="' + item.options.id + '">' + item.options.name + '' +
        ' </label>' +
        '</div>';
    }

  })
  $('#leftCheckBox').html(leftHtml);
  $('#rightCheckBox').html(rightHtml);

}