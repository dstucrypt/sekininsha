function validateName(name, err) {
    if (name === undefined) return;
    if(name.length === 0) {
        err.name = 'Введите имя';
    }
}

function validateTaxID(tax_id, err) {
    if (tax_id === undefined) return;
    if(tax_id.length === 0 || tax_id.length === 10) {
        true;
    } else {
        err.tax_id = 'Налоговый номер неправильной длины';
    }
}

function validateEmail(email, err) {
    if (email === undefined) return;
    if(email.length === 0 || email.indexOf('@') > 0) {
        true;
    } else {
        err.email = 'Неправильный формат адреса';
    }
}

function validateEmailTaxID(email, tax_id, err) {
    if (email === undefined && tax_id === undefined) return;
    email = email || "";
    tax_id = tax_id || "";
    if (email.length === 0 && tax_id.length === 0) {
        err.email = 'Укажите что-нибудь';
        err.tax_id = err.email;
    }
}

function validateAll(mm, err) {
    validateName(mm.name, err);
    validateEmail(mm.email, err);
    validateTaxID(mm.tax_id, err);
    validateEmailTaxID(mm.email, mm.tax_id, err);
}


var member = function(mm, force) {
    var err = {};
    var data;
    if(force) {
        data = {};
        data.name = mm.name || "";
        data.email = mm.email || "";
        data.tax_id = mm.tax_id || "";
    } else {
        data = mm;
    }
    validateAll(data, err);
    return err;
};

module.exports.member = member;
