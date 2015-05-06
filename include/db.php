<?

function DBServerConnect() {
	$Resource =  mysql_connect(cDBHost, cDBUser,cDBPass);
	return $Resource;  
}

function DBIsConnected($Resource) {
	$Result = TRUE;
	if( $Resource === FALSE  ) {
     	$Result = FALSE;	
	}
	return $Result;
}


function DBSelect($Db) {
	return mysql_select_db($Db);
}
	
function DBServerDisconnect($Link) {
	return mysql_close($Link);
}


//Retorna números de resultados de uma consulta. Retorna 0 em caso de não encontrar ou erro
//Count of results 
function MySQLResults($ExeSQL) {
	$Resultados = 0;
	if( $ExeSQL !== FALSE ) {
		$Resultados = mysql_num_rows($ExeSQL);
	}
	return $Resultados;
}

function MySQLResultsFromSQL($SQL) {
	$ExeSQL = mysql_query($SQL);
	return MySQLResults($ExeSQL);
}



//Search calendar and return as array
function SearchByID($ID) {
	//--------------------------------------------------------------------
	$Resultado = FALSE; 
	$IDInt = FromBase36($ID);
	$Res = DBServerConnect();
	if( DBIsConnected($Res)) {
		if (DBSelect(cDBName)){
			$SQL = "SELECT * FROM RGMGoTo WHERE ID = $IDInt LIMIT 1;";

			$ExeSQL = mysql_query($SQL);
			if( MySQLResults($ExeSQL) > 0 ) {
				 $Resultado = mysql_fetch_array($ExeSQL);
			}
		}
		DBServerDisconnect($Res);
	}
	return $Resultado;
}

?>