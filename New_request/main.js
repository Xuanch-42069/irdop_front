var PAGES = {};
var bildr_ids = {
    Request_Form_Builder : 'T2IsvNBjUEA2AROgkTqNAA'
}


class MAIN {
    constructor (brf) {
        this.brf = brf;
        this.el = {
            request_builder_container : this.brf.pHTML.querySelector('.root_page.request_builder_container'),
        }
        
        this.init();
    }
    init () {
        // load Builder page
        bapi.helper.openPageInContainerElement(bildr_ids.Request_Form_Builder, this.el.request_builder_container, null, null)
    }    
}

class Request_Form_Builder {
    constructor (brf) {
        this.brf = brf;
        PAGES.Request_Form_Builder = this;
        this.is_new_request = true;         // default is new request
        this.el = {
            client_toggle_entity : this.brf.pHTML.querySelector('.client_type_toggle.entity'),
            client_toggle_individual : this.brf.pHTML.querySelector('.client_type_toggle.individual'),
            client_toggle_err : this.brf.pHTML.querySelector('.client_type_toggle_err'),
            client_entity_form : this.brf.pHTML.querySelector('.client_entity_form'),
            client_individual_form : this.brf.pHTML.querySelector('.client_individual_form'),
            input_client_name : this.brf.pHTML.querySelector('.input_client_name'),
            input_err_client_name : this.brf.pHTML.querySelector('.input_err_client_name'),
        }
        this.form_data = {
            client_type : null,
            client_name : null,
        }
        this.init();
    }

    init() {
        this.el.client_toggle_entity.addEventListener('click', () => {
            this.set_client_type('entity');
        });
        this.el.client_toggle_individual.addEventListener('click', () => {
            this.set_client_type('individual');
        });

        if (this.is_new_request) {
            this.setup_new_request();
        }
    }

    setup_new_request () {
        this.set_client_type('entity');    // default is entity
    }

    set_client_type(type) {
        if (type === 'entity' || type === 100) {
            this.form_data.client_type = 100;
            this.el.client_toggle_entity.classList.add('active');
            this.el.client_toggle_individual.classList.remove('active');
            // show entity form and hide individual form
            el_show(this.el.client_entity_form);
            el_hide(this.el.client_individual_form);
        }
        else if (type === 'individual' || type === 200) {
            this.form_data.client_type = 200;
            this.el.client_toggle_entity.classList.remove('active');
            this.el.client_toggle_individual.classList.add('active');
            // show individual form and hide entity form
            el_show(this.el.client_individual_form);
            el_hide(this.el.client_entity_form);
        }
        else {
            throw new Error('state_client_type: invalid argument of client type');
        }
    }
}