
//初始化地图并加载图层

$(document).ready(
  function () {
      $("#toggle").click(function() {
          $("#layersContent").toggle();
      });
    var map = L.map('map').setView([39.88642, 116.37452], 18);

    var layerController = new fastmap.mapApi.LayerController({config: App.layersConfig});

    for (var i = 0, len = layerController.layers.length; i < len; i++) {
      map.addLayer(layerController.layers[i])
    }

    //生成图层列表
    createLayerList(layerController.layers);
    //图层点击事件

    $('#leftCheckBox input[type="checkbox"]').change(function (e) {
      console.log('------------'+e)
    })
      $('#rightCheckBox input[type="checkbox"]').change(function (e) {
      console.log('------------'+e)
    })

  }
);



//生成图层列表
function createLayerList(layers) {
  var leftHtml = "";
  var rightHtml = "";
  $.each(layers,function (index ,item) {
      if(index <= 3) {
          leftHtml += '<div class="checkbox" style="padding-left: 9px">' +
            '<label>' +
            '<input type="checkbox" value="' + item.options.id + '">' + item.options.name + '' +
            ' </label>' +
            '</div>';
      } else {
          rightHtml = '<div class="checkbox" style="padding-left: 9px">' +
            '<label>' +
            '<input type="checkbox" value="' + item.options.id + '">' + item.options.name + '' +
            ' </label>' +
            '</div>';
      }

  })
$('#leftCheckBox').html(leftHtml);
$('#rightCheckBox').html(rightHtml);

}
