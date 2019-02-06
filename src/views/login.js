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
let layout = require('../utils/layout.js');
let inputs = require('../utils/inputs.js');
ui.navigationBar.background = '#fff';
let accessdomainCount = 0;
exports.show = function(navigationView) {
    localStorage.setItem('token', null);
    localStorage.setItem('loggedin', false);
    let login_email = localStorage.getItem('login_email');
    let login_password = localStorage.getItem('login_password');
    navigationView.toolbarColor = config.item.COLOR_TWO;
    let pageTitle = 'Login - ' + config.item.APP_NAME;
    navigationView.toolbarVisible = false;
    let page = new Page({
        title: pageTitle,
        autoDispose: true,
        background: config.item.MAIN_BGCOLOR,
        backgroundImage: {
            src: config.item.PAGE_BG
        },
    }).appendTo(navigationView);
    let logoContainer = layout.logoContainer(page);
    let scrollView = new ScrollView({
        left: '5%',
        top: [logoContainer, 30],
        right: '5%',
        bottom: 0,
    }).appendTo(page);
    new ImageView({
        layoutData: {
            centerY: 0,
            left: '20%',
            right: '20%',
        },
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
                message: ''
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
                message: ''
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
    }).appendTo(logoContainer);
    inputs.textInputBox(scrollView, 'login_email', {
        centerY: 10,
        right: 35,
        left: 30,
        height: 60,
        keyboard: 'email',
        autoCorrect: false,
        id: 'login_email',
        borderColor: '#fff',
        text: login_email || '',
        message: 'Enter Email Address'
    }, 'Email', 'email.png');
    inputs.textInputBox(scrollView, 'login_password', {
        centerY: 10,
        right: 35,
        left: 30,
        height: 60,
        type: 'password',
        keyboard: 'default',
        autoCorrect: false,
        id: 'login_password',
        borderColor: '#fff',
        text: login_password || '',
        message: 'Enter Password'
    }, 'Password', 'password.png');
    new Button({
        id: 'login_btn',
        text: 'Login',
        textColor: '#fff',
        background: config.item.BUTTON_PRIMARY
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
                localStorage.setItem('login_email', login_email);
                localStorage.setItem('login_password', login_password);
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
    }).appendTo(scrollView);
    scrollView.apply({
        '#logo_image': {
            centerY: 0,
            centerX: 0
        },
        '#login_btn': {
            top: ['prev()', 20],
            height: 60,
            width: 200,
            centerX: 0,
            highlightOnTouch: true,
        },
    });
    animation.animateInFromRight(page, 'logo_image', 50);
    animation.animateInFromRight(page, 'login_email', 100);
    animation.animateInFromRight(page, 'login_password', 150);
    animation.animateInFromRight(page, 'login_btn', 200);
};