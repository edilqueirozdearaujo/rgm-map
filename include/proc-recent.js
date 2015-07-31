$('.botao-paginador').click(function(e) {
	e.preventDefault();
	e.stopImmediatePropagation();
	var LinkText = $(this).text();
	var LinkTarget = $(this).attr("href");
	alert( LinkText );
	alert( LinkTarget );
		
	//$("#rgm-map-controles").submit();
});
