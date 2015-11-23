
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    navigator.getUserMedia = navigator.getUserMedia
                            || navigator.webkitGetUserMedia
                            || navigator.mozGetUserMedia
                            || navigator.msGetUserMedia;

    var video = document.querySelector('video');
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var videoStream;

    navigator.getUserMedia({video: true, audio: true}, function(stream) {
        videoStream = stream;
        video.src = window.URL.createObjectURL(stream);
    }, function(err) {
        console.error(err);
    });

    video.addEventListener('click', function() {
        if (videoStream) {
            canvas.width = video.clientWidth;
            canvas.height = video.clientHeight;
            ctx.drawImage(video, 0, 0);
        }
    });

    var mouseDown = false;
    var lastX;
    var lastY;
    var width;

    document.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        ctx.beginPath();
        ctx.strokeStyle = document.getElementById('line-color-inp').value;
        width = document.getElementById('line-width-inp').value;
        ctx.lineWidth = width;
        lastX = evt.clientX - canvas.offsetLeft + window.scrollX;
        lastY = evt.clientY - canvas.offsetTop + window.scrollY;
        ctx.moveTo(lastX, lastY);

    });

    document.addEventListener('mousemove', function(evt) {
        if (mouseDown) {
            var currentX = evt.clientX - canvas.offsetLeft + window.scrollX;
            var currentY = evt.clientY - canvas.offsetTop + window.scrollY;
            ctx.lineWidth = Math.acos((lastX - currentX) / (lastY - currentY)) * width;
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        }
    });

    document.addEventListener('mouseup', function(evt) {
        ctx.lineTo(evt.clientX - canvas.offsetLeft + window.scrollX, evt.clientY - canvas.offsetTop + window.scrollY);
        ctx.stroke();
        mouseDown = false;
    });

    document.querySelector('#btnSnapshot').addEventListener('click', function() {
        document.querySelector('img').src = canvas.toDataURL();
    })

});

