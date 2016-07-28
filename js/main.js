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
var searchHtml;
var paginator;
var pageNum;
var perPageCount;
// next three are initialized for first pass. They will be reset with each new selection
var currentPage = 1;
var startDisplay = 0;
var endDisplay = stdPageCount;

//  search globals
var search = '';

//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function getTotals()
{
    totalCount = $(".student-list").children().length;
    overflowCount = totalCount - ( Math.floor( totalCount / stdPageCount ) * stdPageCount );
    totalPages = Math.ceil( totalCount / stdPageCount );

}

function buildHeadSearch()
{
    searchHtml = '<div class="student-search">';
    searchHtml +='<input type="text" placeholder="Search for students...">';
    searchHtml +='<button>Search</button></div>';
}

function buildPaginator()
{
    //  builds all the buttons that are required
    //  1 for prev page (<)
    //  1 for each specific page (in this case 6)
    //  1 for next page (>)

    paginator = '<ul class="pagination"><li class="prevLink" longdesc="<"><button type="button">' + "<" + '</button></li>';
    var loopPage=1
    while(totalPages >= loopPage){
        paginator += '<li class="pageLink" longdesc="' + loopPage +'"><button type="button">' + (loopPage) +'</button></li>';
        loopPage ++;
    }
    paginator += '<li class="nextLink" longdesc=">"><button type="button">' + ">" +'</button></li></ul>';
}

//  execute pagination options

//  ********************************************************************************
//  ********************************************************************************

function prevPage(){

    /*newPage = parseInt($('#currentPage').val()) - 1;*/
    newPage = currentPage - 1;
    if( newPage > 0 ){              //  if there is an item before the current active link run the function
        goToPage(newPage);
    }

}

function nextPage(){
    /*newPage = parseInt($('#currentPage').val()) + 1;*/
    newPage = currentPage + 1;
    if( newPage <= totalPages ){    //  if the selection remains within the page range
        goToPage(newPage);
    }

}
function goToPage(pageNum){
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

function showPage()
{
    //add activePage class to the first page link
    $('.pagination .pageLink:first').addClass('activePage');

//hide all the elements inside content div
    $('.student-list').children().hide();

//and show the first n (perPageCount) elements

    if (currentPage === totalPages)
    {
        endDisplay = startDisplay + overflowCount;
    }
    else
    {
        endDisplay = startDisplay + stdPageCount;
    }
    $('.student-list').children().slice(startDisplay, endDisplay).show();

}
//  end of execute pagination

//  ********************************************************************************
//  ********************************************************************************

//  Build student search

//  ********************************************************************************
//  ********************************************************************************

function studentSearch() {
    //  something
}

//  ********************************************************************************
//  ********************************************************************************

//  end  of student search

//  ********************************************************************************
//  ********************************************************************************

//  Mainline Processing
//  *********************************************************************************
//  *********************************************************************************

getTotals();
buildHeadSearch();
buildPaginator();

$('.page-header').append(searchHtml);                 //    set the search capability

$('.page').append(paginator);                         //    set the page selector buttons

showPage();

//  click event for pagination

$('li').click(function(){
    var selection = $(this).attr('longdesc');
    if (selection === '<') {
        //debugger;
        prevPage();
    }
    else if (selection === '>') {
        //debugger;
        nextPage();
    }
    else
    {
        //debugger;
        pageNum = parseInt(selection,10);
        goToPage(pageNum);
    }
    showPage();
});

// Released under MIT license: http://www.opensource.org/licenses/mit-license.php
// jQuery HTML5 placeholder fix.js
// https://gist.github.com/hagenburger/379601

//  the following code is a cross-browser fix to prevent placeholder string values
// from appearing in form action script.

$('[placeholder]').focus(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
        input.val('');
        input.removeClass('placeholder');
    }
}).blur(function() {
    var input = $(this);
    if (input.val() == '' || input.val() == input.attr('placeholder')) {
        input.addClass('placeholder');
        input.val(input.attr('placeholder'));
    }
}).blur().parents('form').submit(function() {
    $(this).find('[placeholder]').each(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
        }
    })
});

//  input event for student search

search = $(["type=text"])
