<?php 
class DataBase {
    private $login;
    private $password;
    private $database;
    private $hostname;
    private $conn;
    
    public function DataBase() {
      $this->login    = 'root';
      $this->password = '';
      $this->database = 'UploadingFiles';
      $this->hostname = 'localhost';
      return $this;
    }

    private function getConnection(){
      $this->conn = mysqli_connect($this->hostname, $this->login, $this->password, $this->database);
    }

    public function query($query){
      $this->getConnection();
      $this->conn->query($query);
      return $this->conn;
    }

    public function reader($query){
      $this->getConnection();
      return $this->conn->query($query);
    }

    public function close()
    {
      $this->conn->close();
    }
}
?>