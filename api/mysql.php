<?php

class Mysql
{
    public function ShellSQL($kotoba)
    {
        require("config.php");
         @$dbres=new mysqli($dbsource,$dbuser,$dbpwd,$dbname);
        if(!$dbres)
            die("数据库连接错误！".mysqli_connect_error);
        $res=$dbres->query($kotoba);
       // if(!$res)
       //     die($dbres->error);
        mysqli_close($dbres);
        return $res;
    }
}

