/**
 * Callout blocks for Ghost theme
 * Transforms blockquotes with special format to callout cards
 */
(function() {
    // Execute when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Type definitions with their respective SVG icons
        const iconMap = {
            info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
            warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
            success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            note: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
            error: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
        };

        // Aliases mapping for different callout types
        const typeAliases = {
            // Info aliases
            info: 'info',
            information: 'info',
            
            // Warning aliases
            warning: 'warning',
            caution: 'warning',
            attention: 'warning',
            
            // Success/Tip aliases
            success: 'success',
            tip: 'success',
            hint: 'success',
            
            // Note aliases
            note: 'note',
            
            // Error aliases
            error: 'error',
            danger: 'error',
            important: 'error'
        };

        /**
         * Transforms blockquotes with special format to callout cards
         */
        function transformBlockquotes() {
            // Find all blockquotes
            const blockquotes = document.querySelectorAll('blockquote');
            
            blockquotes.forEach(function(blockquote) {
                const firstParagraph = blockquote.querySelector('p:first-child');
                if (!firstParagraph) return;

                // Check for callout type pattern: [TYPE] or (TYPE)
                const match = firstParagraph.textContent.match(/^\s*(?:\[([^\]]+)\]|\(([^\)]+)\))\s*(.+)$/i);
                if (!match) return;

                // Get the callout type and content
                const typeText = (match[1] || match[2]).toLowerCase();
                const content = match[3];
                
                // Check if this is a known callout type
                const normalizedType = typeAliases[typeText];
                if (!normalizedType) return;
                
                // Create the callout card
                createCalloutCard(blockquote, normalizedType, content, firstParagraph);
            });
        }

        /**
         * Creates a callout card from a blockquote
         */
        function createCalloutCard(blockquote, type, content, firstParagraph) {
            // Create the callout container
            const callout = document.createElement('div');
            callout.className = `kg-callout-card kg-callout-card-${type}`;

            // Create the content wrapper
            const calloutContent = document.createElement('div');
            calloutContent.className = 'kg-callout-card-content';

            // Add the icon
            const icon = document.createElement('div');
            icon.className = 'kg-callout-card-icon';
            icon.innerHTML = iconMap[type];
            calloutContent.appendChild(icon);

            // Create text container
            const textContainer = document.createElement('div');
            
            // Update the first paragraph to remove the [TYPE] or (TYPE) marker
            firstParagraph.textContent = content;
            
            // Move all content from the blockquote to the text container
            while (blockquote.firstChild) {
                textContainer.appendChild(blockquote.firstChild);
            }

            // Add the text container to the content wrapper
            calloutContent.appendChild(textContainer);
            
            // Add the content wrapper to the callout
            callout.appendChild(calloutContent);
            
            // Replace the blockquote with the callout
            blockquote.parentNode.replaceChild(callout, blockquote);
        }

        // Run the transformer
        transformBlockquotes();
    });
})(); 