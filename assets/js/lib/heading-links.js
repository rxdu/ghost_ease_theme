/**
 * Ghost Ease Theme - Heading Anchor Links
 * Makes headings linkable with clickable anchors
 */
(function($) {
    'use strict';
    
    // Only run on post and page templates
    const isContentPage = document.body.classList.contains('post-template') || 
                         document.body.classList.contains('page-template');
    
    if (!isContentPage) return;
    
    $(document).ready(function() {
        const contentArea = document.querySelector('.gh-content');
        
        if (!contentArea) return;
        
        // Target H1, H2, and H3 headings
        const headings = contentArea.querySelectorAll('h1, h2, h3');
        
        headings.forEach((heading, index) => {
            // If heading already has an ID from TOC generation, use it
            if (!heading.id) {
                // Create ID from heading text
                let id = heading.textContent
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                
                // Handle empty or invalid IDs
                if (!id) {
                    id = `heading-${index}`;
                }
                
                // Ensure ID uniqueness
                if (document.getElementById(id)) {
                    id = `${id}-${index}`;
                }
                
                heading.id = id;
            }
            
            // Create the anchor link
            const anchor = document.createElement('a');
            anchor.className = 'heading-anchor';
            anchor.href = `#${heading.id}`;
            anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
            anchor.title = 'Click to copy link to this section';
            
            // Simpler approach - don't move content into a wrapper, just append the anchor
            heading.appendChild(anchor);
            
            // Add click event to copy the URL to clipboard
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update URL hash
                window.history.pushState(null, null, this.getAttribute('href'));
                
                // Copy to clipboard
                const url = window.location.href;
                
                // Use modern clipboard API if available
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(url)
                        .then(() => {
                            showCopiedTooltip(anchor);
                        })
                        .catch(err => {
                            console.error('Failed to copy: ', err);
                            // Fallback
                            fallbackCopyTextToClipboard(url, anchor);
                        });
                } else {
                    // Fallback for browsers that don't support clipboard API
                    fallbackCopyTextToClipboard(url, anchor);
                }
            });
        });
        
        // Fallback copy method
        function fallbackCopyTextToClipboard(text, element) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showCopiedTooltip(element);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            
            document.body.removeChild(textArea);
        }
        
        // Show a temporary tooltip
        function showCopiedTooltip(element) {
            // Remove any existing tooltips
            const existingTooltip = element.querySelector('.heading-tooltip');
            if (existingTooltip) {
                element.removeChild(existingTooltip);
            }
            
            // Create new tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'heading-tooltip';
            tooltip.textContent = 'Link copied!';
            
            // Append tooltip to the anchor element
            element.appendChild(tooltip);
            
            // Check if tooltip is overflowing viewport
            setTimeout(() => {
                const tooltipRect = tooltip.getBoundingClientRect();
                
                // If tooltip would extend outside the viewport on the right
                if (tooltipRect.right > window.innerWidth) {
                    tooltip.style.left = 'auto';
                    tooltip.style.right = 'calc(100% + 5px)';
                    tooltip.style.transform = 'translateY(-50%)';
                    tooltip.classList.add('tooltip-left');
                }
            }, 10);
            
            // Remove tooltip after 2 seconds
            setTimeout(() => {
                tooltip.classList.add('heading-tooltip-fade');
                setTimeout(() => {
                    if (element.contains(tooltip)) {
                        element.removeChild(tooltip);
                    }
                }, 300);
            }, 2000);
        }
        
        // Handle direct navigation to headings
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }, 200);
            }
        }
    });
    
})(jQuery); 