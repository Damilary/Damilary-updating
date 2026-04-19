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

    test('should delete characters and move to the next word', () => {
        const words = ['A', 'B'];
        const writer = new TypeWriter(mockElement, words, 1000);

        // In constructor, this.type() is called *before* this.isDeleting is initialized,
        // but this.type() checks if (!this.isDeleting && this.txt === fullTxt).
        // It will set this.isDeleting to true.
        // Wait! In constructor: this.type(); this.isDeleting = false;
        // So at the end of constructor, isDeleting is false!

        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(false); // Because constructor overrides it

        // The first timeout was set in type() during constructor to wait=1000.
        // When that timer fires, type() is called again.
        // Because isDeleting is currently false, it will add another char? No, txt is already 'A', fullTxt is 'A'.
        // So type() will see `!this.isDeleting && this.txt === fullTxt` again, set typeSpeed = 1000, isDeleting = true.
        jest.advanceTimersByTime(1000);

        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(true);

        // Now isDeleting is true. Timer was set to 1000. Advance it.
        // type() runs, it is deleting. Removes 'A', txt becomes ''.
        // Sees isDeleting && txt === ''. Sets isDeleting = false, wordIndex = 1, typeSpeed = 500.
        jest.advanceTimersByTime(1000);

        expect(writer.txt).toBe('');
        expect(writer.isDeleting).toBe(false);
        expect(writer.wordIndex).toBe(1); // Moved to next word

        // Now advance past the 500ms pause. It types 'B'.
        jest.advanceTimersByTime(500);

        // It types 'B'
        expect(writer.txt).toBe('B');
    });

    test('should loop back to the first word', () => {
        const words = ['A'];
        const writer = new TypeWriter(mockElement, words, 1000);

        // Constructor types 'A', isDeleting = false. Timeout set to 1000.
        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(false);

        // Advance 1000ms. type() runs, sees word is complete, isDeleting = true. Timeout set to 1000.
        jest.advanceTimersByTime(1000);
        expect(writer.txt).toBe('A');
        expect(writer.isDeleting).toBe(true);

        // Advance 1000ms. type() runs, deletes 'A'. isDeleting = false, wordIndex = 1. Timeout set to 500.
        jest.advanceTimersByTime(1000);
        expect(writer.txt).toBe('');
        expect(writer.isDeleting).toBe(false);
        expect(writer.wordIndex).toBe(1);

        // Advance 500ms to type 'A' again (since 1 % 1 = 0)
        jest.advanceTimersByTime(500);

        // Type 'A' again
        expect(writer.txt).toBe('A');
        expect(writer.wordIndex).toBe(1);
    });
});
