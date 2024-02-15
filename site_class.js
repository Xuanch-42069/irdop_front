class TABLE {
    constructor (table_el, data, row_el) {
        this.table_el = table_el;
        this.data = data;
        this.row_el = row_el;

        // create rows
        this.rows = this.data.map(row_data => new ROW(this.row_el, row_data, this.table_el));
    }

    add_row (row_data, index) {
        // if index is not provided or if index is not a number, add row to the end of the table
        if (index === undefined || typeof index !== 'number') {
            index = this.rows.length;
        }

        // insert row to the table
        let row = new ROW(this.row_el, row_data, this.table_el);
        row.insert_row_to_table(this.table_el, index);
        this.rows.push(row);

        return row;
    }

    remove_row (index) {
        this.rows[index].remove_row_from_table();
        this.rows.splice(index, 1);
    }

    find_row_by_property (property, value) {
        return this.rows.find(row => row.data[property] === value);
    }

    render (data) {
        if (!data) data = this.data;
        this.rows.forEach(row => row.render());
    }

    export_cvs (filename) {
    }
}

class ROW {
    constructor (template_row_el, data, table_el) {
        this.table_el = table_el;
        this.el = template_row_el.cloneNode(true);
        if (!this.el) {
            console.error('No template row found');
            return;
        }
        this.data = data;
        // Automatically add this row to the table if table_el is provided
        if (table_el) {
            this.add_row_to_table(table_el);
        }
    }

    add_row_to_table(table_el) {
        if (!table_el) table_el = this.table_el;
        if (!table_el) {
            console.error('No table element found');
            return;
        }
        // check if row is already in the table
        if (this.el.parentNode === table_el) {
            console.error('Row is already in the table');
            return;
        }
        table_el.appendChild(this.el);
    }

    insert_row_to_table(table_el, index) {
        if (!table_el) table_el = this.table_el;
        if (!table_el) {
            console.error('No table element found');
            return;
        }

        // index must be a number
        if (typeof index !== 'number') {
            console.error('Row Index must be a number');
            return;
        }

        // if index is not provided or has less than index rows, insert this.el to the end of the table
        if (index === undefined || index >= table_el.children.length) {
            table_el.appendChild(this.el);
            return;
        }

        // if row is already in the table, remove it
        if (this.el.parentNode === table_el) {
            this.el.remove();
        }

        // insert this.el before the index-th row
        table_el.insertBefore(this.el, table_el.children[index]);
    }

    remove_row_from_table() {
        this.el.remove();
    }

    get_data() {
        return this.data;
    }

    set_data(data) {
        this.data = data;
    }

    move_up() {
        this.el.parentNode.insertBefore(this.el, this.el.previousSibling);
    }

    move_down() {
        this.el.parentNode.insertBefore(this.el, this.el.nextSibling.nextSibling);
    }

    render () {
        // render data to this.el
        // scan for all [data] elements and render data to them
        this.el.querySelectorAll('[data]').forEach(el => {
            if (el.data-textContent) {
                el.textContent = this.data[el.data-textContent];
            }
            if (el.data-value) {
                el.value = this.data[el.data-value];
            }
            if (el.data-innerHTML) {
                el.innerHTML = this.data[el.data-innerHTML];
            }
            if (el.data-table) {
                this.data[el.data-table].forEach((row_data, index) => {
                    let row = new ROW(el, row_data);
                    row.add_row_to_table(el);
                });
            }
        });
    }
}