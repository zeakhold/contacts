<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Credentials : true"); //临时跨域
if(!isset($_POST['cmd']) || trim($_POST['cmd'])=="")
{
     $back=array("code"=>-5,"msg"=>"no command string");
    die(json_encode($back));
}
$cmd=$_POST['cmd'];
require("userlogin.php");
$user=new userlogin;
switch($cmd)
{
      case "change":
        if(!isset($_POST['id']))
        {
            $json=array("code"=>-3,"msg"=>"no id number");
            die(json_encode($json));
        }
        $id=$_POST['id'];
       if(isset($_POST['username']))
            $username=$_POST['username'];
        else
            $username="";
        if(isset($_POST['phone']))
            $phone=$_POST['phone'];
        else
            $phone="";
        if(isset($_POST['pwd']))
            $pwd=$_POST['pwd'];
        else
            $pwd="";
        $res=$user->ChangeInfo($id,$username, $pwd, $phone);
        if($res==-2)
        {
             $json=array("code"=>-2,"msg"=>"Not Login");
             die(json_encode($json));
        }
        if($res==-1)
        {
             $json=array("code"=>-1,"msg"=>"NOT ALLOWED");
             die(json_encode($json));
        }
        if($res==0)
        {
             $json=array("code"=>0,"msg"=>"Can't Update database");
             die(json_encode($json));
        }
        /**
         if($res==4)
        {
             $json=array("code"=>4,"msg"=>"Exists same email");
             die(json_encode($json));
        }
         * 
         */
         if($res==3)
        {
             $json=array("code"=>3,"msg"=>"Exists same phone number");
             die(json_encode($json));
        }
         if($res==2)
        {
             $json=array("code"=>2,"msg"=>"Exists same username");
             die(json_encode($json));
        }
        if($res==1)
        {
             $json=array("code"=>1,"msg"=>"SUCCESS");
             die(json_encode($json));
        }
        break;
    default:
           $back=array("code"=>-5,"msg"=>"invalid command string");
            die(json_encode($back));
            break;
}
?>
