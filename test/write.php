<?php
$r = fopen("im-s-2016.json", "r");
$w = fopen("test.txt", "w+");
fwrite($w, "123");
fwrite($w, "123");
fwrite($w, "123");
echo fread($r, filesize("im-s-2016.json"));
fclose($r);
fclose($w);
?>
