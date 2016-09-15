(function () {
    'use strict';	// this function is strict... prevents use of undeclared variables
    /*globals $:false */		//	prevent jshint from declaring $ as undefined
    //
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
    var reset = true;                                            //   display reset flag
    var searchHTML = '<div class="student-search"><input placeholder="Search for students..."><button>Search</button></div>';

    var searchStr = '';

    //  end of global variables
    //  ********************************************************************************
    $(".page-header").append(searchHTML);                   //  insert the search block
    $(".page").append("<div class='pageNav'></div>");       //  provide a div for pagination

    initializeFullDisplay();                                //  set for display all students

    //  event listeners
    clickListener();

    inputListener();

    //  end of processing
    //  ********************************************************************************

    //  ********************************************************************************
    //  Define Functions
    //  ********************************************************************************

    //  Initialize full display (first pass & reset)

    function initializeFullDisplay() {

        listClone.each(function(index) {
            $(this).attr("class", "student-item cf display");    //  identify all students as eligible for display
        });

        buildPaging(listClone);                                  //  build the page
    }

    //  paging function   --  builds the paging button set from first page or keypress function

    function buildPaging(clone) {
        $(".noMatch").remove();                                       // remove the noMatch message if it was appended from a previous search
        $(".pageNav").empty();                                        // clear the pagination links class div
        showSetCount = 0;
        clone.each(function(index) {
            if ($(this).attr("class") === "student-item cf display") {
                $(this).attr("id", "show-"+showSetCount);
                showSetCount += 1;
            }
        });
        // if search comes back with no results, append "NO MATCH" message
        if ( (showSetCount) === 0 ) {
            $(".student-search").append("<p class='noMatch'>NO MATCHES FOUND.</p>");
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

            if (keyPressed && searchStr !=='') {
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
            var showCount = $(this)[0].id.split('-')[1];                 //  split out showCount
            showCount = parseInt(showCount,10);                          //  convert to an integer
            if ( (! isNaN(showCount )) && showCount >= showFirst && showCount < showLast ) {      //  this is an actual display item
                if ( reset || keyPressed ) {
                    $(this).show();                                      //  show without fade in
                } else {
                    $(this).show('slow');                                //  show with slow fade in
                }
            }
        });
        reset = false;
        keyPressed = false;
        showSetCount = 0;                                                //  initialize for next page display
    }

    //  click function

    function clickListener() {
        $('.pageNav').on('click', 'a', function(c){                 //  get page clicked on
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

            if ( clickSel === 'reset' ) {                          //  Reset Paging (going back to first page)
                currPage = 1;
                keyPressed = false;
                reset=true;
                initializeFullDisplay();
            }

            showPage(listClone);

        });
    }   //  end of click function

    //  inputListener function   --  builds pattern match for name search fed to buildPaging()
    //      Originally tried keypress, keyup, keydown - all had shortcomings
    //      keypress only fires on printable characters & and is not supported by Safari
    //      keyup & keydown - fired on all characters but I could not tell the difference
    //      between critical special keys like backspace, single quote, return
    //
    //      So I switched to input -- worked fine & I didn't have to analyze searchStr after each keystroke
    //

    function inputListener() {
        $('.student-search').bind('input', function(e) {

            e.preventDefault();
            searchStr = e.target.value.toLowerCase();
            keyPressed = true;
            //  grab key value from text input field
            listClone.each(function(index) {                                    //  looping through each li element in the local list clone
                $(this).removeAttr("id");                                       //  clear pre-applied IDs
                $(this).removeClass("display");                                 //  clear pre-applied class of display
                var name = $(this).find("h3").text();                           //  get the name
                var email = $(this).find(".email").text().split('@')[0];        //  get the name portion of email
                var targetVal = (name + " " + email).toLowerCase();             //  concatentate for single search
                var found = targetVal.indexOf(searchStr);                       //  test for presence of input string
                if ( found !== -1 ) {                                           //  if search string is found
                    $(this).addClass("display");
                }
            });
            buildPaging(listClone);

        });
    }     //  end of inputListener function

    // ******************************************************
    // end of function definitions
    // ******************************************************
}());
//
//  This approach started with web.enavu.com/tutorials/making-a-jquery-pagination-system/
//      Some other techniques came from stackoverflow.com/questions/2808189/jquery-how-to-determine-which-li-tag-was-clicked
//      I ended up abandoning the approach as too cumbersome.
//      I am documenting these things so I will remember them in the future - because who knows.
//      the use of Module Pattern (anonymous function enveloping the entire program) came from
//              https://teamtreehouse.com/library/the-module-pattern-in-javascript.
//
//      I am also documenting, for the evaluator, why I selected some functionality not expressly called for in the instructions

 