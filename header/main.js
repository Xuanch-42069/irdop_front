class UNI_HEADER {
    constructor(brf) {
        this.brf = brf;
        PAGES.UNI_HEADER = this;
        BILRD_ids.UNI_HEADER = 'iQIcyPNviESYvNAKgBvcgA';
        this.el = {
            btn_mobile_menu: document.querySelector('.uni-header.btn_mobile_menu'),
            search_desktop : {
                btn_desktop_search: document.querySelector('.uni-header.btn_desktop_search'),
                input_desktop_search : document.querySelector('.uni-header.input_desktop_search'),
                btn_desktop_search_close : document.querySelector('.uni-header.btn_desktop_search_close'),
            },
            search_mobile : {
                btn_mobile_search: document.querySelector('.uni-header.btn_mobile_search'),
                input_mobile_search : document.querySelector('.uni-header.input_mobile_search'),
                btn_mobile_search_close : document.querySelector('.uni-header.btn_mobile_search_close'),
            },
            nav_container_desktop : {
                reference_material : document.querySelector('.uni-header.nav_container_desktop.reference_material'),
                reference_material_submenu : document.querySelector('.uni-header.nav_container_desktop.reference_material.nav_submenu_container'),
                material_doc_lookup : document.querySelector('.uni-header.nav_container_desktop.material_doc_lookup'),
                testing_service : document.querySelector('.uni-header.nav_container_desktop.testing_service'),
                testing_service_submenu : document.querySelector('.uni-header.nav_container_desktop.testing_service.nav_submenu_container'),
            },
        }
        this.init();
    }

    init() {
        // set path to all element in header
        document.querySelectorAll('a[data-route]').forEach((link) => {
            link.href = `/${get_lang()}${link.dataset.route}`;
        });

        // sync search_mobile and search_desktop
        this.el.search_desktop.input_desktop_search.addEventListener('input', (e) => {
            this.el.search_mobile.input_mobile_search.value = e.target.value;
        });
        this.el.search_mobile.input_mobile_search.addEventListener('input', (e) => {
            this.el.search_desktop.input_desktop_search.value = e.target.value;
        });
        // click search on mobile trigger click search on desktop
        this.el.search_mobile.btn_mobile_search.addEventListener('click', (e) => {
            this.el.search_desktop.btn_desktop_search.click();
        });
        // click search on desktop trigger search site wide
        this.el.search_desktop.btn_desktop_search.addEventListener('click', (e) => {
            console.log('search site wide');
        });
        // sync close search_mobile and search_desktop
        this.el.search_mobile.btn_mobile_search_close.addEventListener('click', (e) => {
            this.search_input_remove();
        });
        // click close search on desktop clear all search input
        this.el.search_desktop.btn_desktop_search_close.addEventListener('click', (e) => {
            this.search_input_remove();
        }); 

        // press enter on search input
        this.el.search_desktop.input_desktop_search.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search_handle(e.target.value);
        });
        this.el.search_mobile.input_mobile_search.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search_handle(e.target.value);
        });


        // reference_material submenu desktop hover
        this.el.nav_container_desktop.reference_material.addEventListener('mouseover', (e) => {
            this.el.nav_container_desktop.reference_material_submenu.classList.add('active');
        });
        this.el.nav_container_desktop.reference_material.addEventListener('mouseout', (e) => {
            this.el.nav_container_desktop.reference_material_submenu.classList.remove('active');
        });

        // testing_service submenu desktop hover
        this.el.nav_container_desktop.testing_service.addEventListener('mouseover', (e) => {
            this.el.nav_container_desktop.testing_service_submenu.classList.add('active');
        });
        this.el.nav_container_desktop.testing_service.addEventListener('mouseout', (e) => {
            this.el.nav_container_desktop.testing_service_submenu.classList.remove('active');
        });

        // toggle menu mobile
        this.el.btn_mobile_menu.addEventListener('click', (e) => {
            this.el.nav_container.classList.toggle('active');
        });

        // set url site search
        let url = new URL(window.location.href);
        let search = url.searchParams.get('site_search');
        if (search) this.search_input_set(search);
        else this.search_input_remove();

        console.log('header page loaded');
    }

    search_input_set(value) {
        this.el.search_desktop.input_desktop_search.value = value;
        this.el.search_mobile.input_mobile_search.value = value;
        show_el(this.el.search_desktop.btn_desktop_search_close);
        show_el(this.el.search_mobile.btn_mobile_search_close);
    }

    search_input_remove () {
        this.el.search_desktop.input_desktop_search.value = '';
        this.el.search_mobile.input_mobile_search.value = '';
        hide_el(this.el.search_desktop.btn_desktop_search_close);
        hide_el(this.el.search_mobile.btn_mobile_search_close);
        // remove site_search from url
        let url = new URL(window.location.href);
        url.searchParams.delete('site_search');
        window.history.pushState({}, '', url);
    }

    search_handle(value) {
        // Directly set the 'site_search' query parameter
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set('site_search', value);
        
        // Update the browser's URL without reloading the page. This step is purely for parameter manipulation.
        history.pushState(null, '', window.location.pathname + '?' + queryParams.toString());
        
        // Now, call redirect_page to navigate to "/search" or any desired path.
        // Note: Pass "/search" or any path you need to redirect to.
        redirect_page("/search");
    }

    state_logedin() {
        console.log('auth_logedin');
    }

    state_guess() {
        console.log('auth_guess');
    }
}