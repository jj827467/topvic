// main.js
document.addEventListener("DOMContentLoaded", function() {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
        fetch("navbar.html")
            .then(response => response.text())
            .then(data => navbarPlaceholder.innerHTML = data);
    }

    // 載入頁尾
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch("footer.html")
            .then(response => response.text())
            .then(data => footerPlaceholder.innerHTML = data);
    }
});

// 監聽全域點擊
document.addEventListener('click', function(event) {
    const btn = event.target.closest('#mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (btn && mobileMenu) {
        const willOpen = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
        return;
    }

    if (mobileMenu && !mobileMenu.classList.contains('hidden') && !event.target.closest('#mobile-menu')) {
        mobileMenu.classList.add('hidden');
        const menuBtn = document.getElementById('mobile-menu-btn');
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    }
});