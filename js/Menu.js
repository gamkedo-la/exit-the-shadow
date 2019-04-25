const Menu = new (function() {
const MENU_PAGE = 0;
const RESUME_PAGE = 1;
const PAUSED_PAGE = 2;
const SETTINGS_PAGE = 3;
const HELP_PAGE = 4;
const CREDITS_PAGE = 5;


let itemsX = 310;
let topItemY = 390;
let itemsWidth = 650;
let rowHeight = 35;

let currentPage = 0;

let textFontFace = "";
let textFontFaceCredits = "";
let textColour = "" ;

let classListMenu = ["new*game", "continue", "settings" , "credits"];
let classListSettings = ["volume", "controls", "back"];
let classListHelp= ["gameplay","gamepad","back"];
let classListPaused= ['save' , 'audio',  'back'];
let classListCredits= ["back"];

})();