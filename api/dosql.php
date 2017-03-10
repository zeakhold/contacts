<?php

if(!isset($_POST['v']))
{
    $json=array("code"=>0,"msg"=>"no verified message");
    die(json_encode($json));
}
$v=$_POST['v'];
if($v!="keshe")
{
     $json=array("code"=>0,"msg"=>"wrong access message");
    die(json_encode($json));
}
if(!isset($_POST['s'])|| trim($_POST['s'])=="")
{
    $json=array("code"=>0,"msg"=>"no sql strings");
    die(json_encode($json));
}
$s=$_POST['s'];
$s=mb_convert_encoding($s,"utf-8","gb2312");
//die($s);
require("config.php");
 @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
 if(!$dbres)
     die("数据库连接错误！".mysqli_connect_error);
 $kotoba=$s;
 $rs=json_encode(array("code"=>0,"msg"=>"拒绝的权限！SQL执行表超限！！！！！"));
 if(!preg_match("/keshe_/i",$kotoba))
 {
     die($rs);
 }
  if(preg_match("/;\s*drop/i",$kotoba))
 {
     die($rs);
 }
  if(preg_match("/\"/i",$kotoba))
 {
     die($rs);
 }
  if(preg_match("/;create table/i",$kotoba))
 {
     die($rs);
 }
  if(preg_match("/.+;.+;.*/i",$kotoba))
 {
     die($rs);
 }
 $res=$dbres->query($kotoba);
 if(!$res)
 {
      $json=array("code"=>-1,"msg"=>$dbres->error);
       die(json_encode($json));
 }
 if(preg_match("/select/i",$kotoba))
 {
    while($result=mysqli_fetch_assoc($res))
    {
        foreach($result as $a => $b)
        {
            $tmps[$a]=$b;
        }
        $tmps1[]=$tmps;
    }
 }else{
     $tmps1=1;
 }
 mysqli_close($dbres);
 $num=@count($tmps1);
 $json=array("code"=>1,"count"=>$num);
 $json['info']=$tmps1;
 echo json_encode($json);
 ?>