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
    // 這裡的 ID 必須跟 navbar.html 裡的按鈕 ID 一模一樣
    const btn = event.target.closest('#mobile-menu-btn');
    
    if (btn) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.style.zIndex = "99999";
        }
    }
});