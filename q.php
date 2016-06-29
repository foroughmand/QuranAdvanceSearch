<?php
//phpinfo();
if ($q.strpos(';') === FALSE)
	die('invalid query');
$n = intval($_GET['num']);
$q = $_GET['q'];
$qq = 'select ';
for ($i=0; $i<$n; $i++) {
	$w = "w$i";
	$qq .= "$w.sure as $w"."s, $w.aye as $w"."a, $w.word as $w"."w, ";
}
$qq .= "1 ";
$qq .= 'from ';
for ($i=0; $i<$n; $i++) {
	if ($i > 0)
		$qq .= ", ";
	$qq .= "WORD as w$i";
}
$qq .= " WHERE ";
$qq .= $q . "";

//echo $qq;


$link = mysql_connect("localhost", "root", "mohammad");
mysql_select_db('corpus', $link);
$result = mysql_query($qq) or die('Query failed: ' . mysql_error());
header('Content-Type: application/json');
echo '{"n": '.$n.', "results":[';
$isfirst = true;
while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
	if (!$isfirst)
		echo ",";
	$isfirst = false;
	echo "[";
	//print_r($line);
	for ($i=0; $i<$n; $i++) {
		echo "{";
		echo '"sure" : "' . $line["w$i"."s"] . '", ';
		echo '"aye" : "' . $line["w$i"."a"] . '", ';
		echo '"word" : "' . $line["w$i"."w"] . '"';
		echo "}";
		if ($i != $n-1)
			echo ",";
	}
	echo "]\n";
}
echo "]}";

mysql_free_result($result);
mysql_close($link);

//$conn = new PDO("mysql:host=localhost;dbname=corpus", "root", "mohammad");
/*
if ($mysqli->connect_errno) {
	    printf("Connect failed: %s\n", $mysqli->connect_error);
	        exit();
}
$result = $mysqli->query($qq);
while($obj = $result->fetch_object()){ 
	$row[] = $ojb;
} 
$result->close(); 
*/



//echo json_encode($row);
?>
