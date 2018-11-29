module.exports = {
    getDateFormat: getDateFormat,
    msgBox: msgBox,
    validMail: validMail,
    getFormType: getFormType,
};
const {
    AlertDialog
} = require('tabris');

function getDateFormat(dateString) {
    if (dateString) {
        let todate = new Date(dateString).getDate();
        let tomonth = new Date(dateString).getMonth() + 1;
        let toyear = new Date(dateString).getFullYear();
        let selectedDate = todate + '/' + tomonth + '/' + toyear;
        return selectedDate;
    }
    return dateString;
}

function msgBox(msg = '', callback = null) {
    let alertDialog = new AlertDialog({
        message: msg,
        buttons: {
            ok: 'OK'
        }
    }).on({
        close: ({
            button
        }) => {
            if (typeof callback === "function") {
                callback();
            }
        },
    }).open();
}

function getFormType() {
    return localStorage.getItem('form_type');
}

function validMail(mail) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}