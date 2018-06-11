<?php
require_once 'connection.php';
require_once 'file.php';

class Services{
    public function Services(){
        return $this;
    }

    public function UploadFile($name, $data, $extension, $date){
        $db = new DataBase();
        $query = "INSERT INTO Files(`Name`, `Data`, `Extension`, `Date`) VALUES('$name', '$data', '$extension', '$date')";
        $res = $db->query($query);
        echo $res->insert_id;
        $db->close();
    }

    public function GetFile($idFile)
    {
        $res;
        $db = new DataBase();
        $query = "SELECT Data FROM Files WHERE Id=$idFile";
        $reader = $db->reader($query);
        if ($row = $reader->fetch_object()) {
            $res = $row->Data;
        }
        $db->close();
        return $res;
    }

    public function GetFiles()
    {
        $res;
        $db = new DataBase();
        $query = "SELECT `Id`, `Name`, `Extension`, `Date` FROM Files";
        $reader = $db->reader($query);
        while ($row = $reader->fetch_object()) {
            $res[] = new File($row);
        }
        return (isset($res)) ? json_encode($res) : null;
    }
}
?>