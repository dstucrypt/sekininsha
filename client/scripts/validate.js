var member = function(mm) {
    var name = mm.name || "";
    var email = mm.email || "";
    var tax_id = mm.tax_id || "";
    var err = {};

    if(tax_id.length === 0 || tax_id.length === 10) {
        true;
    } else {
        err.tax_id = 'Налоговый номер неправильной длины';
    }

    if(email.length === 0 || email.indexOf('@') > 0) {
        true;
    } else {
        err.email = 'Неправильный формат адреса';
    }

    if(email.length === 0 && tax_id.length === 0) {
        err.email = 'Укажите что-нибудь';
        err.tax_id = err.email;
    }

    if(name.length === 0) {
        err.name = 'Введите имя';
    }

    return err;
};

module.exports.member = member;
