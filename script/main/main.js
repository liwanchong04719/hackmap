
//初始化地图并加载图层

$(document).ready(
  function () {

    var map = L.map('map').setView([39.88642, 116.37452], 18);

    var layerController = new fastmap.mapApi.LayerController({config: App.layersConfig});

    for (var i = 0, len = layerController.layers.length; i < len; i++) {
      map.addLayer(layerController.layers[i])
    }

    //生成图层列表
    createLayerList(layerController.layers);
    //图层点击事件

    $('.layersContainer input[type="checkbox"]').change(function (e) {
      console.log('------------'+e)
    })

  }
);



//生成图层列表
function createLayerList(layers) {
  var html = "";
  $.each(layers,function (index ,item) {
      html+= '<div class="checkbox"> <label> <input type="checkbox" value="'+item.options.id+'">'+item.options.name+' </label> </div>'
  })
$('.layersContainer').html(html);

}