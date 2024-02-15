// on page load, redirect to the correct language version of the page.

document.addEventListener('DOMContentLoaded', (event) => {
    let lang = get_lang();
    let current_url = new URL(window.location.href);
    let path = current_url.pathname;
    redirect_page(path);
});