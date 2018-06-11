<?php
class File {
    public $Id;
    public $Name;
    public $Data;
    public $Extension;
    public $Date;

    public function File($file)
    {
        $this->Id = $file->Id;
        $this->Name = $file->Name;
        if(property_exists($file, 'Data'))
            $this->Data = $file->Data;
        $this->Extension = $file->Extension;
        $this->Date = $file->Date;
    }
}
?>