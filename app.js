window.onload = function () {
    //Gets DOM element whos it going to catch the files
    const fileInput = document.getElementById('file');
    //Adds onchange event listener of file input
    fileInput.addEventListener('change', function () {
        //Gets the name from filelist input
        let name = this.files[0].name;
        //Gets the extension from filelist input
        let extension = this.files[0].type;
        //Gets current datetime 
        let date = new Date();
        //Call customized ajax request sending as parameters: 
        //http verb, target url, data to send and a callback whos 
        //gets back the response from http request
        //[001] UploadFile
        getBase64(this.files[0], function (base64) {
            ajax(
                'POST',
                'http://localhost:7000/UploadingFiles/middleware.php',
                JSON.stringify({ name: name, extension: extension, date: date, data: base64, method: 'UploadFile' }),
                function () {
                    appendFile({ Id: this.response, Name: name, Extension: extension, Date: date.getTime(), Data: base64 })
                });
        });
    });
    //Checks if there's files saved in database
    //and draws it
    (function () {
        //GetFiles [003]
        getFiles();
    })();
}
//Gets and converts the file to base64
//Receives as parameters: file read from input file, a callback
function getBase64(file, call) {
    //Creates a filereader object
    let fr = new FileReader();
    //Gets through as parameter the file read from input
    fr.readAsDataURL(file);
    //Gets back data as base64 from onload event
    fr.onload = function (data) {
        //Calls callback and converts from base64 to byte array to send it at database
        call(btoa(this.result));
    }
}
//Generic HXMLHttpRequest
function ajax(method, url, data, call) {
    //Creates XMLHttpRequest object
    let request = new XMLHttpRequest();
    //Sets request timeout in milliseconds
    request.timeout = 10000;
    //Sets callback to onload eventlistener of request
    request.addEventListener('load', call);
    //Sets http verb and target
    request.open(method, url);
    //Sets common headers to it allows send and receive to explorer json datatype
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('DataType', 'json');
    //Sends request
    request.send(data);
}
//It requests if there's files existents
function getFiles() {
    ajax(
        'POST',
        'http://localhost:7000/UploadingFiles/middleware.php',
        JSON.stringify({ method: 'GetFiles' }),
        function () {
            //Converts string response to object to can manage it
            //Checks if response is not null
            if (this.response)
                //Calls drawer method
                drawFiles(JSON.parse(this.response));
        }
    );
}
//Draws files received from http request
//Gets as parameter a file array
function drawFiles(files) {
    //Gets DOM element where going to draw control files
    const filesDiv = document.getElementById('files');
    //Gets DOM element whos notices if exists files from database
    const message = document.getElementById('message');
    message.style.display = 'none';
    //Adds html controls as read file array
    files.map(function (file) {
        filesDiv.innerHTML += `
            <div id="${file.Id}" class="row">
                <div class="cell" style="width:24.5%;float:left;">${file.Name}</div>
                <div class="cell" style="width:24.5%;float:left;">${file.Date}</div>
                <div class="cell" style="width:24.5%;float:left;">${file.Extension}</div>
                <div class="cell" style="width:24.5%;float:left;">
                    <button class="button" name="load">Load file</button>
                    <a class="button" name="${file.Id}" download="${file.Name}" style="display:none;">Download file</a>
                </div>
            </div>
                `;
        //I put a return to prevent skip to next line until map function ends
        return;
    });
    //Seeks DOM element button type whos will take back itself data file
    //and later adds an onclick event to take and allow download each file
    document.getElementsByName('load').forEach((el) => {
        (el).addEventListener('click', function () {
            this.style.display = 'none';
            getFile(this.parentNode.parentNode.getAttribute('id'));
        });
    });
}
//Draws last element added to current file list
function appendFile(file) {
    //Gets DOM element whom has filelist
    const filesDiv = document.getElementById('files');
    //Gets DOM element whos notices if exists files from database
    const message = document.getElementById('message');
    message.style.display = 'none';
    //Adds only one element at current file list
    filesDiv.innerHTML += `
            <div id="${file.Id}" class="row">
                <div class="cell" style="width:24.5%;float:left;">${file.Name}</div>
                <div class="cell" style="width:24.5%;float:left;">${setTime('/Date(' + file.Date + ')/')}</div>
                <div class="cell" style="width:24.5%;float:left;">${file.Extension}</div>
                <div class="cell" style="width:24.5%;float:left;">
                    <a href="${atob(file.Data)}" class="button" name="${file.Id}" download="${file.Name}">Download file</a>
                </div>
            </div>
          `;
}
//Gets file data from clicked element in the file list
//GetFile [002]
function getFile(idFile) {
    ajax(
        'POST',
        'http://localhost:7000/UploadingFiles/middleware.php',
        JSON.stringify({ idFile: idFile, method: 'GetFile' }),
        function () {
            //Sends id and data file converted to base64 from byte array
            setFile(idFile, atob(this.response));
        }
    );
}
//Gets id and data file to setting anchor control
function setFile(idFile, file) {
    //Gets anchor control by Id
    const row = document.getElementsByName(idFile)[0];
    //Sets href attribute to allow download it
    row.setAttribute('href', file)
    //Hides button control whom made the request
    row.style.display = 'block';
}
//Converts datetime from C# format "/Date(1928374658326)/" obtained to readable format "10/06/2018 07:17"
function setTime(time) {
    let date = new Date();
    date.setTime(time.substring(6, 19));
    return `${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}/${((date.getMonth() + 1) < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}/${date.getFullYear()} ${(date.getHours() < 10) ? ('0' + date.getHours()) : date.getHours()}:${(date.getMinutes() < 10) ? ('0' + date.getMinutes()) : date.getMinutes()}`;
}