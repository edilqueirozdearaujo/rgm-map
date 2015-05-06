var	MapboxAccessToken = "";  //your-Mapbox-Access-Token  -> Learn more: https://www.mapbox.com/mapbox.js/

var Sep = ' | ';
var attrOSM         = '<a href="http://www.openstreetmap.org/copyright" title="Termos e condições" >contribuidores do OpenStreetMap</a>'; 
var attrMapboxjs    = attrOSM + Sep + '<a href="https://www.mapbox.com/design/" title="Mapbox" >Mapbox.js</a>';
var attrMapBox      = '<a href="https://www.mapbox.com/" title="Mapbox" >tiles by Mapbox</a>' + Sep + attrMapboxjs; 
var attrMapillary   = "<a href='https://mapillary.com/'>Images from Mapillary</a>";
var attrMMA         = "<a href='http://www.mma.gov.br/areas-protegidas/cadastro-nacional-de-ucs'>Ministério do Meio Ambiente</a>";
var attrPrefMRG     = "<a href='http://ribeiraogrande.sp.gov.br/'>Prefeitura Municipal de Ribeirão Grande</a>";
var attrOverPass    = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';
var attrMapBoxTile  = '<a href="https://www.mapbox.com/" title="MapBox" >tiles by MapBox</a>' + Sep + attrMapboxjs; 
var attrThunder = '<a href="http://thunderforest.com/terms/" title="Termos e condições" >Thunderforest</a>'  + Sep + attrMapboxjs; 
var attrESRI = '<a href="http://downloads2.esri.com/ArcGISOnline/docs/tou_summary.pdf" title="Termos e condições" >Esri World Imagery</a>'  + Sep + attrMapboxjs; 
var attrIBGE = '<a href="https://github.com/tmpsantos/IBGETools" title="IBGETools" >IBGETools</a> | <a href="ftp://geoftp.ibge.gov.br/mapas_estatisticos/censo_2010/mapas_de_setores_censitarios" title="Mapas de Setores Censitários" >Mapas de Setores Censitários (2010)</a> by <a href="http://www.ibge.gov.br/" title="IBGE" >IBGE</a> | hospedado por <a href="https://www.mapbox.com/" title="MapBox" >MapBox</a>'  + Sep + attrMapboxjs; 
var attrStamen = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>' + Sep + attrMapboxjs; 

var layer_mapnik       = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: attrMapboxjs} ); 
var layer_OSMbw        = L.tileLayer('http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {attribution: attrMapboxjs} ); 
var layer_outdoors     = L.tileLayer('http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png', {attribution: attrThunder} ); 
var layer_cycle        = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {attribution: attrThunder} ); 
var layer_ESRI         = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: attrESRI} ); 
var layer_IBGEr        = L.tileLayer('https://{s}.tiles.mapbox.com/v3/tmpsantos.i00mo1kj/{z}/{x}/{y}.png', {attribution: attrIBGE} ); 
var layer_IBGEu        = L.tileLayer('https://{s}.tiles.mapbox.com/v3/tmpsantos.hgda0m6h/{z}/{x}/{y}.png', {attribution: attrIBGE} );
var layer_MapBox       = L.tileLayer('https://{s}.tiles.mapbox.com/v3/openstreetmap.map-inh7ifmo/{z}/{x}/{y}.png', {attribution: attrMapBox} );
var layer_StamenWater  = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {attribution: attrStamen} ); 
var layer_StamenToner  = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {attribution: attrStamen} ); 
var layer_StamenTonerL = L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.jpg', {attribution: attrStamen} ); 

L.mapbox.accessToken   = MapboxAccessToken;
var layer_MMA          = L.mapbox.featureLayer('edilqueirozdearaujo.l55cf7ad');
var layer_Microbacias  = L.mapbox.featureLayer('edilqueirozdearaujo.l54c2k79');

var layer_MapboxComic    = L.mapbox.tileLayer('projetorgm.lo6iii9m');
var layer_MapboxStreets  = L.mapbox.tileLayer('projetorgm.lo6jai4e');
var layer_MapboxLight    = L.mapbox.tileLayer('projetorgm.lo6kkpk8');
var layer_MapboxDark     = L.mapbox.tileLayer('projetorgm.loj1elc9');
var layer_MapboxOutdoors = L.mapbox.tileLayer('projetorgm.loj11cg8');
var layer_MapboxPirates  = L.mapbox.tileLayer('projetorgm.loj254fd');
var layer_MapboxWheatpaste  = L.mapbox.tileLayer('projetorgm.loj34g2c');
var layer_MapboxBike     = L.mapbox.tileLayer('projetorgm.loj474lm');
var layer_MapboxPencil   = L.mapbox.tileLayer('projetorgm.loj51j3n');





var layer_Mapillary    = L.mapbox.featureLayer();
	layer_Mapillary.on('layeradd', function(e) {
        e.layer.bindPopup('<img width="128px" src="' + e.layer.feature.properties.image + '" />', {
            minWidth: 132
        });
    });


function refreshMapillary() {
	var Box = map.getBounds();
	var SOUTH = Box.getSouth();
	var NORTH = Box.getNorth();
	var WEST = Box.getWest();
	var EAST = Box.getEast();
	
	var MapillarySearch = 'http://api.mapillary.com/v1/im/search?' + 
			'min-lat=' + SOUTH +
			'&max-lat=' + NORTH + 
			'&min-lon=' + WEST +
			'&max-lon=' + EAST +
			'&max-results=85&geojson=true';	

	layer_Mapillary.loadURL(MapillarySearch);		
}	


function AttrIfLayerIsOn( Camada, Attr ) {
	if ( map.hasLayer( Camada )) {
	     map.attributionControl.addAttribution(Attr);
	}else {
	     map.attributionControl.removeAttribution(Attr);
	}	
}
