const helpers = {
    paginate: require('handlebars-paginate'),
    ifCond: function(v1, operator, v2, options){
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    },

    simpleEq: (v1, v2) => {
        return v1 === v2;
    },

    selectState: (state, value) => {
        if(state === value) {
            return 'selected';
        }
        return '';
    },

    checkedState: (state) => {
        if(state === 'true' || state === true){
            return 'checked';
        }
        return '';
    },

    checkedStateRadio: (state, id) => {
        switch (state) {
            case 0:
                if (id === 'tilgaengelighed0') {
                    return 'checked'
                }
                break;
            case 1:
                if (id === 'tilgaengelighed1') {
                    return 'checked'
                }
                break;
            case 2:
                if (id === 'tilgaengelighed2') {
                    return 'checked'
                }
                break;
            default:
                break;
        }
        return '';
    },

    checkedStateURL: (url, key, value) => {
        if (url.indexOf(key + "=") == -1) {
            return '';
        }

        string = url.substring(url.indexOf(key + "="));
        if (string.indexOf('&') > -1) {
            string = string.substring(0, string.indexOf('&'));
        }

        if (string == `${key}=${value}`) {
            return 'checked';
        }

        return '';
    },
}

module.exports = { helpers }