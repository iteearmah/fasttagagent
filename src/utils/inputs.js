module.exports = {
    textInputBox: textInputBox,
};
const {
    ImageView,
    TextView,
    TextInput,
    Composite,
} = require('tabris');
let config = require('../config.js');
let appImages = require('./appImages.js');

function curveImage(parentWidget, position = 'left') {
    let height = 52;
    if (position == 'right') {
        positionLayout = {
            right: 0,
            height: height
        };
    } else {
        positionLayout = {
            left: 0,
            height: height
        };
    }
    new ImageView({
        layoutData: positionLayout,
        id: position + '_curve',
        image: {
            src: appImages.inputCurveImage(position),
            scale: 3
        },
        scaleMode: 'auto',
    }).appendTo(parentWidget);
};

function inputIcon(parentWidget, iconfile) {
    let height = 35;
    let inputIcon = new ImageView({
        layoutData: {
            left: 10,
            height: height,
            top: [parentWidget, 8]
        },
        image: {
            src: 'images/icons/' + iconfile,
            scale: 3
        },
        scaleMode: 'auto',
    }).appendTo(parentWidget);
    return inputIcon;
}

function textInputBackground(parentWidget, bdColor = '#fff') {
    let textInputBackground = new Composite({
        background: bdColor,
        layoutData: {
            bottom: 0,
            right: 20,
            left: 21,
            height: 50.5,
        },
        padding: 10,
    }).appendTo(parentWidget);
    return textInputBackground;
}

function textInput(parentWidget, param) {
    let cTextInput = new TextInput(param).appendTo(parentWidget);
    return cTextInput;
}

function textInputContainer(parentWidget, id, param = {}, label = '', iconfile = '') {
    let inputContainer = new Composite({
        layoutData: {
            top: ['prev()', 0],
            right: 0,
            left: 0,
            height: 51,
        },
    }).appendTo(parentWidget);
    curveImage(inputContainer, 'left');
    let textInputBg = textInputBackground(inputContainer);
    inputIcon(inputContainer, iconfile);
    textInput(textInputBg, param);
    curveImage(inputContainer, 'right');
    return inputContainer;
}

function inputLabel(parentWidget, label = '') {
    let inputLabel = new TextView({
        left: 20,
        text: label,
        alignment: 'left',
        textColor: '#fff',
        top: ['next()', 0],
        height: 30,
    }).appendTo(parentWidget);
    return inputLabel;
}

function textInputBox(parentWidget, id, param = {}, label = '', iconfile = '') {
    let textInputBoxContainer = new Composite({
        layoutData: {
            top: ['prev()', 10],
            right: 0,
            left: 0,
            height: 83,
        },
    }).appendTo(parentWidget);
    let inputLabelBox = inputLabel(textInputBoxContainer, label);
    let textInputBox = textInputContainer(textInputBoxContainer, id, param, label, iconfile);
    return textInputBox;
}