module.exports = {
    check: check,
    signOut: signOut,
};
const {
    AlertDialog,
    ActivityIndicator,
    ui
} = require('tabris');
let config = require('../config.js');
let loginPage = require('../views/login.js');

function check(navigationView) {
    if (localStorage.getItem('loggedin') != 'true') {
        navigationView.pages().dispose();
    }
}

function signOut(navigationView) {
    let activityIndicator = new ActivityIndicator({
        centerX: 0,
        centerY: 0
    }).appendTo(ui.contentView);
    let accessToken = localStorage.getItem('token');
    var xhr = new XMLHttpRequest();
    xhr.open('POST', config.item.API_URL + '/logout', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onload = function() {
        let response = JSON.parse(this.responseText);
        if (response.success) {
            activityIndicator.dispose();
            localStorage.setItem('loggedin', false);
            localStorage.setItem('token', null);
            navigationView.pages().dispose();
            loginPage.show(navigationView);
        } else {
            activityIndicator.dispose();
            let message = '';
            if (response.error) {
                message = response.error;
            } else if (response.message) {
                message = response.message;
            }
            let alertDialog = new AlertDialog({
                message: message,
                buttons: {
                    ok: 'OK'
                }
            }).open();
        }
    };
    xhr.send("scope=save-attendee");
}