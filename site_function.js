
var LANGUAGES = ['vi', 'en'];
var DEFAULT_LANG = 'vi';

BILRD_ids.UNI_HEADER_VI = 'iQIcyPNviESYvNAKgBvcgA';
BILRD_ids.UNI_HEADER_EN = '4XndrJYLCEekWE7EAwD4cw';


function hide_el (el) {
    // add display-none class
    el.classList.add('display-none');
    // if el display is set, save it to data-display_before and set display to none
    if (el.style.display) {
        el.dataset.display_before = el.style.display;
        el.style.display = none;
    }
}

function show_el(el) {
    // remove display-none class
    el.classList.remove('display-none');
    // if el has data-display_before, set it to display and remove data-display_before
    if (el.dataset.display_before) {
        el.style.display = el.dataset.display_before;
        delete el.dataset.display_before;
    }
}

// Helper function to get a cookie by name
function get_cookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const targetCookie = cookies.find(cookie => cookie.startsWith(nameEQ));
    return targetCookie ? decodeURIComponent(targetCookie.substring(nameEQ.length)) : null;
}

function set_cookie(name, value, secure = false, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = ";expires=" + date.toUTCString();

    // Dynamically determine the base domain to share the cookie with all subdomains
    const hostname = window.location.hostname;
    const baseDomain = hostname.includes('.') ? ";domain=." + hostname.substring(hostname.indexOf('.') + 1) : '';

    const path = ";path=/";
    const secureFlag = secure ? ";secure" : "";

    document.cookie = `${name}=${encodeURIComponent(value)}${expires}${baseDomain}${path}${secureFlag}`;
}

function get_lang() {
    // Attempt to extract language from the URL path.
    let langFromUrl = window.location.pathname.split('/')[1]; // Assuming language code is the first segment.

    // Validate language obtained from URL.
    if (LANGUAGES.includes(langFromUrl)) {
        return langFromUrl;
    }

    // If URL does not have a valid language, attempt to get the language from cookies.
    let langFromCookie = get_cookie('lang'); // Assuming get_cookie is a function that extracts cookie value.

    // Validate language obtained from Cookie.
    if (LANGUAGES.includes(langFromCookie)) {
        return langFromCookie;
    }

    // Default to a predefined language if neither URL nor cookie provides a valid language.
    return DEFAULT_LANG; // Make sure DEFAULT_LANG is defined as your default language code.
}

function set_lang(lang) {
    // Validate the language code.
    if (!LANGUAGES.includes(lang)) {
        console.error('Invalid language code.');
        return;
    }

    // Update the language cookie regardless of whether the URL will be updated.
    document.cookie = `lang=${encodeURIComponent(lang)};path=/;max-age=${60 * 60 * 24 * 365}`; // Expire in 1 year.

    // Then follow the procedure to update the URL or redirect as before.

    let currentLang = get_lang();
    if (lang === currentLang) return; // No change needed.

    // Construct new URL with the selected language.
    let newPathname = window.location.pathname.replace(new RegExp(`^\/?${currentLang}`), `/${lang}`);
    if (window.location.pathname === newPathname) {
        newPathname = `/${lang}${window.location.pathname}`;
    }
    window.location.href = window.location.origin + newPathname + window.location.search + window.location.hash;
}

function redirect_page(path) {  // path with no lang code
    // Get the current language setting.
    let lang = get_lang();

    // Create a new URL object from the current location.
    let current_url = new URL(window.location.href);

    // Check if the provided path starts with a valid language code.
    let path_parts = path.split('/');
    if (!LANGUAGES.includes(path_parts[1])) {
        // If the path doesn't start with a valid language, prepend the language code.
        path = '/' + lang + path;
    }

    // Update the pathname of the current URL.
    current_url.pathname = path;

    // The search (query parameters) and hash (fragment identifier) of the current URL remain unchanged,
    // ensuring that we preserve all parts of the URL except for the pathname, which we want to update.

    // Redirect to the updated URL.
    window.location.href = current_url.toString();
}

//// API FETCHES ////
async function api_post (url, body, auth_redirect = true) {
    if (!url) {
        console.error('No url provided');
        return undefined;
    }

    const auth = get_cookie('athtkn');
    const headers = auth ? {
        'Content-Type': 'application/json',
        'Authorization': auth
    } : {
        'Content-Type': 'application/json'
    };

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        let data = await response.json();

        if (response.status === 401) {
            dialog_pop('Please login to continue', 'error');
            if (auth_redirect) setTimeout(auth_login_prompt, 1000);

            return undefined;
        }

        if (!response.ok) {
            dialog_pop(data.message, 'error');
            return undefined;
        } else {
            console.log(data);
            return data;
        }
    } catch (error) {
        dialog_pop("Unexpected error occured, please contact your support", 'error');
        console.error(error);
        return undefined;
    }
}

async function api_get (url, auth_redirect = true) {
    try {
        const auth = get_cookie('athtkn');
        const headers = auth ? {
            'Authorization': auth
        } : {};

        let response = await fetch(url, {
            method: 'GET',
            headers: headers
        });

        let data = await response.json();

        if (response.status === 401) {
            dialog_pop('Please login to get access', 'error');
            if (auth_redirect) setTimeout(auth_login_prompt, 1000);
            return undefined;
        }

        if (!response.ok) {
            dialog_pop(data.message, 'error');
            return undefined;
        } else {
            console.log(data);
            return data;
        }
    }
    catch (error) {
        dialog_pop("Unexpected error occured, please contact your support", 'error');
        console.error(error);
        return undefined;
    }
}


//// AUTHENTICATION ////
async function auth_me () {
    let auth = get_cookie('athtkn');
    if (!auth) return false;

    let data = await api_get('/api/auth/me', false); // TODO: replace with your own API endpoint
    if (!data) return false;
    return data;
}

// React to user unauthorized access
async function auth_login_prompt () {
    // Redirect user to login page
    window.location.href = '/login' + '?redirect=' + window.location.pathname;
}