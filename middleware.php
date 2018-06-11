<?php
require_once 'services.php';

//Gets parameters as json format
$params =  json_decode(file_get_contents('php://input',true));

if($params){    //Checks if parameters are not null
    if($method = $params->method)   
        if(function_exists($method))    //Checks if function name exists
         $method($params);  //Calls to method through of received method name
}
    
//This method is called when client-side makes a file uploading
//Search in app.js file with id [001]
function UploadFile($params){
    $srv = new Services();
    $srv->UploadFile($params->name, $params->data, $params->extension, $params->date);
}

//This method sends to client-side only data file requested by id
//Search in app.js file with id [002]
function GetFile($params)
{
    $srv = new Services();
    echo $srv->GetFile($params->idFile);
}

//This method sends to client-side a file list to draw the table
//Search in app.js file with id [003]
function GetFiles()
{
    $srv = new Services();
    echo $srv->GetFiles();
}
?>