const {
    NavigationView,
    ui,
    Action
} = require('tabris');
let config = require('./config.js');
let loginPage = require('./views/login.js');
let navigationView = new NavigationView({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
}).appendTo(ui.contentView);

localStorage.setItem('mode', 'Live');
loginPage.show(navigationView);