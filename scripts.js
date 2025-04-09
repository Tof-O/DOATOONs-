// Search bar functionality
const searchBar = document.querySelector('.search-bar');
const searchIcon = document.querySelector('.search-icon');
const cancelIcon = document.querySelector('.cancel-icon');

if (searchBar && searchIcon && cancelIcon) {
    searchIcon.addEventListener('click', () => {
        const query = searchBar.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    });

    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBar.value.trim();
            if (query) {
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            }
        }
    });

    searchBar.addEventListener('input', () => {
        cancelIcon.style.display = searchBar.value ? 'block' : 'none';
    });

    cancelIcon.addEventListener('click', () => {
        searchBar.value = '';
        cancelIcon.style.display = 'none';
    });
}

// Dynamic header height adjustment
window.addEventListener('load', () => {
    const header = document.querySelector('header');
    const mainContent = document.querySelector('.main-content') || document.querySelector('.page-content');
    if (header && mainContent) {
        const headerHeight = header.offsetHeight;
        mainContent.style.marginTop = `${headerHeight}px`;
    }
});

window.addEventListener('resize', () => {
    const header = document.querySelector('header');
    const mainContent = document.querySelector('.main-content') || document.querySelector('.page-content');
    if (header && mainContent) {
        const headerHeight = header.offsetHeight;
        mainContent.style.marginTop = `${headerHeight}px`;
    }
});
