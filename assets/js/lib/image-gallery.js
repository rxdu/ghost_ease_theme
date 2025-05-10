/**
 * Image gallery enhancements
 * Optimizes side-by-side image galleries
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Find all image galleries
        const galleries = document.querySelectorAll('.kg-image-gallery');
        
        if (galleries.length === 0) return;
        
        // Process each gallery
        galleries.forEach(function(gallery) {
            const items = gallery.querySelectorAll('.kg-image-gallery-item');
            const images = gallery.querySelectorAll('img');
            
            // Make sure all images are loaded
            let loadedCount = 0;
            
            images.forEach(function(img) {
                if (img.complete) {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        adjustGallery(gallery, items);
                    }
                } else {
                    img.addEventListener('load', function() {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            adjustGallery(gallery, items);
                        }
                    });
                    
                    // Handle image load errors
                    img.addEventListener('error', function() {
                        loadedCount++;
                        if (loadedCount === images.length) {
                            adjustGallery(gallery, items);
                        }
                    });
                }
            });
        });
        
        // Adjust gallery items for optimal display
        function adjustGallery(gallery, items) {
            // Only apply equal height on wider screens
            if (window.innerWidth > 600) {
                // Reset heights first
                items.forEach(item => {
                    item.style.height = 'auto';
                });
                
                // Find tallest image+caption combination
                let maxHeight = 0;
                items.forEach(item => {
                    const height = item.offsetHeight;
                    maxHeight = Math.max(maxHeight, height);
                });
                
                // Apply equal height
                if (maxHeight > 0) {
                    items.forEach(item => {
                        item.style.height = maxHeight + 'px';
                    });
                }
            }
        }
        
        // Adjust on window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                galleries.forEach(function(gallery) {
                    const items = gallery.querySelectorAll('.kg-image-gallery-item');
                    adjustGallery(gallery, items);
                });
            }, 250);
        });
    });
})(); 