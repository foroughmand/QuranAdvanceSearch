<?php
include("inc.php");
header('Content-Type: application/json');

$link = db_connect();
$result = mysql_query("select lem from WORD group by lem") or die('Query failed: ' . mysql_error());
echo '{"lems":[';
$isfirst = true;
while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
	if ($line['lem'] != NULL) {
		if (!$isfirst)
			echo ",";
		echo "\t{". '"lem":"' . $line['lem'] . '"' . "," . ' "persian":"'. to_persian($line['lem']) .'"}';
		$isfirst = false;
	}
}
echo "]}";

mysql_free_result($result);
mysql_close($link);
?>
