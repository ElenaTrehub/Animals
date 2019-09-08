"use strict"

$(document).ready(function(){

    $('#pull').click(function () {
        $('.header-nav').css('left', '0');
        $('.header-mask').css('display', 'block');
        document.getElementsByTagName("body")[0].style.overflow = 'hidden';
    });

    $('.header-mask').click(function(){
        $('.header-nav').css('left', '-200px');
        $('.header-mask').css('display', 'none');
        document.getElementsByTagName("body")[0].style.overflow = 'auto';
    });

    $(".owl-carousel").owlCarousel({
        loop:true,
        margin:50,
        nav:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:2
            },
            1000:{
                items:4
            }
        }
    });

});

