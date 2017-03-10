<?php
session_start();
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
    case 'login':
        if(!isset($_POST['phone']) || !isset($_POST['pwd']))
        {
            $back=array("code"=>2,"msg"=>"no phone number or password");
            die(json_encode($back));
        }
        $phone=$_POST['phone'];
        $pwd=$_POST['pwd'];
        $res=$user->Login($phone, $pwd);
        if($res==-1)
        {
            $back=array("code"=>0,"msg"=>"Already Logined");
            echo json_encode($back);
        }elseif($res==0)
        {
             $back=array("code"=>2,"msg"=>"Wrong phone number or pwd");
             echo json_encode($back);
        }elseif($res==1)
        {
            $back=array("code"=>1,"msg"=>"login success");
            $back['info']=array("id"=> userlogin::$id,"username"=> userlogin::$username,"phone"=>userlogin::$phone,"admin"=> userlogin::$admin);
            echo json_encode($back);
        }elseif($res==2)
        {
            $back=array("code"=>3,"msg"=>"No This User");
             echo json_encode($back);
        }
        break;
    case "logout":
        $user->Logout();
        $back=array("code"=>1,"logout"=>1,"msg"=>"Success");
        echo json_encode($back);
        break;
    case "simislogin":
        $res=$user->IsLogin();
        if($res==1)
        {
            $back=array("code"=>1,"islogin"=>1,"msg"=>"Logined");
            echo json_encode($back);
        }else{
             $back=array("code"=>0,"islogin"=>0,"msg"=>"NOT Logined");
             echo json_encode($back);
        }
        break;
    case "islogin":   //GetInfor
        $res=$user->GetInfo();
        if($res==1)
        {
            $back=array("code"=>1,"msg"=>"Logined");
            $back['info']=array("id"=> userlogin::$id,"username"=> userlogin::$username,"phone"=>userlogin::$phone,"admin"=> userlogin::$admin);
             echo json_encode($back);
        }else{
            $back=array("code"=>0,"msg"=>"Not Login");
            echo json_encode($back);
            break;
        }
        break;
    case "signup":
        if(!isset($_POST['username']) || !isset($_POST['phone']) || !isset($_POST['pwd']) || !isset($_POST['code']))
        {
            $json=array("code"=>-4,"msg"=>"Information not compeleted");
            die(json_encode($json));
        }
        $username=$_POST['username'];
        $pwd=$_POST['pwd'];
        $phone=$_POST['phone'];
        $veri=$_POST['code'];
        if(isset($_SESSION['verifycodet']))
        {
            if(time()-$_SESSION['verifycodet']>300)
            {
                $json=array("code"=>2,"msg"=>"code time wo koete");
                die(json_encode($json));
            }else{
                if($veri!=$_SESSION['verifycode'])
                {
                      $json=array("code"=>3,"msg"=>"invalid code");
                       die(json_encode($json));
                }
            }
        }else{
             $json=array("code"=>3,"msg"=>"invalid code");
             die(json_encode($json));
        }
         
         
        if($phone!=$_SESSION['vnumber'])
        {
            $json=array("code"=>4,"msg"=>"invalid code and number");
             die(json_encode($json));
        }
         
        $res=$user->Signup($username, $pwd, $phone);
        if($res==-3)
        {
           $json=array("code"=>-3,"msg"=>"Exists same username");
           die(json_encode($json));
       }
       if($res==-2)
       {
           $json=array("code"=>-2,"msg"=>"Exists same phone number");
           die(json_encode($json));
       }
       /**
       if($res==-1)
       {
           $json=array("code"=>-1,"msg"=>"Exists same email");
           die(json_encode($json));
       }
        * 
        */
        if($res==0)
       {
           $json=array("code"=>0,"msg"=>"Can't Write to Database");
           die(json_encode($json));
       }
        if($res==1)
       {
           $json=array("code"=>1,"msg"=>"Success");
           die(json_encode($json));
       }
       break;
    case "verify":
        if(!isset($_POST['number']))
        {
             $json=array("code"=>-2,"msg"=>"NO PHONE NUMBER");
            die(json_encode($json));
        }
        $phone=$_POST['number'];
        $res=$user->GetVeriyCode($phone);
        if($res==-1)
        {
            $json=array("code"=>-1,"msg"=>"TIME LIMIT");
            die(json_encode($json));
        }elseif($res==0)
        {
            $json=array("code"=>0,"msg"=>"SENT ERROR");
            die(json_encode($json));
        }elseif($res==1){
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