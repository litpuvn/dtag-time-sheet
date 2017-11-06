function readTextFile(filePath)
{
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET",filePath,false);
    xmlhttp.send(null);
    var fileContent = xmlhttp.responseText;

    return csvJSON(fileContent)
}

//var csv is the CSV file with headers
function csvJSON(csv){

    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }

    //return result; //JavaScript object
    var a = JSON.stringify(result); //JSON

    return JSON.parse(a);
}