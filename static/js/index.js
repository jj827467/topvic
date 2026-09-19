// index.js
// 拓域科技首頁共用互動：Navbar / Footer、手機選單、Hero 輪播、FAQ、平滑捲動。

(function () {
    "use strict";

    const AUTO_PLAY_DELAY = 5000;
    const HEADER_OFFSET = 80;

    let currentSlide = 0;
    let slideInterval = null;

    async function loadPartial(placeholderId, filePath, label) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        try {
            const response = await fetch(filePath);

            if (!response.ok) {
                throw new Error(`${label} 載入失敗：${response.status}`);
            }

            placeholder.innerHTML = await response.text();
        } catch (error) {
            console.error(error);
        }
    }

    function getCarouselElements() {
        return {
            carousel: document.getElementById("hero-carousel"),
            inner: document.getElementById("carousel-inner"),
            dots: Array.from(document.querySelectorAll(".carousel-dot")),
        };
    }

    function getTotalSlides() {
        const { inner } = getCarouselElements();
        return inner ? inner.children.length : 0;
    }

    function updateCarousel() {
        const { inner, dots } = getCarouselElements();
        if (!inner) return;

        inner.style.transform = `translateX(-${currentSlide * 100}%)`;

        dots.forEach((dot, index) => {
            const isActive = index === currentSlide;

            dot.classList.toggle("bg-white", isActive);
            dot.classList.toggle("bg-white/40", !isActive);
            dot.classList.toggle(
                "shadow-[0_0_10px_rgba(255,255,255,0.5)]",
                isActive
            );
            dot.classList.toggle("hover:bg-white/80", !isActive);
            dot.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    function stopCarousel() {
        if (slideInterval !== null) {
            window.clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    function startCarousel() {
        stopCarousel();

        if (getTotalSlides() <= 1) return;

        slideInterval = window.setInterval(() => {
            const totalSlides = getTotalSlides();
            if (!totalSlides) return;

            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }, AUTO_PLAY_DELAY);
    }

    function resetCarouselTimer() {
        startCarousel();
    }

    function nextSlide() {
        const totalSlides = getTotalSlides();
        if (!totalSlides) return;

        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        resetCarouselTimer();
    }

    function prevSlide() {
        const totalSlides = getTotalSlides();
        if (!totalSlides) return;

        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        resetCarouselTimer();
    }

    function goToSlide(index) {
        const totalSlides = getTotalSlides();
        const targetIndex = Number(index);

        if (
            !totalSlides ||
            !Number.isInteger(targetIndex) ||
            targetIndex < 0 ||
            targetIndex >= totalSlides
        ) {
            return;
        }

        currentSlide = targetIndex;
        updateCarousel();
        resetCarouselTimer();
    }

    function setMobileMenu(open) {
        const menu = document.getElementById("mobile-menu");
        const button = document.getElementById("mobile-menu-btn");
        const menuIcon = document.getElementById("menu-icon");
        const closeIcon = document.getElementById("close-icon");

        if (!menu) return;

        menu.classList.toggle("hidden", !open);
        button?.setAttribute("aria-expanded", String(open));
        menuIcon?.classList.toggle("hidden", open);
        closeIcon?.classList.toggle("hidden", !open);
    }

    function toggleMobileMenu() {
        const menu = document.getElementById("mobile-menu");
        if (!menu) return;

        setMobileMenu(menu.classList.contains("hidden"));
    }

    function toggleAccordion(triggerOrId) {
        let trigger = null;
        let content = null;

        if (typeof triggerOrId === "string") {
            content = document.getElementById(triggerOrId);
        } else if (triggerOrId instanceof Element) {
            trigger = triggerOrId;
            const controlsId = trigger.getAttribute("aria-controls");
            content = controlsId
                ? document.getElementById(controlsId)
                : trigger.nextElementSibling;
        }

        if (!content || !content.classList.contains("accordion-content")) return;

        const willOpen = content.getAttribute("data-state") !== "open";
        content.setAttribute("data-state", willOpen ? "open" : "closed");
        content.style.display = willOpen ? "block" : "none";

        if (trigger) {
            trigger.setAttribute("aria-expanded", String(willOpen));
            const icon = trigger.querySelector("[data-accordion-icon]");
            if (icon) icon.textContent = willOpen ? "−" : "+";
        }
    }

    function toggleCompanyDialog() {
        const dialog = document.getElementById("company-dialog");

        if (!dialog) {
            window.alert(
                "「拓域科技」專注於提供創新資訊科技解決方案，深耕於前後端系統開發、AI 服務整合及 AIGC 影像創作。"
            );
            return;
        }

        dialog.classList.toggle("hidden");
        const isOpen = !dialog.classList.contains("hidden");
        document.body.style.overflow = isOpen ? "hidden" : "";
    }

    function smoothScrollTo(hash) {
        if (!hash || hash === "#") return false;

        let target;
        try {
            target = document.querySelector(hash);
        } catch (error) {
            return false;
        }

        if (!target) return false;

        const top =
            target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

        window.scrollTo({ top, behavior: "smooth" });
        return true;
    }

    function handleDocumentClick(event) {
        const menuButton = event.target.closest("#mobile-menu-btn");
        const mobileMenu = document.getElementById("mobile-menu");

        if (menuButton) {
            event.preventDefault();
            toggleMobileMenu();
            return;
        }

        const accordionTrigger = event.target.closest(
            "[data-accordion-trigger], .accordion-trigger"
        );
        if (accordionTrigger) {
            event.preventDefault();
            toggleAccordion(accordionTrigger);
            return;
        }

        const anchor = event.target.closest('a[href^="#"]');
        if (anchor) {
            const hash = anchor.getAttribute("href");
            if (smoothScrollTo(hash)) {
                event.preventDefault();
                if (mobileMenu?.contains(anchor)) setMobileMenu(false);
            }
        }

        if (
            mobileMenu &&
            !mobileMenu.classList.contains("hidden") &&
            !event.target.closest("#mobile-menu")
        ) {
            setMobileMenu(false);
        }
    }

    function initialiseAccordions() {
        document.querySelectorAll(".accordion-content").forEach((content) => {
            content.style.display = "none";
            content.setAttribute("data-state", "closed");
        });
    }

    function initialiseCarousel() {
        const { carousel, inner } = getCarouselElements();
        if (!inner) return;

        currentSlide = 0;
        updateCarousel();
        startCarousel();

        carousel?.addEventListener("mouseenter", stopCarousel);
        carousel?.addEventListener("mouseleave", startCarousel);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopCarousel();
            } else {
                startCarousel();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", async () => {
        await Promise.all([
            loadPartial("navbar-placeholder", "navbar.html", "Navbar"),
            loadPartial("footer-placeholder", "footer.html", "Footer"),
        ]);

        initialiseCarousel();
        initialiseAccordions();
    });

    document.addEventListener("click", handleDocumentClick);

    // 保留給 HTML onclick 屬性使用。
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
    window.goToSlide = goToSlide;
    window.toggleMobileMenu = toggleMobileMenu;
    window.toggleAccordion = toggleAccordion;
    window.toggleCompanyDialog = toggleCompanyDialog;
})();
