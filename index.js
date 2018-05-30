const API_KEY = "AIzaSyA-SzJddoiSg2Rq6C45hY0O5yec0q7bEjQ";
const NY_CRIME = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?$where=cmplnt_fr_dt=\"2015-12-31T00:00:00.000\"&$limit=1000";
const NEIGH_NAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const BUILDING_DATA ="https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
const GEO_POS = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";


var infoBuilsRow = [];
var cont = [];
var infoCrimeRows = [];
var geo_posRows = [];
var map;
var boro_marker = []
var boro_coordinates = [];
var NYU_coordinates= {lat:40.729584, lng:-73.995935}
var asd_marker;
var asd_coordinates = {lat:40.712229008, lng:-73.986835479 }
//var asd = new google.maps.LatLng(40.712229008, -73.986835479);
var NYU_marker;//-73.993360067,40.719077749
var directionsService;
var directionsRenderer;
var polygon;
var randomCol;
var colo = [];
var ale = ['green','blue','red','yellow'];
var arr_lat = [];
var arr_long = [];

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: NYU_coordinates
        });
        console.log(NYU_coordinates);
        NYU_marker = new google.maps.Marker({
          position: NYU_coordinates,
          map: map
        });
       asd_marker = new google.maps.Marker({
          position: asd_coordinates,
          map: map
       });
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer();
        markerEvents(NYU_marker);

        map.data.loadGeoJson(
            'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');


        map.data.setStyle(function(feature){
            var color = randomCol();
            return {fillColor: color,
            strokeWeight: 1,
            fillOpacity : 0.3 };

        })
      }
function markerEvents(marker){
  if(marker != "undefined"){
    marker.addListener("click",function(){
      getRoute();
    });
  }
}
function getRoute(){
  var request =  {
    origin: ny_marker.position,
    destination: bro_marker.position,
    travelMode: 'DRIVING'
  }
  directionsRenderer.setMap(map);
  directionsService.route(request,function(result,status){
    if (status == "OK") {
      directionsRenderer.setDirections(result);
    }
  });
}
function drawPolygon(polygon, color){
  polygon = new google.maps.Polygon({
  paths: triangleCoords,
  strokeColor: color,
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: color,
  fillOpacity: 0.35
});
polygon.setMap(map);
}
function randomCol(){
  hex = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F")
  for (var i = 0; i < 7; i++) {
    randomCo = "#";
    for (var j = 0; j < 6; j++) {
      pos = random(0,hex.length);
      randomCo += hex[pos]
    }
    colo.push(randomCo);
  }

  return colo[Math.floor(Math.random() * colo.length)];
}
function random(inferior,superior){
   numPosibilidades = superior - inferior
   aleat = Math.random() * numPosibilidades
   aleat = Math.floor(aleat)
   return parseInt(inferior) + aleat
}
function getData(){
  var data_crime = $.get(NY_CRIME, function(){})
//  var data = $.get(NY_CRIMES,function(){})
  var pos = $.get(GEO_POS, function(){})
    .done(function(){
      document.getElementById('titulo').innerHTML = 'CRIMES';
      document.getElementById('tit1').innerHTML = 'Borough';
      document.getElementById('tit2').innerHTML = 'Hour';
      document.getElementById('tit3').innerHTML = 'Type of Crime';
     console.log(data_crime);
    var data_CrimeRow = data_crime.responseJSON;
    console.log(data_CrimeRow);
    var parse_pos = JSON.parse(pos.responseText);
    var posRow = parse_pos.features;
    console.log(posRow);
    for (var i = 0; i < data_CrimeRow.length; i++) {
      if (data_CrimeRow[i].lat_lon != null) {
        infoCrimeRows.push([data_CrimeRow[i].boro_nm,data_CrimeRow[i].cmplnt_fr_tm,data_CrimeRow[i].ofns_desc]);
      }
    }
   console.log(infoCrimeRows);
    var arreglo = arr_coord(posRow);
    if (data_CrimeRow[0].lat_lon == null) {
    }
    var a = 40.6979087;
    var b = -73.93550784;
    var cont = 0;
    for (var i = 0; i < arr_lat.length; i++) {
      if (arr_lat[i].length >= 32) {
        if (a >= arr_lat[i][0] && a <= arr_lat[i][arr_lat[i].length-1]) {
          if (b <= arr_long[i][0] && b >= arr_long[i][arr_long[i].length-1]) {
            cont += 1;
          }
        }
      }
    }
    var tableReference = $("#tableBody")[0];
    var newRow,CrimeNumber,District,Value;
    console.log(tableReference.rows.length);

    for (var i = 0; i < tableReference.rows.length; i++) {
      tableReference.deleteRow(i);
      i--;
    }
    for (var j = 0; j < infoCrimeRows.length; j++) {
      newRow = tableReference.insertRow(tableReference.rows.length);
      CrimeNumber = newRow.insertCell();
      District = newRow.insertCell();
      Value = newRow.insertCell();
      CrimeNumber.innerHTML = infoCrimeRows[j][0];
      District.innerHTML = infoCrimeRows[j][1];
      Value.innerHTML = infoCrimeRows[j][2];
    }
    for (var i = 1; i <= posRow.length; i++) {
      //console.log(posRow[i].geometry.coordinates);
      if (data_crime[i] != null) {
        var dir = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(data_CrimeRow[i].lat_lon.coordinates[1], data_CrimeRow[i].lat_lon.coordinates[0]), posRow[i])

      }
    //  var qwe = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(data_CrimeRow.lat_lon.coordinates[1], data_CrimeRow[i].lat_lon[0][0]), posRow[1])
      console.log(dir);
    }
    })
    .fail(function(error){
      console.log(error);
    })
}

function get_houses(){
  var data_build = $.get(BUILDING_DATA, function(){})
  .done(function(){
    console.log(data_build);
    var data_buildRow = data_build.responseJSON.data;
    console.log(data_buildRow);
    document.getElementById('tit1').innerHTML = 'Borough';
    document.getElementById('tit2').innerHTML = 'NumberDistrict';
    document.getElementById('tit3').innerHTML = 'State';
    for (var i = 0; i < data_buildRow.length; i++) {
      infoBuilsRow.push([data_buildRow[i][15], data_buildRow[i][19], data_buildRow[i][28]]);
    }
    console.log(infoBuilsRow);

    var tableReference = $("#tableBody")[0];
    tableReference.delete;
    var newRow,Borough,District,State;
    for (var i = 0; i < tableReference.rows.length; i++) {
      tableReference.deleteRow(i);
      i--;
    }
    for (var j = 0; j < infoBuilsRow.length; j++) {
      newRow = tableReference.insertRow(tableReference.rows.length);
      Borough = newRow.insertCell();
      District = newRow.insertCell();
      State = newRow.insertCell();
      Borough.innerHTML = infoBuilsRow[j][0];
      District.innerHTML = infoBuilsRow[j][1];
      State.innerHTML = infoBuilsRow[j][2];
    }
    ranking(infoBuilsRow);
    console.log(cont);
  //  rankingHouse();
  })
  .fail(function(error){
    console.log(error);
  })
}

function ranking(infoBuilsRow){
  var z = 0;
//  cont.push["hola",0];
//  console.log(cont);
  console.log(document.getElementById('tableBody').rows.length);
  for (var i = 0; i < document.getElementById('tableBody').rows.length; i++) {
    //console.log(document.getElementById('tableBody').rows[i].cells[1].innerHTML);
    //console.log(cont.length);
    if (cont.length == 0) {
      cont.push([document.getElementById('tableBody').rows[i].cells[1].innerHTML,0]);
    }
    //console.log(cont);
    //console.log(cont[i]);
    var cont1 = 0;
    var a = -1
    while (cont1 < cont.length && a == -1) {
      //console.log("entro");
     //console.log(cont[cont1][0]);
      a = cont[cont1][0].indexOf(document.getElementById('tableBody').rows[i].cells[1].innerHTML);
      if (a == -1) {
        cont1++;
      }
    }
    if (a == 0) {
      cont[cont1][1]++;
    }else {
      //console.log(cont[i][0]);
      z++;
      cont.push([document.getElementById('tableBody').rows[i].cells[1].innerHTML,1]);
    }
  }
}

function rankingHouse(){
  for (var i = 0; i < cont.length-1; i++) {
    for (var j = 0; j < cont.length-i; j++) {
      try {
        if (cont[j][1]<cont[j+1][1]) {
          var k = cont[j][1];
          var l = cont[j][0];
          cont[j][1] = cont[j+1][1];
          cont[j][0] = cont[j+1][0];
          cont[j+1][1] = k;
          cont[j+1][0] = l;
        }
      } catch (e) {
      }
    }
  }
  console.log(cont);
  var tableReference = $("#tableBodyR")[0];
  tableReference.delete;
  var newRow,District,Quantity;
  for (var i = 0; i < tableReference.rows.length; i++) {
    tableReference.deleteRow(i);
    i--;
  }
  for (var j = 0; j < 10; j++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    District = newRow.insertCell();
    Quantity = newRow.insertCell();
    District.innerHTML = cont[j][0];
    Quantity.innerHTML = cont[j][1];
  }
}
/*function updateChar(){
  var svg = d3.select("svg");
    margin = {top: 20, right: 20, bottom: 30, left:50},
    width = 1200 - margin.right - margin.left,
    height = 400 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform","translate(" + margin.left + "," margin.top ")");

}*/
function arr_coord(array_1){
  console.log(array_1);
  for (var i = 0; i < array_1.length; i++) {
    if (array_1[i].geometry.type == "Polygon") {
      geo_posRows.push(array_1[i].geometry.coordinates[0]);
    }else {
      var arr_aux = [];
        for (var j = 0; j < array_1[i].geometry.coordinates.length; j++) {
          arr_aux.push(array_1[i].geometry.coordinates[j]);
        }
        geo_posRows.push(arr_aux);
    }
  }
  console.log(geo_posRows);
  for (var i = 0; i < geo_posRows.length; i++) {
    var lat = [];
    var long = [];
    if (array_1[i].geometry.type == "Polygon") {
      for (var j = 0; j < geo_posRows[i].length; j++) {
        //------------------------------------------------------------
        lat.push(geo_posRows[i][j][1]);
        long.push(geo_posRows[i][j][0]);
      }
    //  console.log(lat);
    //  console.log(long);
    }else {
      var arr_aux1 = [];
      var arr_aux2 = [];
      for (var j = 0; j < geo_posRows[i].length; j++) {
        for (var k = 0; k < geo_posRows[i][j].length; k++) {
          for (var l = 0; l < geo_posRows[i][j][k].length; l++) {
            arr_aux1.push(geo_posRows[i][j][k][l][1]);
            arr_aux2.push(geo_posRows[i][j][k][l][0]);
          }
        }
        arr_aux1.sort();
        arr_aux2.sort();
        lat.push(arr_aux1);
        long.push(arr_aux2);
        arr_aux1 = [];
        arr_aux2 = [];
      }

    }
    lat.sort();
    long.sort();
    arr_lat.push(lat);
    arr_long.push(long);
  }
  console.log(arr_lat);
  console.log(arr_long);
}

$("document").ready(function(){
  $("#getCrimeData").on("click",getData)
  $("#getBuildData").on("click", get_houses)
  $("#Ranking").on("click", rankingHouse)
  $("#exportData").click(function(){
  $("table").tableToCSV();
});

})
