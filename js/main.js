//  This approach refrences http://web.enavu.com/tutorials/making-a-jquery-pagination-system/
//      some of the ideas used in this program are borrowed and adapted from the tutorial
//      the idea for using links in the pagination came from an epiphany I had studying the css
//      I realized that anchor tags had to be involved somehow in order for selectors including
//      .pagination li a... to be valid. So I began to explore that avenue of solution
//      I am documenting these things so I will remember them in the future.
//
//  Define Global Variables
//  ********************************************************************************
//  ********************************************************************************

var totalCount;
var totalPages;
var currentPage = 0;
var stdPageCount = 10;
var overflowCount;
var searchHtml;
var paginator;
var buttonCount;
var ButtonId;
var firstPass = true;
var startDisplay = 0;
var endDisplay = 9;
//  classes of subject list
var subjectsAll;               //  the entire list of students
var subjectsMatchCurrPage;     //  the students to display on the current page

//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function getTotals()
{
    totalCount = $(".student-list").children().length;
    totalPages = Math.ceil( totalCount / stdPageCount );
    overflowCount = totalCount - ( Math.floor( totalCount / stdPageCount ) * stdPageCount );
    /*$('#currentPage').val(0);
    $('#perPageCount').val(perPageCount);*/

}

function buildHeadSearch()
{
    searchHtml = '<div class="student-search">';
    searchHtml +='<input placeholder="Search for students...">';
    searchHtml +='<button>Search</button></div>';
}

function buildPaginator()
{
    //  builds all the buttons are required
    //  1 for prev (<) page
    //  1 for each specific page (in this case 6)
    //  1 for next (>) page
    //  all with links

    paginator = '<ul class="pagination"><li><a class="prevLink" href="javascript:js/main.js prevPage();">' + "<" + '</a></li>';
    var currentLink = 0;
    while(totalPages > currentLink){
        paginator += '<li><a class="pageLink" href="javascript:js/main.js goToPage(' + currentLink +');" longdesc="' + currentLink +'">'+ (currentLink + 1) +'</a></li>';
        currentLink ++;
    }
    paginator += '<li><a class="nextLink" href="javascript:js/main.js nextPage();">></a></li></ul>';
}

function prevPage(){

    /*newPage = parseInt($('#currentPage').val()) - 1;*/
    newPage = currentPage - 1;
    if( $('.activePage').prev('.pageLink').length > 0 ){    //if there is an item before the current active link run the function
        goToPage(newPage);
    }

}

function nextPage(){
    /*newPage = parseInt($('#currentPage').val()) + 1;*/
    newPage = currentPage + 1;
    if( $('.activePage').nextPage('.pageLink').length > 0 ){    //if there is an item after the current active link run the function
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

    startPos = pageNum * stdPageCount;    //    get the element number from where to start the slice
    endPos = startPos + perPageCount;     //    get the element number at where to end the slice

    //hide all children elements of student-list, get specific items and show them
    //$('.student-list').children().css('display', 'none').slice(startPos, endPos).css('display', 'block');
    $('.student-list').children().hide;                 //  hide the full list of student
    $('.student-list').slice(startPos,endPos).show;     //  show the current page slice of students

    /*get the page link that has longdesc attribute of the current page and add activePage class to it 
     and remove that class from previously active page link*/
    $('.pageLink[longdesc=' + pageNum +']').addClass('activePage').siblings('.activePage').removeClass('activePage');

    //update the current page input field  
    //$('#currentPage').val(pageNum);
    currentPage = pageNum;
}

/*function getSearchParams()
 {

 }*/

//  Mainline Processing
//  *********************************************************************************
//  *********************************************************************************

getTotals();
buildHeadSearch();
buildPaginator();
debugger;
$('.page-header').append(searchHtml);                 //    set the search capability

$('.buttonGroup').html(paginator);                     //    set the page selector buttons

//add activePage class to the first page link
$('.pagination .pageLink:first').addClass('activePage');

//hide all the elements inside content div
$('.student-list').children().hide();

//and show the first n (perPageCount) elements
$('.student-list').children().slice(0, stdPageCount).show();

//  input event for student search



