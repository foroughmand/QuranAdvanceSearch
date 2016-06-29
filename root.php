<?php
include("inc.php");

header('Content-Type: application/json');

$link = db_connect();
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
