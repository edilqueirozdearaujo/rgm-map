//initialization ************************************************************
var LinksAlvo = "";
var SelBaselayersDivContent = "";
var MapaEmbutido = MapIsEmb();
//Os links dos botões devem abrir fora do iframe ou quadro onde o mapa foi embutido
if ( MapaEmbutido ) {
  LinksAlvo = '_parent';  
}

/*var SelBaselayersDiv     =  document.getElementById('select-baselayers');	 //obtem objeto
SelBaselayersDivContent = SelBaselayersDiv.innerHTML;                       //backup
SelBaselayersDiv.innerHTML = "";                                        //limpa <div>  

*/
var MapLegendTitle = SelBaselayersDivContent + ""; //DEPRECATED
var map = L.mapbox.map('mapdiv');
//***************************************************************************


function ChangeLayer() {
	var sel = document.getElementById('select-layer');
	var Opcao = sel.options[sel.selectedIndex].value;	
	
	//Transforma string em layer
	switch( Opcao ) {
		case 'lMNK' : sLayer = lMNK; break;	
		case 'lMKG' : sLayer = lMKG; break;	
		case 'lMBL' : sLayer = lMBL; break;
		case 'lMBD' : sLayer = lMBD; break;	
		case 'lOTD' : sLayer = lOTD; break;	
		case 'lMBO' : sLayer = lMBO; break;	
		case 'lCYL' : sLayer = lCYL; break;	
		case 'lMBB' : sLayer = lMBB; break;	
		case 'lMBP' : sLayer = lMBP; break;	
		case 'lMBC' : sLayer = lMBC; break;	
		case 'lMBR' : sLayer = lMBR; break;	
		case 'lSTW' : sLayer = lSTW; break;	
		case 'lSTL' : sLayer = lSTL; break;	
		case 'lSTT' : sLayer = lSTT; break;	
		case 'lMBW' : sLayer = lMBW; break;	
		case 'lMBS' : sLayer = lMBS; break;	
		case 'lESR' : sLayer = lESR; break;	
		case 'lIBR' : sLayer = lIBR; break;	
		case 'lIBU' : sLayer = lIBU; break;	
	}	
	
	//remove camadas existentes
	RmBaseLayers(); //Apenas as baselayers, preserve as overlays
	//map.eachLayer(function(layer) { map.removeLayer(layer); });
/*
    if (map.hasLayer(sLayer)) {
            map.removeLayer(sLayer);
            this.className = '';
    } else {
            map.addLayer(sLayer);
            this.className = 'active';
    }
*/    	
   map.addLayer(sLayer);
}


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
	
	
	LinkOSMR      = ItemLegenda(HrefFromURLPlus(PreLinkOSMR,"Como chegar até aqui","Como chegar",LinksAlvo));
	LinkMapillary = ItemLegenda(HrefFromURLPlus(PreLinkMapillary,"Fotos e streetview","Streetview",LinksAlvo));
	LinkF4Map = ItemLegenda(HrefFromURLPlus(PreLinkF4Map,"Veja em 3D","Veja em 3D",LinksAlvo));
	LinkOSMe  = ItemLegenda(HrefFromURLPlus(PreLinkOSMe,"Edite este mapa","Edite este mapa",LinksAlvo));
	LinkOSMd  = ItemLegenda(HrefFromURLPlus(PreLinkOSMd,"Detalhes sobre os dados: Histórico, autores, etc","Dados do mapa",LinksAlvo));

	LinkPrint  = ItemLegenda(HrefFromURLPlus('#',"Imprimir","Imprimir <small>(em breve)</small>"));
	
	LinksLegenda = LinkOSMR + LinkMapillary + LinkF4Map + LinkOSMd + LinkOSMe + LinkPrint 
					+ MapLegendTitle;

	ComporLegenda(Legenda,LinksLegenda);				
}



//Default layer to show
layer_mapnik.addTo(map);  

var BaseLayers = {
//DEPRECATED
/*    
    'OpenStreetMap': layer_mapnik,
    'Light'        : layer_MapboxLight,
    'Dark'         : layer_MapboxDark,
    'Ar livre'     : layer_MapboxOutdoors,  
    'Poster Lambe-lambe'    : layer_MapboxWheatpaste,    
    'Comic'        : layer_MapboxComic,
    'Lápis'        : layer_MapboxPencil,
    'Toner'        : layer_StamenTonerL,
    'Satélite'     : layer_MapboxStreets,
    'Satélite ESRI': layer_ESRI,
    'IBGE Rural'   : layer_IBGEr,
    'IBGE Urbano'  : layer_IBGEu
*/    
};	

var Overlays = {		
   // 'Unidades de Conservação'  : layer_MMA,
   'Fotos do Mapillary'       : layer_Mapillary
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


var olMPLL = layer_Mapillary;
var olALIM = layer_oplAlimentacao;
var olACOM = layer_oplAcomodacao;
var olACOM = layer_oplAcomodacao;
var olTURI = layer_oplTurismo;
var olTRSP = layer_oplTransporte;
var olUTIL = layer_oplBasicos;
var olNASC = layer_oplNasc;


ControlLayers.addOverlay(olALIM, 'Onde se alimentar?');
ControlLayers.addOverlay(olACOM, 'Onde dormir?');				
ControlLayers.addOverlay(olTURI, 'Turismo');				
ControlLayers.addOverlay(olTRSP, 'Transporte');				
ControlLayers.addOverlay(olUTIL, 'Utilidades básicas');								
ControlLayers.addOverlay(olNASC, 'Nascentes');								
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

var Escala = L.control.scale({
	maxWidth: 140
});				
Escala.addTo(map);


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


		AtualizarLegenda('map-legend-btn');			
		map.on('moveend', function(e) {
			AtualizarLegenda('map-legend-btn');					
		});	

		refreshMapillary();
		map.on('dragend', function(e) {
			refreshMapillary();					
		});	
										