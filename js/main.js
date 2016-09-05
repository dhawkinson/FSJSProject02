(function () {
    'use strict';	// this function is strict... prevents use of undeclared variables
}());
/*globals $:false */		//	prevent jshint from declaring $ as undefined
//
//  This approach started with web.enavu.com/tutorials/making-a-jquery-pagination-system/
//      some of the ideas used in this program are borrowed and adapted from the tutorial.
//      some come from stackoverflow.com/questions/2808189/jquery-how-to-determine-which-li-tag-was-clicked
//      I am documenting these things so I will remember them in the future.
//      I am also documenting, for the evaluator, why I selected some functionality not expressly called for in the instructions

//  ********************************************************************************
//  Define Global Variables
//  ********************************************************************************

var showSetCount = 0;                                        //   The total selected Students to show -- all pages
var showOnPage = 10;                                         //   declare number of students per standard page
var numPages = 0;                                            //   number of pages - derived from showSetCount
var currPage = 1;                                            //   the current page number (initialized to page 1)
var pagingHtml = '';                                         //   global because it needs to be preserved
var keyPressed = false;                                      //   flag to identify keypress (name search) function
var listClone =  $(".student-list > li").clone();            //   full student list clone from the <li>s

// *********************************************************************************
//  setup searchHtml -- slight variance from initial file
//                      brought the <h2> element into variable so the inner HTML of the div is complete within the variable
//                      I dropped the button because I wasn't using it because of the dynamic name search
//
var searchHtml = '<h2>Students</h2><span Id="student-search"><input class="searchVal" type="text" placeholder="Search for students...">';
var searchStr = '';

//  end of global variables
//  ********************************************************************************

$(".page-header").html(searchHtml);                     //  inject the name search into the header
$(".page").append("<div class='pageNav'></div>");       //  provide a div for pagination

initializeFullDisplay();                                //  set for display all students

//  event listeners
clickListener();

keypressListener();

//  end of processing
//  ********************************************************************************

//  ********************************************************************************
//  Define Functions
//  ********************************************************************************

//  Initialize full display (first pass & reset)

function initializeFullDisplay() {

    listClone.each(function(index) {
        $(this).attr("class", "student-item cf display");    //  identify all students as eligible for display
        $(this).removeAttr("style");                         //  clear style attribute
    });
    showSetCount = 0;                                        //  number to show in selected set

    buildPaging(listClone);                                  //  build the page
}

//  paging function   --  builds the paging button set from first page or keypress function

function buildPaging(clone) {
    $(".noMatch").remove();                                       // remove the noMatch message if it was appended from a previous search
    $(".pageNav").empty();                                        // clear the pagination links class div
    clone.each(function(index) {
        if ($(this).attr("class") === "student-item cf display") {
            $(this).attr("id", "show-"+showSetCount);
            showSetCount +=1;                                    // count the display elements
        }
    });

    // if search comes back with no results, append message to the list stating to the effect
    if ( (showSetCount - 1) === 0 ) {
        $("#student-search").append("<p class='noMatch'>NO MATCHES FOUND.</p>");
    }
    // count total number of page links required for pagination
    //          will be = to either a function of all students
    //          or = to a function of number of names matched

    numPages = Math.ceil(showSetCount/showOnPage);
    if (numPages > 1) {
        pagingHtml = '<ul id="paging"><li><a href="#"><</a></li>';
        var loopPage=1;
        while(numPages >= loopPage){
            pagingHtml += '<li><a href="#">' + (loopPage) +'</a></li>';
            loopPage ++;
        }

        if (keyPressed) {
            pagingHtml += '<li><a href="#">></a></li><li><a href="#">reset</a></li></ul></div>';
        } else {
            pagingHtml += '<li><a href="#">></a></li></ul></div>';
        }
    } else {
        pagingHtml = '<ul id="paging"><li><a href="#">reset</a></li></ul></div>';
    }

    $(".pageNav").html(pagingHtml);     // reinsert paging buttons

    currPage = 1;           //  display always starts with the first page

    showPage(listClone);
}

//  display function    --  displays the results of buildPaging, either directly or through page click function

function showPage(clone) {                                           //  shows the pages required by buildPaging @ click function
    clone.hide();                                                    //  hide everything
    $(".student-list").html(clone);                                  //  refresh html with cloned list
    var showFirst = ( (currPage * 10) - 10 );                        //  set first display position
    var showLast = ( showFirst + showOnPage );                       //  set last display position

    clone.each(function() {
        //listClone.css( "opacity", 1);                                //  overcome transparency from fadeIn function
        var showCount = $(this)[0].id.split('-')[1];                 //  split out showCount
        showCount = parseInt(showCount,10);                          //  convert to an integer
        if ( (! isNaN(showCount )) && showCount >= showFirst && showCount < showLast ) {      //  this is an actual display item
            $(this).show(500);                                      //  show with 1 sec fade in
        }
    });
    showSetCount = 0;                                                //  initialize for next page display
}

//  click function

function clickListener() {
    $('.pageNav').on('click', 'a', function(c){                 //  get page clicked on
        //c.preventDefault();                                     //  kill default click behavior
        var clickSel = c.target.textContent;                    //  value of the button clicked
        searchStr = '';                                         //  reset searchStr for name search
        if ( clickSel === '<' ) {                               //  Previous Page
            clickSel = currPage - 1;
            if ( clickSel > 0 ) {
                currPage = clickSel;
            }
            else {
                currPage = 1;
            }
        } else if ( clickSel === '>' ) {                        //  Next Page
            clickSel = currPage + 1;
            if ( clickSel <= numPages ) {
                currPage = clickSel;
            }
            else {
                currPage = numPages;
            }
        }  else if ( parseInt(clickSel,10) ) {
            currPage = parseInt(clickSel,10);                  //  Numbered Page
        }

        if ( clickSel === 'reset' ) {                           //  Reset Paging (going back to first page)
            currPage = 1;
            keyPressed = false;
            initializeFullDisplay();
        }

        showPage(listClone);

    });
}   //  end of click function

//  keypress function   --  builds pattern match for name search fed to buildPaging()

//  Explanation of why I chose to use keyPress instead of keyDown or keyUp
//      Taken from: http://www.w3library.com/javascript/onkeypress-vs-onkeyup-and-onkeydown/
//      KeyDown is fired when ANY key is pressed down
//      KeyUp is fired when ANY key is released
//      KeyPress is fired when a key is pressed and released, but ONLY fires for keys with printable characters
//      Since Name Searching is limited to printable characters, I decided to use the specialized handler

function keypressListener() {
    searchStr = '';

    $('.page-header').on('keypress', '.searchVal', function(k) {
        k.preventDefault();
        keyPressed = true;
        searchStr += k.key;                                                             //  grab key value from text input field
        $(".pageNav > ul > li > a").attr("href", "#");                                  //  reset to page 1 of pagination
        $(".pageNav > ul > li:first-child > a").attr("class", "active");                //  first student in list

        //  explanation of why I used RegExp
        //      Though not specifically required or specified
        //      RegExp offers a more flexible style of search
        //      in that the pattern being matched on the target element
        //      can be present anywhere in the string

        var ptrnMatch = new RegExp(searchStr,"i");                          //  for pattern/character matching, case insensitive
        listClone.each(function(index) {                                    //  looping through each li element in the local list clone
            $(this).removeAttr("id");                                       //  clear pre-applied IDs
            $(this).removeClass("display");                                 //  clear pre-applied class of display
            $(this).removeAttr("style");                                    //  clear style attribute
            var name = $(this).find("h3").text();                           //  get the name
            var email = $(this).find(".email").text().split('@')[0];        //  get the name portion of email
            var searchVal = name + " " + email;                             //  concatentate for single search
            if (searchVal.match(ptrnMatch) !== null) {                      //  if there is a match
                $(this).addClass("display");                                //  mark for display
            }

        });
        buildPaging(listClone);

    });
}     //  end of keypress function

// ******************************************************
// end of function definitions
// ******************************************************

