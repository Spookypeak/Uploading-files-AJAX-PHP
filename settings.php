<?php
abstract class Settings {
    protected $login;
    protected $password;
    protected $database;
    protected $hostname;

    public function __construct() {
        echo 'settings';
        $this->login    = 'root';
        $this->password = '';
        $this->database = 'UploadingFiles';
        $this->hostname = 'localhost:7000';
    }

    private function throwExceptionIfNotSet($argName, $argValue) {
        if (empty($argValue)) {
            throw new DatabaseException("'${argName}' not set");
        }
    }
}

?>