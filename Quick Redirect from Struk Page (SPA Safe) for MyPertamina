// ==UserScript==
// @name         Quick Redirect from Struk Page (SPA Safe)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Press Alt+S on struk page to go back to merchant app dashboard — works in SPAs!
// @author       You
// @match        https://subsiditepatlpg.mypertamina.id/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const HOTKEY = 'Ctrl+Alt'; // Customize: e.g., 'Ctrl+D', 'Shift+Q'
    const TARGET_URL = 'https://subsiditepatlpg.mypertamina.id/merchant/app';

    // Parse HOTKEY
    const [modifier, key] = HOTKEY.split('+');

    let isListenerAttached = false;

    function handleKeyDown(e) {
        let modifierPressed = false;

        switch (modifier.toLowerCase()) {
            case 'alt':
                modifierPressed = e.altKey;
                break;
            case 'ctrl':
                modifierPressed = e.ctrlKey;
                break;
            case 'shift':
                modifierPressed = e.shiftKey;
                break;
            case 'meta':
                modifierPressed = e.metaKey;
                break;
            default:
                return;
        }

        if (modifierPressed && e.key.toUpperCase() === key.toUpperCase()) {
            e.preventDefault();
            window.location.href = TARGET_URL;
        }
    }

    function checkAndAttachListener() {
        const shouldListen = window.location.href.includes('merchant/app/sale/struk');

        if (shouldListen && !isListenerAttached) {
            document.addEventListener('keydown', handleKeyDown);
            isListenerAttached = true;
            console.log(`[Struk Redirector] Hotkey ${HOTKEY} activated.`);
        } else if (!shouldListen && isListenerAttached) {
            document.removeEventListener('keydown', handleKeyDown);
            isListenerAttached = false;
            console.log(`[Struk Redirector] Hotkey deactivated.`);
        }
    }

    // Initial check
    checkAndAttachListener();

    // Watch for SPA navigation
    const observer = new MutationObserver(checkAndAttachListener);
    observer.observe(document, { subtree: true, childList: true });

    // Also watch for history changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(history, args);
        setTimeout(checkAndAttachListener, 50); // slight delay to ensure DOM updated
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(history, args);
        setTimeout(checkAndAttachListener, 50);
    };

    window.addEventListener('popstate', () => {
        setTimeout(checkAndAttachListener, 50);
    });

})();
