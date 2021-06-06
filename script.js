// Menghubungkan Web ke Firebase API
var firebaseConfig = {
    apiKey: "AIzaSyCwrjhEFWYWW8NaLCZ0slrNbiA1NH8Ff9A",
    authDomain: "iot-testing-68dea.firebaseapp.com",
    databaseURL: "https://iot-testing-68dea-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iot-testing-68dea",
    storageBucket: "iot-testing-68dea.appspot.com",
    messagingSenderId: "69114531692",
    appId: "1:69114531692:web:98804744b536cc8ac86d49",
    measurementId: "G-MF3LXR9FDD"
};

// Inisialisasi firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// var ctx = document.getElementById('myChart').getContext('2d');


// Jquery
$(document).ready(function () {
    const suhuHTML = document.getElementById('suhuHTML'); //mengambil element dengan id suhuHTML
    const suhuStatus = document.getElementById('suhuStatus'); //mengambil element dengan id suhuHTML


    const db = firebase.database(); //inisialisasi db sebagai firebase database
    const ref = db.ref(); // mengambil referensi child node berdasarkan db
    ref.on('value', success, failed); //membaca data firebase

    function success(snapshot) {
        const datalogSuhuDB = snapshot.val().datalogSuhu;//membaca data datalogsuhu pada db
        const rtSuhuVal = snapshot.val().rtSuhu;//membaca data realtime suhu pada db
        let buttonHeaterDB = snapshot.val().buttonheater; //membaca data status logika buttonheater
        let buttonFanDB = snapshot.val().buttonfan;//membaca data status logika buttonfan
        buttonHeaterStatus(buttonHeaterDB); //mengirim data buttonheater ke function buttonHeaterStatus
        buttonFanStatus(buttonFanDB);//mengirim data buttonfan ke function buttonFanStatus
        suhuHTML.innerHTML = rtSuhuVal + ' ° C'; //mengubah nilai element suhuHTML 
        funcSuhuStatus(rtSuhuVal); //mengirim data realtime suhu ke function funcSuhuStatus

        const datalogKeys = Object.keys(datalogSuhuDB); //membaca nilai child pada datalogSuhu
        console.log(datalogKeys);


        var dtdb = db.ref('/datalogSuhu'); //mengambil nilai child pada datalogSuhu
        for (var i = 0; i < datalogKeys.length; i++) { //menampilkan data datalogSuhu pada tiap angka sesuai banyaknya child pada datalogSuhu
            var k = datalogKeys[i]; //get val
            // if (i < 24) { //membatasi child tidak lebih dari 18 jika lebih akan dikosongkon

            // }
            var suhuDatalog = datalogSuhuDB[k];
            // showData(suhuDatalog); //mengirim data datalog ke function showData
            showData(suhuDatalog);

        }

    };

    function showData(rtSuhu) { //function untuk menampilkan datalog ke html
        $('#showData').click(function (e) {
            $('.datalogList').append('<li>' + rtSuhu + '</li>'); // Menampilkan Datalog ke Element unordered list dengan class datalogList
            e.preventDefault();
        });

        $('#clearData').click(function (e) {
            $('.datalogList').empty(); // Mengosongkan li pada class datalogList
            e.preventDefault();

        });

    }
    function buttonHeaterStatus(buttonHeater) { //function untuk mengubah status button sesuai logika button
        if (buttonHeater == 1) {
            console.log('Tes button heater = 1');
            $('button#buttonHeater').text('ON');
            $('button#buttonHeater').css('backgroundColor', 'rgb(34, 167, 127)');
        }

        else {
            console.log('Tes button heater = 0')
            $('button#buttonHeater').toggleClass("off");
            $('button#buttonHeater').text('OFF');
            $('button#buttonHeater').css('backgroundColor', 'rgb(255, 115, 115)');
        }
    }

    function buttonFanStatus(buttonFan) {
        if (buttonFan == 1) {
            console.log('Tes button Fan = 1')
            $('button#buttonFan').text('ON');
            $('button#buttonFan').css('backgroundColor', 'rgb(34, 167, 127)');

        }
        else {
            console.log('Tes button Fan = 0')
            $('button#buttonFan').toggleClass("off");
            $('button#buttonFan').text('OFF');
            $('button#buttonFan').css('backgroundColor', 'rgb(255, 115, 115)');

        }
    }


    function failed() { //function ketika gagal membaca data firebase
        console.log('Gagal membaca data pada Firebase');
    };

    function funcSuhuStatus(suhuValue) { //function untuk menampilkan status kondisi air sesuai suhu yang didapat sesuai pengkondisian dibawah

        if (suhuValue <= 18) {
            suhuStatus.innerHTML = 'Sangat Dingin';
        }

        else if (suhuValue > 18 && suhuValue <= 25) {
            suhuStatus.innerHTML = 'Dingin';
        }

        else if (suhuValue > 25 && suhuValue <= 27) {
            suhuStatus.innerHTML = 'Normal';
        }

        else if (suhuValue > 27 && suhuValue <= 30) {
            suhuStatus.innerHTML = 'Sempurna';
        }
        else if (suhuValue > 30 && suhuValue <= 40) {
            suhuStatus.innerHTML = 'Panas';
        }
        else {
            suhuStatus.innerHTML = 'Terlalu Panas';
        }
    }




    $('button#buttonHeater').click(function (e) {// function click untuk button heater
        $(this).toggleClass("off");
        $button = $(this);
        if ($button.is('.off')) {
            $($button).text('OFF');
            db.ref().update({
                buttonheater: 0, //ketika off akan mengirim logika 0 ke firebase
            });
        }
        else {
            $($button).text('ON');
            db.ref().update({
                buttonheater: 1,//ketika on akan mengirim logika 1 ke firebase
            });
        }
        e.preventDefault();
    });

    $('button#buttonFan').click(function (e) { //function click untuk button fan
        $(this).toggleClass("off");//ketika button diclick akan mengaktifkan toggle untuk class on dan off
        $button = $(this);
        if ($button.is('.off')) {
            $($button).text('OFF');
            db.ref().update({
                buttonfan: 0, //ketika off akan mengirim logika 0 ke firebase
            });
        }
        else {
            $($button).text('ON');
            db.ref().update({
                buttonfan: 1, //ketika on akan mengirim logika 1 ke firebase
            });
        }
        e.preventDefault();
    });

    $('button#buttonMode').click(function (e) { //function click untuk button mode
        $(this).toggleClass("off"); //ketika button diclick akan mengaktifkan toggle untuk class on dan off
        $button = $(this);
        if ($button.is('.off')) {
            $($button).text('MANUAL');
            db.ref().update({
                mode: 0,//ketika manual akan mengirim mode logika 0 ke firebase
            });
        }
        else {
            $($button).text('AUTO');
            db.ref().update({
                mode: 1,//ketika auto akan mengirim mode logika 1 ke firebase
            });
        }
        e.preventDefault();
    });

});



