<?php
$to_per = array();
$lines = file('../data/corpus-chars');

foreach ($lines as $line_num => $line) {
	$to_per[$line[0]] = substr($line, 2, strlen($line)-1-2);
}

function to_persian($s) {
	global $to_per;
	$r = "";
	$strlen = strlen( $s );
	for( $i = 0; $i < $strlen; $i++ ) {
		$c = $s[$i];
		if (isset($to_per[$c]))
			$r .= $to_per[$c];
		else
			$r .= $c;
	}
	return $r;
}

function db_connect() {
	$link = mysql_connect("localhost", "root", "mohammad");
	mysql_select_db('corpus', $link);
	return $link;
}
?>
