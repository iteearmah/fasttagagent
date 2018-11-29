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
ui.navigationBar.background = '#fff';
localStorage.setItem('token', null);
localStorage.setItem('loggedin', false);
exports.show = function(navigationView) {
    navigationView.toolbarColor = config.item.COLOR_TWO;
    let pageTitle = 'Settings - ' + config.item.APP_NAME;
    navigationView.toolbarVisible = false;
    localStorage.setItem('form_type', 'input');
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
    }).appendTo(pageContainer);
    new TextInput({
        id: 'event_code',
        font: "initial",
        text: 'nl8G34',
        borderColor: config.item.COLOR_TWO,
        message: 'Event Code'
    }).on('accept', ({}) => {}).appendTo(pageContainer);
    let modeInputContainer = new Composite({
        id: 'mode_input_container',
        top: ['prev()', 10],
        right: 0,
        left: 0,
    }).appendTo(pageContainer);
    /*['Live', 'Test'].forEach((title) => {
        new RadioButton({
            id: 'mode_' + title.toLowerCase(),
            class: 'mode',
            checked: title.toLowerCase() == 'live' ? true : false,
            tintColor: config.item.COLOR_TWO,
            checkedTintColor: config.item.COLOR_TWO,
            text: title + ' Mode',
        }).on('checkedChanged', ({
            target,
            value: checked
        }) => {
            if (checked) {
                console.log(target.text.toLowerCase() + ' checked');
                localStorage.setItem('mode', target.text.toLowerCase());
            }
        }).appendTo(modeInputContainer);
    });*/
    new Button({
        id: 'apply_settings',
        text: 'Apply',
        textColor: '#fff',
        font: "initial",
        background: config.item.COLOR_TWO
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
    }).appendTo(pageContainer);
    scrollView.apply({
        '#logo_image': {
            top: ['prev()', 30],
            right: '20%',
            left: '20%',
        },
        '#event_code': {
            top: ['prev()', 30],
            right: 0,
            left: 0,
            height: '50',
            focused: true,
            keyboard: 'default',
            autoCorrect: false,
        },
        '.mode': {
            top: ['prev()', 10],
            right: 0,
            left: 0,
            height: '50',
        },
        '#mode_live': {
            top: ['#mode_input_container', 0],
            right: '50%',
            left: 0,
        },
        '#mode_test': {
            top: ['#mode_input_container', 0],
            right: 0,
            left: ['50%', 0],
        },
        '#pin_form_switch_label': {
            top: ['prev()', 30],
        },
        '#pin_form_switch': {
            right: 0,
            left: ['#pin_form_switch_label', 16],
            baseline: '#pin_form_switch_label'
        },
        '#apply_settings': {
            top: ['prev()', 20],
            right: 0,
            left: 0,
            height: '50',
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