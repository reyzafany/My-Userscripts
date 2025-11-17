// ==UserScript==
// @name         Bypass Paste Restriction
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Allows pasting using Ctrl+V on sites that block it and triggers formatting
// @author       OpenAI (gpt-4o-mini-2024-07-18)
// @author       Yi-01.AI (Yi-01.AI) (v0.4)
// @license      MIT
// @match        *://*/*
// @grant        clipboardRead
// @grant        clipboardWrite
// @downloadURL https://update.greasyfork.org/scripts/512823/Bypass%20Paste%20Restriction.user.js
// @updateURL https://update.greasyfork.org/scripts/512823/Bypass%20Paste%20Restriction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', async function(event) {
        console.log('Keydown event detected:', event);

        if (event.ctrlKey && event.key === 'v') {
            console.log('Ctrl+V detected, preventing default paste behavior');
            event.preventDefault(); // Prevent the default paste behavior

            try {
                // Use the Clipboard API to read the clipboard content
                const text = await navigator.clipboard.readText();
                console.log('Clipboard content:', text);

                const activeElement = document.activeElement;
                console.log('Active element:', activeElement);

                if (activeElement && (
                    activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.getAttribute('contenteditable') === 'true'
                )) {
                    console.log('Active element is an input, textarea, or contenteditable div');

                    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                        console.log('Handling input or textarea');
                        // For standard input and textarea fields
                        const start = activeElement.selectionStart;
                        const end = activeElement.selectionEnd;
                        console.log('Selection start:', start, 'Selection end:', end);

                        const newValue = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
                        console.log('New value:', newValue);

                        activeElement.value = newValue;
                        activeElement.setSelectionRange(start + text.length, start + text.length);
                    } else if (activeElement.getAttribute('contenteditable') === 'true') {
                        console.log('Handling contenteditable div');
                        // For contenteditable divs
                        const selection = window.getSelection();
                        if (selection.rangeCount > 0) {
                            const range = selection.getRangeAt(0);
                            console.log('Range:', range);

                            range.deleteContents();
                            const textNode = document.createTextNode(text);
                            range.insertNode(textNode);
                            range.collapse(false); // Collapse the selection to the end of the pasted text
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }

                    // Create and dispatch input event to trigger formatting
                    const inputEvent = new Event('input', { bubbles: true });
                    activeElement.dispatchEvent(inputEvent);
                    console.log('Dispatched input event');

                    // Create and dispatch change event to ensure any additional formatting logic runs
                    const changeEvent = new Event('change', { bubbles: true });
                    activeElement.dispatchEvent(changeEvent);
                    console.log('Dispatched change event');
                } else {
                    console.log('Active element is not an input, textarea, or contenteditable div');
                }
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
            }
        }
    });
})();
