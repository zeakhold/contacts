<?php

/*
 课程设计用
 */
session_start();
class userlogin {
    static $username;
    static $pwd;
    static $appkey;
    static $id;
    static $admin;
    static $phone;
    public function Login($phe,$pwd)
    {
        if($this->IsLogin())
        {
            return -1;
        }
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $phe=trim($phe);
        $phe= htmlspecialchars($phe);
        $phe= strip_tags($phe);
        $kotoba="SELECT * FROM $qianzhui"."user WHERE phone=?;";
        $chuugen=$dbres->prepare($kotoba);
        $chuugen->bind_param("s", $phe);
        $chuugen->execute();
        $tmp =$chuugen->get_result();
        if($tmp===false || $tmp->num_rows==0)
        {
            $chuugen->close();
            $dbres->close();
              //return 2;
            return 0;
        }
        $result=mysqli_fetch_assoc($tmp);
        if($pwd==$result['password'])
        {
            ini_set('session.gc_maxlifetime',14400);
            setcookie('id',$result['id'] , time()+3600);
            setcookie('verify',md5(md5($pwd)),time()+3600);
            $_SESSION['username']=$result['username'];
            $_SESSION['verify']=md5(md5($pwd));
            $_SESSION['admin']=$result['admin'];
            $_SESSION['id']=$result['id'];
            self::$id=$result['id'];
            self::$username=$result['username'];
            self::$pwd=$result['password'];
            self::$appkey=$result['appkey'];
            self::$admin=$result['admin'];
            self::$phone=$result['phone'];
            return 1;
        }else{
            return 0;
        }
    }
    public function IsLogin()
    {
        if(!isset($_COOKIE['id']))
             return 0;
         if(!isset($_COOKIE['verify']))
             return 0;
        if($_COOKIE['id']==$_SESSION['id'] && $_COOKIE['verify']==$_SESSION['verify'])
        {
            return 1;
        }
    }
    public function Xu()
    {
        if($this->IsLogin())
        {
             setcookie('id',$_SESSION['id'] , time()+3600);
             setcookie('verify',$_SESSION['verify'],time()+3600);
        }
    }
    public function Logout()
    {
        setcookie("id",'',time()-52600);
	setcookie("verify",'',time()-52600);
        if (session_id()!="" || isset($_COOKIE[session_name()]))
		setcookie(session_name(),'',time()-2592000,'/');
	session_destroy();
        self::$id='';
        self::$username='';
        self::$pwd='';
        self::$appkey='';
        self::$admin='';
        self::$phone="";
    }
    public function GetInfo()
    {
        if($this->IsLogin())
        {
            $id=$_SESSION['id'];
            require("config.php");
            @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
            if(!$dbres)
                die("数据库连接错误！".mysqli_connect_error);
            $kotoba="SELECT * FROM $qianzhui"."user WHERE id='$id'";
            $chuugen=@$dbres->query($kotoba);
            $result= mysqli_fetch_array($chuugen);
            self::$id=$result['id'];
            self::$username=$result['username'];
            self::$pwd=$result['password'];
            self::$appkey=$result['appkey'];
            self::$admin=$result['admin'];
            self::$phone=$result['phone'];
            return 1;
        }else
            return 0;
    }
      public function Anyuser($id)
    {
            require("config.php");
            @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
            if(!$dbres)
                die("数据库连接错误！".mysqli_connect_error);
            $id=trim(htmlspecialchars(strip_tags($id)));
            $kotoba="SELECT * FROM $qianzhui"."user WHERE id=?";
            $chuugen=$dbres->prepare($kotoba);
            $chuugen->bind_param("i", $id);
            $chuugen->execute();
            $tmp=$chuugen->get_result();
            $result= mysqli_fetch_assoc($tmp);
            self::$id=$result['id'];
            self::$username=$result['username'];
            self::$pwd=$result['password'];
            self::$appkey=$result['appkey'];
            self::$admin=$result['admin'];
            self::$phone=$result['phone'];
    }
    public function Signup($user,$pwd,$phone)
    {
         $user=trim(htmlspecialchars(strip_tags($user)));
         $phone=trim(htmlspecialchars(strip_tags($phone)));
         if(strpos($user,";")!==false)
                 return -3;
        if(strpos($phone,";")!==false)
                 return -2;
         require("config.php");
        require("mysql.php");
         $kotoba="SELECT * FROM $qianzhui"."user WHERE username='".$user."';";
       if($this->CheckExists($kotoba))
           return -3;
        $kotoba="SELECT * FROM $qianzhui"."user WHERE phone='".$phone."';";
       if($this->CheckExists($kotoba))
           return -2;
       $kotoba="INSERT INTO $qianzhui"."user VALUES(NULL,'".$user."','".$pwd."','".$phone."','".md5($phone)."','2');";
       $dbress=new Mysql();
       $res=$dbress->ShellSQL($kotoba);
       if(!$res)
           return 0;
       else
	   {
		   $kotoba="SELECT id FROM $qianzhui"."user WHERE appkey='".md5($phone)."';";
		   @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
		   if(!$dbres)
				die("数据库连接错误！".mysqli_connect_error);
			$ress=$dbres->query($kotoba);
			$num= mysqli_fetch_row($ress);
			$kotoba="INSERT INTO $qianzhui"."fenzu VALUES(NULL,".$num[0].",0,'未分组');";
			$dbress->ShellSQL($kotoba);
           return 1;
	   }
    }
    private function CheckExists($kotoba)
    {
         require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $res=$dbres->query($kotoba);
        $num= mysqli_num_rows($res);
        mysqli_close($dbres);
        if(!$res || $num==0)
        {
            return 0;
        }else{
            return 1;
        }
    }
    public function ChangeInfo($id,$username="",$pwd="",$phone="")
    {
        if(!$this->IsLogin())
            return -2;
        if($id!=$_SESSION['id'] && $_SESSION['admin']!=1)
            return -1;
        $this->Anyuser($id);
         $username=trim(htmlspecialchars(strip_tags($username)));
        $phone=trim(htmlspecialchars(strip_tags($phone)));
        require("config.php");
        require("mysql.php");
         if($username=="")
            $username=self::$pwd;
        if($pwd=="")
            $pwd=self::$pwd;
        if($phone=="")
            $phone=self::$phone;
        //$this->GetInfo();
         $kotoba="SELECT * FROM $qianzhui"."user WHERE username='".$username."' AND id!='".$id."';";
       if($this->CheckExists($kotoba))
           return 2;
        $kotoba="SELECT * FROM $qianzhui"."user WHERE phone='".$phone."' AND id!='".$id."';";
       if($this->CheckExists($kotoba))
           return 3;
       /**
       $kotoba="SELECT * FROM $qianzhui"."user WHERE email='".$email."' AND id!='".$id."';";
       if($this->CheckExists($kotoba))
           return 4;
        * 
        */
        $kotoba="UPDATE $qianzhui"."user SET password='".$pwd."',username='".$username."',phone='".$phone."' WHERE id='" .$id."';";
        $dbres=new Mysql;
        $res=$dbres->ShellSQL($kotoba);
        if(!$res)
            return 0;
        else
            return 1;
    }
    public function GetVeriyCode($phonenumber)
    {
        if(isset($_SESSION["verifycodet"]))
        {
            if(time()-$_SESSION["verifycodet"]<60)
                    return -1;
            else{
                    $code=rand(10000,99999);
                    $naiyou="【广工天协】欢迎您注册课设通讯录，您的验证码为:".$code."，五分钟内有效。";
                    $url="http://tui3.com/api/send/?k=短信密钥&r=json&p=1id&t=".$phonenumber."&c=".$naiyou;
                    $res= GetURL($url,1);
                    $k= json_decode($res);
                    if($k->err_code==0)
                    {
                            $_SESSION["verifycodet"]=time();
                            $_SESSION["verifycode"]=$code;
                            $_SESSION['vnumber']=$phonenumber;
                            return 1;
                    }
                    else
                        return 0;
            }
        }else{
            $code=rand(10000,99999);
            $naiyou="【广工天协】欢迎您注册课设云端通讯录，您的验证码为:".$code."，五分钟内有效。";
            $url="http://tui3.com/api/send/?k=yourkey&r=json&p=1id&t=".$phonenumber."&c=".$naiyou;
            $res= GetURL($url,1);
             $k= json_decode($res);
            if($k->err_code==0)
            {
                   $_SESSION["verifycodet"]=time();
                    $_SESSION["verifycode"]=$code;
                    $_SESSION['vnumber']=$phonenumber;
                    return 1;
            }
             else
               return 0;
        }
    }
}
function GetURL($url,$usecurl=1,$gzip=-1) //GET curl&file_get_contents
{
	@trigger_error('520', E_USER_NOTICE);  
	if ($usecurl==1)
	{
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_HEADER, 0);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		$data = curl_exec($curl);
		curl_close($curl);
		$output=$data;
		$error=error_get_last();
		if($error['message']!='520')
			die("URL检索错误！请检查链接是否正确！url=$url");
	}else{
		$output=file_get_contents($url);
		$error=error_get_last();
		if($error['message']!='520')
			die("URL检索错误！请检查链接是否正确 信息=".$error['message']."url=$url");
	}
	if($gzip>0){
		$output=gzinflate(substr($output,$gzip));
	}elseif($gzip==0){
		//die ("$url");
		$output=gzinflate($output);
	}
	return $output;
}
?>