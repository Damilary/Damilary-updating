const TypeWriter = require('./typewriter');

describe('TypeWriter', () => {
    let mockElement;

    beforeEach(() => {
        // Setup a mock DOM element
        mockElement = document.createElement('span');
        mockElement.className = 'txt-type';
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('should initialize correctly', () => {
        const words = ['Hello', 'World'];
        const writer = new TypeWriter(mockElement, words, 2000);

        expect(writer.txtElement).toBe(mockElement);
        expect(writer.words).toEqual(words);
        expect(writer.txt).toBe('H'); // Because type() is called in the constructor, the first letter is added
        expect(writer.wordIndex).toBe(0);
        expect(writer.wait).toBe(2000);
        expect(writer.isDeleting).toBe(false);
    });

    test('should type words character by character', () => {
        const words = ['Hi'];
        const writer = new TypeWriter(mockElement, words, 3000);

        // Constructor types 'H'
        expect(writer.txt).toBe('H');
        expect(mockElement.innerHTML).toBe('<span class="txt">H</span>');

        // Advance timer for the next character
        jest.advanceTimersByTime(300);

        expect(writer.txt).toBe('Hi');
        expect(mockElement.innerHTML).toBe('<span class="txt">Hi</span>');
    });

    test('should pause and switch to deleting when a word is fully typed', () => {
        const words = ['Hi'];
        const writer = new TypeWriter(mockElement, words, 3000);

        // Constructor types 'H'
        jest.advanceTimersByTime(300);
        // Now it's 'Hi'
        expect(writer.txt).toBe('Hi');

        // The word is complete. The next timer should be the 'wait' duration
        expect(writer.isDeleting).toBe(true);

        // Timer is now set to 3000
        jest.advanceTimersByTime(3000);

        // It should delete 'i'
        expect(writer.txt).toBe('H');
        expect(writer.isDeleting).toBe(true);
    });

    test('should cycle through words and loop back to the beginning', () => {
        const words = ['A', 'B'];
        const writer = new TypeWriter(mockElement, words, 1000);

        // Initialization: txt = 'A', isDeleting = false, timeout = 1000ms
        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(false);

        // Timer fires (1000ms). type() runs. txt = 'A', fullTxt = 'A'.
        // sets typeSpeed = 1000ms, isDeleting = true
        jest.advanceTimersByTime(1000);
        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(true);

        // Timer fires (1000ms). type() runs, deletes 'A'. txt = ''.
        // sets typeSpeed = 500ms, isDeleting = false, wordIndex = 1
        jest.advanceTimersByTime(1000);
        expect(writer.txt).toBe('');
        expect(writer.isDeleting).toBe(false);
        expect(writer.wordIndex).toBe(1);

        // Timer fires (500ms). type() runs, types 'B'. txt = 'B', fullTxt = 'B'.
        // sets typeSpeed = 1000ms, isDeleting = true
        jest.advanceTimersByTime(500);
        expect(writer.txt).toBe('B');
        expect(writer.isDeleting).toBe(true);

        // Timer fires (1000ms). type() runs, deletes 'B'. txt = ''.
        // sets typeSpeed = 500ms, isDeleting = false, wordIndex = 2
        jest.advanceTimersByTime(1000);
        expect(writer.txt).toBe('');
        expect(writer.isDeleting).toBe(false);
        expect(writer.wordIndex).toBe(2);

        // Timer fires (500ms). type() runs, types 'A'. txt = 'A', fullTxt = 'A'.
        // sets typeSpeed = 1000ms, isDeleting = true
        jest.advanceTimersByTime(500);
        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(true);
        expect(writer.wordIndex % writer.words.length).toBe(0);
    });
});
