//  This approach refrences web.enavu.com/tutorials/making-a-jquery-pagination-system/
//      some of the ideas used in this program are borrowed and adapted from the tutorial.
//      some come from stackoverflow.com/questions/2808189/jquery-how-to-determine-which-li-tag-was-clicked
//      I am documenting these things so I will remember them in the future.
//
//  Define Global Variables
//  ********************************************************************************
//  ********************************************************************************

//  pagination globals
var reset = true;
var totalCount;
var totalPages;
var stdPageCount = 10;
var overflowCount;
var searchButtonHtml;
var paginatorHtml;
var pageNum;
var perPageCount;
// next three are initialized for first pass. They will be reset with each new selection
var currentPage = 1;
var startDisplay = 0;
var endDisplay = stdPageCount;

//  search globals
var patMatch = '';
var listSource = 'paginationStd';
var searchCount = 0;
//  the ul for the search capability
var searchUl = '<ul class="search-list"></ul>';

//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function buildHeadSearch()      //  builds student name search box
{
    searchButtonHtml = '<div class="student-search">';
    searchButtonHtml +='<input class="searchVal" type="text" placeholder="Search for students...">';
    searchButtonHtml +='<button type="button" class="nameSrch">Search</button></div>';
}

function buildTotals()    //  builds student count, total pages, last page overflow
{
    if ( reset ) {
        totalCount = $(".student-list").children().length;
        overflowCount = totalCount - ( Math.floor( totalCount / stdPageCount ) * stdPageCount );
        totalPages = Math.ceil( totalCount / stdPageCount );
        reset = false;
    } else
    {
        totalCount = searchCount;
        overflowCount = totalCount - ( Math.floor( totalCount / stdPageCount ) * stdPageCount );
        totalPages = Math.ceil( totalCount / stdPageCount );
    }

}

function buildPageButtons()           //  builds pagination control buttons
{
    //  builds all the buttons that are required
    //  1 for prev page (<)
    //  1 for each specific page 
    //  1 for next page (>)
    //  1 to reset (reset) and go back to page 1

    paginatorHtml = '<ul class="paging"><li class="paging prevLink" longdesc="<"><button type="button">' + "<" + '</button></li>';
    var loopPage=1;
    while(totalPages >= loopPage){
        paginatorHtml += '<li class="paging pageLink" longdesc="' + loopPage +'"><button type="button">' + (loopPage) +'</button></li>';
        loopPage ++;
    }
    paginatorHtml += '<li class="paging nextLink" longdesc=">"><button type="button">' + ">" +'</button></li>';

    if ( listSource === 'paginationStd' )
    {
        paginatorHtml += '</ul>'
    } else
    {
        //add the reset button when coming from the name search
        paginatorHtml += '<li class="reset" longdesc="reset"><span> </span><button type="button">' + "reset" +'</button></li></ul>';
    }

}

function prevPage()                   //  build "previous" page pagination control
{
    var newPage = currentPage - 1;
    if( newPage > 0 ){              //  if there is an item before the current active link run the function
        goToPage(newPage);
    }

}

function nextPage()                   // build "next" page pagination control
{
    var newPage = currentPage + 1;
    if( newPage <= totalPages ){    //  if the selection remains within the page range
        goToPage(newPage);
    }

}
function goToPage(pageNum)            //  execute actual page change
{
    //get the number of items shown per page
    if ( pageNum < totalPages )
    {
        perPageCount = stdPageCount;
    }
    else
    {
        perPageCount = overflowCount;
    }

    startDisplay = (pageNum * stdPageCount)-10;      //    get the element number from where to start the slice
    endDisplay = startDisplay + perPageCount;        //    get the element number at where to end the slice

    //hide all children elements of student-list, get specific items and show them
    //$('.student-list').children().css('display', 'none').slice(startPos, endPos).css('display', 'block');
    $('.student-list').children().hide;                 //  hide the full list of student
    $('.student-list').slice(startDisplay,endDisplay).show;     //  show the current page slice of students

    /*  get the page link that has longdesc attribute of the current page and add activePage class to it
     and remove that class from previously active page link */
    $('.pageLink[longdesc=' + pageNum +']').addClass('activePage').siblings('.activePage').removeClass('activePage');

    //update the current page input field  
    //$('#currentPage').val(pageNum);
    currentPage = pageNum;
}
function resetPagination()                                     // reset pagination and return to page one
{
    clearPagination();
    $('.student-list').children().removeClass("selected");     //   reset any previously select students

    //  sets up for redisplay of page one
    currentPage = 1;
    startDisplay = 0;
    reset = true;

}

function buildStudentSearch()       //  build name search control
{
    //  establish search pattern
    var searchString = $(".searchVal").val();
    patMatch = new RegExp(searchString,"gi");  //  for pattern/character matching, case insensitive

    //  search for pattern in each child of student-list and build search-list
    var nameList = $(".student-details h3").toArray();
    var emailList = $(".email").toArray();

    for ( var i = 0; i < $(".student-list").children().length; i++ ) {

        var n = $(".student-details h3")[i].textContent.match(patMatch);
        var e = $(".email")[i].textContent.match(patMatch);

        //  if there is a match on either name or email, add to the search-list by setting class 'selected'
        if ( n !== null || e !== null )
        {
            document.getElementsByClassName("student-item cf")[i].setAttribute("class", "student-item cf selected");
        }

    }
    debugger;
    searchCount = document.getElementsByClassName("student-item cf selected").length;   //  how many students selected?
    if ( searchCount <= stdPageCount )
    {
        // we have a simple search  --  no paging involved
        listSource = 'simpleSrch';
    } else {
        // we have a pagination search  --  more than will display on a page
        reset = false;
        currentPage = 1;
        //  establish totals and pagination for the name search
        listSource = 'paginationSrch';
    }

    return;     //  just to make it obvious

}

function buildPaginationPage()      //  tailor pagination control - standard paging
{
    //add activePage class to the first page link
    $('.paging .pageLink:first').addClass('activePage');

    //  establish the length of the page (perPageCount) elements

    if (currentPage === totalPages) {
        endDisplay = startDisplay + overflowCount;
    }
    else {
        endDisplay = startDisplay + stdPageCount;
    }
    $('.student-list').children().hide();                      //   hide the comlpete list of  elements inside content div

    return;   //  Just to make it obvious

}

function showPage(listSource)       //  execute page display (pagination or name search)
{
    // here is how it works
    // coming from pagination - startDisplay/endDisplay = a range of students on the page
    // coming from name search - startDisplay/endDisplay = the one item being displayed
    //      if the results of name search yields multiple names the for loop in buildStudentSearch() will send it back
    //      for the subsequent names

    if ( listSource == 'paginationStd' ) {
        $('.student-list').children().slice(startDisplay, endDisplay).show();              // standard pagination

    } else if ( listSource == 'simpleSrch' ) {
        $(".selected").show();                                      // simple pattern match
        listSource = 'paginationStd';                               //  reset for paginationStd -- no need for paging

    } else {
        $(".selected").slice(startDisplay, endDisplay).show();   // search pagination

    }

    return;   //  Just to make it obvious
}

function presentPage()
{

    buildPaginationPage();
    showPage(listSource);

}

function clearPagination()                                     //   clear up any previous search pagination
{

    $(".paging").remove();                                     //  removes the pagination buttons

}

//  *********************************************************************************
//  *********************************************************************************
//  First Pass Processing
//  *********************************************************************************
//  *********************************************************************************

buildHeadSearch();
buildTotals();
buildPageButtons();

listSource = 'paginationStd';
$('.page-header').append(searchButtonHtml);          //  set up the search capability (searchbox and button)
$('.page').append(paginatorHtml);                    //  set up the page selector buttons, based on total pages (includes '<' & '>' & 'reset'

presentPage();

//  *********************************************************************************
//  *********************************************************************************
//  click Processing
//  *********************************************************************************
//  *********************************************************************************

//  click event for pagination

$('li.paging').click(function()
{
    var selection = $(this).attr('longdesc');
    if (selection === '<' )
    {
        prevPage();
    }
    else if (selection === '>')
    {
        nextPage();
    }
    else
    {
        pageNum = parseInt(selection,10);
        goToPage(pageNum);
    }

    presentPage();
});

//  click event for name search

$( 'button.nameSrch' ).click(function()
{
    debugger;
    buildStudentSearch();                         //  populate the search list

    if ( listSource === 'paginationSrch' )        //   if name search results in pagaination
    {
        clearPagination();                        //   remove for name search pagination
        buildTotals();                            //   build the display totals again
        buildPageButtons();
        $('.page').append(paginatorHtml);                    //  set up the page selector buttons, based on total pages (includes '<' & '>' & 'reset'
    }

    presentPage();
});

//  click event for pagination reset

$( 'li.reset' ).click(function()
{
    resetPagination();
    buildTotals();
    buildPageButtons();
    $('.page').append(paginatorHtml);    //  re-estabilsh pagination buttons
    listSource = 'paginationStd';
    presentPage();
});


/*****************************************************************
    the following links to code are cross-browser fixes to prevent placeholder string values
    from appearing in form action script.

    Dont know if I will need them but want to remember how to get back to them

    Released under MIT license: http://www.opensource.org/licenses/mit-license.php
    jQuery HTML5 placeholder fix.js

    https://gist.github.com/hagenburger/379601
    see also
    https://github.com/mathiasbynens/jquery-placeholder
******************************************************************/
