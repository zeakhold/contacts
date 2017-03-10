<?php 
require("./api/config.php");
$kotoba=array(
"user"=>
"CREATE TABLE IF NOT EXISTS $qianzhui"."user(
 id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
 username VARCHAR(20) UNIQUE NOT NULL,
 password VARCHAR(20) NOT NULL,
 phone VARCHAR(15) UNIQUE NOT NULL,
 appkey VARCHAR(33),
 admin TINYINT DEFAULT 2,
 PRIMARY KEY(id))
 ENGINE Innodb,
 CHARACTER SET utf8 COLLATE utf8_general_ci;",
 
 "fenzu"=>
 "CREATE TABLE IF NOT EXISTS $qianzhui"."fenzu(
 id INT UNSIGNED NOT NULL AUTO_INCREMENT,
 userid TINYINT UNSIGNED NOT NULL,
 fid TINYINT UNSIGNED NOT NULL,
 fname VARCHAR(30) NOT NULL,
 PRIMARY KEY(id),
 FOREIGN KEY(userid) REFERENCES $qianzhui"."user(id))
 ENGINE Innodb,
 CHARACTER SET utf8 COLLATE utf8_general_ci;",
 
 "connect"=>
 "CREATE TABLE IF NOT EXISTS $qianzhui"."connect(
 id INT UNSIGNED NOT NULL AUTO_INCREMENT,
 userid TINYINT UNSIGNED NOT NULL,
 name VARCHAR(15) NOT NULL,tele VARCHAR(111),
 qq VARCHAR(12),
 email VARCHAR(25),
 addr VARCHAR(50),
 comp VARCHAR(80),
 fenzu TINYINT,
 salt VARCHAR(33),
 PRIMARY KEY(id),
 FOREIGN KEY(userid) REFERENCES $qianzhui"."user(id))
 ENGINE Innodb,
 CHARACTER SET utf8 COLLATE utf8_general_ci;");
@$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
if(!$dbres)
	die("数据库连接错误！".mysqli_connect_error);
foreach($kotoba as $na=>$info)
{
	$shres=$dbres->query($info);
	if(!$shres) die('错误！数据表'.$na.'创建失败！'.$dbres->error);
	echo '创建'.$na.'表成功<br />';
}
mysqli_close($dbres);
?>
