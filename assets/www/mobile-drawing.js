var vector = new OpenLayers.Layer.Vector('Vector Layer', {
        styleMap: new OpenLayers.StyleMap({
            temporary: OpenLayers.Util.applyDefaults({
                pointRadius: 16
            }, OpenLayers.Feature.Vector.style.temporary)
        })
    });
var toolbar = new OpenLayers.Control.Panel({
        displayClass: 'olControlEditingToolbar'
    });
var draw =new OpenLayers.Control.DrawFeature(vector, OpenLayers.Handler.Polygon, { displayClass: 'olControlDrawFeaturePolygon'});
toolbar.addControls([
        new OpenLayers.Control({
            displayClass: 'olControlNavigation'
        }),
        draw
    ]);

// var mymap = new OpenLayers.Layer.WMS( "ENGIN","http://222.22.64.192/cgi-bin/mapserv?map=/home/engin/webapp/mapfile/tt.map&",{layers: ['xzq','jmd','cz','road']},{gutter: 15});
var mylayer = new OpenLayers.Layer.WMS( "OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'},{gutter: 15});
var map;
var init =function(){

	map = new OpenLayers.Map({
	        div: 'map',
	        controls: [
	            new OpenLayers.Control.TouchNavigation(),
	            new OpenLayers.Control.ZoomPanel(),
	            toolbar
	        ],
	        layers: [mylayer, vector],
	        center: new OpenLayers.LonLat(0, 0),
	        zoom: 5,
	        theme: null
	    });
	toolbar.controls[0].activate();
}

function setgeo() {
	var onSuccess = function(position) {
	    alert("开启GPS成功，当前坐标：\n"+'纬度：'          + position.coords.latitude          + '\n' +
	          '经度：'         + position.coords.longitude         + '\n' +
	          '高程：'          + position.coords.altitude          + '\n' +
	          '精度：'          + position.coords.accuracy          + '\n' +
	          '高程精度' + position.coords.altitudeAccuracy  + '\n' +
	          '朝向：'           + position.coords.heading           + '\n' +
	          '速度：'             + position.coords.speed             + '\n' +
	          '时间：'         + new Date(position.timestamp)      + '\n');
	    //draw.setGeometry(position);
	    //draw.finalize();
	    var x=parseFloat(position.coords.latitude);
	    var y=parseFloat(position.coords.longitude);
	    draw.insertXY(y,x);
	};

	function onError(error) {
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	};
	navigator.geolocation.getCurrentPosition(onSuccess, onError,{ enableHighAccuracy: true });
};

function undo() {
	draw.undo();
};
function redo() {
	draw.redo();
};
function watch(){
	function onSuccess(position) {
	    alert( 'Latitude: '  + position.coords.latitude      + '\n' +
	                        'Longitude: ' + position.coords.longitude );
	    var x=parseFloat(position.coords.latitude);
	    var y=parseFloat(position.coords.longitude);
	    var latlon= new OpenLayers.LonLat(y,x);
	    draw.handler.drawLocation(y,x);
	    map.setCenter(latlon);
	}

	function onError(error) {
	    alert('code: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}
	var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { frequency: 3000,enableHighAccuracy: true });
};
function finish(){
	draw.finishSketch();
};
function cancle() {
	draw.cancle();
};
