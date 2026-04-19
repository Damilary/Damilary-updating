/*------------------------------------------------------------------
Project:        Damilary typewriter - by Damilary.com
Version:        1.0
Last change:    27/12/2022
Author:         Damilary Cre8tive Concept
URL:            https://damilary.com
License:        https://damilary.com/pages/license
-------------------------------------------------------------------*/
const TypeWriter = function (txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    const waitInt = parseInt(wait, 10);
    this.wait = isNaN(waitInt) ? 3000 : waitInt;
    this.type();
    this.isDeleting = false;
}

// Type Method
TypeWriter.prototype.type = function () {
    // Current index of word
    const current = this.wordIndex % this.words.length;
    // Get full text of current word
    const fullTxt = this.words[current];

    // Check if deleting
    if (this.isDeleting) {
        // Remove char
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        // Add char
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert txt into element
    const span = document.createElement('span');
    span.className = 'txt';
    span.textContent = this.txt;
    this.txtElement.textContent = '';
    this.txtElement.appendChild(span);

    // Initial Type Speed
    let typeSpeed = 300;

    if (this.isDeleting) {
        typeSpeed /= 2;
    }

    // If word is complete
    if (!this.isDeleting && this.txt === fullTxt) {
        // Make pause at end
        typeSpeed = this.wait;
        // Set delete to true
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        // Move to next word
        this.wordIndex++;
        // Pause before start typing
        typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
}



// Init On DOM Load
document.addEventListener('DOMContentLoaded', init);

// Init App
function init() {
    const txtElement = document.querySelector('.txt-type');
    if (!txtElement) return;

    let words;
    try {
        words = JSON.parse(txtElement.getAttribute('data-words'));
    } catch (e) {
        words = ["The Developer", "The Designer", "The Creator"];
    }

    if (!Array.isArray(words)) {
        words = ["The Developer", "The Designer", "The Creator"];
    }

    const waitAttr = txtElement.getAttribute('data-wait');
    const wait = waitAttr ? parseInt(waitAttr, 10) : 3000;

    // Init TypeWriter
    new TypeWriter(txtElement, words, isNaN(wait) ? 3000 : wait);
}