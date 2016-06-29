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
header('Content-Type: application/json');

$link = mysql_connect("localhost", "root", "mohammad");
mysql_select_db('corpus', $link);
$result = mysql_query("select root from WORD group by root") or die('Query failed: ' . mysql_error());
echo '{"roots":[';
$isfirst = true;
while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
	if ($line['root'] != NULL) {
		if (!$isfirst)
			echo ",";
		echo "\t{". '"root":"' . $line['root'] . '"' . "," . ' "persian":"'. to_persian($line['root']) .'"}';
		$isfirst = false;
	}
}
echo "]}";

mysql_free_result($result);
mysql_close($link);
?>
