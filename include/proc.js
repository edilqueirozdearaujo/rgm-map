//initialization ************************************************************
//var LinkPrint  = HrefFromURLPlus("#","icon printer","Imprimir","","");
var MapPrintButton  = HrefFromURLPlus("#","button short icon space-bottom1 print rgm-map-print-button","Imprimir","","") + " ";
var MapHelpButton   = HrefFromURLPlus("#","button short icon space-bottom1 help","Ajuda","","") + " ";
var MapAddLButton   = HrefFromURLPlus("#","button short icon space-bottom1 plus fill-green rgm-map-addl-button","Adicionar mapas","","") + " ";
var MapShareButton  = HrefFromURLPlus("#","button short icon share fill-green rgm-map-share-button","Compartilhe","","") +" "; 
var MapRecentButton = HrefFromURLPlus("http://projetorgm.com.br/map/?pg=1","button short icon star fill-green rgm-map-recent-button","Mapas recentes","","") +" "; 
var MapHomeButton   = HrefFromURLPlus("http://projetorgm.com.br/map/","button short icon home space-bottom1 fill-green","Início","","") +" "; 
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

var MapBaseLayersSelect = "<form id='rgm-map-controles' method='post' >"
		+"<span class='dark'>"+MapAddLButton+"</span>"
		+"<span class='icon layers'></span>"
		+"<select id='map-select-layer' name='share-b'>"
			+"<option value='lMNK' >OpenStreetMap</option>"  
			+"<option value='lMKG' >OSM Tons de cinza</option>"
			+"<option value='lMBL' >Mapbox Light</option>"  
			+"<option value='lMBD' >Mapbox Dark</option>"
			+"<option value='lMBS' >Mapbox Streets</option>"
			+"<option value='lMBT' >Mapbox Satellite</option>"
			+"<option value='lMBO' >Mapbox Outdoors</option>"
			+"<option value='lMBB' >Mapbox Run - Bike</option>"
			+"<option value='lMBP' >Mapbox Pencil</option>"
			+"<option value='lMBC' >Mapbox Comic</option>"
			+"<option value='lMBR' >Mapbox Pirates</option>"
			+"<option value='lMBW' >Mapbox Wheatpaste</option>"
			+"<option value='lOTD' >Outdoors</option>"
			+"<option value='lCYL' >Cycle</option>"
			+"<option value='lLSC' >Landscape</option>"
			+"<option value='lTPD' >Transport Dark</option>"
			+"<option value='lSTW' >Stamen Watercolor</option>"
			+"<option value='lSTL' >Stamen Toner Light</option>"
			+"<option value='lSTT' >Stamen Toner Dark</option>"
			+"<option value='lIBR' >IBGE Rural</option>"
			+"<option value='lIBU' >IBGE Urbano</option>"
		+"</select> "
		+"<span class='dark'>"
		+ MapShareButton + MapRecentButton + MapHomeButton
		+"</span> "				
		+"<span class='dark map-controls-group space-bottom1'></span>"		
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
		case 'lLSC' : sLayer = lLSC; break;	
		case 'lTPD' : sLayer = lTPD; break;	
		case 'lMBB' : sLayer = lMBB; break;	
		case 'lMBP' : sLayer = lMBP; break;	
		case 'lMBC' : sLayer = lMBC; break;	
		case 'lMBR' : sLayer = lMBR; break;	
		case 'lSTW' : sLayer = lSTW; break;	
		case 'lSTL' : sLayer = lSTL; break;	
		case 'lSTT' : sLayer = lSTT; break;	
		case 'lMBW' : sLayer = lMBW; break;	
		case 'lMBS' : sLayer = lMBS; break;	
		case 'lMBT' : sLayer = lMBT; break;		
		case 'lIBR' : sLayer = lIBR; break;	
		case 'lIBU' : sLayer = lIBU; break;	
	}	
	
	//remove camadas existentes
	RmBaseLayers(); //Apenas as baselayers, preserve as overlays
   map.addLayer(sLayer);
}


function MakeMapControls(Links) {
	$(".map-controls-group").html(Links);
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
	
	LinkOSMR      = HrefFromURLPlus(PreLinkOSMR,     "button short icon l-r-arrow","Como chegar até aqui","",LinksAlvo);
	LinkMapillary = HrefFromURLPlus(PreLinkMapillary,"button short icon street","Fotos e streetview","",LinksAlvo);
	LinkF4Map     = HrefFromURLPlus(PreLinkF4Map,    "button short icon mt","Veja em 3D","",LinksAlvo);
	LinkEcoMap    = HrefFromURLPlus(PreLinkEcoMap,   "button short icon landuse","Mapa ecológico","",LinksAlvo);
	LinkOSMe      = HrefFromURLPlus(PreLinkOSMe,     "button short icon pencil","Edite este mapa","",LinksAlvo);
	LinkLast90    = HrefFromURLPlus(PreLinkLast90,   "button short icon history","Edições nos últimos 90 dias","",LinksAlvo);
	LinkOSMd      = HrefFromURLPlus(PreLinkOSMd,     "button short icon inspect","Dados do mapa","",LinksAlvo);

	PreLinkNote      = GetLinkNote(Lat,Lon); 
	LinkNote   = HrefFromURLPlus(PreLinkNote,"button short icon tooltip","Localizou um erro ou algo faltando? Informe pra gente :)","",LinksAlvo);

	
	LinksLegenda = LinkOSMR + " " + LinkMapillary + " " + LinkF4Map + " " + LinkEcoMap + " " + LinkOSMe
					 + " " + LinkLast90 + " " + LinkOSMd + " "  + LinkNote; // + " " + LinkPrint;
	
	if ( !MapaEmbutido ) {
		LinksLegenda = LinksLegenda; 
	}
	
	MakeMapControls(LinksLegenda);
}


var BaseLayers = {};	
//DEPRECATED var Overlays = {'Fotos do Mapillary'       : olMPLL};	
var Overlays = {};	
var ControlLayers = L.control.layers( BaseLayers, Overlays, {position: 'topright', collapsed: false});

/*
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
var layer_oplLixo = new L.OverPassLayer({
	   query: "( node(BBOX)['amenity'='waste_disposal']; node(BBOX)['amenity'='waste_basket']; node(BBOX)['amenity'='recycling'];  node(BBOX)['amenity'='recycling']; );out;"   
});

var olALIM = layer_oplAlimentacao;
var olACOM = layer_oplAcomodacao;
var olTURI = layer_oplTurismo;
var olTRSP = layer_oplTransporte;
var olUTIL = layer_oplBasicos;

*/
var olNASC = new L.OverPassLayer({
	   query: "( node(BBOX)['natural'='spring']; );out;"   
});



//ControlLayers.addOverlay(olALIM, 'Onde se alimentar?');
//ControlLayers.addOverlay(olACOM, 'Onde dormir?');				
//ControlLayers.addOverlay(olTURI, 'Turismo');				
//ControlLayers.addOverlay(olTRSP, 'Transporte');				
//ControlLayers.addOverlay(olUTIL, 'Utilidades básicas');								
//ControlLayers.addOverlay(layer_oplLixo, 'Onde jogar lixo?');


//MAPILLARY       ******************************************************************
//https://www.mapbox.com/mapbox.js/example/v1.0.0/images-from-mapillary/
    
var API_ENDPOINT = "";

function MapillaryImg(Key,Width) {
	return 'https://d1cuyjsrcm0gby.cloudfront.net/' + Key + '/thumb-'+ Width + '.jpg';
}

function MapillaryImgHref(Key) {
	var Img = '<img alt="foto..." src="' + MapillaryImg(Key,320)  + '" />';
	var Link = "http://mapillary.com/map/im/"+ Key +"/photo";
	
	
	return HrefFromURLPlus(Link,'','',Img,'_parent'); 
}


function GetAPI_ENDPOINT() {
	S = map.getBounds().getSouth();    
	N = map.getBounds().getNorth();    
	W = map.getBounds().getWest();    
	E = map.getBounds().getEast();    
	

	return "https://a.mapillary.com/v2/search/im/geojson?client_id=" + MapillaryID 
	+ "&max_lat=" + N +"&max_lon="+E+"&min_lat="+S+"&min_lon="+W+"&limit=200&page=0";	
}

var MapillaryIcon =  L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-symbol': 'camera',
        'marker-color': '#1087bf'
    })


var olMPLL = L.mapbox.featureLayer()
    .on('layeradd', function(e) {
        //e.layer.bindPopup('<img src="' + MapillaryImg(e.layer.feature.properties.key,320)  + '" />', {
        e.layer.bindPopup(MapillaryImgHref(e.layer.feature.properties.key,320), {
            minWidth: 200
        });        
    })
  	.on('ready', function(layer) {
	    this.eachLayer(function(marker) {
	         // See the following for styling hints:
	         // https://help.github.com/articles/mapping-geojson-files-on-github#styling-features
	         marker.setIcon(MapillaryIcon);
	    });         
    });


 

//API_ENDPOINT = GetAPI_ENDPOINT();
olMPLL.loadURL(GetAPI_ENDPOINT());
olMPLL.addTo(map);
AttrIfLayerIsOn( olMPLL, attrMapillary );


ControlLayers.addOverlay(olMPLL, 'Fotos do Mapillary');								
ControlLayers.addOverlay(olNASC, 'Nascentes');								
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
	if ( map.hasLayer(olNASC) ) {			
	     map.attributionControl.addAttribution(attrOverPass);
	}else {
	     map.attributionControl.removeAttribution(attrOverPass);
	}
}

map.on('overlayadd', function(e) {
	 AttrIfLayerIsOn( olMPLL, attrMapillary );		     
	 CheckOverpassLayers();
 });
map.on('overlayremove', function(e) {
	 AttrIfLayerIsOn( olMPLL, attrMapillary );		     
	 CheckOverpassLayers();		     
 });
   



AtualizarControlesDoMapa();			
map.on('moveend', function(e) {
	AtualizarControlesDoMapa();	


		olMPLL.loadURL(GetAPI_ENDPOINT()); //BETA
					
});	

/*DEPRECATED
refreshMapillary();
map.on('dragend', function(e) {
	refreshMapillary();					
});	
*/
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
	
	//Se já tiver mapa cadastrado, nada a fazer. ID = string. Mas se for zero...
	if ( TestID == '0' ) {
		Tit = prompt("Salvar este mapa ou apenas link?\nDê um nome para salvar.\nCancelar / sem nome para apenas link.", "sem nome");

		var Cnt = map.getCenter();
		var Zoom = map.getZoom();
		var Lat = Cnt.lat;
		var Lon = Cnt.lng;
		var XYZ = Zoom + "/" + Lat + "/" + Lon;
		var O  = ""; 
	
		//O salvamento temporário das overlays predefinidas é incondicional
		$("#share-xyz").val(XYZ);
		if (map.hasLayer( olMPLL )) {O = "MPLL";}	
		if (map.hasLayer( olNASC )) {
			if( O != "" && O != null  ) {	O = O + ";";} //Adiciona um separador
			O = O + "NASC";
		}	
		$("#share-o").val(O);	
		
		//Mas o salvamento das overlays customizadas (Mapbox) é condicional ao nome do mapa
		//Se não tiver título, considera que apenas quer o link do mapa	
		if (Tit != null && Tit != "" && Tit != "sem nome") { 
				Dsc = prompt("Quer deixar alguma descrição sobre esse mapa?", "");		
				$("#share-tit").val(Tit);		
				if (Dsc != null) { $("#share-dsc").val(Dsc);	}
				var Total = RawOverlaysMB.length;
				var MBLayers = "";
				for ( Cont = 0; Cont < Total; Cont++ ) {
					MBLayers = MBLayers + RawOverlaysMB[Cont] + ";"; //
				}
				$("#share-mb").val(MBLayers );
		}else {		
			//Submeter = false;
			//			
		}		
	}	
	
	if ( Submeter ) { $("#rgm-map-controles").submit();}			
});


//Função para adicionar mapas criados com o editor Mapbox! :)
$(".rgm-map-addl-button").click(function(e) {
	e.preventDefault();
	var Link  = "\nEditor Mapbox: http://mapbox.com/editor/";
	var Mapa = prompt("Adicione seus mapas criados com o " + Link + '\nInforme o ID e apelido separados por vírgula', "projetorgm.n11d3kl9,Unidades");
	
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


//adiciona uma camada no mapa, e armazena informações. Dados = Array, 0 = mapbox ID | 1 = Apelido | 2 = heat ou cluster layer
//MapNick = Apelido do mapa 
//HeatLayer e ClusterLayer são os nomes dados para as variáveis
//O mapa só possui 1 camada Heat ou Cluster. Todas camadas adicionadas serão agrupadas em uma única Heat ou Cluster se especificadas
//A primeira camada dá o nome para o grupo.  
function AddMBLayerInTheMap(DadosRaw) {
	var MapID = null;
	var MapNick = null;
	var LayerGroup = null;  //Cluster or Heat
	
	var Dados = DadosRaw.split(',');
	MapID      = Dados[0]; 		 
	MapNick    = Dados[1];
	LayerGroup = Dados[2];
	
	if ( MapNick == null || MapNick == "" ) {				 
			return false;
	}else { 
		//Podemos continuar...
		MapNick = MapNick.substr(0, 20);  //Tamanho máximo para o apelido da camada		
		var MBName = MapID.replace(".","_");	
		var Indice = OverlaysMB.length;
		//Cria camada... até aqui tudo bem...
		OverlaysMB[Indice] = L.mapbox.featureLayer(MapID);

		//Se for Layer comum, OK. Mas se for Layer agrupada, temos de tratar corretamente	
		if ( LayerGroup != null && LayerGroup != ""  ) {
		
			//Salva camada como dados brutos
			RawOverlaysMB[RawOverlaysMB.length] = MapID + "," + MapNick + "," + LayerGroup;
			//A camada é agrupada. Temos de saber de que tipo e tratar...
			//Verificar se a camada pertence a um grupo e adicionar no mapa se necessário
			//Se não tem no mapa, adiciona usando título da primeira camada
			switch(LayerGroup) {
				case 'h':					
						//Adiciona no grupo
						OverlaysMB[Indice].on('ready', function(){
								OverlaysMB[Indice].eachLayer(function(l) {
		  							HeatLayer.addLatLng(l.getLatLng());
		  						});
						});
						
						if( !map.hasLayer(HeatLayer)  ) { 
								ControlLayers.addOverlay(HeatLayer, MapNick);
								map.addLayer(HeatLayer);
						}
				break;		
				case 'c':
					OverlaysMB[Indice].on('ready', function(){
							//Adiciona no grupo
							ClusterLayer.addLayer(OverlaysMB[Indice]);
					});
				
					if( !map.hasLayer(ClusterLayer)  ) {
							ControlLayers.addOverlay(ClusterLayer, MapNick);
							map.addLayer(ClusterLayer);
					}
				break;		
			}				 
		}else {
			//Salva camada como dados brutos
			RawOverlaysMB[RawOverlaysMB.length] = MapID + "," + MapNick;
			//Se camada comum, vai para o ControlLayers
			ControlLayers.addOverlay(OverlaysMB[Indice], MapNick);
			map.addLayer(OverlaysMB[Indice]); 
			OverlaysMB[Indice].on('ready', function(){
				map.fitBounds(OverlaysMB[Indice].getBounds());
			});
		}
		
		return true;
	}
}

