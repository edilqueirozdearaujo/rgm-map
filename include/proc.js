var MapLegendTitle = "<div class='flutuar-direita map-title'><h3>Mapa do RGM</h3> <b>[beta]</b> | <a href='https://github.com/edilqueirozdearaujo/rgm-map'><b>Código fonte</b></a> | <a href='about.php'><b>Sobre</b></a> </div>";
var map = L.mapbox.map('mapdiv');


function LimparLegenda(Legenda) {
	document.getElementById(Legenda).innerHTML = '';
}

function ComporLegenda(LegendaId, Conteudo) {
	var Elem = document.getElementById(LegendaId);
	Elem.innerHTML = Conteudo;	
}

function ItemLegenda(Dados) {
	return " <div class='itemlegenda arredondar'>"+ Dados +"</div> ";
}

function AtualizarLegenda(Legenda) {
	//pega coordenadas
	var Cnt = map.getCenter();
	var Lat = Cnt.lat;
	var Lon = Cnt.lng;
	
	PreLinkOSMR      = GetLinkOSMR(Lat,Lon); 
	PreLinkMapillary = GetLinkMapillary(Lat,Lon);
	PreLinkF4Map     = GetLinkF4Map(Lat,Lon);
	PreLinkOSMe      = GetLinkOSMe(Lat,Lon);
	PreLinkOSMd      = GetLinkOSMd(Lat,Lon);
	
	LinkOSMR      = ItemLegenda(HrefFromURL(PreLinkOSMR,"Como chegar até aqui","Como chegar"));
	LinkMapillary = ItemLegenda(HrefFromURL(PreLinkMapillary,"Fotos e streetview","Streetview"));
	LinkF4Map = ItemLegenda(HrefFromURL(PreLinkF4Map,"Veja em 3D","Veja em 3D"));
	LinkOSMe  = ItemLegenda(HrefFromURL(PreLinkOSMe,"Edite este mapa","Edite este mapa"));
	LinkOSMd  = ItemLegenda(HrefFromURL(PreLinkOSMd,"Detalhes sobre os dados: Histórico, autores, etc","Dados do mapa"));

	LinkPrint  = ItemLegenda(HrefFromURL('#',"Imprimir","Imprimir <small>(em breve)</small>"));
	
	LinksLegenda = LinkOSMR + LinkMapillary + LinkF4Map + LinkOSMd + LinkOSMe + LinkPrint 
					+ MapLegendTitle;

	ComporLegenda(Legenda,LinksLegenda);				
}



//Default layer to show
layer_mapnik.addTo(map);  

var BaseLayers = {
    'OpenStreetMap': layer_mapnik,
    'Toner': layer_StamenTonerL,
    'Satélite Mapbox': layer_MapBox,
    'Satélite ESRI': layer_ESRI,
    'Ciclistas'    : layer_cycle,
    'Ao ar livre': layer_outdoors,
    'IBGE Rural'   : layer_IBGEr,
    'IBGE Urbano'  : layer_IBGEu
};	

var Overlays = {		
   // 'Unidades de Conservação'  : layer_MMA,
   // 'Fotos do Mapillary'       : layer_Mapillary,
   // 'Microbacias Hidrográficas' : layer_Microbacias
};	

var ControlLayers = L.control.layers( BaseLayers, Overlays, {position: 'topright', collapsed: true});

//Caso a URL inicial do mapa não tenha coordenadas
map.setView([-24.1267,-48.3721], 10); 

//OverPassAPI overlay
map.attributionControl.addAttribution(attrOverPass);

var layer_oplAlimentacao = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='cafe']; node(BBOX)['amenity'='fast_food'];  node(BBOX)['amenity'='restaurant']; node(BBOX)['amenity'='ice_cream']; );out;"
});
var layer_oplAcomodacao = new L.OverPassLayer({
	   query: "( node(BBOX)['tourism'='hotel']; node(BBOX)['tourism'='alpine_hut'];  node(BBOX)['tourism'='apartament']; node(BBOX)['tourism'='guest_house']; node(BBOX)['tourism'='chalet']; node(BBOX)['tourism'='hostel'];  node(BBOX)['tourism'='motel'];  );out;"
   
});
var layer_oplTurismo = new L.OverPassLayer({
	   query: "( node(BBOX)['historic'='monument']; node(BBOX)['historic'='memorial']; node(BBOX)['historic'='ruins']; node(BBOX)['historic'='ruins']; node(BBOX)['tourism'='attraction'];  node(BBOX)['tourism'='artwork']; node(BBOX)['tourism'='gallery']; node(BBOX)['tourism'='information']; node(BBOX)['tourism'='museum']; node(BBOX)['tourism'='zoo']; );out;"   
});

var layer_oplTransporte = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='bicycle_parking']; node(BBOX)['amenity'='bus_station']; node(BBOX)['amenity'='car_rental']; node(BBOX)['amenity'='car_wash'];  node(BBOX)['amenity'='charging_station']; node(BBOX)['amenity'='ferry_terminal'];  node(BBOX)['amenity'='fuel'];  node(BBOX)['amenity'='parking'];  node(BBOX)['amenity'='taxi']; node(BBOX)['amenity'='bus_stop']; );out;"   
});
var layer_oplBasicos = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='post_office']; node(BBOX)['amenity'='police']; node(BBOX)['amenity'='pharmacy']; node(BBOX)['amenity'='hospital'];  node(BBOX)['amenity'='atm']; node(BBOX)['amenity'='bank']; );out;"   
});
var layer_oplNasc = new L.OverPassLayer({
	   query: "( node(BBOX)['natural'='spring']; );out;"   
});
var layer_oplLixo = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='waste_disposal']; node(BBOX)['amenity'='waste_basket']; node(BBOX)['amenity'='recycling'];  node(BBOX)['amenity'='recycling']; );out;"   
});

ControlLayers.addOverlay(layer_oplAlimentacao, 'Onde se alimentar?');
ControlLayers.addOverlay(layer_oplAcomodacao, 'Onde dormir?');				
ControlLayers.addOverlay(layer_oplTurismo, 'Turismo');				
ControlLayers.addOverlay(layer_oplTransporte, 'Transporte');				
ControlLayers.addOverlay(layer_oplBasicos, 'Utilidades básicas');								
ControlLayers.addOverlay(layer_oplNasc, 'Nascentes');								
//ControlLayers.addOverlay(layer_oplLixo, 'Onde jogar lixo?');

ControlLayers.addTo(map);

L.control.locate().addTo(map);
		
var ControlGeocoder = new L.Control.geocoder({
		position:    'topleft',
		placeholder: 'O que procura?'
});
ControlGeocoder.addTo(map);

var MapHash = L.hash(map);
		
//map.addControl(L.mapbox.shareControl());
		

		map.on('overlayadd', function(e) {
			 AttrIfLayerIsOn( layer_Mapillary, attrMapillary );		     
			 AttrIfLayerIsOn( layer_MMA, attrMMA );		     
			 AttrIfLayerIsOn( layer_Microbacias, attrPrefMRG );		     
		 });
		map.on('overlayremove', function(e) {
			 AttrIfLayerIsOn( layer_Mapillary, attrMapillary );		     
			 AttrIfLayerIsOn( layer_MMA, attrMMA );		     
			 AttrIfLayerIsOn( layer_Microbacias, attrPrefMRG );		     
		 });


		AtualizarLegenda('map-legend');			
		map.on('moveend', function(e) {
			AtualizarLegenda('map-legend');					
		});	

		refreshMapillary();
		map.on('dragend', function(e) {
			refreshMapillary();					
		});	
					