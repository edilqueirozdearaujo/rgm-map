//initialization ************************************************************
var LinkPrint  = HrefFromURLPlus("#","icon printer","Imprimir","","");
var MapAddLButton  = "<span >" + HrefFromURLPlus("#","icon plus rgm-map-addl-button","Adicionar mapas","","") + "</span>";
var MapShareButton = "<span>"+ HrefFromURLPlus("#","icon share rgm-map-share-button","Compartilhe","","") +"</span>"; 
var MapRecentButton = "<span>"+ HrefFromURLPlus("http://www.projetorgm.com.br/map/?m=1","icon star rgm-map-recent-button","Mapas recentes","","") +"</span>"; 
var LinksAlvo = "";
var MapControlsInner = "";     //HTML que vai dentro do LegendControl ControlesDoMapa
var MapaEmbutido = MapIsEmb();

//Os links dos botões devem abrir fora do iframe ou quadro onde o mapa foi embutido
if ( MapaEmbutido ) {
  LinksAlvo = '_parent';
  MapShareButton = "";
  MapAddLButton  = "";
  MapRecentButton = "";       
}

var MapBaseLayersSelect = "<form id='rgm-map-controles' method='post' >"+MapAddLButton+"<span class='icon layers'></span>"
		+"<select id='map-select-layer' name='share-b' >"
			+"<option value='lMNK' >OpenStreetMap</option>"  
			+"<option value='lMKG' >OSM Tons de cinza</option>"
			+"<option value='lMBL' >Light Mapbox</option>"  
			+"<option value='lMBD' >Dark Mapbox</option>"
			+"<option value='lOTD' >Ar livre</option>"
			+"<option value='lMBO' >Ar livre Mapbox</option>"
			+"<option value='lCYL' >Ciclistas</option>"
			+"<option value='lMBB' >Bike</option>"
			+"<option value='lMBP' >Lápis</option>"
			+"<option value='lMBC' >Comic</option>"
			+"<option value='lMBR' >Piratas</option>"
			+"<option value='lSTW' >Aquarela</option>"
			+"<option value='lSTL' >Toner Light</option>"
			+"<option value='lSTT' >Toner Dark</option>"
			+"<option value='lMBW' >Poster Lambe-lambe</option>"
			+"<option value='lMBS' >Satélite Mapbox</option>"
			+"<option value='lESR' >Satélite lESR</option>"
			+"<option value='lIBR' >IBGE Rural</option>"
			+"<option value='lIBU' >IBGE Urbano</option>"
		+"</select>"+ MapShareButton
		+"</select>"+ MapRecentButton
		+"<div id='map-controls-group'></div>"
		+"<input id='share-id' name='share-id' type='hidden' value='0'>"
		//+"<input id='share-b'  name='share-b' type='hidden' value=''>"
		+"<input id='share-o'  name='share-o' type='hidden' value=''>"
		+"<input id='share-mb' name='share-mb' type='hidden' value=''>"
		+"<input id='share-xyz' name='share-xyz'  type='hidden' value=''>"
		+"<input id='share-tit' name='share-tit' type='hidden' value=''>"
		+"<input id='share-dsc' name='share-dsc' type='hidden' value=''>"
		+"<input id='map-recent' name='map-recent' type='hidden' value=''>"
		+"</form>";

var ControlesDoMapa = new L.mapbox.LegendControl({position: 'topright'});
ControlesDoMapa.addTo(map);
ControlesDoMapa.addLegend(MapBaseLayersSelect); //A seleção das camadas do mapa não devem ser mudadas ao mover o mapa


function ChangeLayer(Opcao) {
	//Transforma Opcao (string) em layer
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


function MakeMapControls(Links) {
	$("#map-controls-group").html(Links);
}

function AtualizarControlesDoMapa() {
	//pega coordenadas
	var Cnt = map.getCenter();
	var Lat = Cnt.lat;
	var Lon = Cnt.lng;
	
	PreLinkOSMR      = GetLinkOSMR(Lat,Lon); 
	PreLinkMapillary = GetLinkMapillary(Lat,Lon);
	PreLinkF4Map     = GetLinkF4Map(Lat,Lon);
	PreLinkEcoMap    = GetLinkEcoMap(Lat,Lon);
	PreLinkOSMe      = GetLinkOSMe(Lat,Lon);
	PreLinkOSMd      = GetLinkOSMd(Lat,Lon);
	PreLinkLast90    = GetLinkLast90Edits(Lat,Lon);
	
	LinkOSMR      = HrefFromURLPlus(PreLinkOSMR,"icon l-r-arrow","Como chegar até aqui","",LinksAlvo);
	LinkMapillary = HrefFromURLPlus(PreLinkMapillary,"icon street","Fotos e streetview","",LinksAlvo);
	LinkF4Map  = HrefFromURLPlus(PreLinkF4Map,"icon mt","Veja em 3D","",LinksAlvo);
	LinkEcoMap = HrefFromURLPlus(PreLinkEcoMap,"icon landuse","Mapa ecológico","",LinksAlvo);
	LinkOSMe   = HrefFromURLPlus(PreLinkOSMe,"icon pencil","Edite este mapa","",LinksAlvo);
	LinkLast90 = HrefFromURLPlus(PreLinkLast90,"icon history","Edições nos últimos 90 dias","",LinksAlvo);
	LinkOSMd   = HrefFromURLPlus(PreLinkOSMd,"icon inspect","Dados do mapa","",LinksAlvo);

	PreLinkNote      = GetLinkNote(Lat,Lon); 
	LinkNote   = HrefFromURLPlus(PreLinkNote,"icon contact","Localizou um erro ou algo faltando? Informe pra gente :)","",LinksAlvo);

	
	LinksLegenda = LinkOSMR + " " + LinkMapillary + " " + LinkF4Map + " " + LinkEcoMap + " " + LinkOSMe
					 + " " + LinkLast90 + " " + LinkOSMd + " "  + LinkNote; // + " " + LinkPrint;
	
	if ( !MapaEmbutido ) {
		LinksLegenda = LinksLegenda; 
	}
	
	MakeMapControls(LinksLegenda);
}


var BaseLayers = {};	
var Overlays = {'Fotos do Mapillary'       : olMPLL};	
var ControlLayers = L.control.layers( BaseLayers, Overlays, {position: 'topright', collapsed: true});

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


var olMPLL = olMPLL;
var olALIM = layer_oplAlimentacao;
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

//map.addControl(L.mapbox.shareControl());

var Escala = L.control.scale({
	maxWidth: 140
});				
Escala.addTo(map);

function CheckOverpassLayers() {
	if ( map.hasLayer(olALIM) || map.hasLayer(olACOM) || map.hasLayer(olTURI) || map.hasLayer(olTRSP)|| map.hasLayer(olUTIL) || map.hasLayer(olNASC) ) {			
	     map.attributionControl.addAttribution(attrOverPass);
	}else {
	     map.attributionControl.removeAttribution(attrOverPass);
	}
}

map.on('overlayadd', function(e) {
	 AttrIfLayerIsOn( olMPLL, attrMapillary );		     
	 AttrIfLayerIsOn( olMMA, attrMMA );		     
	 AttrIfLayerIsOn( olMBH, attrPrefMRG );
	 CheckOverpassLayers();
 });
map.on('overlayremove', function(e) {
	 AttrIfLayerIsOn( olMPLL, attrMapillary );		     
	 AttrIfLayerIsOn( olMMA, attrMMA );		     
	 AttrIfLayerIsOn( olMBH, attrPrefMRG );
	 CheckOverpassLayers();		     
 });
   



AtualizarControlesDoMapa();			
map.on('moveend', function(e) {
	AtualizarControlesDoMapa();					
});	

refreshMapillary();
map.on('dragend', function(e) {
	refreshMapillary();					
});	

//thanks to http://jsfiddle.net/3fdCD/ from http://stackoverflow.com/questions/22119535/having-trouble-with-leaflet-removelayer
$("#map-select-layer").change(function() {
	var Opcao = $("#map-select-layer option:selected").val();
	ChangeLayer(Opcao);			
});

$(".rgm-map-share-button").click(function(e) {
	//share-id: se mapa existente, é informado na abertura do mapa
	//          se novo mapa, será gerado ao submeter form
	//Baselayer Overlay: Está dentro do form
	
	e.preventDefault();
	var Tit = "";
	var Dsc = "";		
	var Submeter = true;

	var TestID = $("#share-id").val();
	
	//Se já tiver mapa cadastrado, nada a fazer. ID = string
	if ( TestID == '0' ) {
		Tit = prompt("Dê um nome para este mapa", "Mapa sem título");

		var Cnt = map.getCenter();
		var Zoom = map.getZoom();
		var Lat = Cnt.lat;
		var Lon = Cnt.lng;
		var XYZ = Zoom + "/" + Lat + "/" + Lon;
		var O  = ""; 
	
		$("#share-xyz").val(XYZ);	
		if (Tit != null && Tit != "") { 
				Dsc = prompt("Quer deixar alguma descrição sobre esse mapa?", "");		
				$("#share-tit").val(Tit);		
				if (Dsc != null) { $("#share-dsc").val(Dsc);	}
			
				if (map.hasLayer( olMPLL )) {O = "MPLL";}	
				if (map.hasLayer( olNASC )) {
					if( O != "" && O != null  ) {	O = O + ";";} //Adiciona um separador
					O = O + "NASC";
				}	
				$("#share-o").val(O);	
				
				var Total = RawOverlaysMB.length;
				var MBLayers = "";
				for ( Cont = 0; Cont < Total; Cont++ ) {
					MBLayers = MBLayers + RawOverlaysMB[Cont] + ";"; //
				}
				$("#share-mb").val(MBLayers );
		}else {		
			Submeter = false;
		}		
	}	
	
	if ( Submeter ) { $("#rgm-map-controles").submit();}			
});


//Função para adicionar mapas criados com o editor Mapbox! :)
$(".rgm-map-addl-button").click(function(e) {
	e.preventDefault();
	var Link  = "Editor Mapbox: http://mapbox.com/editor/";
	var Mapa = prompt("Adicione seus mapas criados com o " + Link + '! Informe o ID e apelido separados por vírgula', "projetorgm.n11d3kl9,Unidades");
	
	if ( Mapa != '' && Mapa != null ) {
		if ( AddMBLayerInTheMap(Mapa) ) {				 
			document.getElementById('share-id').value = 0; //Isso permite remixar um mapa existente, criando um novo
		}else {
			alert('Mapa inválido! Informe um ID e Apelido, separados por vírgulas');			
		}
	}		
});


$(".rgm-map-recent-button").click(function(e) {
	//e.preventDefault();
	//$("#map-recent").val('1');	
	//$("#rgm-map-controles").submit();
});


//adiciona uma camada no mapa, e armazena informações. Dados = Array, 0 = mapbox ID e 1 = Apelido 
function AddMBLayerInTheMap(DadosRaw) {
	var MapID = null;
	var MapNick = null;
	var Dados = DadosRaw.split(',');
	MapID = Dados[0]; 		 
	MapNick = Dados[1];
	 		 
	if ( MapNick == null ) {				 
			return false;
	}else { //Podemos continuar...	
		MapNick = MapNick.substr(0, 20);		
		RawOverlaysMB[RawOverlaysMB.length] = MapID + "," + MapNick; //Salva camada como dados brutos		
		var MBName = MapID.replace(".","_");	
		var Indice = OverlaysMB.length;
		OverlaysMB[Indice] = L.mapbox.featureLayer(MapID);
		ControlLayers.addOverlay(OverlaysMB[Indice], MapNick);
		map.addLayer(OverlaysMB[Indice]); 
		
		OverlaysMB[Indice].on('ready', function(){
			map.fitBounds(OverlaysMB[Indice].getBounds());
		});
		return true;
	}
}