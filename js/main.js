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

var totToShow = 0;                                     //   The total Students to show - all pages
var pageToShow = 0;                                    //   The total Students to show - this page
var numPages = 0;                                      //   number of pages - derived from totTorShow
var currPage = 1;                                      //   the current page number (initialized to page 1)

var showOnPage = 10;                                   //   declare number of students per standard page
var listClone =  $(".student-list > li").clone();      //   full student list clone from the <li>s
var totAllStudents = listClone.length;                 //   total number of all Students

// *********************************************************************************
//  setup searchHtml -- slight variance from initial file
//                      brought the <h2> element into variable so the inner HTML of the div is complete within the variable
//                      dropped the button because I wasn't using it
//
var searchHtml = '<h2>Students</h2><span Id="student-search"><input class="searchVal" type="text" placeholder="Search for students...">';
var searchStr = '';

//  ********************************************************************************
//  Define Functions
//  ********************************************************************************

//  click function

function clickListener()
{
    $(".pageNav > ul > li > a").click(function(c)       //  get the page clicked for
    {
        var selection = c.target.textContent;           //  value of the button clicked
        if ( selection == '<' )                          //  Previous Page
        {
            selection = currPage - 1;
            if ( selection > 0 )
            {
                currPage = selection;
            }
            else
            {
                currPage = 1;
            }
        }
        else if ( selection == '>' )                     //  Next Page
        {
            selection = currPage + 1;
            if ( selection <= numPages )
            {
                currPage = selection;
            }
            else
            {
                currPage = numPages;
            }
        }
        else
        {
            currPage = parseInt(selection,10);          //  Specific Page
        }

        showPage(listClone);

    });
}   //  end of click function

//  Explanation of why I chose to use keypress
//      Taken from: http://www.w3library.com/javascript/onkeypress-vs-onkeyup-and-onkeydown/
//      KeyDown is fired when ANY key is pressed down
//      KeyUp is fired when ANY key is released
//      KeyPress is fired when a key is pressed and released, but ONLY fires for keys with printable characters
//      Since Name Searching is limited to printable characters, I decided to use the specialized handler

//  keypress function   --  builds pattern match for name search fed to buildPaging()

function keypressListener()
{
    $(".search-input").keypress(function(k)
    {
        listClone.css( "opacity", 1);                                                   //  erase any lingering transparency from fadeIn function
        $(".pageNav > ul > li > a").attr("href", "#");                                  //  reset to page 1 of pagination
        $(".pageNav > ul > li:first-child > a").attr("class", "active");                //  first student in list
        searchStr += k.key;                                                             //  grab text from text input field
        //  explanation of why I used RegExp
        //      Though not specifically required or specified
        //      RegExp offers a more flexible style of search
        //      in that the pattern being matched on the target element
        //      can be present anywhere in the string
        var ptrnMatch = new RegExp(searchStr,"gi");                                         //  for pattern/character matching, case insensitive
        console.log( 'searchStr = '+searchStr+' ptrnMatch = '+ptrnMatch );
        listClone.each(function(index)
        {                   //  looping through each li element in the local list clone
            $(this).removeAttr("id");                                                   //  clear pre-applied IDs
            var nameText = $(this).find("h3").text();                                   //  get the name
            var emailText = $(this).find(".email").text().substring(0,($(this).indexOf('@')));  //  get the name portion of email
            var lookUpText = nameText + " " + emailText;                                //  concatentate for single search
            console.log( 'lookUpText = '+lookUpText );
            if (lookUpText.match(ptrnMatch) !== null)                                   //  if there is a match
            {
                $(this).attr("id", "display");                                          //  mark for disply
            }
        });

        buildPaging(listClone);

    });
}     //  end of keypress function

//  paging function   --  builds the paging button set from first page or keypress function

function buildPaging(clone)
{
    //
    //****************************************
    //  initialize
    //****************************************
    //

    $(".noMatch").remove();                             // remove the noMatch message if it was appended from a previous search
    $(".pageNav").empty();                              // clear the pagination links class div
    // count all elements to be shown
    totToShow = 0;
    clone.each(function(index)
    {
        if ($(this).attr("id") == "display")
        {
            $(this).attr("id", "display-"+(index));
            totToShow +=1;                              // count the display elements
        }

    });

    // if search comes back with no results, append message to the list stating to the effect
    if ((totToShow - 1) < 1) {
        $("#student-search").append("<p class='noMatch'>NO MATCHES FOUND.</p>");
    }
    // count total number of page links required for pagination
    //          will be = to either a function of all students
    //          or = to a function of number of names matched

    numPages = Math.ceil(totToShow/showOnPage);

    //only paginate if there is more than one page
    if (numPages > 1) {
        var pagingHtml = '<ul id="paging"><li><a href="#">' + "<" + '</a></li>';
        var loopPage=1;
        while(numPages >= loopPage){
            pagingHtml += '<li><a href="#">' + (loopPage) +'</a></li>';
            loopPage ++;
        }
        pagingHtml += '<li><a href="#">' + ">" +'</a></li>';
        pagingHtml += '</ul></div>';

        // assign inner html of pagination div with constructed pagination string, 1st element class set to active
        $(".pageNav").html(pagingHtml);
    }
    currPage = 1;           //  display always starts with the first page

    showPage(listClone);
}

//  display function    --  displays the results of buildPaging, either directly or through page click function

function showPage(clone)                                          //  shows the pages required by buildPaging @ click function
{
    clone.hide();                                                 //  hide everything
    $(".student-list").html(clone);                               //  populate html with new list
    var first = ( (currPage * 10) - 10 );                         //  set first display position
    var last = ( first + showOnPage );                            //  set last display position
    var refIndex = -1;                                            //  initialize

    clone.each(function(index)
    {
        if ( $(this).attr("id") == 'display-'+index.toString() )  //  this is a possible diplay item
        {
            refIndex += 1;
            if ( refIndex >= first && refIndex < last )           //  this is an actual display item
            {
                $(this).show().fadeIn(3000);                      //  show with 1 sec fade in
            }
        }

    });

}
// ******************************************************
// end of function definitions
// ******************************************************

$(".page-header").html(searchHtml);                     //  inject the name search into the header
$(".page").append("<div class='pageNav'></div>");       //  provide a div for pagination

listClone.each(function(index)
{
    //if ( index <= 9 ) {
    $(this).attr("id", "display");                      //  identify all students for display
    //}
    totToShow = totAllStudents;                         //  set number in all pages
    pageToShow = showOnPage;                           //  set number for first page
});

buildPaging(listClone);                                 //  build the page
debugger;
//  event listeners
clickListener();
keypressListener();
//document.getElementById("student-search").addEventListener("keypress",keypressListener);
//document.getElementById("paging").addEventListener("click",clickListener);

