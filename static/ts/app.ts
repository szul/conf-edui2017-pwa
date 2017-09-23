/// <reference path="../../node_modules/metronical.metron/dist/gen/metron.d.ts" />
metron.onready(() => {

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log(pos.coords.latitude);
            console.log(pos.coords.latitude);
        });
        let w = navigator.geolocation.watchPosition((pos) => {
            console.log(pos.coords.latitude);
            console.log(pos.coords.latitude);
        });
        navigator.geolocation.clearWatch(w);
    }
    navigator.getUserMedia = (<any>navigator).getUserMedia || (<any>navigator).webkitGetUserMedia || (<any>navigator).mozGetUserMedia || (<any>navigator).msGetUserMedia;
    var video = document.querySelector('video');
    
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true, video: true}, (s) => {
           console.log(s);
        }, (e) => {
            console.log(e);
        });
    }
});
