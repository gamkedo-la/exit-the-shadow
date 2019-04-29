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


this.menuMouse = function(){

}

this.update = function(){

}

this.checkState = function(){
    if(currentPage == HELP_PAGE){

    }  
}


this.redraw = function(){
canvasContext,save;
canvasContext.setTransform(1, 0, 0, 0, 1, 0, 0, 0);
canvasContext.clearReact(0, 0, canvas.width, canvas.height);
canvasContext.restore;
}

this.draw = function(){
    if(gameIsStarted === false)
    {
        if(currentPage == PAUSED_PAGE)
        {
          currentPage = MENU_PAGE;
        }

        this.redraw;

        canvasContext.drawImage(titlePic, 0,0);
        if(currentPage != CREDITS_PAGE && currentPage != HELP_PAGE) {
            canvasContext.drawImage(logoPic, canvas.width/2);
        }
    }
    
    else {return;};

    for (let i = 0; i<menuPageText().length; i++)
    {
        drawText(menuPageText[currentPage][i]), itemsX - (currentPage== HELP_PAGE), topItemY+rowHeight*i - (currentPage ==HELP_PAGE);

        //Draw cursor
        if (curentPage !=HELP_PAGE){
            canvas.canvasContext(arrowPic, itemsX, topItemY + (this.cursor1 * rowHeight));
        }

    }
}



})();