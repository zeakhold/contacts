<?php
ob_start();
/**
if(!isset($_POST['cmd']) || trim($_POST['cmd'])=="")
{
     $back=array("code"=>-5,"msg"=>"no command string");
    die(json_encode($back));
}
**/
$cmd=$_POST['cmd'];
require("classcontact.php");
require("userlogin.php");
$user=new userlogin;
if(!isset($_POST['check']) || trim($_POST['check'])=="")
{
	if($user->IsLogin()==0)
	{
		$json=array("code"=>-6,"msg"=>"not login");
		die(json_encode($json));
	}else
	{
		$json=array("code"=>1,"msg"=>"logined");
		die(json_encode($json));
	}
}
$user->Xu();

if(!isset($_POST['check']) || trim($_POST['check'])=="")
{
	exit;
}
$con=new mycontact($_SESSION['id']);
$result=$con->ListAll();
header("Content-Type: application/vnd.ms-excel; charset=utf-8");
header("Content-Disposition:filename=contacts.csv");
header("Pragma: no-cache");
header("Expires: 0");
header("Cache-control:must-revalidate,post-check=0,pre-check=0");
ob_end_flush();
/**
echo "序号\t";
echo "姓名\t";
echo "手机号\t";
echo "QQ\t";
echo "Email\t";
echo "住址\t";
echo "公司\t";
echo "分组\t\n";
**/
echo iconv('utf-8','gb2312',"序号,姓名,手机号,QQ,Email,住址,公司,分组\n");
$info=$result['info'];
foreach($info as $tmp1)
{
	foreach($tmp1 as $tmp2=>$tmp3)
	{
		if($tmp2!="id" && $tmp2!="userid" && $tmp2!="fenzu" && $tmp2!="salt")
			echo iconv('utf-8','gb2312',$tmp3).",";
	}
	echo "\n";
}
?>