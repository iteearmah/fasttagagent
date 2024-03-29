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
    CollectionView,
    ActionSheet,
    RefreshComposite,
    AlertDialog
} = require('tabris');
let config = require('../config.js');
let animation = require('../utils/animation.js');
let generic = require('../utils/generic.js');
let layout = require('../utils/layout.js');
let inputs = require('../utils/inputs.js');
ui.navigationBar.background = '#fff';
exports.show = function(navigationView) {
    //login.check(navigationView);
    let event_data = JSON.parse(localStorage.getItem('event_data'));
    let eventLogo = event_data.cover_photo;
    let eventBGColor = event_data.background_color;
    let eventFontColor = event_data.font_color;
    navigationView.toolbarColor = eventBGColor || config.item.COLOR_TWO;
    let pageTitle = 'Monitor - ' + config.item.APP_NAME;
    navigationView.toolbarVisible = false;
    let attendees_list = [];
    let page = new Page({
        title: pageTitle,
        autoDispose: true,
        background: config.item.MAIN_BGCOLOR,
        backgroundImage: {
            src: config.item.PAGE_BG
        },
    }).appendTo(navigationView);
    let refreshComposite = new RefreshComposite({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }).on('refresh', ({
        target
    }) => setTimeout(() => {
        startWS();
        target.refreshIndicator = false;
        console.log(`last refresh: ${new Date()}`);
    }, 2000)).appendTo(page);
    let logoContainer = layout.logoContainer(refreshComposite);
    let eventLogoBox = new Composite({
        left: 0,
        right: '50%',
        background: 'red'
    }).appendTo(logoContainer);
    let eventCounterBox = new Composite({
        left: '50%',
        right: 0,
        background: 'blue'
    }).appendTo(logoContainer);
    let scrollView = new ScrollView({
        left: '5%',
        top: [logoContainer, 30],
        right: '5%',
        bottom: 0,
    }).appendTo(refreshComposite);
    new TextView({
        layoutData: {
            centerX: 0,
            centerY: 0,
        },
        id: 'attendee_numbers',
        text: '0',
        markupEnabled: true,
        font: '35px bold',
        alignment: 'center',
        backgroundImage: {
            src: "images/counter-bg.png",
            scale: 2
        },
    }).appendTo(eventCounterBox);
    let searchInputBox = inputs.textInputBox(scrollView, 'search_box', {
        centerY: 10,
        right: 35,
        left: 30,
        height: 60,
        id: 'search_box',
        borderColor: '#fff',
        text: '',
        message: 'Enter Attendee Name'
    }, 'Search', 'password.png');
    new ImageView({
        layoutData: {
            right: [searchInputBox, 5],
            width: 55,
            height: 55,
        },
        id: 'submit_search',
        image: {
            src: "images/search-black-24dp@3x.png",
            scale: 2
        },
        highlightOnTouch: true,
        scaleMode: 'auto',
    }).on('tap', ({}) => {
        let searchText = page.find('#search_box').get('text');
        if (searchText == '') {
            let alertDialog = new AlertDialog({
                message: 'Enter search phrase',
                buttons: {
                    ok: 'OK'
                }
            }).open();
            return false;
        }
        console.log('Search:' + searchText);
        searchAttendees(searchText);
    }).appendTo(searchInputBox);
    let collectionView = new CollectionView({
        left: 0,
        top: 'prev() 16',
        right: 0,
        bottom: 0,
        itemCount: attendees_list.length,
        cellHeight: 70,
        createCell: () => {
            let cell = new Composite({
                padding: {
                    left: 10,
                    right: 10,
                    top: 5,
                    bottom: 5
                },
                top: 0,
                left: 0,
                right: 0,
                highlightOnTouch: true,
            });
            new TextView({
                id: 'attendee_name',
                markupEnabled: true,
                font: '17px bold',
                top: 'prev()',
                textColor: "#fff",
                alignment: 'left'
            }).appendTo(cell);
            let attendeePhone = new TextView({
                id: 'attendee_phone',
                top: ['prev()', 10],
                alignment: 'left',
                textColor: "#777",
            }).appendTo(cell);
            new Composite({
                left: 0,
                right: 0,
                top: ['prev()', 4],
                height: 1,
                background: '#ABB1BA'
            }).appendTo(cell);
            return cell;
        },
        updateCell: (cell, index) => {
            let attendee = attendees_list[index];
            cell.find('#attendee_name').set('text', attendee.full_name);
            cell.find('#attendee_phone').set('text', attendee.phone);
        }
    }).on('select', ({
        index
    }) => {
        let selectedAttendeeUUID = attendees_list[index].uuid;
        new ActionSheet({
            title: 'Actions',
            actions: [{
                title: 'Print Tag',
                image: {
                    src: device.platform === 'iOS' ? 'images/icons8-white-print-50.png' : 'images/icons8-print-50.png',
                    scale: 2
                }
            }]
        }).on({
            select: ({
                index
            }) => {
                if (index == 0) //print Tag
                {
                    printTag(selectedAttendeeUUID);
                }
                console.log(`${index} selected: ` + selectedAttendeeUUID)
            }
        }).open();
        //clearTimeout(clocked_in);
    }).appendTo(scrollView);
    scrollView.apply({
        '#attendee_numbers': {
            top: 30,
            centerX: 0,
            width: 130,
        },
    });
    startWS(); //start websocket
    /*animation.animateInFromRight(page, 'logo_image', 300);
    animation.animateInFromRight(page, 'welcome_message_event', 400);
    animation.animateInFromRight(page, 'welcome_message', 400);*/
    let user_uuid = localStorage.getItem('user_uuid');
    //console.info('user_uuid:' + user_uuid + ' | ' + event_data.event_code);
    //
    function startWS() {
        let wsocket = new WebSocket(config.item.WS_HOSTPORT, 'echo-protocol');
        wsocket.onmessage = (event) => {
            let json = JSON.parse(event.data);
            page.find('#attendee_numbers').set('text', json.data || 'N/A');
            //console.info('Incoming message: ' + event.data)
        };
        wsocket.onopen = (event) => {
            wsocket.send(JSON.stringify({
                type: 'identifier',
                data: event_data.event_code
            }));
            wsocket.send(JSON.stringify({
                type: 'message',
                toIdentifier: event_data.event_code,
                data: event_data.event_code
            }));
            console.info('Connection opened');
        };
        wsocket.onerror = (event) => {
            console.info('Error: ' + event.data);
        }
    }

    function searchAttendees(keywords = '') {
        let event_id = event_data.event_code;
        let accessToken = localStorage.getItem('token');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', config.item.API_URL + '/attendees-search/' + event_id, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onerror = function(e) {
            activityIndicator.dispose();
            new AlertDialog({
                message: 'Connection timed out',
                buttons: {
                    ok: 'OK'
                }
            }).open();
        };
        xhr.onload = function() {
            console.log(this.responseText);
            let response = JSON.parse(this.responseText);
            if (response.status == 'success') {
                if (response.data.length > 0) {
                    attendees_list = response.data;
                    collectionView.itemCount = attendees_list.length;
                }
            } else {
                attendees_list = response.data;
                collectionView.itemCount = 0;
            }
        };
        xhr.send("event_id=" + event_id + "&search=" + keywords);
    }

    function printTag(uuid) {
        if (uuid) {
            let accessToken = localStorage.getItem('token');
            var xhr = new XMLHttpRequest();
            xhr.open('POST', config.item.API_URL + '/attendee-printag', true);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader("Accept", "application/json");
            xhr.onload = function() {
                console.log(this.responseText);
                let response = JSON.parse(this.responseText);
                if (response.status == 'success') {
                    window.plugins.toast.showLongBottom('Tag Generated!');
                    /* let alertDialog = new AlertDialog({
                         message: 'Tag Generated!',
                         buttons: {
                             ok: 'OK'
                         }
                     }).open();*/
                } else {
                    attendees_list = response.data;
                    collectionView.itemCount = 0;
                }
            };
            xhr.send("uuid=" + uuid);
        } else {
            let alertDialog = new AlertDialog({
                message: 'Error: Set Attendee UUID',
                buttons: {
                    ok: 'OK'
                }
            }).open();
        }
    }
};