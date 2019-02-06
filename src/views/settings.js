const {
    ui,
    Page,
    Composite,
    ScrollView,
    Button,
    ImageView,
    TextInput,
    TextView,
    ActivityIndicator,
    AlertDialog,
    Switch,
    RadioButton
} = require('tabris');
let config = require('../config.js');
let animation = require('../utils/animation.js');
let monitor_event = require('./monitor_event.js');
let generic = require('../utils/generic.js');
let layout = require('../utils/layout.js');
let inputs = require('../utils/inputs.js');
ui.navigationBar.background = '#fff';
localStorage.setItem('token', null);
localStorage.setItem('loggedin', false);
exports.show = function(navigationView) {
    navigationView.toolbarColor = config.item.COLOR_TWO;
    let pageTitle = 'Settings - ' + config.item.APP_NAME;
    let event_code = localStorage.getItem('event_code');
    navigationView.toolbarVisible = false;
    localStorage.setItem('form_type', 'input');
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
        left: '10%',
        top: [logoContainer, 30],
        right: '10%',
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
    }).appendTo(logoContainer);
    inputs.textInputBox(scrollView, 'event_code', {
        centerY: 10,
        right: 35,
        left: 30,
        height: 60,
        id: 'event_code',
        borderColor: '#fff',
        text: event_code || '',
        message: 'Enter Event Code'
    }, 'Event Code', 'password.png');
    new Button({
        id: 'apply_settings',
        text: 'Apply',
        textColor: '#fff',
        font: "initial",
        background: config.item.BUTTON_PRIMARY
    }).on('select', ({}) => {
        let event_code = page.find('#event_code').get('text');
        if (event_code == '') {
            generic.msgBox('Provide Event Code');
            page.find('#event_code').set('focused', true);
        } else {
            // Create loading indicator
            let accessToken = localStorage.getItem('token');
            let activityIndicator = new ActivityIndicator({
                centerX: 0,
                centerY: 0
            }).appendTo(ui.contentView);
            var xhr = new XMLHttpRequest();
            xhr.open('GET', config.item.API_URL + '/events/' + event_code, true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
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
                if (response.status == 'success') {
                    localStorage.setItem('event_data', JSON.stringify(response.data));
                    localStorage.setItem('event_code', event_code);
                    activityIndicator.dispose();
                    page.dispose();
                    monitor_event.show(navigationView);
                } else if (response.status == 'error') {
                    activityIndicator.dispose();
                    let alertDialog = new AlertDialog({
                        message: response.error + ': Wrong Event Code',
                        buttons: {
                            ok: 'OK'
                        }
                    }).open();
                }
            };
            xhr.send("event_code=" + event_code);
        }
    }).appendTo(scrollView);
    scrollView.apply({
        '#logo_image': {
            centerY: 0,
            centerX: 0
        },
        '#event_code': {
            focused: true,
        },
        '#apply_settings': {
            top: ['prev()', 20],
            height: 60,
            width: 200,
            centerX: 0,
            highlightOnTouch: true,
        },
    });
    animation.animateInFromRight(page, 'logo_image', 50);
    animation.animateInFromRight(page, 'event_code_label', 100);
    animation.animateInFromRight(page, 'event_code', 150);
    animation.animateInFromRight(page, 'mode_Live', 200);
    animation.animateInFromRight(page, 'mode_Test', 250);
    animation.animateInFromRight(page, 'apply_settings', 300);
};