/*------------------------------------------------------------------
Project:        Damilary - by Damilary.com
Version:        3.0
Last change:    27/12/2022
Author:         Damilary Cre8tive Concept
URL:            http://damilary.com
License:        http://damilary.com/pages/license
-------------------------------------------------------------------*/

// Navigation toggle button
let header = document.querySelector("header");
let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
    navbar.classList.toggle("active");
};

// menu active styles
$(document).on('click', '.navbar li', function () {
    $(this).addClass('active').siblings().removeClass('active')
})

/* ========  Current Year ========= */
// Automatically update copyright year in the footer
var currentTime = new Date();
var year = currentTime.getFullYear();
$("#year").text(year);