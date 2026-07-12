document.addEventListener('DOMContentLoaded', () => {
    // 1. Read ?slug= from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    // Dom elements to manipulate
    const articleTitle = document.querySelector('.article-title');
    const articleMeta = document.querySelector('.article-meta');
    const articleBody = document.querySelector('.article-body');

    // 2. Handle missing or empty slug scenario
    if (!slug) {
        renderNotFound("No Page Specified", "Please provide a valid document identifier in the URL query string.");
        return;
    }

    // 3. Load database file using fetch API
    fetch(`database/pages/${slug}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page schema file not found');
            }
            return response.json();
        })
        .then(data => {
            // 4. Parse JSON and display data layout
            document.title = `${data.title} - Index Engine`;
            articleTitle.textContent = data.title;
            
            // Build dynamic metadata view safely
            articleMeta.innerHTML = `
                <span>✍️ Author: <strong>${escapeHtml(data.author || 'Anonymous')}</strong></span>
                <span>📂 Category: <strong>${escapeHtml(data.category || 'General')}</strong></span>
            `;
            
            // 5. Inject the HTML content into the main container
            articleBody.innerHTML = data.content;
        })
        .catch(error => {
            // 6. Show friendly Error UI if the JSON target missing
            console.error('Index Engine Fetch Error:', error);
            renderNotFound("404: Page Not Found", `The document index matching "<strong>${escapeHtml(slug)}</strong>" does not exist in our static registry base.`);
        });

    // Helper: Build dynamic Fallback UI state
    function renderNotFound(title, description) {
        document.title = "Page Not Found - Index Engine";
        articleTitle.textContent = title;
        articleMeta.innerHTML = '';
        articleBody.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
                <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 24px;">${description}</p>
                <a href="index.html" class="btn btn-primary" style="text-decoration: none; display: inline-block;">↩️ Back to Home Registry</a>
            </div>
        `;
    }

    // Helper: Clean raw text data input strings
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
