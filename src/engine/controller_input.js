/*
 * File: controller_input.js
 *  
 * interfaces with HTML5 and Gamepad API to to receive controller events
 * 
 * For documentation, see
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API 
 */
"use strict";


const buttons = {
    // letter buttons
    A: 0,
    B: 1,
    X: 2,
    Y: 3,
    // bumper buttons (above triggers)
    LeftBumper: 4,
    RightBumper: 5,
    // trigger buttons (move this into its own array later)
    LeftTrigger: 6,
    RightTrigger: 7,
    // control buttons
    Back: 8,
    Start: 9,
    // joysticks can be pressed inwards
    LeftJoystickButton: 10,
    RightJoystickButton: 11,
    // plus pad
    PlusPadUp: 12,
    PlusPadDown: 13,
    PlusPadLeft: 14,
    PlusPadRight: 15,


    LastButtonCode: 15
}

// left = 0 and right = 1 is a convention for development sake
const joysticks = {
    Left: 0,
    Right: 1
}

// joystick data is an array of length 4
// private enum so developers do not confuse which index is which joystick
const joysticks_private = {
    LeftX: 0,
    LeftY: 1,
    RightX: 2,
    RightY: 3,

    LastJoystickCode: 3
}

const triggers = {
    LeftTrigger: 6,
    RightTrigger: 7
}

let controllers = [];

// previous state for buttons
let mButtonPreviousState = [];
// if button is currently being pressed
let  mIsButtonPressed = [];
// if button was clicked that frame
let  mIsButtonClicked = [];
// if button was released that frame
let mIsButtonReleased = [];
// x y positions of the joysticks
let mJoystickState =  [];
// number of controllers
let mNumControllers = 0;

function cleanUp() {}  // nothing to do for now

function init() {
    for (let i = 0; i <= buttons.LastButtonCode; i++) {
        mIsButtonPressed[i] = false;
        mButtonPreviousState[i] = false;
        mIsButtonClicked[i] = false;
        mIsButtonReleased[i] = false;
    }
    for (let i = 0; i <= joysticks_private.LastJoystickCode; i++) {
        mJoystickState[i] = 0;
    }

    window.addEventListener("gamepadconnected", (e) => {
        mNumControllers++;
    });
    window.addEventListener("gamepaddisconnected", (e) => {
        mNumControllers--;
    });
}

function update() { 
    // get controller data every tick
    controllers = navigator.getGamepads();
    // loop supports 4 controllers, arrays only support 1 controller
    // implementation can be extended to multiple controllers by adding multi-dimensional arrays
    for (let i = 0; i < controllers.length; i++) {
        if (controllers[i] == null) {
            continue;
        }
        // get all controller state data
        for (let j = 0; j < controllers[i].buttons.length; j++) {
            mIsButtonPressed[j] = controllers[i].buttons[j].pressed; // button pressed

            mIsButtonClicked[j] = (!mButtonPreviousState[j]) && mIsButtonPressed[j]; // button clicked
            mIsButtonReleased[j] = mButtonPreviousState[j] && !mIsButtonPressed[j]; // button released MUST be saved HERE or else previousState and isPressed will NEVER line up!!
            mButtonPreviousState[j] = mIsButtonPressed[j]; // previous state
        }
        // get all controller joystick data
        for (let j = 0; j <= joysticks_private.LastJoystickCode; j++) {
            mJoystickState[j] = controllers[i].axes[j];
        }
    }
}

function getNumControllers() {
    return mNumControllers;
}

function isButtonPressed(buttonCode) {
    if (getNumControllers() == 0) {
        return null;
    }
    return mIsButtonPressed[buttonCode];
}

function isButtonClicked(buttonCode) {
    if (getNumControllers() == 0) {
        return null;
    }
    return mIsButtonClicked[buttonCode];
}

function isButtonReleased(buttonCode) {
    if (getNumControllers() == 0) {
        return null;
    }
    return mIsButtonReleased[buttonCode];
}

function getJoystickPosition(joystickCode) {
    // if (getNumControllers() == 0) {
    //     return 0;
    // }
    // if (joystickCode == 0) {
    //     return [mJoystickState[joysticks_private.LeftX], mJoystickState[joysticks_private.LeftY]];
    // } else if (joystickCode == 1) {
    //     return [mJoystickState[joysticks_private.RightX], mJoystickState[joysticks_private.RightY]];
    // } else {
    //     return null;
    // }
}

function getJoystickPosX(joystickCode) {
    if (getNumControllers() == 0) {
        return 0;
    }
    let val = 0;
    if (joystickCode == 0) {
        val = mJoystickState[joysticks_private.LeftX]
    } else if (joystickCode == 1) {
       val =  mJoystickState[joysticks_private.RightX];
    }
    // padding is needed because analog joysticks can never be 0 exactly
    if (val >= -0.075 && val <= 0.075) {
        return 0
    } else {
        return val;
    }
}

function getJoystickPosY(joystickCode) {
    let val = 0;
    if (joystickCode == 0) {
        val = mJoystickState[joysticks_private.LeftY]
    } else if (joystickCode == 1) {
       val =  mJoystickState[joysticks_private.RightY];
    }
    // padding is needed because analog joysticks can never be 0 exactly
    if (val >= -0.075 && val <= 0.075) {
        return 0
    } else {
        return -val;
    }
}

export {buttons, joysticks, init, cleanUp,
    update, 
    isButtonClicked,
    isButtonPressed,
    isButtonReleased,
    getJoystickPosX,
    getJoystickPosY,
    getNumControllers
}
