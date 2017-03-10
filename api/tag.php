<?php
//header("Access-Control-Allow-Origin: *"); 
//header("Access-Control-Allow-Credentials : true"); //临时跨域
if(!isset($_POST['cmd']) || trim($_POST['cmd'])=="")
{
     $back=array("code"=>-5,"msg"=>"no command string");
    die(json_encode($back));
}
$cmd=$_POST['cmd'];
require("classtag.php");
require("userlogin.php");
$user=new userlogin;
if($user->IsLogin()==0)
{
    $json=array("code"=>-6,"msg"=>"not login");
    die(json_encode($json));
}
$user->Xu();
$tag=new tag($_SESSION['id']);
switch($cmd)
{
    case "add":
        if(!isset($_POST['name']))
        {
              $json=array("code"=>-2,"msg"=>"No Tagname");
                die(json_encode($json));
        }
            $tagname=$_POST['name'];
            $res=$tag->AddTag($tagname);
            if($res==0)
            {
                $json=array("code"=>-1,"msg"=>"Already Exists Same Tagname");
                die(json_encode($json));
            }
             if($res==-1)
            {
                $json=array("code"=>0,"msg"=>"Database Error");
                die(json_encode($json));
            }
             if($res==1)
            {
                $json=array("code"=>1,"msg"=>"Success");
                die(json_encode($json));
            }
        break;
    case "delete":
          if(!isset($_POST['id']))
        {
              $json=array("code"=>-2,"msg"=>"No Tagid");
                die(json_encode($json));
        }
         $tagid=$_POST['id'];
         $res=$tag->DeleteTag($tagid);
         if($res==0)
            {
                $json=array("code"=>-1,"msg"=>"Not Exists Tagid");
                die(json_encode($json));
            }
             if($res==-1)
            {
                $json=array("code"=>0,"msg"=>"Database Error");
                die(json_encode($json));
            }
             if($res==1)
            {
                $json=array("code"=>1,"msg"=>"Success");
                die(json_encode($json));
            }
        break;
    case "change":
           if(!isset($_POST['name']) || !isset($_POST['id']))
        {
              $json=array("code"=>-3,"msg"=>"No Tagname or Tagid");
                die(json_encode($json));
        }
          $tagname=$_POST['name'];
          $tagid=$_POST['id'];
          $res=$tag->ChangeName($tagid, $tagname);
          if($res==-2)
            {
                $json=array("code"=>-2,"msg"=>"No Same Tagid");
                die(json_encode($json));
            }
           if($res==0)
            {
                $json=array("code"=>-1,"msg"=>"Already Exists Same Tagname");
                die(json_encode($json));
            }
             if($res==-1)
            {
                $json=array("code"=>0,"msg"=>"Database Error");
                die(json_encode($json));
            }
             if($res==1)
            {
                $json=array("code"=>1,"msg"=>"Success");
                die(json_encode($json));
            }
        break;
    case "tagcontact":
          if(!isset($_POST['id']))
        {
              $json=array("code"=>-2,"msg"=>"No Tagid");
                die(json_encode($json));
        }
         $tagid=$_POST['id'];
         if(!isset($_POST["num"]))
             $num=0;
         else
             $num=(int)$_POST["num"];
         if(!isset($_POST['page']))
            $st=1;
         else
             $st=(int)($_POST['page']);
         $result=$tag->GetTagContact($tagid, $num, $st);
         die(json_encode($result));
         break;
    case "getalltag":
        $result=$tag->GetAllTag();
         die(json_encode($result));
         break;
    case "count";
        $res=$tag->GetCount();
         $json=array("code"=>1,"count"=>(int)$res);
        die(json_encode($json));
        break;
    default:
          $json=array("code"=>-4,"msg"=>"wrong cmd");
        die(json_encode($json));
        break;
}
?>