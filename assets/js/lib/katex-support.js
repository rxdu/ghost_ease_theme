/**
 * Ghost Ease Theme - KaTeX Math Equation Support
 * Automatically renders LaTeX math equations using KaTeX
 */
(function($) {
    'use strict';
    
    // Only run on post and page templates
    const isContentPage = document.body.classList.contains('post-template') || 
                          document.body.classList.contains('page-template');
    
    if (!isContentPage) return;
    
    // Store equation counter
    window.ghostEaseEquationCounter = 0;
    
    $(document).ready(function() {
        loadKaTeXAndRender();
    });
    
    function loadKaTeXAndRender() {
        // Add KaTeX CSS
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
        document.head.appendChild(styleLink);
        
        // Add KaTeX script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
        script.onload = function() {
            // Load auto-render extension
            const autoRenderScript = document.createElement('script');
            autoRenderScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js';
            autoRenderScript.onload = processAndRenderEquations;
            document.head.appendChild(autoRenderScript);
            
            // Also load copy-tex for better equation copying
            const copyTexScript = document.createElement('script');
            copyTexScript.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/copy-tex.min.js';
            document.head.appendChild(copyTexScript);
        };
        document.head.appendChild(script);
    }
    
    function processAndRenderEquations() {
        const contentArea = document.querySelector('.gh-content');
        if (!contentArea) return;
        
        // Process all equation environments and add proper numbering
        processEquationEnvironments(contentArea);
        
        // Now render all equations with KaTeX
        renderWithKaTeX(contentArea);
        
        // Process equation references in text
        processEquationReferences(contentArea);
    }
    
    function processEquationEnvironments(contentArea) {
        // Convert LaTeX equation environments to a format KaTeX can handle
        
        // First, fix special equation environments to use standard display math with tags
        const html = contentArea.innerHTML;
        
        // Convert all begin/end equation environments to use tags
        const processedHtml = html.replace(
            /<p>\\begin\{equation\}([\s\S]*?)\\end\{equation\}<\/p>/g, 
            function(match, content) {
                window.ghostEaseEquationCounter++;
                return '<p>$$' + content.trim() + ' \\tag{' + window.ghostEaseEquationCounter + '}$$</p>';
            }
        );
        
        // Also handle the \numberthis command
        const finalHtml = processedHtml.replace(
            /\$\$([\s\S]*?)\\numberthis([\s\S]*?)\$\$/g,
            function(match, before, after) {
                window.ghostEaseEquationCounter++;
                return '$$' + before + ' \\tag{' + window.ghostEaseEquationCounter + '}' + after + '$$';
            }
        );
        
        contentArea.innerHTML = finalHtml;
    }
    
    function renderWithKaTeX(contentArea) {
        // Render all math using KaTeX auto-render
        renderMathInElement(contentArea, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false,
            errorColor: '#ff0000',
            trust: true,
            strict: false
        });
        
        // Add class to indicate KaTeX is enabled
        contentArea.classList.add('katex-enabled');
        
        // Fix any styling issues with equation numbers
        fixEquationNumberStyling();
    }
    
    function fixEquationNumberStyling() {
        // Ensure equation tags are visible and properly positioned
        document.querySelectorAll('.katex-display .tag').forEach(function(tag) {
            // Ensure the tag is visible
            tag.style.display = 'inline-block';
            
            // Find the parent KaTeX display container and make sure it has sufficient right padding
            const displayContainer = tag.closest('.katex-display');
            if (displayContainer) {
                displayContainer.style.position = 'relative';
                displayContainer.style.paddingRight = '3em';
            }
            
            // Position the tag absolutely on the right
            tag.style.position = 'absolute';
            tag.style.right = '0.5em';
            tag.style.top = '50%';
            tag.style.transform = 'translateY(-50%)';
        });
    }
    
    function processEquationReferences(contentArea) {
        // Find and style equation references in text
        const eqRefPattern = /(?:equation|eq\.?)\s*\((\d+|[a-zA-Z]+)\)/gi;
        
        // Process all text nodes that are not inside equations
        const allTextNodes = [];
        const walker = document.createTreeWalker(
            contentArea, 
            NodeFilter.SHOW_TEXT, 
            { 
                acceptNode: function(node) {
                    // Skip nodes inside KaTeX elements
                    if (isInsideKaTeX(node)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                } 
            },
            false
        );
        
        // Collect all text nodes
        let node;
        while (node = walker.nextNode()) {
            allTextNodes.push(node);
        }
        
        // Replace equation references with styled spans
        allTextNodes.forEach(function(textNode) {
            const content = textNode.nodeValue;
            if (eqRefPattern.test(content)) {
                // Create a document fragment to hold the modified content
                const fragment = document.createDocumentFragment();
                let lastIndex = 0;
                
                // Reset regex to start from beginning
                eqRefPattern.lastIndex = 0;
                
                // Process each match
                let match;
                while ((match = eqRefPattern.exec(content)) !== null) {
                    // Add text before the match
                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(
                            content.substring(lastIndex, match.index)
                        ));
                    }
                    
                    // Get the equation number/label
                    const eqNumber = match[1];
                    
                    // Add the text up to the number
                    const beforeText = content.substring(match.index, content.indexOf('(', match.index) + 1);
                    fragment.appendChild(document.createTextNode(beforeText));
                    
                    // Create a styled span for the equation number
                    const eqRefSpan = document.createElement('span');
                    eqRefSpan.className = 'eq-ref';
                    eqRefSpan.textContent = eqNumber;
                    fragment.appendChild(eqRefSpan);
                    
                    // Add the closing parenthesis
                    fragment.appendChild(document.createTextNode(')'));
                    
                    // Update lastIndex to after this match
                    lastIndex = match.index + match[0].length;
                }
                
                // Add any remaining text
                if (lastIndex < content.length) {
                    fragment.appendChild(document.createTextNode(
                        content.substring(lastIndex)
                    ));
                }
                
                // Replace the original text node with the fragment
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        });
    }
    
    function isInsideKaTeX(node) {
        // Check if the node is inside a KaTeX element
        let parent = node.parentNode;
        while (parent) {
            if (parent.classList && 
                (parent.classList.contains('katex') || 
                parent.classList.contains('katex-display'))) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }
    
})(jQuery); 