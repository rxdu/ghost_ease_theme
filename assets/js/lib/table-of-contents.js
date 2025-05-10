/**
 * Ghost Ease Theme - Table of Contents Generator
 * Automatically creates a TOC from headings in the post content
 * Includes a floating TOC for wider screens
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
        
        // Clean up any existing TOCs first
        const existingTOCs = document.querySelectorAll('.gh-toc, .gh-toc-floating');
        existingTOCs.forEach(toc => toc.remove());
        
        // Find all headings in the content
        const headings = contentArea.querySelectorAll('h2, h3, h4, h5, h6');
        
        // If there are fewer than 2 headings, don't bother with a TOC
        if (headings.length < 2) return;
        
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
        });
        
        // Create TOC content
        function createTocList() {
            // Create TOC list
            const tocList = document.createElement('ul');
            tocList.className = 'gh-toc-list';
            
            // Add each heading to the TOC
            headings.forEach((heading, index) => {
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
            
            return tocList;
        }
        
        // Create inline TOC (for smaller screens)
        const inlineTocContainer = document.createElement('div');
        inlineTocContainer.className = 'gh-toc';
        
        // Create and add the title for the inline TOC
        const tocHeader = document.createElement('h2');
        tocHeader.className = 'gh-toc-title';
        tocHeader.textContent = 'Table of Contents';
        inlineTocContainer.appendChild(tocHeader);
        
        // Add TOC list
        inlineTocContainer.appendChild(createTocList());
        
        // Insert inline TOC at the beginning of the content
        const firstChild = contentArea.firstChild;
        contentArea.insertBefore(inlineTocContainer, firstChild);
        
        // Only create floating TOC for wider screens
        if (window.innerWidth >= 1200) {
            // Create floating TOC for wider screens with fixed style
            const floatingTocContainer = document.createElement('div');
            floatingTocContainer.className = 'gh-toc-floating';
            floatingTocContainer.id = 'gh-floating-toc'; // Add a unique ID
            
            // Set fixed position styling directly in the element style
            floatingTocContainer.style.cssText = `
                position: fixed !important;
                top: 160px !important;
                box-shadow: none !important;
                right: ${window.innerWidth >= 1600 ? 'calc((100vw - 1320px) / 2 - 150px)' : '60px'};
            `;
            
            // Add TOC list without title
            floatingTocContainer.appendChild(createTocList().cloneNode(true));
            
            // Add the floating TOC to the document
            document.querySelector('.site-content').appendChild(floatingTocContainer);
        }
        
        // Make heading links clickable and add scroll behavior
        $('.gh-toc a, .gh-toc-floating a').on('click', function(e) {
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
        
        // Re-apply position on resize
        window.addEventListener('resize', function() {
            // Remove any floating TOC if screen is now small
            if (window.innerWidth < 1200) {
                const floatingToc = document.getElementById('gh-floating-toc');
                if (floatingToc) {
                    floatingToc.remove();
                }
                return;
            }
            
            // Create floating TOC if screen is now large and it doesn't exist
            if (window.innerWidth >= 1200 && !document.getElementById('gh-floating-toc')) {
                const floatingTocContainer = document.createElement('div');
                floatingTocContainer.className = 'gh-toc-floating';
                floatingTocContainer.id = 'gh-floating-toc';
                
                // Set fixed position styling directly in the element style
                floatingTocContainer.style.cssText = `
                    position: fixed !important;
                    top: 160px !important;
                    box-shadow: none !important;
                    right: ${window.innerWidth >= 1600 ? 'calc((100vw - 1320px) / 2 - 150px)' : '60px'};
                `;
                
                floatingTocContainer.appendChild(createTocList().cloneNode(true));
                document.querySelector('.site-content').appendChild(floatingTocContainer);
            } else {
                // Update position for existing floating TOC
                const tocEl = document.getElementById('gh-floating-toc');
                if (tocEl) {
                    tocEl.style.right = window.innerWidth >= 1600 ? 'calc((100vw - 1320px) / 2 - 150px)' : '60px';
                }
            }
        });
    });
    
})(jQuery); 