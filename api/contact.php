<?php
//header("Access-Control-Allow-Origin: *"); 
//header("Access-Control-Allow-Credentials : true"); //临时跨域
if(!isset($_POST['cmd']) || trim($_POST['cmd'])=="")
{
     $back=array("code"=>-5,"msg"=>"no command string");
    die(json_encode($back));
}
$cmd=$_POST['cmd'];
require("classcontact.php");
require("userlogin.php");
$user=new userlogin;
if($user->IsLogin()==0)
{
    $json=array("code"=>-6,"msg"=>"not login");
    die(json_encode($json));
}
$user->Xu();
$con=new mycontact($_SESSION['id']);
switch($cmd)
{
    case "add":
         if(!isset($_POST['name']) || !isset($_POST['phone']))
        {
              $json=array("code"=>-2,"msg"=>"No name or phone number");
                die(json_encode($json));
        }
        $name=$_POST['name'];
        $tele=$_POST['phone'];
       if(!isset($_POST['qq'])) $qq=NULL;else $qq=$_POST['qq'];
       if(!isset($_POST['email'])) $email=NULL;else $email=$_POST['email'];
       if(!isset($_POST['addr'])) $addr=NULL;else $addr=$_POST['addr'];
       if(!isset($_POST['comp'])) $comp=NULL;else $comp=$_POST['comp'];
       if(!isset($_POST['fenzu'])) $fenzu=NULL;else $fenzu=$_POST['fenzu'];
       $res=$con->AddNew($name, $tele, $qq, $email, $addr, $comp, $fenzu);
       if($res==-2)
       {
            $json=array("code"=>-1,"msg"=>"No EXISTS FENZU");
           die(json_encode($json));
       }
        if($res==0)
       {
            $json=array("code"=>0,"msg"=>"DATA BASE ERROR");
           die(json_encode($json));
       }
        if($res>=1)
       {
            $json=array("code"=>1,"msg"=>"SUCCESS","id"=>$res);
           die(json_encode($json));
       }
       break;
    case 'change':
        if(!isset($_POST['id']))
        {
              $json=array("code"=>-2,"msg"=>"No contact id");
                die(json_encode($json));
        }
        $id=$_POST['id'];
        if(!isset($_POST['name'])) $name=NULL;else $qq=$_POST['name'];
        if(!isset($_POST['phone'])) $tele=NULL;else $tele=$_POST['phone'];
       if(!isset($_POST['qq'])) $qq=NULL;else $qq=$_POST['qq'];
       if(!isset($_POST['email'])) $email=NULL;else $email=$_POST['email'];
       if(!isset($_POST['addr'])) $addr=NULL;else $addr=$_POST['addr'];
       if(!isset($_POST['comp'])) $comp=NULL;else $comp=$_POST['comp'];
       if(!isset($_POST['fenzu'])) $fenzu=NULL;else $fenzu=$_POST['fenzu'];
       $res=$con->ChangeOne($id,$name, $tele, $qq, $email, $addr, $comp, $fenzu);
       if($res==-1)
       {
            $json=array("code"=>-1,"msg"=>"No EXISTS this one");
           die(json_encode($json));
       }
        if($res==-2)
       {
            $json=array("code"=>-2,"msg"=>"no admin");
           die(json_encode($json));
       }
        if($res==-3)
       {
            $json=array("code"=>-3,"msg"=>"no same fenzu");
           die(json_encode($json));
       }
       if($res==0)
       {
            $json=array("code"=>0,"msg"=>"DATA BASE ERROR");
           die(json_encode($json));
       }
        if($res==1)
       {
            $json=array("code"=>1,"msg"=>"SUCCESS");
           die(json_encode($json));
       }
       break;
    case 'delete':
         if(!isset($_POST['id']))
        {
              $json=array("code"=>-4,"msg"=>"No contact id");
                die(json_encode($json));
        }
        $id=$_POST['id'];
         $res=$con->DeleteOne($id);
       if($res==-1)
       {
            $json=array("code"=>-1,"msg"=>"No EXISTS this one");
           die(json_encode($json));
       }
        if($res==-2)
       {
            $json=array("code"=>-2,"msg"=>"no admin");
           die(json_encode($json));
       }
        if($res==0)
       {
            $json=array("code"=>0,"msg"=>"DATA BASE ERROR");
           die(json_encode($json));
       }
        if($res==1)
       {
            $json=array("code"=>1,"msg"=>"SUCCESS");
           die(json_encode($json));
       }
       break;
    case "list":
          if(!isset($_POST["num"]))
             $num=0;
         else
             $num=(int)$_POST["num"];
         if(!isset($_POST['page']))
            $st=1;
         else
             $st=(int)($_POST['page']);
         $result=$con->ListAll($num, $st);
         die(json_encode($result));
         break;
    case "getone":
          if(!isset($_POST['id']))
        {
              $json=array("code"=>-4,"msg"=>"No contact id");
                die(json_encode($json));
        }
        $id=$_POST['id'];
        if(!$con->GetOneInfo($id))
        {
            $json=array("code"=>-1,"msg"=>"database error");
            die(json_encode($json));
        }
         if($con->userid!=$con->cuid)
         {
              $json=array("code"=>-2,"msg"=>"no admin");
           die(json_encode($json));
         }
         $tmp["id"]=$con->id;$tmp['name']=$con->name;$tmp['tele']=$con->tele;$tmp['qq']=$con->qq;$tmp['email']=$con->email;
         $tmp['addr']=$con->addr;$tmp['comp']=$con->comp;$tmp['fenzu']=$con->fenzu;
          $json=array("code"=>1,"msg"=>"SUCCESS","info"=>$tmp);
           die(json_encode($json));
         break;
    case 'search':
        if(!isset($_POST['any']))
        {
              $json=array("code"=>-2,"msg"=>"No contact any");
                die(json_encode($json));
        }
         if(!isset($_POST["num"]))
             $num=0;
         else
             $num=(int)$_POST["num"];
         if(!isset($_POST['page']))
            $st=1;
         else
             $st=(int)($_POST['page']);
         if(!isset($_POST["mohu"]))
             $mohu=1;
         else
             $num=(int)$_POST["mohu"];
         if(!isset($_POST["fid"]))
             $fid=NULL;
         else
             $fid=(int)$_POST["fid"];
         $any=$_POST['any'];
         $result=$con->Search($any, $mohu, $fid, $num, $st);
         echo json_encode($result);
         break;
   default:
          $json=array("code"=>-4,"msg"=>"wrong cmd");
        die(json_encode($json));
        break;
}
?>

