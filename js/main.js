debugger;
//  Define Global Variables
//  ********************************************************************************
//  ********************************************************************************

var firstPass = true;
var startLoop = 0;
var loopCount = 0;
var loopEnd = 10;
var totAllStudents = 0;
var totPages = 0;
var studentsPerPage = 10;
var overFlowStudents = 0;
var searchHtml = '';
var studentSelected = false;
var strSelected = false;
var pageSelected = false;
var btnCount = 0;
var pageCount = 0;
var pageDisplay = '';
var buttons = '';

//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function getTotals()
{
    totAllStudents = $(".student-list").children().length;
    totPages = Math.ceil( totAllStudents / studentsPerPage );
    overFlowStudents = totAllStudents - ( Math.floor( totAllStudents / studentsPerPage ) * studentsPerPage );
}

function buildHeadSearch()
{
    searchHtml = '<div class="student-search">';
    searchHtml +='<input placeholder="Search for students...">';
    searchHtml+='<button>Search</button></div>';
}

function buildPageButtons()
{
    buttons = '<div class="pagination"><ul>';

    for ( btnCount = 1; btnCount <= totPages; btnCount ++ )
    {
        buttons = buttons + '<li><button class="' + btnCount + '">' + btnCount + '</button></li>';
    }

    buttons = buttons + '</ul></div>';
}

function getPageParams ()
{
    if ( studentSelected )            //  specific Student selected (one only)
    {
        startLoop = 0;
        loopEnd = startLoop + 1;
    }
    else if ( strSelected )           //  search-string selected
    {
        startLoop = 0;
    }
    else                              //  page selected
    {
        pageSelected = true;
        startLoop = ( pageCount * 10 ) - 10;
    }
}

function buildDisplayPage()
{
    pageDisplay = '';
    for ( loopCount = startLoop; loopCount < loopEnd; loopCount ++ )
    {
        var imageUrl = document.getElementsByTagName('img')[loopCount].getAttribute("src");
        var studentName = document.getElementsByTagName("h3")[loopCount].textContent;
        var studentEmail = document.getElementsByClassName("email")[loopCount].textContent;
        var joinedDate = document.getElementsByClassName("date")[loopCount].textContent;

        pageDisplay = pageDisplay + '<l1 class="student-item cf>"';
        pageDisplay = pageDisplay + '<div class="student-details">';
        pageDisplay = pageDisplay + '<img class="avatar" src="' + imageUrl + '">';
        pageDisplay = pageDisplay + '<h3>' + studentName + '</h3>';
        pageDisplay = pageDisplay + '<span class="email">' + studentEmail + '</span>' + '</div>';
        pageDisplay = pageDisplay + '<div class="joined-details">';
        pageDisplay = pageDisplay + '<span class="date">' + joinedDate + '</span>' + '</div></li>';
    }
    debugger;
}

function renderPage()
{
    $('.student-search').append(searchHtml);
    $('.student-list').innerHTML = pageDisplay;     //  refresh the page content
    $('.buttons').append(buttons);                  //  append the buttons

    debugger;

}
//  Mainline Processing
//  *********************************************************************************
//  *********************************************************************************
debugger;
if ( firstPass )
{
    firstPass = false;
    startLoop = 0;
    loopEnd = 10;

    getTotals();
    buildHeadSearch();
    buildPageButtons();
}
else
{
    //input event for search
    var querySearch = document.querySelector("div.student-search input[Search for students...]");
    if ( querySearch === null )
    {
        studentSelected = false;
        strSelected = false;
    }
    else
    {
        //  logic for search
    }

    //  click event for page selection
    for ( pageCount = 1; ( pageSelected === false && pageCount <= totPages  ); pageCount ++ )
    {
        var className = '.' + pageCount;
        var clickElement = document.getElementsByClassName(className);
        clickElement.addEventListener("click", getPageParams, false);
    }
}

buildDisplayPage();
renderPage();
