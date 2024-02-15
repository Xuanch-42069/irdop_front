var PAGES = {};
var BILRD_ids = {};
console.log("test from git 11111111");

class ROOT {
    constructor(current_brf) {
        PAGES = {};
        PAGES.root = this;
        this.brf = current_brf;
        this.search_result;
        
        this.init();
    }

    async init() {
        // 1. Get search result data: Get search query and fetch data from server
        if (this.get_search_key()) {
            // TODO: show loading spinner
            // Search for the search key
            this.search_result = await this.handle_search();
            // TODO: hide loading spinner
        }
        else {
            // TODO: show no search key message
        }

        // 2. render data
        // TODO: Search result count
        let table_result = new TABLE (document.querySelector('.search_result_table'), this.search_result, document.querySelector('.search_result_table_row'));
        table_result.render();

        // 3. add event listeners
    }

    get_search_key() {
        // get search key from site_search url param
        let urlParams = new URLSearchParams(window.location.search);
        let search_key = urlParams.get('site_search');
        return search_key;
    }

    async handle_search () {
        // get search key
        let search_key = this.get_search_key();
        // TODO: fetch data from server
        
        return search_result;
    }
}