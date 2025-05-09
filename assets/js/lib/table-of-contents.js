/**
 * Ghost Ease Theme - Table of Contents Generator
 * Automatically creates a TOC from headings in the post content
 */
(function($) {
    'use strict';
    
    // Only run TOC generation in post views
    const isPostPage = document.body.classList.contains('post-template');
    
    if (!isPostPage) return;
    
    // Generate table of contents when the page is ready
    $(document).ready(function() {
        const contentArea = document.querySelector('.gh-content');
        
        // If no content area is found, exit
        if (!contentArea) return;
        
        // Find all headings in the content
        const headings = contentArea.querySelectorAll('h2, h3, h4, h5, h6');
        
        // If there are fewer than 2 headings, don't bother with a TOC
        if (headings.length < 2) return;
        
        // Create TOC container
        const tocContainer = document.createElement('div');
        tocContainer.className = 'gh-toc';
        
        // Create TOC header
        const tocHeader = document.createElement('h2');
        tocHeader.className = 'gh-toc-title';
        tocHeader.textContent = 'Table of Contents';
        tocContainer.appendChild(tocHeader);
        
        // Create TOC list
        const tocList = document.createElement('ul');
        tocList.className = 'gh-toc-list';
        
        // Generate unique IDs for headings that don't have them
        headings.forEach((heading, index) => {
            if (!heading.id) {
                // Create ID from heading text: lowercase, remove special chars, replace spaces with dashes
                let id = heading.textContent
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
                
                // If the ID is empty or just contains invalid chars, use a generic ID
                if (!id) {
                    id = `heading-${index}`;
                }
                
                // Ensure ID uniqueness
                if (document.getElementById(id)) {
                    id = `${id}-${index}`;
                }
                
                heading.id = id;
            }
            
            // Create TOC item
            const level = parseInt(heading.tagName.substring(1), 10); // Extract level from H2, H3, etc.
            const tocItem = document.createElement('li');
            tocItem.className = `gh-toc-item gh-toc-level-${level}`;
            
            const tocLink = document.createElement('a');
            tocLink.href = `#${heading.id}`;
            tocLink.textContent = heading.textContent;
            
            tocItem.appendChild(tocLink);
            tocList.appendChild(tocItem);
        });
        
        tocContainer.appendChild(tocList);
        
        // Insert TOC at the beginning of the content
        const firstChild = contentArea.firstChild;
        contentArea.insertBefore(tocContainer, firstChild);
        
        // Make heading links clickable and add scroll behavior
        $('.gh-toc a').on('click', function(e) {
            e.preventDefault();
            
            const targetId = $(this).attr('href');
            const targetElement = $(targetId);
            
            if (targetElement.length) {
                // Scroll smoothly to the heading
                $('html, body').animate({
                    scrollTop: targetElement.offset().top - 100
                }, 400);
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
})(jQuery); 