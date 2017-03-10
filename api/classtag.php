<?php

class tag
{
    public $userid;
    public function __construct($uid) {
       $this->userid=$uid ;
    }
    public function GetCount()
    {
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $res=$dbres->prepare("SELECT COUNT(fid) FROM $qianzhui"."fenzu WHERE userid=?;");
        $res->bind_param("d", $this->userid);
        $res->execute();
        $result= mysqli_fetch_row($res->get_result());
        return   $result[0];
    }
    public function GetAllTag()
    {
         require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $kotoba="SELECT fid,fname FROM $qianzhui"."fenzu WHERE userid=?;";
        $res=$dbres->prepare($kotoba);
        $res->bind_param("i",$this->userid);
        $res->bind_result($fid,$fname);
        if(!$res->execute())
        {
            $result['code']=-1;
             $result['count']=0;
            $res->close();
            $dbres->close();
            return $result;
        }
        $res->store_result();
        if($res->num_rows()==0)
        {
            $result['code']=0;
            $result['count']=0;
            $res->close();
            $dbres->close();
            return $result;
        }
        while($res->fetch())
        {
            $kotoba="SELECT COUNT(id) FROM $qianzhui"."connect WHERE userid='".$this->userid."' AND fenzu='".$fid."';";
            
            $fres= mysqli_fetch_row($dbres->query($kotoba));
            $tmps[]=array("count"=>(int)$fres[0],"fid"=>$fid,"fname"=>$fname);
        }
        $result['code']=1;
        $result['count']=$res->num_rows();
        $result['info']=$tmps;
        $res->close();
        $dbres->close();
        return $result;
    }
    public function GetTagContact($fid,$ye=0,$start=1)
    {
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
       $kotoba="SELECT COUNT(id) FROM $qianzhui"."connect WHERE userid='".$this->userid."' AND fenzu='".$fid."';";
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
       $kotoba="SELECT * FROM $qianzhui"."connect WHERE userid='".$this->userid."' AND fenzu='".$fid."';";
       $res=$dbres->query($kotoba);
       $tags=$this->GetAllTag();
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
            $result=array("code"=>1,"count"=>count($tmp5),"max_page"=>$ym,"info"=>$tmp5);
            return $result;
       }
         $result=array("code"=>1,"count"=>(int)$fres[0],"info"=>$tmp4);
         return $result;
    }
    public function AddTag($tagname)
    {
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $sou=$this->GetAllTag();
        $num=$sou["count"];
        $num++;
        $co=0;
        foreach($sou['info'] as $tmp)
        {
            if($tmp['fname']==$tagname)
            {
                $co=1;
                break;
            }
        }
        if($co)
            return 0;
        $kotoba="INSERT INTO $qianzhui"."fenzu VALUES(NULL,".$this->userid.",".$num.",?);";
       
        $res=$dbres->prepare($kotoba);
        $res->bind_param("s", $tagname);
        if($res->execute())
            return 1;
        else
            return -1;
    }
    public Function DeleteTag($fid)
    {
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $sou=$this->GetAllTag();
        $num=$sou["count"];
        $num++;
        $co=0;
        foreach($sou['info'] as $tmp)
        {
            if($tmp['fid']==$fid)
            {
                $co=1;
                break;
            }
        }
        if(!$co)
            return 0;
        $kotoba="UPDATE $qianzhui"."connect SET fenzu=0 WHERE userid=".$this->userid." AND fenzu=?;";
        $res=$dbres->prepare($kotoba);
        $res->bind_param("i", $fid);
        $res->execute();
        $res->close();
        $kotoba="DELETE FROM $qianzhui"."fenzu WHERE userid=".$this->userid." AND fid=?;";
        $res=$dbres->prepare($kotoba);
        $res->bind_param("d", $fid);
        if($res->execute())
        {
            $res->close();
            $dbres->close();
            return 1;
        }else
        {
            $res->close();
            $dbres->close();
            return -1;
        }
    }
    function ChangeName($fid,$newname)
    {
        
        require("config.php");
        @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $sou=$this->GetAllTag();
        $num=$sou["count"];
        $num++;
        $co=0;
        foreach($sou['info'] as $tmp)
        {
            if($tmp['fid']==$fid)
            {
                $co=1;
                break;
            }
        }
        if(!$co)
            return -2;
        $co=0;
        foreach($sou['info'] as $tmp)
        {
            if($tmp['fname']==$newname && $tmp['fid']!=$fid)
            {
                $co=1;
                break;
            }
        }
        if($co)
            return 0;
        $kotoba="UPDATE $qianzhui"."fenzu SET fname=? WHERE userid=".$this->userid." AND fid=?;";
        $res=$dbres->prepare($kotoba);
        $res->bind_param("si", $newname,$fid);
        if($res->execute())
        {
            $res->close();
            $dbres->close();
            return 1;
        }else
        {
            $res->close();
            $dbres->close();
            return -1;
        }
    }
}

