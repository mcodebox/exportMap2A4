// OpenLayers Map -------------------------------------
var map = new ol.Map({
  view: new ol.View({
    center: [1163030.7515295409, 6650243.907942198],
    zoom: 6
  }),
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({})
    })
  ]
});
map.setTarget('js-map');

// Vector Layer (Draw) -------------------------------------
var drawSource = new ol.source.Vector({
  wrapX: false
});
var drawLayer = new ol.layer.Vector({
  source: drawSource,
  style: drawStyle
});
map.addLayer(drawLayer);

var typeSelect = document.getElementById('type');

var drawedStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "red",
    width: 2
  }),
  fill: new ol.style.Fill({
    color: [244, 92, 66, 0.2]
  }),
  image: new ol.style.Circle({
    stroke: new ol.style.Stroke({
      color: "red",
      width: 2
    }),
    radius: 5,
    fill: new ol.style.Fill({color: 'white'})
  })
});
drawLayer.setStyle(drawedStyle);

var drawStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: "red",
    width: 2
  }),
  fill: new ol.style.Fill({
    color: [244, 92, 66, 0.2]
  }),
  image: new ol.style.Circle({
    stroke: new ol.style.Stroke({
      color: "red",
      width: 2
    }),
    radius: 5,
    fill: new ol.style.Fill({color: 'red'})
  })
});

var draw; // global so we can remove it later
function addInteraction() {
  var value = typeSelect.value;
  if (value !== 'None') {
    draw = new ol.interaction.Draw({
      source: drawSource,
      type: /** @type {ol.geom.GeometryType} */ (typeSelect.value),
      style: drawStyle
    });
    map.addInteraction(draw);
  }
}


//Handle change event.

typeSelect.onchange = function() {
  map.removeInteraction(draw);
  addInteraction();
};

addInteraction();

// Clear Map
var clearMAP = function() {
  drawSource.clear();
};

// Export PNG -------------------------------------
var exportPNG = function() {
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.toBlob(function(blob) {
    saveAs(blob, 'map.png');
  });
};

// Export PDF -------------------------------------
var exportPDF = function() {
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.toBlob(function(blob) {
      var newImg = document.createElement('img'),
        url = URL.createObjectURL(blob);

      newImg.onload = function() {
        URL.revokeObjectURL(url);
      };

      newImg.src = url;

      // image quality 0.9 = 90%
      dataURL = canvas.toDataURL("image/jpeg", 0.9);

      if (mapOrientation == 'vertical') {
        var docVert = new jsPDF();
        docVert.addImage(dataURL, 'JPEG', 0, 0);
        docVert.save('map.pdf');
      } else {
        var docHoriz = new jsPDF('landscape');
        docHoriz.addImage(dataURL, 'JPEG', 0, 0);
        docHoriz.save('map.pdf');
      }

      // document.body.appendChild(newImg);
    }
    //,
    //'image/jpeg', 0.95
  );

};

// Rotate Map -------------------------------------
// DIN A4 & 96 dpi = 794x1123px
var mapOrientation = 'vertical';
var rotateMap = function() {

  if (mapOrientation == 'vertical') {
    document.getElementById("js-map").style.height = "794px";
    document.getElementById("js-map").style.width = "1123px";
    map.updateSize();
    document.getElementById("rotateMAPbtn").value = "Vertical";
    mapOrientation = 'horizontal';
  } else {
    document.getElementById("js-map").style.height = "1123px";
    document.getElementById("js-map").style.width = "794px";
    map.updateSize();
    document.getElementById("rotateMAPbtn").value = "Horizontal";
    mapOrientation = 'vertical';
  }

};
