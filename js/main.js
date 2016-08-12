//  This approach refrences web.enavu.com/tutorials/making-a-jquery-pagination-system/
//      some of the ideas used in this program are borrowed and adapted from the tutorial.
//      some come from stackoverflow.com/questions/2808189/jquery-how-to-determine-which-li-tag-was-clicked
//      I am documenting these things so I will remember them in the future.
//
//  Define Global Variables
//  ********************************************************************************
//  ********************************************************************************

//  pagination globals
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
var listSource = '';
//  the name search control div
var searchControlHtml = '<div class="search-control"></div>'
//  the ul for the search capability
var searchUl = '<ul class="search-list"></ul>';

//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function getTotals()    //  builds student count, total pages, last page overflow
{
    totalCount = $(".student-list").children().length;
    overflowCount = totalCount - ( Math.floor( totalCount / stdPageCount ) * stdPageCount );
    totalPages = Math.ceil( totalCount / stdPageCount );

}

function buildHeadSearch()      //  builds student name search box
{
    searchButtonHtml = '<div class="student-search">';
    searchButtonHtml +='<input class="searchVal" type="text" placeholder="Search for students...">';
    searchButtonHtml +='<button onclick="buildStudentSearch()">Search</button></div>';
}

function buildPaginatorButtons()        //  builds pagination control buttons
{
    //  builds all the buttons that are required
    //  1 for prev page (<)
    //  1 for each specific page (in this case 6)
    //  1 for next page (>)

    paginatorHtml = '<ul class="pagination"><li class="prevLink" longdesc="<"><button type="button">' + "<" + '</button></li>';
    var loopPage=1;
    while(totalPages >= loopPage){
        paginatorHtml += '<li class="pageLink" longdesc="' + loopPage +'"><button type="button">' + (loopPage) +'</button></li>';
        loopPage ++;
    }
    paginatorHtml += '<li class="nextLink" longdesc=">"><button type="button">' + ">" +'</button></li></ul>';
}

function prevPage()     //  builds "previous" page pagination control
{
    var newPage = currentPage - 1;
    if( newPage > 0 ){              //  if there is an item before the current active link run the function
        goToPage(newPage);
    }

}

function nextPage()     // build "next" page pagination control
{
    var newPage = currentPage + 1;
    if( newPage <= totalPages ){    //  if the selection remains within the page range
        goToPage(newPage);
    }

}
function goToPage(pageNum)      //  execute actual page change
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

function buildPaginationPage()      //  tailor pagination control
{
    //add activePage class to the first page link
    $('.pagination .pageLink:first').addClass('activePage');

    //  establish the length of the page (perPageCount) elements

    if (currentPage === totalPages) {
        endDisplay = startDisplay + overflowCount;
    }
    else {
        endDisplay = startDisplay + stdPageCount;
    }
    //hide the comlpete list of  elements inside content div
    $('.student-list').children().hide();

    //  display the page that was built
    listSource = 'pagination';

    showPage(listSource);
}

function buildStudentSearch()       //  build name search control
{
    //hide the comlpete list of  elements inside content div
    $('.student-list').children().hide();
    //  establish search pattern
    var searchString = $(".searchVal").val();
    patMatch = new RegExp(searchString,"gi");  //  for pattern/character matching, case insensitive

    //  search for pattern in each child of student-list and build search-list
    var nameList = $(".student-details h3").toArray();
    var emailList = $(".email").toArray();

    for ( var i = 0; i < nameList.length; i++ ) {
        //  strip <tags> from name and email array elements, leaving text only
        var testName = nameList[i].textContent;
        var testEmail = emailList[i].textContent;
        // match on the name and email using the RegExp patMatch
        var n = testName.match(patMatch);
        var e = testEmail.match(patMatch);
        //  if there is a match on either name or email, add to the search-list

        if ( n !== null || e !== null ) {
            startDisplay = i;
            endDisplay = i + 1;
            showPage('search')

        }

    }
}


function showPage(listSource)       //  execute page display (pagination or name search)
{
    // here is how it works
    // coming from pagination - startDisplay/endDisplay = a range of students on the page
    // coming from name search - startDisplay/endDisplay = the one item being displayed
    //      if the results of name search yields multiple names the for loop in buildStudentSearch() will send it back
    //      for the subsequent names

    $('.student-list').children().slice(startDisplay, endDisplay).show();

    return  //  Just to make it obvious
}


//  *********************************************************************************
//  *********************************************************************************
//  Mainline Processing
//  *********************************************************************************
//  *********************************************************************************

getTotals();
buildHeadSearch();
buildPaginatorButtons();
//  append the search and pagination elements

$('.page-header').append(searchButtonHtml);          //  set up the search capability (searchbox and button)
$('.page').append(searchControlHtml);                //  set up for search display control
$('.page').append(paginatorHtml);                   //  set up the page selector buttons, based on total pages (includes '<' & '>'

buildPaginationPage();

//  click event for pagination

$('li').click(function(){
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
    
    buildPaginationPage();  //  build the specifics of the pagination display
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

//
//  Notes to remember why I used this approach for -- future reference
//
// searchButtonHtml & paginatorHtml are no mystery; they are the apparatus for executing the functionality
// searchControlHtml gives me a <div class="search-control"> between the <ul class="student-list"> & <ul class="pagination">
// within <div class="search-control"> have placed <ul class="search-list"></ul> which serves as the wrppper for name searches
// I can build, .show and .remove the results of pattern matching on names without disturbing
// either <ul class="student-list"> or <ul class="pagination">
//
// the process on name searches works like this:
//      buildStudentSearch()
//          1. establish a new pattern match (RegExp)
//          2. gather (append) one or more students that meet the pattern match on either name or email
//          3. if there are any names matched
//                4. append <ul class="search-list"></ul> to .searchControl (empty wrapper)
//                5. call showPage()
//      showPage(listSource)
//          1. .hide the full student list
//          if sourceList = 'pagination'
//              2. show the slice of page-selected students
//          else
//              3. .show the list of pattern matched students
//              4. call removeSearchList()
//      removeSearchList()
//          1. .remove search-list                (the one just built and shown)
//
//******************************************************************
//
//  Problems solved with this approach (all of which I experienced before adopting the approach)
//
//      1. simplified the determination of which elements were in and which where out for display on name searches
//      2. simplified the buiilding and releasing of elements for multiple (and unique) name searches
//      3. simplified the ability to keep the pagination list at the bottom of (instead of above) the displayed list, through iterations
//      4. eliminated the possibility of retaining prior name search results, through iterations
//      5. simplified the process of preventing name search lists from "tagging along" when reverting to pagination

