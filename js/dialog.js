var location_Lati_and_Long = new Object();

function getLocation() {//取得 經緯度
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);//有拿到位置就呼叫 showPosition 函式
    } else { 
    locationtext.innerHTML = "您的瀏覽器不支援 顯示地理位置 API ，請使用其它瀏覽器開啟 這個網址";
    }
}

function showPosition(position) {

    //first-> fly
    map.flyTo({
    center: [
    position.coords.longitude,
    position.coords.latitude],
    zoom: 17
    });

    //紀錄位置變數
    location_Lati_and_Long = position;

    var coord = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'latLng': coord }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            var locationtext = document.getElementById("location");
        // 如果有資料就會回傳
            if (results) {
                locationtext.innerHTML = "您的位置：" + "<br>" + results[0].formatted_address;
                document.getElementById("nextButton").style.visibility="visible";
            }
            else {
                locationtext.innerText = "沒有資料";
            }
        }
        // 經緯度資訊錯誤
        else {
            alert("Reverse Geocoding failed because: " + status);
            document.getElementById("dialogTitle").innerText="Reverse Geocoding failed because: " + status;
        }
    });
}

function updateUI() {
    document.getElementById("dialogTitle").innerText="您現在心情如何？";
    document.getElementById("locateButton").style.display="none";
    document.getElementById("location").style.display="none";
    document.getElementById("nextButton").style.display="none";
    document.getElementById("yButton").style.display="inline";
    document.getElementById("nButton").style.display="inline";
    document.getElementById("sendMood").style.display="block";
}

var yORn = 0; //初始化為偽
function yButtonClicked() {
    yORn = 1;
    document.getElementById("yButton").style.backgroundColor="#4CAF50";
    document.getElementById("nButton").style.backgroundColor="#ffffff";
}

function nButtonClicked() {
    yORn = 0;
    document.getElementById("nButton").style.backgroundColor="#008CBA";
    document.getElementById("yButton").style.backgroundColor="#ffffff";
}

var Moolean = class {
    constructor(location_Lati_and_Long, yORn, time) {
        this.location_Lati_and_Long = location_Lati_and_Long;
        this.yORn = yORn;
        this.time = time; //國際標準時間
    }
};

function sendMood() {
    //顯示新增Moolean光點
    var myMoolean = new Moolean(location_Lati_and_Long, yORn, new Date());
    console.log(myMoolean.time);
    //上傳firebase
    writMooleanToFirebase(myMoolean);
    //update UI
    openORclose();
    showMoodMarker(myMoolean.location_Lati_and_Long.coords.longitude, myMoolean.location_Lati_and_Long.coords.latitude, myMoolean.yORn, myMoolean.time);
    map.flyTo({
            center: [
            myMoolean.location_Lati_and_Long.coords.longitude,
            myMoolean.location_Lati_and_Long.coords.latitude],
            zoom: 15
            });
}

function writMooleanToFirebase(moolean) {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDRVy_Y6mXPUL7teOw3PfwDFks7au1Y3Nw",
        authDomain: "moolean-898a2.firebaseapp.com",
        databaseURL: "https://moolean-898a2.firebaseio.com",
        projectId: "moolean-898a2",
        storageBucket: "moolean-898a2.appspot.com",
        messagingSenderId: "852782399249"
    };
    firebase.initializeApp(config);

    firebase.database().ref(
        moolean.time.getUTCFullYear()+"/" 
        + moolean.time.getUTCMonth()+"/" 
        + moolean.time.getUTCDate()+"/" )
        .push({
            coordinates: "[" +
                moolean.location_Lati_and_Long.coords.longitude + "," +
                moolean.location_Lati_and_Long.coords.latitude +
                        "]",
            location: document.getElementById("location"),
            timestamp: moolean.time.toString(),
            yORn: moolean.yORn
        });
}

function showMoodMarker(latitude, longitude, yORn, time) {
    var singlegeojson = {
    type: 'FeatureCollection',
    features: [
    {
        type: 'Feature',
        geometry: {
        type: 'Point',
        coordinates: [latitude, longitude]
        },
        properties: {
        title: 'Mapbox',
        timestamp: time,
        yORn: yORn
        }
    }]
    };

    // add markers to map
    singlegeojson.features.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    if(yORn == 0) {
        el.className = 'markern';
    }
    else {
        el.className = 'markery';
    }

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
    });
}

var geojson = {
    type: 'FeatureCollection',
    features: [{
        type: 'Feature',
        geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
        },
        properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
        }
    },
    {
        type: 'Feature',
        geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
        },
        properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
        }
    }]
};

// add markers to map
geojson.features.forEach(function(marker) {

    // create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'markery';

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
});