// scripts.js

// Function to set dynamic padding for page content based on header height
function setPageContentPadding() {
    const header = document.querySelector('header');
    const pageContent = document.querySelector('.main-content') || document.querySelector('.page-content');
    if (header && pageContent) {
        const headerHeight = header.offsetHeight;
        pageContent.style.paddingTop = `${headerHeight + 20}px`;
    }
}

// Function to initialize search bar functionality
function initializeSearchBar() {
    const searchBar = document.querySelector('.search-bar');
    const searchIcon = document.querySelector('.search-icon');
    const cancelIcon = document.querySelector('.cancel-icon');

    if (searchBar && searchIcon && cancelIcon) {
        // Search on icon click
        searchIcon.addEventListener('click', () => {
            const query = searchBar.value.trim();
            if (query) {
                window.location.href = `/DOATOONs-/search/?q=${encodeURIComponent(query)}`;
            }
        });

        // Search on Enter key
        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchBar.value.trim();
                if (query) {
                    window.location.href = `/DOATOONs-/search/?q=${encodeURIComponent(query)}`;
                }
            }
        });

        // Show/hide cancel icon and clear text
        searchBar.addEventListener('input', () => {
            cancelIcon.style.display = searchBar.value ? 'block' : 'none';
        });

        cancelIcon.addEventListener('click', () => {
            searchBar.value = '';
            cancelIcon.style.display = 'none';
        });
    }
}

// Function to load the header
function loadHeader() {
    fetch('/DOATOONs-/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeSearchBar();
            setPageContentPadding();
            window.addEventListener('resize', setPageContentPadding);
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header-placeholder').innerHTML = '<p>Error loading header. Please try again later.</p>';
        });
}

// Function to load the footer
function loadFooter() {
    fetch('/DOATOONs-/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            document.getElementById('footer-placeholder').innerHTML = '<p>Error loading footer. Please try again later.</p>';
        });
}

// Load the header and footer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});
