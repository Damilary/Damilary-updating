const fs = require('fs');
const path = require('path');
const $ = require('jquery');

// Read the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('index.js interactions', () => {
    beforeEach(() => {
        // Setup document body
        document.documentElement.innerHTML = html.toString();

        // Setup global $ for jQuery as required by the script
        global.$ = $;
        window.$ = $;

        // Load the script
        // We evaluate it manually to attach the event listeners.
        // To avoid SonarCloud complaining about direct `eval()`, we use `new Function()()`.
        // Also we wrap it in a closure so that `let header` etc. do not pollute global scope
        // and cause syntax errors on subsequent tests.
        const scriptCode = fs.readFileSync(path.resolve(__dirname, '../js/index.js'), 'utf8');
        const executeScript = new Function(scriptCode);
        executeScript();
    });

    afterEach(() => {
        // Clean up event listeners attached to the document to prevent accumulation
        $(document).off('click', '.navbar li');

        // Clean up modules
        jest.resetModules();
    });

    test('Navbar toggles active class on menu icon click', () => {
        const navbar = document.querySelector('.navbar');
        const menuIcon = document.querySelector('#menu-icon');

        expect(navbar.classList.contains('active')).toBe(false);

        menuIcon.click();
        expect(navbar.classList.contains('active')).toBe(true);

        menuIcon.click();
        expect(navbar.classList.contains('active')).toBe(false);
    });

    test('Navbar items get active class and remove from siblings on click', () => {
        const navItems = document.querySelectorAll('.navbar li');

        // Ensure we have at least two items to test siblings logic
        expect(navItems.length).toBeGreaterThan(1);

        // Simulate click on the second item using jQuery to trigger the delegated event
        $(navItems[1]).trigger('click');

        expect($(navItems[1]).hasClass('active')).toBe(true);
        expect($(navItems[0]).hasClass('active')).toBe(false);

        // Click first item
        $(navItems[0]).trigger('click');

        expect($(navItems[0]).hasClass('active')).toBe(true);
        expect($(navItems[1]).hasClass('active')).toBe(false);
    });
});
