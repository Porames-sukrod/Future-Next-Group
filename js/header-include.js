// Inject header.css once (idempotent)
(function loadHeaderCSS() {
    if (!document.getElementById('header-css')) {
        const link = document.createElement('link');
        link.id = 'header-css';
        link.rel = 'stylesheet';
        link.href = 'css/header.css';
        document.head.appendChild(link);
    }
})();

function ensureMobileNavFixStyles() {
    if (document.getElementById('fng-mobile-nav-fix-style')) return;

    var style = document.createElement('style');
    style.id = 'fng-mobile-nav-fix-style';
    style.textContent = [
        '@media (max-width: 767px) {',
        '  #canvasMobile.offcanvas-start.show:not(.hiding),',
        '  #canvasMobile.offcanvas-start.showing { transform: none !important; }',
        '  #canvasMobile #menu-mobile > li > a {',
        '    background: transparent !important;',
        '    color: #ffffff !important;',
        '    letter-spacing: 0 !important;',
        '    overflow: visible !important;',
        '    text-indent: 0 !important;',
        '    white-space: normal !important;',
        '  }',
        '  #canvasMobile #menu-mobile > li.current-menu-item > a,',
        '  #canvasMobile #menu-mobile > li.current-menu-mobile-item > a {',
        '    background: rgba(114, 255, 240, 0.16) !important;',
        '    color: #ffffff !important;',
        '  }',
        '  #mobileNavLang {',
        '    display: flex !important;',
        '    align-items: center !important;',
        '    justify-content: flex-start !important;',
        '    padding: 14px 0 0 !important;',
        '    margin-top: 10px !important;',
        '  }',
        '  #mobileNavLang .language-switcher {',
        '    width: max-content !important;',
        '    max-width: 100% !important;',
        '    display: inline-flex !important;',
        '    align-items: center !important;',
        '    gap: 4px !important;',
        '    padding: 3px !important;',
        '    border-radius: 8px !important;',
        '    background: rgba(255, 255, 255, 0.08) !important;',
        '    border: 1px solid rgba(255, 255, 255, 0.18) !important;',
        '  }',
        '  #mobileNavLang .lang-btn {',
        '    width: 30px !important;',
        '    min-width: 30px !important;',
        '    height: 28px !important;',
        '    min-height: 28px !important;',
        '    max-height: 28px !important;',
        '    padding: 0 !important;',
        '    border-radius: 6px !important;',
        '    display: inline-flex !important;',
        '    align-items: center !important;',
        '    justify-content: center !important;',
        '  }',
        '  #mobileNavLang .lang-btn.lang-active {',
        '    background: #ffffff !important;',
        '    box-shadow: 0 6px 16px rgba(255, 255, 255, 0.16) !important;',
        '  }',
        '  #mobileNavLang .lang-code { display: none !important; }',
        '  #mobileNavLang .lang-flag {',
        '    width: 18px !important;',
        '    height: 13px !important;',
        '    flex: 0 0 18px !important;',
        '  }',
        '}'
    ].join('\n');
    document.head.appendChild(style);
}

function applyMobileNavStateFixes() {
    var isMobile = window.matchMedia('(max-width: 767px)').matches;
    var canvas = document.getElementById('canvasMobile');
    if (!isMobile || !canvas) return;

    if (canvas.classList.contains('show') || canvas.classList.contains('showing')) {
        canvas.style.setProperty('transition', 'none', 'important');
        canvas.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
    }

    document.querySelectorAll('#menu-mobile > li > a').forEach(function (link) {
        var item = link.closest('li');
        var isCurrent = item && (
            item.classList.contains('current-menu-item') ||
            item.classList.contains('current-menu-mobile-item')
        );

        link.style.setProperty('background-color', isCurrent ? 'rgba(114, 255, 240, 0.16)' : 'transparent', 'important');
        link.style.setProperty('background-image', 'none', 'important');
        link.style.setProperty('color', '#ffffff', 'important');
        link.style.setProperty('letter-spacing', '0', 'important');
        link.style.setProperty('text-indent', '0', 'important');
        link.style.setProperty('white-space', 'normal', 'important');
    });

    var langWrap = document.querySelector('#mobileNavLang .language-switcher');
    if (langWrap) {
        langWrap.style.setProperty('width', 'max-content', 'important');
        langWrap.style.setProperty('display', 'inline-flex', 'important');
        langWrap.style.setProperty('gap', '4px', 'important');
    }

    document.querySelectorAll('#mobileNavLang .lang-btn').forEach(function (button) {
        button.style.setProperty('width', '30px', 'important');
        button.style.setProperty('min-width', '30px', 'important');
        button.style.setProperty('height', '28px', 'important');
        button.style.setProperty('min-height', '28px', 'important');
        button.style.setProperty('max-height', '28px', 'important');
        button.style.setProperty('padding', '0', 'important');
    });
}

function clearMobileNavOpenFixes() {
    var canvas = document.getElementById('canvasMobile');
    if (!canvas) return;

    canvas.style.removeProperty('transition');
    canvas.style.removeProperty('transform');
}

function closeMobileNavInstantly(event) {
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    var canvas = document.getElementById('canvasMobile');
    if (!canvas) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') {
        event.stopImmediatePropagation();
    }

    clearMobileNavOpenFixes();
    canvas.classList.remove('show', 'showing', 'hiding');
    canvas.style.setProperty('visibility', 'hidden', 'important');
    canvas.removeAttribute('aria-modal');
    canvas.removeAttribute('role');

    document.querySelectorAll('.offcanvas-backdrop').forEach(function (backdrop) {
        backdrop.remove();
    });

    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
}

function initMobileNavStateFixes() {
    var canvas = document.getElementById('canvasMobile');
    var mobileButton = document.querySelector('.header .mobile-button > a');
    var closeButton = canvas ? canvas.querySelector('.btn-close') : null;

    applyMobileNavStateFixes();

    if (canvas) {
        ['show.bs.offcanvas', 'shown.bs.offcanvas', 'transitionend'].forEach(function (eventName) {
            canvas.addEventListener(eventName, function () {
                setTimeout(applyMobileNavStateFixes, 0);
            });
        });
        ['hide.bs.offcanvas', 'hidden.bs.offcanvas'].forEach(function (eventName) {
            canvas.addEventListener(eventName, clearMobileNavOpenFixes);
        });
    }

    if (mobileButton) {
        mobileButton.addEventListener('click', function () {
            setTimeout(applyMobileNavStateFixes, 80);
            setTimeout(applyMobileNavStateFixes, 320);
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeMobileNavInstantly, true);
        closeButton.addEventListener('touchend', closeMobileNavInstantly, true);
    }

    window.addEventListener('resize', applyMobileNavStateFixes, { passive: true });
}

function initSharedLogoEffects() {
    var logoAnchors = document.querySelectorAll('.logo-header2 a');
    if (!logoAnchors.length) return;

    var isFinePointer = window.matchMedia('(pointer: fine)').matches;

    logoAnchors.forEach(function (logoAnchor) {
        if (logoAnchor.dataset.logoEffectBound === 'true') return;
        logoAnchor.dataset.logoEffectBound = 'true';
        var isFooterLogo = !!logoAnchor.closest('.footer, .footer-inner');

        if (!isFinePointer || isFooterLogo) return;

        logoAnchor.addEventListener('mouseenter', function () {
            logoAnchor.classList.remove('logo-idle');
            logoAnchor.style.animation = 'none';
        });

        logoAnchor.addEventListener('mousemove', function (event) {
            if (document.body.classList.contains('nav-sidebar')) return;
            var rect = logoAnchor.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dx = (event.clientX - cx) / (rect.width / 2);
            var dy = (event.clientY - cy) / (rect.height / 2);
            var rotY = dx * 22;
            var rotX = -dy * 16;
            var tx = dx * 4;
            var ty = dy * 3;
            logoAnchor.style.transform =
                'perspective(600px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translate(' + tx + 'px,' + ty + 'px) scale(1.06)';
        });

        logoAnchor.addEventListener('mouseleave', function () {
            logoAnchor.style.transform = '';
            setTimeout(function () {
                logoAnchor.style.animation = '';
            }, 350);
        });
    });
}

function cloneDesktopMenuItemForMobile(desktopItem) {
    var mobileItem = document.createElement('li');
    mobileItem.className = 'menu-item';

    if (desktopItem.dataset.page) {
        mobileItem.dataset.page = desktopItem.dataset.page;
    }
    if (desktopItem.classList.contains('current-menu-item') || desktopItem.classList.contains('active')) {
        mobileItem.classList.add('current-menu-item');
    }

    var link = desktopItem.querySelector(':scope > a');
    if (link) {
        var mobileLink = link.cloneNode(true);
        mobileLink.className = 'mobile-menu-link';
        mobileItem.appendChild(mobileLink);
    }

    var flyoutLinks = desktopItem.querySelectorAll('.sub-menu-flyout > .sub-menu-item > a');
    if (flyoutLinks.length) {
        mobileItem.classList.add('menu-item-has-children-mobile');

        var toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'mobile-submenu-toggle';
        toggle.setAttribute('aria-label', 'Toggle product list');
        toggle.setAttribute('aria-expanded', 'false');
        mobileItem.appendChild(toggle);

        var submenu = document.createElement('ul');
        submenu.className = 'sub-menu-mobile';

        flyoutLinks.forEach(function (flyoutLink) {
            var submenuItem = document.createElement('li');
            submenuItem.className = 'menu-item';
            var submenuLink = flyoutLink.cloneNode(true);
            submenuLink.className = 'item-link-2';
            submenuItem.appendChild(submenuLink);
            submenu.appendChild(submenuItem);
        });

        mobileItem.appendChild(submenu);
    }

    return mobileItem;
}

function syncMobileMenuFromDesktopHeader() {
    var mobileMenu = document.getElementById('menu-mobile');
    var desktopItems = document.querySelectorAll('.header .menu-primary-menu > .menu-item');
    if (!mobileMenu || !desktopItems.length) return;

    mobileMenu.innerHTML = '';
    desktopItems.forEach(function (desktopItem) {
        mobileMenu.appendChild(cloneDesktopMenuItemForMobile(desktopItem));
    });

    mobileMenu.querySelectorAll('.mobile-submenu-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var item = toggle.closest('.menu-item-has-children-mobile');
            if (!item) return;

            var isOpen = item.classList.toggle('is-mobile-submenu-open');
            var submenu = item.querySelector(':scope > .sub-menu-mobile');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (submenu) submenu.classList.toggle('show', isOpen);
        });
    });
}

function closeMobileSidebarAfterNavigation() {
    var header = document.getElementById('header');
    if (!header) return;

    header.querySelectorAll('.main-menu a[href]').forEach(function (link) {
        if (link.dataset.mobileSidebarCloseBound === 'true') return;
        link.dataset.mobileSidebarCloseBound = 'true';

        link.addEventListener('click', function () {
            if (!window.matchMedia('(max-width: 1199px)').matches) return;
            if (!document.body.classList.contains('nav-sidebar')) return;

            document.body.classList.remove('nav-sidebar');
            document.body.classList.remove('sidebar-products-focus');
            document.body.classList.remove('nav-hidden');
            localStorage.setItem('navLayout', 'top');
            localStorage.setItem('navHidden', '0');
        });
    });
}

// Function to load and include the header
function includeHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            // Insert the header after the top-bar
            const topBar = document.querySelector('.top-bar');
            if (topBar) {
                topBar.insertAdjacentHTML('afterend', data);
            } else {
                // If no top-bar, insert at the beginning of wrapper
                const wrapper = document.querySelector('.wrapper');
                if (wrapper) {
                    wrapper.insertAdjacentHTML('afterbegin', data);
                }
            }
            initSharedLogoEffects();
            // Localize and set active menu item
            localizeNavigation();
            setActiveMenu();
            syncMobileMenuFromDesktopHeader();
            // Click/tap dropdown controls
            initDropdownToggles();
            // Init layout toggle
            initLayoutToggle();
            closeMobileSidebarAfterNavigation();
            // Init color customizer
            initColorCustomizer();
            // Highlight active language
            initLangSwitcher();
            ensureMobileNavFixStyles();
            initMobileNavStateFixes();
            // Hide/show menu toggle
            initHideMenu();
            // Keep the navigation stable; hiding is controlled by the Hide/Menu buttons.
            // Scroll shadow
            const hdrEl = document.getElementById('header');
            if (hdrEl) {
                const onScroll = () => hdrEl.classList.toggle('is-scrolled', window.scrollY > 20);
                window.addEventListener('scroll', onScroll, { passive: true });
                onScroll();
            }
        })
        .catch(error => console.error('Error loading header:', error));
}

// -------------------------------------------------------
// Auto-hide header: hide on idle/scroll-down, show on
// scroll-up, mouse-near-top, or mouse-enter header.
// -------------------------------------------------------
function initAutoHide() {
    var header = document.getElementById('header');
    if (!header) return;

    var hideTimer = null;
    var isHidden  = false;
    var lastScroll = window.scrollY;

    function showHeader() {
        clearTimeout(hideTimer);
        if (isHidden) {
            header.classList.remove('header-auto-hide');
            header.style.marginTop = '';
            // sidebar: restore wrapper margin
            if (document.body.classList.contains('nav-sidebar')) {
                document.querySelectorAll('.wrapper, .top-bar').forEach(function(el) {
                    el.style.marginLeft = '';
                });
            }
            isHidden = false;
        }
        startHideTimer();
    }

    function hideHeader() {
        if (!isHidden) {
            var isSidebar = document.body.classList.contains('nav-sidebar');
            if (isSidebar) {
                header.classList.add('header-auto-hide');
                // collapse wrapper margin so content fills full width
                document.querySelectorAll('.wrapper, .top-bar').forEach(function(el) {
                    el.style.marginLeft = '0';
                });
            } else {
                var h = header.offsetHeight;
                header.classList.add('header-auto-hide');
                header.style.marginTop = '-' + h + 'px';
            }
            isHidden = true;
        }
    }

    function startHideTimer() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            if (!header.matches(':hover')) hideHeader();
        }, 1500);
    }

    header.addEventListener('mouseenter', showHeader);
    header.addEventListener('mouseleave', startHideTimer);

    document.addEventListener('mousemove', function (e) {
        if (e.clientY <= 12) showHeader();
    });

    window.addEventListener('scroll', function () {
        var cur = window.scrollY;
        if (cur > lastScroll + 10)       hideHeader();
        else if (cur < lastScroll - 10)  showHeader();
        lastScroll = cur;
    }, { passive: true });

    startHideTimer();
}

var NAV_ITEMS = {
    th: {
        home: 'หน้าแรก',
        products: 'ผลิตภัณฑ์',
        productList: 'รายการผลิตภัณฑ์',
        services: 'บริการ',
        about: 'เกี่ยวกับเรา',
        contact: 'ติดต่อเรา',
        serviceOverview: 'รายการบริการ',
        electronicsSubtitle: 'อุปกรณ์อิเล็กทรอนิกส์และเครื่องใช้ไฟฟ้า',
        electronicsTitle: 'ผลิตภัณฑ์อิเล็กทรอนิกส์',
        spareSubtitle: 'อะไหล่และอุปกรณ์เสริม',
        spareTitle: 'อะไหล่และอุปกรณ์เสริม',
        securitySubtitle: 'CCTV, Access Control และ Barriers',
        securityTitle: 'ระบบรักษาความปลอดภัย',
        solarSubtitle: 'พลังงานสะอาดสำหรับองค์กร',
        solarTitle: 'ระบบพลังงาน Solar Cell',
        itSubtitle: 'คอมพิวเตอร์ เครื่องพิมพ์ และอุปกรณ์สำนักงาน',
        itTitle: 'อุปกรณ์ IT',
        assemblySubtitle: 'ประกอบผลิตภัณฑ์และติดตั้งตามความต้องการ',
        assemblyTitle: 'ผลิตภัณฑ์และอุปกรณ์ประกอบ',
        hide: 'ซ่อน',
        colors: 'สี',
        menu: 'เมนู'
    },
    en: {
        home: 'Home',
        products: 'Products',
        productList: 'Product List',
        services: 'Services',
        about: 'About Us',
        contact: 'Contact Us',
        serviceOverview: 'Integrated Services',
        electronicsSubtitle: 'Electronics & Electrical Appliances',
        electronicsTitle: 'Electronics',
        spareSubtitle: 'Spare Parts & Accessories',
        spareTitle: 'Spare Parts',
        securitySubtitle: 'CCTV, Access Control & Barriers',
        securityTitle: 'Security Systems',
        solarSubtitle: 'Clean Energy for Organizations',
        solarTitle: 'Solar Cell Solutions',
        itSubtitle: 'Computers, Printers & Office Devices',
        itTitle: 'IT Equipment',
        assemblySubtitle: 'Assembly and Customer-guided Installation',
        assemblyTitle: 'Assembly Products',
        hide: 'Hide',
        colors: 'Colors',
        menu: 'Menu'
    }
};

function isEnglishPage(page) {
    return page.includes('-en') || page.startsWith('en-');
}

function localizedPage(basePage, isEN) {
    return isEN ? basePage.replace(/\.html$/, '-en.html') : basePage;
}

function setLink(selector, href, text) {
    document.querySelectorAll(selector).forEach(function(link) {
        link.href = href;
        if (text !== undefined) link.textContent = text;
    });
}

function setHeaderLink(dataPage, href, text) {
    document.querySelectorAll('.header .menu-item[data-page="' + dataPage + '"] > a').forEach(function(link) {
        link.href = href;
        var span = link.querySelector('span');
        if (span) span.textContent = text;
        else link.textContent = text;
    });
}

function setServiceFlyout(index, href, subtitle, title) {
    var items = document.querySelectorAll('.header .sub-menu-flyout > .sub-menu-item > a');
    var link = items[index];
    if (!link) return;
    link.href = href;
    var subtitleEl = link.querySelector('.service-subtitle');
    var titleEl = link.querySelector('.service-title');
    if (subtitleEl) subtitleEl.textContent = subtitle;
    if (titleEl) titleEl.textContent = title;
}

function localizeNavigation() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var isEN = isEnglishPage(page);
    var copy = NAV_ITEMS[isEN ? 'en' : 'th'];

    var pages = {
        home: localizedPage('index.html', isEN),
        products: localizedPage('porfolio-list.html', isEN),
        services: localizedPage('services.html', isEN),
        details: localizedPage('services-details.html', isEN),
        about: localizedPage('about-us.html', isEN),
        contact: localizedPage('contact.html', isEN),
        electronics: localizedPage('porfolio-electronics.html', isEN),
        spare: localizedPage('porfolio-spare-parts.html', isEN),
        security: localizedPage('porfolio-security.html', isEN),
        solar: localizedPage('porfolio-solar.html', isEN),
        it: localizedPage('porfolio-it-equipment.html', isEN),
        assembly: localizedPage('porfolio-assembly.html', isEN)
    };

    var logo = document.querySelector('.header .logo-header2 a');
    if (logo) logo.href = pages.home;

    setHeaderLink('index.html', pages.home, copy.home);
    setHeaderLink('porfolio-list.html', pages.products, copy.products);
    setHeaderLink('services', pages.services, copy.services);
    setHeaderLink('about-us.html', pages.about, copy.about);
    setHeaderLink('contact.html', pages.contact, copy.contact);

    var overview = document.querySelector('.header .sub-menu-services > .sub-menu-item > a');
    if (overview) {
        overview.href = pages.products;
        var overviewTitle = overview.querySelector('.service-title');
        if (overviewTitle) overviewTitle.textContent = copy.productList;
    }

    var productToggle = document.querySelector('.header .menu-item[data-page="porfolio-list.html"] > .product-dropdown-toggle');
    if (productToggle) productToggle.setAttribute('aria-label', copy.productList);

    setServiceFlyout(0, pages.electronics, copy.electronicsSubtitle, copy.electronicsTitle);
    setServiceFlyout(1, pages.spare, copy.spareSubtitle, copy.spareTitle);
    setServiceFlyout(2, pages.security, copy.securitySubtitle, copy.securityTitle);
    setServiceFlyout(3, pages.solar, copy.solarSubtitle, copy.solarTitle);
    setServiceFlyout(4, pages.it, copy.itSubtitle, copy.itTitle);
    setServiceFlyout(5, pages.assembly, copy.assemblySubtitle, copy.assemblyTitle);

    var hideText = document.querySelector('#menuHideBtn span');
    if (hideText) hideText.textContent = copy.hide;
    var colorText = document.querySelector('#colorCustomizerBtn span');
    if (colorText) colorText.textContent = copy.colors;
    var menuShowText = document.querySelector('#menuShowBtn .msb-text');
    if (menuShowText) menuShowText.textContent = copy.menu;

    setLink('#menu-mobile a[href$="index.html"], #menu-mobile a[href$="index-en.html"]', pages.home, copy.home);
    setLink('#menu-mobile a[href$="porfolio-list.html"], #menu-mobile a[href$="porfolio-list-en.html"]', pages.products, copy.products);
    setLink('#menu-mobile a[href$="services.html"], #menu-mobile a[href$="services-en.html"]', pages.services, copy.services);
    setLink('#menu-mobile a[href$="services-details.html"], #menu-mobile a[href$="services-details-en.html"]', pages.details, copy.serviceOverview);
    setLink('#menu-mobile a[href$="about-us.html"], #menu-mobile a[href$="about-us-en.html"]', pages.about, copy.about);
    setLink('#menu-mobile a[href$="contact.html"], #menu-mobile a[href$="contact-en.html"]', pages.contact, copy.contact);
}

// Function to set the active menu item based on current page
function setActiveMenu() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const basePath = currentPath.replace(/-en\.html$/, '.html');
    const menuItems = document.querySelectorAll('.menu-item[data-page]');

    menuItems.forEach(item => {
        if (item.getAttribute('data-page') === basePath) {
            item.classList.add('current-menu-item');
        } else {
            item.classList.remove('current-menu-item');
        }
    });

    // For sub-menu items, if current page is a sub-page, set parent active
    const subPages = {
        'porfolio-grid.html': 'porfolio-list.html',
        'porfolio-list.html': 'porfolio-list.html',
        'porfolio-details.html': 'porfolio-list.html',
        'porfolio-electronics.html': 'porfolio-list.html',
        'porfolio-spare-parts.html': 'porfolio-list.html',
        'porfolio-security.html': 'porfolio-list.html',
        'porfolio-solar.html': 'porfolio-list.html',
        'porfolio-it-equipment.html': 'porfolio-list.html',
        'porfolio-assembly.html': 'porfolio-list.html',
        'services.html': 'services',
        'services-details.html': 'services'
    };

    if (subPages[basePath]) {
        const parentItem = document.querySelector(`.menu-item[data-page="${subPages[basePath]}"]`);
        if (parentItem) {
            parentItem.classList.add('current-menu-item');
        }
    }
}

// -------------------------------------------------------
// Dropdown toggles
// Products opens on click/tap, and the nested product list
// can be opened/closed independently.
// -------------------------------------------------------
function initDropdownToggles() {
    var header = document.getElementById('header');
    if (!header) return;

    var productsItem = header.querySelector('.menu-item.menu-item-has-children[data-page="porfolio-list.html"]');
    if (!productsItem) return;

    var productsToggle = productsItem.querySelector(':scope > .product-dropdown-toggle');
    var flyoutItem = productsItem.querySelector('.sub-menu-services > .sub-menu-item.has-child');
    var flyoutLink = flyoutItem ? flyoutItem.querySelector(':scope > .item-link-2') : null;

    function setExpanded(item, open) {
        if (!item) return;
        item.classList.toggle('is-dropdown-open', open);
        var toggle = item.querySelector(':scope > .product-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function setFlyoutExpanded(item, open) {
        if (!item) return;
        item.classList.toggle('is-flyout-open', open);
        var link = item.querySelector(':scope > a');
        if (link) link.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function syncSidebarProductsFocus() {
        var shouldFocus = document.body.classList.contains('nav-sidebar') &&
            productsItem.classList.contains('is-dropdown-open');
        document.body.classList.toggle('sidebar-products-focus', shouldFocus);
    }

    function closeAll() {
        setExpanded(productsItem, false);
        setFlyoutExpanded(flyoutItem, false);
        syncSidebarProductsFocus();
    }

    if (productsToggle) {
        productsToggle.setAttribute('aria-haspopup', 'true');
        productsToggle.setAttribute('aria-expanded', 'false');
        productsToggle.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            var willOpen = !productsItem.classList.contains('is-dropdown-open');
            setExpanded(productsItem, willOpen);
            if (willOpen && document.body.classList.contains('nav-sidebar')) {
                setFlyoutExpanded(flyoutItem, true);
            }
            if (!willOpen) setFlyoutExpanded(flyoutItem, false);
            syncSidebarProductsFocus();
        });
    }

    if (flyoutLink && flyoutItem) {
        flyoutLink.setAttribute('aria-haspopup', 'true');
        flyoutLink.setAttribute('aria-expanded', 'false');
        flyoutLink.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            setFlyoutExpanded(flyoutItem, !flyoutItem.classList.contains('is-flyout-open'));
            setExpanded(productsItem, true);
            syncSidebarProductsFocus();
        });
    }

    header.querySelectorAll('.sub-menu a').forEach(function (link) {
        if (link === flyoutLink) return;
        link.addEventListener('click', function () {
            closeAll();
        });
    });

    document.addEventListener('click', function (event) {
        if (!header.contains(event.target)) closeAll();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeAll();
    });

    var layoutBtn = document.getElementById('layoutToggleBtn');
    if (layoutBtn) {
        layoutBtn.addEventListener('click', function () {
            setTimeout(syncSidebarProductsFocus, 0);
        });
    }

    window.addEventListener('resize', syncSidebarProductsFocus, { passive: true });
}

// Highlight the language button that matches the current page language
function initLangSwitcher() {
    var page  = window.location.pathname.split('/').pop() || 'index.html';
    var isEN  = isEnglishPage(page);

    // Derive counterpart hrefs dynamically
    var thPage, enPage;
    if (isEN) {
        thPage = page.replace(/-en\.html$/, '.html');
        enPage = page;
    } else {
        thPage = page;
        enPage = page.replace(/\.html$/, '-en.html');
    }

    // Update desktop header lang buttons
    var btnTh = document.getElementById('langBtnTh');
    var btnEn = document.getElementById('langBtnEn');
    if (btnTh) {
        btnTh.href = thPage;
        btnTh.classList.toggle('lang-active', !isEN);
    }
    if (btnEn) {
        btnEn.href = enPage;
        btnEn.classList.toggle('lang-active', isEN);
    }

    // Inject / update lang switcher inside Bootstrap offcanvas #canvasMobile
    var mobileNav = document.querySelector('#canvasMobile .mobile-main-nav');
    if (mobileNav && !document.getElementById('mobileNavLang')) {
        var langHtml = '<div class="mobile-nav-lang" id="mobileNavLang">' +
            '<div class="language-switcher hdr-lang-sw" style="width:100%">' +
            '<a href="' + thPage + '" class="lang-btn lang-th' + (!isEN ? ' lang-active' : '') + '" title="ภาษาไทย">' +
            '<img src="https://flagcdn.com/th.svg" alt="TH" class="lang-flag"><span class="lang-code">TH</span></a>' +
            '<a href="' + enPage + '" class="lang-btn lang-en' + (isEN ? ' lang-active' : '') + '" title="English">' +
            '<img src="https://flagcdn.com/gb.svg" alt="EN" class="lang-flag"><span class="lang-code">EN</span></a>' +
            '</div></div>';
        mobileNav.insertAdjacentHTML('afterend', langHtml);
    }

    // Highlight active page in mobile offcanvas menu
    var mobileItems = document.querySelectorAll('#menu-mobile .menu-item[data-page]');
    mobileItems.forEach(function(item) {
        if (item.getAttribute('data-page') === page.replace(/-en\.html$/, '.html')) item.classList.add('current-menu-item');
    });

    // Highlight active page in custom mobile sidebar
    var sidebarItems = document.querySelectorAll('#mobileSidebar .menu-item[data-page]');
    sidebarItems.forEach(function(item) {
        if (item.getAttribute('data-page') === page.replace(/-en\.html$/, '.html')) item.classList.add('current-menu-item');
        var mobileBtnTh = document.getElementById('mobileLangBtnTh');
        var mobileBtnEn = document.getElementById('mobileLangBtnEn');
        if (mobileBtnTh) { mobileBtnTh.href = thPage; mobileBtnTh.classList.toggle('lang-active', !isEN); }
        if (mobileBtnEn) { mobileBtnEn.href = enPage; mobileBtnEn.classList.toggle('lang-active', isEN); }
    });
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', includeHeader);

// -------------------------------------------------------
// Footer Cards Include
// -------------------------------------------------------
(function loadFooterCardsCSS() {
    if (!document.getElementById('footer-cards-css')) {
        var link = document.createElement('link');
        link.id = 'footer-cards-css';
        link.rel = 'stylesheet';
        link.href = 'css/footer-cards.css';
        document.head.appendChild(link);
    }
})();

function includeFooterCards() {
    fetch(window.FOOTER_CARDS_FILE || 'footer-cards.html')
        .then(function (response) { return response.text(); })
        .then(function (html) {
            var footerBottom = document.querySelector('.footer-bottom');
            if (!footerBottom) return;

            // Remove existing footer-middle container (old or new)
            var existingMiddle = document.querySelector('.footer-middle');
            if (existingMiddle) {
                var existingContainer = existingMiddle.closest('.tf-container');
                if (existingContainer) {
                    existingContainer.remove();
                } else {
                    existingMiddle.remove();
                }
            }

            // Insert new footer cards before the tf-container that wraps footer-bottom
            var footerBottomContainer = footerBottom.closest('.tf-container');
            if (footerBottomContainer) {
                footerBottomContainer.insertAdjacentHTML('beforebegin', html);
                initSharedLogoEffects();
            }
        })
        .catch(function (error) { console.error('Error loading footer cards:', error); });
}

document.addEventListener('DOMContentLoaded', includeFooterCards);

// -------------------------------------------------------
// Hide / Show Menu
// Preference saved in localStorage as 'navHidden'
// -------------------------------------------------------
function initHideMenu() {
    var btn     = document.getElementById('menuHideBtn');
    var showBtn = document.getElementById('menuShowBtn');
    var hdr     = document.getElementById('header');
    if (!btn || !hdr) return;

    var KEY = 'navHidden';

    // Collapse top-nav header (height: 0 + opacity: 0)
    function collapseTopNav(animate) {
        if (!animate) {
            hdr.style.overflow = 'hidden';
            hdr.style.height   = '0';
            hdr.style.opacity  = '0';
            hdr.style.transition = '';
            document.body.classList.add('nav-hidden');
            return;
        }
        var h = hdr.offsetHeight;
        hdr.style.overflow   = 'hidden';
        hdr.style.height     = h + 'px';
        hdr.style.opacity    = '1';
        hdr.style.transition = 'none';
        requestAnimationFrame(function () {
            hdr.style.transition = 'height 0.32s ease, opacity 0.22s ease';
            requestAnimationFrame(function () {
                hdr.style.height  = '0';
                hdr.style.opacity = '0';
                document.body.classList.add('nav-hidden');
            });
        });
    }

    // Expand top-nav header back to natural height
    function expandTopNav() {
        document.body.classList.remove('nav-hidden');
        hdr.style.overflow   = 'hidden';
        hdr.style.transition = 'none';

        hdr.style.height  = '';
        hdr.style.opacity = '1';
        var naturalH = hdr.getBoundingClientRect().height;

        hdr.style.height  = '0';
        hdr.style.opacity = '0';
        void hdr.offsetHeight;

        requestAnimationFrame(function () {
            hdr.style.transition = 'height 0.32s ease, opacity 0.22s ease';
            hdr.style.height     = naturalH + 'px';
            hdr.style.opacity    = '1';
            setTimeout(function () {
                hdr.style.height     = '';
                hdr.style.overflow   = '';
                hdr.style.transition = '';
                hdr.style.opacity    = '';
            }, 360);
        });
    }

    function doHide(animate) {
        if (document.body.classList.contains('nav-sidebar')) {
            document.body.classList.add('nav-hidden');
        } else {
            collapseTopNav(animate !== false);
        }
        localStorage.setItem(KEY, '1');
    }

    function doShow() {
        if (document.body.classList.contains('nav-sidebar')) {
            document.body.classList.remove('nav-hidden');
        } else {
            expandTopNav();
        }
        localStorage.setItem(KEY, '0');
    }

    // Restore on page load (no animation)
    if (localStorage.getItem(KEY) === '1' && !window.matchMedia('(max-width: 767px)').matches) {
        doHide(false);
    }

    btn.addEventListener('click', function () { doHide(); });
    if (showBtn) showBtn.addEventListener('click', function () { doShow(); });
}

// -------------------------------------------------------
// Layout Toggle: Top nav <-> Sidebar nav
// Preference is saved in localStorage as 'navLayout'
// -------------------------------------------------------
function initLayoutToggle() {
    const btn = document.getElementById('layoutToggleBtn');
    const icon = document.getElementById('layoutToggleIcon');
    const label = document.getElementById('layoutToggleLabel');
    if (!btn) return;

    const SIDEBAR_ICON = `
        <rect x="2" y="3" width="5" height="18" rx="1"/>
        <line x1="11" y1="3" x2="22" y2="3"/>
        <line x1="11" y1="8" x2="22" y2="8"/>
        <line x1="11" y1="13" x2="22" y2="13"/>
        <line x1="11" y1="18" x2="22" y2="18"/>`;

    const TOPNAV_ICON = `
        <rect x="2" y="3" width="20" height="4" rx="1"/>
        <line x1="2" y1="11" x2="22" y2="11"/>
        <line x1="2" y1="15" x2="22" y2="15"/>
        <line x1="2" y1="19" x2="22" y2="19"/>`;

    function applyLayout(mode) {
        if (mode === 'sidebar') {
            document.body.classList.add('nav-sidebar');
            icon.innerHTML = TOPNAV_ICON;
            label.textContent = 'Nav';
        } else {
            document.body.classList.remove('nav-sidebar');
            icon.innerHTML = SIDEBAR_ICON;
            label.textContent = 'Sidebar';
        }
    }

    // Restore saved preference
    const saved = localStorage.getItem('navLayout') || 'top';
    applyLayout(saved);

    btn.addEventListener('click', function () {
        const current = localStorage.getItem('navLayout') || 'top';
        const next = current === 'sidebar' ? 'top' : 'sidebar';
        localStorage.setItem('navLayout', next);
        applyLayout(next);
    });

    window.addEventListener('resize', function () {
        applyLayout(localStorage.getItem('navLayout') || 'top');
    }, { passive: true });
}
// -------------------------------------------------------
// Color Customizer: Header BG, Font, Accent, Border
// Preference is saved in localStorage as 'navColors'
// -------------------------------------------------------
function initColorCustomizer() {
    var DEFAULTS = {
        bg:          '#4f7db8',
        bg2:         '#43BAFF',
        bg3:         '#0a1a3a',
        bgMode:      'gradient',
        bgDir:       '135deg',
        font:        '#ffffff',
        accent:      '#00b4d8',
        border:      'rgba(0,180,216,0.2)',
        pageBg:      '#eef5f8',
        waveShow:      true,
        waveBack:      '#1b3e7a',
        waveFront:     '#00b4d8',
        waveHeight:    60,
        waveAmplitude: 30,
        waveOpacity:   85
    };

    var STYLE_ID = 'nav-color-override';

    function hexFromRgba(v) {
        // If already hex, return as-is
        if (/^#/.test(v)) return v;
        // Convert rgba/rgb to hex (approx, ignores alpha)
        var m = v.match(/\d+/g);
        if (!m || m.length < 3) return v;
        return '#' + [m[0],m[1],m[2]].map(function(n){ return parseInt(n).toString(16).padStart(2,'0'); }).join('');
    }

    /* ── Wave helpers ── */
    function buildWavePaths(h, a) {
        var mid = h / 2;
        // Clamp amplitude so wave stays within viewBox
        a = Math.min(a, Math.floor(mid * 0.96));
        var r = function(v) { return Math.round(v * 10) / 10; };
        var back = 'M0,' + r(mid) +
            ' C240,' + r(mid + a) + ' 480,' + r(mid - a) + ' 720,' + r(mid) +
            ' C960,' + r(mid + a) + ' 1200,' + r(mid - a) + ' 1440,' + r(mid) +
            ' L1440,' + h + ' L0,' + h + ' Z';
        var front = 'M0,' + r(mid - a * 0.33) +
            ' C360,' + r(mid + a * 0.83) + ' 720,' + r(mid - a) + ' 1080,' + r(mid + a * 0.17) +
            ' C1260,' + r(mid + a * 0.73) + ' 1380,' + r(mid - a * 0.33) + ' 1440,' + r(mid - a * 0.5) +
            ' L1440,' + h + ' L0,' + h + ' Z';
        return { back: back, front: front };
    }

    function applyWave(colors) {
        var wrap  = document.querySelector('.header-wave-wrap');
        var back  = document.querySelector('.header-wave-back path');
        var front = document.querySelector('.header-wave-front path');
        if (!wrap) return;

        var show    = (colors.waveShow !== false);
        var h       = parseInt(colors.waveHeight    || DEFAULTS.waveHeight);
        var a       = parseInt(colors.waveAmplitude !== undefined ? colors.waveAmplitude : DEFAULTS.waveAmplitude);
        var opacity = parseInt(colors.waveOpacity   || DEFAULTS.waveOpacity) / 100;

        wrap.style.display = show ? '' : 'none';
        wrap.style.height  = h + 'px';

        // sync SVG viewBox height so the wave fills the wrap
        document.querySelectorAll('.header-wave').forEach(function(svg) {
            svg.setAttribute('viewBox', '0 0 1440 ' + h);
            svg.style.height = h + 'px';
        });

        // Regenerate wave paths based on amplitude
        var paths = buildWavePaths(h, a);
        if (back)  back.setAttribute('d', paths.back);
        if (front) front.setAttribute('d', paths.front);

        if (back)  back.setAttribute('fill', colors.waveBack  || DEFAULTS.waveBack);
        if (front) {
            front.setAttribute('fill', colors.waveFront || DEFAULTS.waveFront);
            front.setAttribute('fill-opacity', opacity);
        }
    }

    function buildBgValue(colors) {
        if (colors.bgMode === 'gradient') {
            var c2 = colors.bg2 || colors.bg;
            var c3 = colors.bg3 || null;
            var stops = c3
                ? colors.bg + ', ' + c2 + ', ' + c3
                : colors.bg + ', ' + c2;
            return 'linear-gradient(' + (colors.bgDir || 'to right') + ', ' + stops + ')';
        }
        if (colors.bgMode === 'radial') {
            var c2r = colors.bg2 || colors.bg;
            var c3r = colors.bg3 || null;
            var stopsR = c3r
                ? colors.bg + ', ' + c2r + ', ' + c3r
                : colors.bg + ', ' + c2r;
            return 'radial-gradient(ellipse at center, ' + stopsR + ')';
        }
        return colors.bg;
    }

    function applyColors(colors) {
        var el = document.getElementById(STYLE_ID);
        if (!el) {
            el = document.createElement('style');
            el.id = STYLE_ID;
            document.head.appendChild(el);
        }
        var bgValue = buildBgValue(colors);
        el.textContent = [
            '.header.header-sticky,',
            '.header.header-sticky.is-scrolled {',
            '  background: ' + bgValue + ' !important;',
            '  border-color: ' + colors.border + ' !important;',
            '}',
            '.header .item-link,',
            '.header .main-menu a,',
            '.header .nav-megamenu .burger span,',
            '.header .language-switcher a {',
            '  color: ' + colors.font + ' !important;',
            '}',
            '.header .language-switcher a:hover,',
            '.header .language-switcher a.lang-active {',
            '  color: #07233a !important;',
            '  background: #ffffff !important;',
            '}',
            '.header .current-menu-item > a,',
            '.header .menu-item > a:hover {',
            '  color: #ffffff !important;',
            '  background: rgba(255, 255, 255, 0.16) !important;',
            '  box-shadow: inset 0 0 0 1px ' + colors.accent + ', 0 8px 22px rgba(0, 0, 0, 0.18) !important;',
            '}',
            '.header .main-menu {',
            '  border-left-color: ' + colors.border + ' !important;',
            '}',
            '.header .logo-header2 {',
            '  border-bottom-color: ' + colors.border + ' !important;',
            '}',
            '#colorCustomizerBtn { color: ' + colors.font + ' !important; }',
            '#layoutToggleBtn { color: ' + colors.font + ' !important; }',
            'body, .wrapper { background-color: ' + colors.pageBg + ' !important; }',
            '.main-content, .footer, .top-bar { background-color: ' + colors.pageBg + ' !important; }'
        ].join('\n');

        // Sync dot + preview strip
        var dotBg     = document.getElementById('cpBgDot');
        var dotFont   = document.getElementById('cpFontDot');
        var dotAccent = document.getElementById('cpAccentDot');
        var dotBorder = document.getElementById('cpBorderDot');
        var dotPageBg = document.getElementById('cpPageBgDot');
        var previewEl = document.getElementById('cpBgPreview');
        if (dotBg)     dotBg.style.background          = bgValue;
        if (dotFont)   dotFont.style.backgroundColor   = colors.font;
        if (dotAccent) dotAccent.style.backgroundColor = colors.accent;
        if (dotBorder) dotBorder.style.backgroundColor = colors.border;
        if (dotPageBg) dotPageBg.style.backgroundColor = colors.pageBg;
        if (previewEl) previewEl.style.background      = bgValue;

        applyWave(colors);
    }

    var COLOR_VER = 'v6-page-bg-eef5f8'; // bump this to force-reset saved prefs

    function loadColors() {
        var saved = localStorage.getItem('navColors');
        if (saved) {
            try {
                var parsed = JSON.parse(saved);
                // If saved before this theme version, discard and use defaults
                if (parsed._ver !== COLOR_VER) throw new Error('stale');
                return parsed;
            } catch(e) {}
        }
        var d = Object.assign({}, DEFAULTS);
        d._ver = COLOR_VER;
        return d;
    }

    function saveColors(colors) {
        colors._ver = COLOR_VER;
        localStorage.setItem('navColors', JSON.stringify(colors));
    }

    // Restore on load
    var current = loadColors();
    applyColors(current);

    // Wait for DOM elements (they are inside the loaded header)
    var panel         = document.getElementById('colorCustomizerPanel');
    var trigger       = document.getElementById('colorCustomizerBtn');
    var closeBtn      = document.getElementById('colorCustomizerClose');
    var cpBg          = document.getElementById('cpBg');
    var cpBg2         = document.getElementById('cpBg2');
    var cpBg3         = document.getElementById('cpBg3');
    var cpGradDir     = document.getElementById('cpGradDir');
    var cpBgModeSolid  = document.getElementById('cpBgModeSolid');
    var cpBgModeGrad   = document.getElementById('cpBgModeGrad');
    var cpBgModeRadial = document.getElementById('cpBgModeRadial');
    var cpFont          = document.getElementById('cpFont');
    var cpAccent        = document.getElementById('cpAccent');
    var cpBorder        = document.getElementById('cpBorder');
    var cpPageBg        = document.getElementById('cpPageBg');
    var cpWaveShow      = document.getElementById('cpWaveShow');
    var cpWaveBack      = document.getElementById('cpWaveBack');
    var cpWaveFront     = document.getElementById('cpWaveFront');
    var cpWaveHeight    = document.getElementById('cpWaveHeight');
    var cpWaveHeightVal = document.getElementById('cpWaveHeightVal');
    var cpWaveAmplitude    = document.getElementById('cpWaveAmplitude');
    var cpWaveAmplitudeVal = document.getElementById('cpWaveAmplitudeVal');
    var cpWaveOpacity   = document.getElementById('cpWaveOpacity');
    var cpWaveOpacityVal= document.getElementById('cpWaveOpacityVal');
    var cpWaveControls  = document.getElementById('cpWaveControls');
    var applyBtn        = document.getElementById('cpApply');
    var resetBtn        = document.getElementById('cpReset');

    if (!panel || !trigger) return;

    // Set picker values from current
    cpBg.value     = hexFromRgba(current.bg);
    cpFont.value   = hexFromRgba(current.font);
    cpAccent.value = hexFromRgba(current.accent);
    cpBorder.value = hexFromRgba(current.border);
    cpPageBg.value = hexFromRgba(current.pageBg || DEFAULTS.pageBg);
    if (cpBg2)          cpBg2.value          = hexFromRgba(current.bg2  || DEFAULTS.bg2);
    if (cpBg3)          cpBg3.value          = hexFromRgba(current.bg3  || DEFAULTS.bg3);
    if (cpGradDir)      cpGradDir.value      = current.bgDir || DEFAULTS.bgDir;
    if (cpWaveBack)     cpWaveBack.value     = hexFromRgba(current.waveBack  || DEFAULTS.waveBack);
    if (cpWaveFront)    cpWaveFront.value    = hexFromRgba(current.waveFront || DEFAULTS.waveFront);
    if (cpWaveHeight)   { cpWaveHeight.value = current.waveHeight || DEFAULTS.waveHeight; if (cpWaveHeightVal) cpWaveHeightVal.textContent = (current.waveHeight || DEFAULTS.waveHeight) + 'px'; }
    if (cpWaveAmplitude) { cpWaveAmplitude.value = current.waveAmplitude !== undefined ? current.waveAmplitude : DEFAULTS.waveAmplitude; if (cpWaveAmplitudeVal) cpWaveAmplitudeVal.textContent = (current.waveAmplitude !== undefined ? current.waveAmplitude : DEFAULTS.waveAmplitude); }
    if (cpWaveOpacity)  { cpWaveOpacity.value= current.waveOpacity|| DEFAULTS.waveOpacity; if (cpWaveOpacityVal) cpWaveOpacityVal.textContent= (current.waveOpacity || DEFAULTS.waveOpacity) + '%'; }
    if (cpWaveShow)     cpWaveShow.checked   = (current.waveShow !== false);
    if (cpWaveControls) cpWaveControls.style.display = (current.waveShow !== false) ? '' : 'none';

    // Wave show/hide toggle
    if (cpWaveShow) {
        cpWaveShow.addEventListener('change', function() {
            if (cpWaveControls) cpWaveControls.style.display = this.checked ? '' : 'none';
            applyWave(getLiveColors());
        });
    }
    // Wave range labels
    if (cpWaveHeight) {
        cpWaveHeight.addEventListener('input', function() {
            if (cpWaveHeightVal) cpWaveHeightVal.textContent = this.value + 'px';
            applyWave(getLiveColors());
        });
    }
    if (cpWaveAmplitude) {
        cpWaveAmplitude.addEventListener('input', function() {
            if (cpWaveAmplitudeVal) cpWaveAmplitudeVal.textContent = this.value;
            applyWave(getLiveColors());
        });
    }
    if (cpWaveOpacity) {
        cpWaveOpacity.addEventListener('input', function() {
            if (cpWaveOpacityVal) cpWaveOpacityVal.textContent = this.value + '%';
            applyWave(getLiveColors());
        });
    }

    // Sync gradient-extra UI rows and mode button active state
    function syncGradMode(mode) {
        var isGrad   = (mode === 'gradient' || mode === 'radial');
        var isLinear = (mode === 'gradient');
        document.querySelectorAll('.ccp-grad-only').forEach(function(el) {
            el.style.display = isGrad ? 'flex' : 'none';
        });
        document.querySelectorAll('.ccp-linear-only').forEach(function(el) {
            el.style.display = isLinear ? 'flex' : 'none';
        });
        if (cpBgModeSolid)  cpBgModeSolid.classList.toggle('ccp-mode-active',  mode === 'solid');
        if (cpBgModeGrad)   cpBgModeGrad.classList.toggle('ccp-mode-active',   mode === 'gradient');
        if (cpBgModeRadial) cpBgModeRadial.classList.toggle('ccp-mode-active', mode === 'radial');
    }
    syncGradMode(current.bgMode || 'solid');

    // Mode buttons
    if (cpBgModeSolid) {
        cpBgModeSolid.addEventListener('click', function() {
            current.bgMode = 'solid';
            syncGradMode('solid');
            applyColors(getLiveColors());
        });
    }
    if (cpBgModeGrad) {
        cpBgModeGrad.addEventListener('click', function() {
            current.bgMode = 'gradient';
            syncGradMode('gradient');
            applyColors(getLiveColors());
        });
    }
    if (cpBgModeRadial) {
        cpBgModeRadial.addEventListener('click', function() {
            current.bgMode = 'radial';
            syncGradMode('radial');
            applyColors(getLiveColors());
        });
    }

    // Collect current live picker values (helper used by preview, apply, reset)
    function getLiveColors() {
        return {
            bg:          cpBg.value,
            bg2:         cpBg2     ? cpBg2.value     : (current.bg2  || DEFAULTS.bg2),
            bg3:         cpBg3     ? cpBg3.value     : (current.bg3  || DEFAULTS.bg3),
            bgMode:      current.bgMode || 'solid',
            bgDir:       cpGradDir ? cpGradDir.value : (current.bgDir || DEFAULTS.bgDir),
            font:        cpFont.value,
            accent:      cpAccent.value,
            border:      cpBorder.value,
            pageBg:      cpPageBg.value,
            waveShow:    cpWaveShow   ? cpWaveShow.checked        : (current.waveShow !== false),
            waveBack:    cpWaveBack   ? cpWaveBack.value          : (current.waveBack  || DEFAULTS.waveBack),
            waveFront:   cpWaveFront  ? cpWaveFront.value         : (current.waveFront || DEFAULTS.waveFront),
            waveHeight:  cpWaveHeight ? parseInt(cpWaveHeight.value)  : (current.waveHeight  || DEFAULTS.waveHeight),
            waveAmplitude: cpWaveAmplitude ? parseInt(cpWaveAmplitude.value) : (current.waveAmplitude !== undefined ? current.waveAmplitude : DEFAULTS.waveAmplitude),
            waveOpacity: cpWaveOpacity? parseInt(cpWaveOpacity.value) : (current.waveOpacity || DEFAULTS.waveOpacity)
        };
    }

    // Live preview on color change
    var liveInputs = [cpBg, cpBg2, cpBg3, cpFont, cpAccent, cpBorder, cpPageBg, cpWaveBack, cpWaveFront];
    liveInputs.filter(Boolean).forEach(function(input) {
        input.addEventListener('input', function() {
            applyColors(getLiveColors());
        });
    });
    if (cpGradDir) {
        cpGradDir.addEventListener('change', function() {
            applyColors(getLiveColors());
        });
    }

    // Toggle panel open/close
    trigger.addEventListener('click', function() {
        var isOpen = panel.classList.toggle('ccp-open');
        trigger.classList.toggle('ccp-active', isOpen);
    });

    // Close button
    closeBtn.addEventListener('click', function() {
        panel.classList.remove('ccp-open');
        trigger.classList.remove('ccp-active');
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (!panel.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) {
            panel.classList.remove('ccp-open');
            trigger.classList.remove('ccp-active');
        }
    });

    // Apply button — save
    applyBtn.addEventListener('click', function() {
        var colors = getLiveColors();
        applyColors(colors);
        saveColors(colors);
        current = colors;
        // Flash button
        applyBtn.textContent = 'Saved!';
        setTimeout(function() { applyBtn.textContent = 'Apply'; }, 1200);
    });

    // Reset button
    resetBtn.addEventListener('click', function() {
        current = Object.assign({}, DEFAULTS);
        cpBg.value     = hexFromRgba(DEFAULTS.bg);
        cpFont.value   = hexFromRgba(DEFAULTS.font);
        cpAccent.value = hexFromRgba(DEFAULTS.accent);
        cpBorder.value = hexFromRgba(DEFAULTS.border);
        cpPageBg.value = hexFromRgba(DEFAULTS.pageBg);
        if (cpBg2)          cpBg2.value          = hexFromRgba(DEFAULTS.bg2);
        if (cpBg3)          cpBg3.value          = hexFromRgba(DEFAULTS.bg3);
        if (cpGradDir)      cpGradDir.value      = DEFAULTS.bgDir;
        if (cpWaveBack)     cpWaveBack.value     = hexFromRgba(DEFAULTS.waveBack);
        if (cpWaveFront)    cpWaveFront.value    = hexFromRgba(DEFAULTS.waveFront);
        if (cpWaveHeight)   { cpWaveHeight.value = DEFAULTS.waveHeight;     if (cpWaveHeightVal)     cpWaveHeightVal.textContent     = DEFAULTS.waveHeight  + 'px'; }
        if (cpWaveAmplitude) { cpWaveAmplitude.value = DEFAULTS.waveAmplitude; if (cpWaveAmplitudeVal) cpWaveAmplitudeVal.textContent = DEFAULTS.waveAmplitude; }
        if (cpWaveOpacity)  { cpWaveOpacity.value= DEFAULTS.waveOpacity; if (cpWaveOpacityVal) cpWaveOpacityVal.textContent = DEFAULTS.waveOpacity + '%'; }
        if (cpWaveShow)     { cpWaveShow.checked = DEFAULTS.waveShow; if (cpWaveControls) cpWaveControls.style.display = DEFAULTS.waveShow ? '' : 'none'; }
        syncGradMode(DEFAULTS.bgMode);
        applyColors(current);
        saveColors(current);
    });
}
