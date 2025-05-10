// Initialize and configure Mermaid.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mermaid with configuration options
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true
        },
        fontSize: 16
    });

    // Function to render mermaid diagrams
    const renderMermaidDiagrams = () => {
        // Find all pre code blocks with class 'language-mermaid'
        document.querySelectorAll('pre code.language-mermaid').forEach((element, index) => {
            // Get the parent pre element
            const preElement = element.parentElement;
            
            // Create a div to hold the rendered diagram
            const diagramDiv = document.createElement('div');
            diagramDiv.className = 'mermaid-diagram';
            diagramDiv.id = `mermaid-diagram-${index}`;
            
            // Get the diagram definition from the code element
            const diagramDefinition = element.textContent;
            
            // Replace the pre element with the mermaid div
            preElement.parentNode.replaceChild(diagramDiv, preElement);
            
            // Render the diagram
            try {
                mermaid.render(`mermaid-${index}`, diagramDefinition).then(result => {
                    diagramDiv.innerHTML = result.svg;
                });
            } catch (error) {
                console.error('Error rendering mermaid diagram:', error);
                diagramDiv.innerHTML = `<pre class="error">Error rendering diagram: ${error.message}</pre>`;
            }
        });
    };

    // Check if mermaid is available
    if (typeof mermaid !== 'undefined') {
        // Render all diagrams
        renderMermaidDiagrams();
    } else {
        console.error('Mermaid.js is not loaded');
    }
}); 