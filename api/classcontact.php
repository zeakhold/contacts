<?php
session_start();
class mycontact
{
    public $id;
    public $userid;
    public $name;
    public $tele;
    public $qq;
    public $email;
    public $addr;
    public $comp;
    public $fenzu;
    public $cuid;
    function __construct($uid) {
       $this->userid=$uid;
    }
    public function GetOneInfo($id)
    {
         require("config.php");
         $id=(int)$id;
       @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
       if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
       $kotoba="SELECT * FROM $qianzhui"."connect WHERE id=".$id.";";
       $res=$dbres->query($kotoba);
       if(mysqli_num_rows($res)==0)
       {
           $this->id=-1;
           $dbres->close();
           return 0;
       }
       $result= mysqli_fetch_assoc($res);
       $this->id=$result['id'];
       $this->cuid=$result['userid'];
       $this->name=$result['name'];
       $this->tele=$result['tele'];
       $this->qq=$result['qq'];
       $this->email=$result['email'];
       $this->addr=$result['addr'];
       $this->comp=$result['comp'];
       $this->fenzu=$result['fenzu'];
       $dbres->close();
       return 1;
    }
    public function AddNew($name,$tele,$qq=NULL,$email=NULL,$addr=NULL,$comp=NULL,$fenzu=0)
    {

        if($fenzu!=NULL)
        {
            require("classtag.php");
            $tag=new tag($this->userid);
            $sou=$tag->GetAllTag();
             $num=$sou["count"];
             $num++;
            $co=0;
            foreach($sou['info'] as $tmp)
            {
                if($tmp['fid']==$fenzu)
                {
                    $co=1;
                    break;
                }
             }
            if(!$co)
                return -2;
        }
       require("config.php");
       $dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
       if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
		$salt=md5(time().$this->userid);
       $kotoba="INSERT INTO $qianzhui"."connect VALUES(NULL,".$this->userid.",?,?,?,?,?,?,?,?);";
       $res=$dbres->prepare($kotoba);
       $res->bind_param("ssssssis",$name,$tele,$qq,$email,$addr,$comp,$fenzu,$salt);
       if($res->execute())
       {
		   $kotoba="SELECT id FROM $qianzhui"."connect WHERE salt='".$salt."';";
		   $sss=$dbres->query($kotoba);
			$ss=mysqli_fetch_row($sss);
           $res->close();
           $dbres->close();
           return $ss[0];
       }else{
            $res->close();
           $dbres->close();
           return 0;
       }
    }
    public function DeleteOne($id)
    {
        if(!$this->GetOneInfo($id))
            return -1;
        if($this->userid!=$this->cuid)
            return -2;
        $id=(int)$id;
        require("config.php");
        $kotoba="DELETE FROM $qianzhui"."connect WHERE id=".$id.";";
         @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
       if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
       if($dbres->query($kotoba))
           return 1;
       else
           return 0;
    }
    public Function ChangeOne($id,$name=NULL,$tele=NULL,$qq=NULL,$email=NULL,$addr=NULL,$comp=NULL,$fenzu=NULL)
    {
           if(!$this->GetOneInfo($id))
            return -1;
         if($this->userid!=$this->cuid)
            return -2;
         if($fenzu!=NULL)
        {
            require("classtag.php");
            $tag=new tag($this->userid);
            $sou=$tag->GetAllTag();
             $num=$sou["count"];
             $num++;
            $co=0;
            foreach($sou['info'] as $tmp)
            {
                if($tmp['fid']==$fenzu)
                {
                    $co=1;
                    break;
                }
             }
            if(!$co)
                return -3;
        }
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
       if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
         if($name==NULL) $name=$this->name;
         if($tele==NULL)$tele= $this->tele;
         if($qq==NULL) $qq=$this->qq;
         if($email==NULL)$email= $this->email;
         if($addr==NULL)$addr= $this->addr;
         if($comp==NULL)$comp= $this->comp;
         if($fenzu==NULL) $fenzu=$this->fenzu;
         $kotoba="UPDATE $qianzhui"."connect SET name=?,tele=?,qq=?,email=?,addr=?,comp=?,fenzu=? WHERE id=?;";
         $res=$dbres->prepare($kotoba);
         $res->bind_param("ssssssii", $name,$tele,$qq,$email,$addr,$comp,$fenzu,$id);
         if($res->execute())
        if($res->execute())
       {
           $res->close();
           $dbres->close();
           return 1;
       }else{
            $res->close();
           $dbres->close();
           return 0;
       }
    }
    public function ListAll($ye=0,$start=1)
    {
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
       $kotoba="SELECT COUNT(id) FROM $qianzhui"."connect WHERE userid='".$this->userid."';";
       $fres= mysqli_fetch_row($dbres->query($kotoba));
       if($fres[0]==0)
       {
           $result=array("code"=>1,"count"=>0);
           return $result;
       }
       if($ye!=0)
       {
           $ym=floor($fres[0]/$ye);
           if($ym-$fres[0]/$ye!=0)
               $ym++;
           if($start>$ym)
           {
                $result=array("code"=>0,"count"=>0,"msg"=>'limit wo koete');
                return $result;
           }
       }
       $kotoba="SELECT * FROM $qianzhui"."connect WHERE userid='".$this->userid."';";
       $res=$dbres->query($kotoba);
       require("classtag.php");
       $ttag=new tag($this->userid);
       $tags=$ttag->GetAllTag();
       while($info= mysqli_fetch_assoc($res))
       {
           foreach($info as $tmp=>$tmp2)
           {
               $tmp3[$tmp]=$tmp2;
               if($tmp=="fenzu")
               {
                   foreach($tags['info'] as $ttp)
                   {
                       if($tmp2==NULL)
                       {
                           $tmp3['fname']='错误分组';
                           break;
                       }
                       if($ttp['fid']==$tmp2)
                       {    $tmp3['fname']=$ttp['fname'];
                            break;    
                       }else $tmp3['fname']=NULL;
                   }
               }
           }
           $tmp4[]=$tmp3;
       }

       if($ye!=0)
       {
           $op=$start*$ye-$ye+1;
           $ed=$start*$ye;
           if($ed>$fres[0]) $ed=$fres[0];
           for($i=$op;$i<$ed+1;$i++)
           {
               $tmp5[]=$tmp4[$i-1];
           }
            $result=array("code"=>1,"count"=>(int)$fres[0],"max_page"=>$ym,"info"=>$tmp5);
            return $result;
       }
         $result=array("code"=>1,"count"=>(int)$fres[0],"info"=>$tmp4);
         return $result;
    }
    public function Search($any,$mohu=1,$fid=NULL,$ye=0,$start=1)
    {
        if($fid!=NULL)
        {
            require ("classtag.php");
            $ttag=new tag($this->userid);
            $res=$ttag->GetTagContact($fid);
        }else
            $res=$this->ListAll ();
        if($res['count']==0)
            return $res['count'];
        if($mohu)
            $kotoba="/.*".$any.".*/";
        else
            $kotoba="/^$any$/";
         $i=0;
         foreach($res['info'] as $tmp2)
         {
                if(preg_match($kotoba,$tmp2["name"]) || preg_match($kotoba,$tmp2["tele"]) ||  preg_match($kotoba,$tmp2["qq"]) || preg_match($kotoba,$tmp2["email"])
                        || preg_match($kotoba,$tmp2["addr"]) || preg_match($kotoba,$tmp2["comp"]) )
                {$saishou[]=$tmp2;$i++;}
         }
          if(!isset($saishou))
          {
              $result=array("code"=>1,"count"=>(int)$i,"info"=>null);
              return $result;
          }
          if($ye!=0)
       {
           $ym=floor($i/$ye);
           if($ym-$i/$ye!=0)
               $ym++;
           if($start>$ym)
           {
                $result=array("code"=>0,"count"=>0,"msg"=>'limit wo koete');
                return $result;
           }
       }
         if($ye!=0)
       {
           $op=$start*$ye-$ye+1;
           $ed=$start*$ye;
           if($ed>$i) $ed=$i;
           for($j=$op;$j<$ed+1;$j++)
           {
               $tmp5[]=$saishou[$j-1];
           }
            $result=array("code"=>1,"count"=>count($tmp5),"max_page"=>$ym,"info"=>$tmp5);
            return $result;
       }
         $result=array("code"=>1,"count"=>(int)$i,"info"=>$saishou);
         return $result;
    }
}

