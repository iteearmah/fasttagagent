const {
    ui,
    Page,
    Composite,
    ScrollView,
    Button,
    ImageView,
    TextInput,
    ActivityIndicator,
    AlertDialog,
    Popover,
    TextView,
    NavigationView,
    Action
} = require('tabris');
let config = require('../config.js');
let animation = require('../utils/animation.js');
let settings = require('./settings.js');
ui.navigationBar.background = '#fff';
let accessdomainCount = 0;
exports.show = function(navigationView) {
    localStorage.setItem('token', null);
    localStorage.setItem('loggedin', false);
    navigationView.toolbarColor = config.item.COLOR_TWO;
    let pageTitle = 'Login - ' + config.item.APP_NAME;
    navigationView.toolbarVisible = false;
    let page = new Page({
        title: pageTitle,
        autoDispose: true,
    }).appendTo(navigationView);
    let scrollView = new ScrollView({
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }).appendTo(page);
    let pageContainer = new Composite({
        layoutData: {
            right: '5%',
            left: '5%',
            centerY: 0
        },
        padding: 10,
    }).appendTo(scrollView);
    new ImageView({
        id: 'logo_image',
        image: {
            src: config.item.LOGO,
        },
        scaleMode: 'auto',
    }).on('tap', ({}) => {
        accessdomainCount++;
        if (accessdomainCount == 3) {
            accessdomainCount = 0;
            let popover = new Popover({
                width: 300,
                height: 160,
            });
            new NavigationView({
                layoutData: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                },
                navigationAction: new Action({
                    title: 'Close',
                    image: {
                        src: device.platform === 'iOS' ? 'images/close-black-24dp@3x.png' : 'images/close-white-24dp@3x.png',
                        scale: 3
                    }
                }).on('select', () => popover.close())
            }).appendTo(popover.contentView);
            popover.contentView.append(new TextView({
                id: 'access_domain_label',
                centerY: -35,
                left: 10,
                right: 10,
                text: 'IP with Port / Domain',
                font: "bold 20px",
                alignment: 'left'
            }));
            popover.contentView.append(new TextInput({
                id: 'access_domain',
                top: ['#access_domain_label', 10],
                right: 10,
                left: 10,
                height: '50',
                keyboard: 'default',
                borderColor: config.item.COLOR_TWO,
                text: localStorage.getItem('access_domain'),
                message: 'IP with Port / Domain'
            }).on('input', ({
                text
            }) => {
                if (text.length >= 0) {
                    localStorage.setItem('access_domain', text.trim())
                }
            }));
            popover.contentView.append(new TextView({
                id: 'access_ws_label',
                top: ['#access_domain', 10],
                left: 10,
                right: 10,
                text: 'Web Socket IP with Port',
                font: "bold 20px",
                alignment: 'left'
            }));
            popover.contentView.append(new TextInput({
                id: 'access_ws',
                top: ['#access_ws_label', 10],
                right: 10,
                left: 10,
                height: '50',
                keyboard: 'default',
                borderColor: config.item.COLOR_TWO,
                text: localStorage.getItem('access_ws'),
                message: 'Web Socket IP with Port'
            }).on('input', ({
                text
            }) => {
                if (text.length >= 0) {
                    localStorage.setItem('access_ws', text.trim())
                }
            }));
            popover.on('close', () => {
                console.log('access_domain [close]: ' + localStorage.getItem('access_domain'));
                console.log('access_ws [close]: ' + localStorage.getItem('access_ws'));
            }).open();
        }
    }).appendTo(pageContainer);
    new TextInput({
        id: 'login_email',
        borderColor: config.item.COLOR_TWO,
        text: 'lilmopat@gmail.com',
        message: 'Email Address'
    }).on('accept', ({}) => {
        //page.find('#login_password').set('keepFocus', true);
    }).appendTo(pageContainer);
    new TextInput({
        id: 'login_password',
        borderColor: config.item.COLOR_TWO,
        text: '123456',
        message: 'Password'
    }).on('accept', ({}) => {}).appendTo(pageContainer);
    new Button({
        id: 'login_btn',
        text: 'Login',
        textColor: '#fff',
        background: config.item.COLOR_TWO,
    }).on('select', ({}) => {
        let login_email = page.find('#login_email').get('text');
        let login_password = page.find('#login_password').get('text');
        let access_domain = localStorage.getItem('access_domain');
        let access_ws = localStorage.getItem('access_ws');
        console.log('access_domain: ' + access_domain);
        console.log('access_ws: ' + access_ws);
        // Create loading indicator
        let activityIndicator = new ActivityIndicator({
            centerX: 0,
            centerY: 0
        }).appendTo(ui.contentView);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://' + access_domain + '/api/login', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onerror = function(e) {
            activityIndicator.dispose();
            new AlertDialog({
                message: "Connection failed!",
                buttons: {
                    ok: 'OK'
                }
            }).open();
        };
        xhr.onload = function() {
            let response = JSON.parse(this.responseText);
            if (response.success) {
                localStorage.setItem('token', response.success.token);
                localStorage.setItem('user_uuid', response.success.user_uuid);
                localStorage.setItem('loggedin', true);
                activityIndicator.dispose();
                page.dispose();
                settings.show(navigationView);
            } else if (response.error) {
                activityIndicator.dispose();
                let alertDialog = new AlertDialog({
                    message: response.error + ': Wrong crendentials',
                    buttons: {
                        ok: 'OK'
                    }
                }).open();
            } else {
                activityIndicator.dispose();
                let alertDialog = new AlertDialog({
                    message: response.message + ': Wrong crendentials',
                    buttons: {
                        ok: 'OK'
                    }
                }).open();
            }
        };
        xhr.send("email=" + login_email + "&password=" + login_password);
    }).appendTo(pageContainer);
    scrollView.apply({
        '#logo_image': {
            top: ['prev()', 10],
            right: '20%',
            left: '20%',
        },
        '#login_email': {
            top: ['prev()', 10],
            right: 0,
            left: 0,
            height: '50',
            keyboard: 'email',
            autoCorrect: false,
        },
        '#login_password': {
            top: ['prev()', 10],
            right: 0,
            left: 0,
            height: '50',
            type: 'password',
            keyboard: 'default',
            autoCorrect: false,
        },
        '#login_btn': {
            top: ['prev()', 20],
            right: 0,
            left: 0,
            height: '50',
            highlightOnTouch: true,
        },
    });
    animation.animateInFromRight(page, 'logo_image', 50);
    animation.animateInFromRight(page, 'login_email', 100);
    animation.animateInFromRight(page, 'login_password', 150);
    animation.animateInFromRight(page, 'login_btn', 200);
};