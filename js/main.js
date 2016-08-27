//  This approach refrences web.enavu.com/tutorials/making-a-jquery-pagination-system/
//      some of the ideas used in this program are borrowed and adapted from the tutorial.
//      some come from stackoverflow.com/questions/2808189/jquery-how-to-determine-which-li-tag-was-clicked
//      I am documenting these things so I will remember them in the future.
//
//  ********************************************************************************
//  ********************************************************************************
//  Define Global Variables
//  ********************************************************************************
//  ********************************************************************************

//  paging globals
var totToShow;
var totPgs;
var showStdPage = 10;
var showOverflow;
var pagingHtml;
var pageNum;
var thisShow;
var eventType = 'pageSelect';
// next three are initialized for first pass. They will be reset with each new selection
var currPg = 1;
var beginShow = 0;
var endShow = showStdPage;

//  search globals
var searchHtml = '<div class="student-search"><input class="searchVal" type="text" placeholder="Search for students..."><a href="#" class="btn nameSrch" longdesc="nameSrch">Search</a></div>';
var ptrnMatch = '';
var searchToShow = 0;

//  ********************************************************************************
//  ********************************************************************************
//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function buildPaging()                           //     builds student count, total pages, last page overflow
{

    if (eventType === 'searchWithPaging') {       //      builds a search set
        totToShow = searchToShow;
        showOverflow = totToShow - ( Math.floor (totToShow / showStdPage) * showStdPage );
        totPgs = Math.ceil (totToShow / showStdPage);
    }
    else                                        //      builds a full set
    {
        totToShow = $ (".student-list").children ().length;
        showOverflow = totToShow - ( Math.floor (totToShow / showStdPage) * showStdPage );
        totPgs = Math.ceil (totToShow / showStdPage);
    }

    //  clears any previous paging
    //  builds all the buttons that are required
    //  1 for prev page (<)
    //  1 for each specific page 
    //  1 for next page (>)
    //  1 to reset (reset) and go back to page 1

    $(".pageNav").remove();                    //       removes the paging buttons

    //  establish the paging
    pagingHtml = '<div class="pageNav"><ul class="paging"><li><a href="#" class="btn prevLink" longdesc="<">' + "<" + '</a></li>';
    var loopPage=1;
    while(totPgs >= loopPage){
        pagingHtml += '<li><a href="#" class="btn pageLink" longdesc="' + loopPage +'">' + (loopPage) +'</a></li>';
        loopPage ++;
    }
    pagingHtml += '<li><a href="#" class="btn nextLink" longdesc=">">' + ">" +'</a></li>';

    if ( eventType === 'pageSelect' )
    {
        pagingHtml += '</ul></div>'
    } else
    {
        //add the reset button when coming from the name search
        pagingHtml += '<li><span> </span><a href="#" class="btn reset" longdesc="reset">' + "reset" +'</a></li></ul></div>';
    }

}

function prevPage()                            //    build "previous" page paging control
{
    var newPage = currPg - 1;
    if( newPage > 0 ){                        //  if there is an item before the current active link run the function
        goToPage(newPage);
    }

}

function nextPage()                          //    build "next" page paging control
{
    var newPage = currPg + 1;
    if( newPage <= totPgs ){                //  if the selection remains within the page range
        goToPage(newPage);
    }

}
function goToPage(pageNum)                  //    execute actual page change
{
    //get the number of items shown per page
    if ( pageNum < totPgs )
    {
        thisShow = showStdPage;
    }
    else
    {
        thisShow = showOverflow;
    }

    beginShow = (pageNum * showStdPage)-10;      //    get the element number from where to start the slice
    endShow = beginShow + thisShow;              //    get the element number at where to end the slice

    //hide all children elements of student-list, get specific items and show them
    //$('.student-list').children().css('display', 'none').slice(startPos, endPos).css('display', 'block');
    $('.student-list').children().hide;                 //  hide the full list of student
    $('.student-list').slice(beginShow,endShow).show;     //  show the current page slice of students

    /*  get the page link that has longdesc attribute of the current page and add activePage class to it
     and remove that class from previously active page link */
    $('.pageLink[longdesc=' + pageNum +']').addClass('activePage').siblings('.activePage').removeClass('activePage');

    //update the current page input field  
    //$('#currPg').val(pageNum);
    currPg = pageNum;
}

function buildSearchSet()         //    build name search control
{
    //  establish search pattern
    var searchString = $(".searchVal").val();
    ptrnMatch = new RegExp(searchString,"gi");  //  for pattern/character matching, case insensitive

    //  search for pattern in each child of student-list and build search-list
    var nameList = $(".student-details h3").toArray();
    var emailList = $(".email").toArray();

    for ( var i = 0; i < $(".student-list").children().length; i++ ) {

        var n = $(".student-details h3")[i].textContent.match(ptrnMatch);
        var e = $(".email")[i].textContent.match(ptrnMatch);

        //  if there is a match on either name or email, add to the search-list by setting class 'selected'
        if ( n !== null || e !== null )
        {
            document.getElementsByClassName("student-item cf")[i].setAttribute("class", "student-item cf selected");
        }

    }

    searchToShow = document.getElementsByClassName("student-item cf selected").length;   //  how many students selected?
    if ( searchToShow <= showStdPage )
    {
        // we have a simple search  --  no paging involved
        eventType = 'searchNoPaging';
    } else {
        // we have a paging search  --  more than will display on a page
        currPg = 1;
        //  establish totals and paging for the name search
        eventType = 'searchWithPaging';
    }

    return;     //  just to make it obvious

}

function showPage(eventType)          //    execute page display (paging or name search)
{
    //  Three Event Types
    //
    //      1.  pageSelect = simple page selection
    //      2.  searchNoPaging = name search resulting in < 11 matches
    //          (retains standard paging)
    //      3.  searchWithPaging = name search resulting in more than 10 matches

    //add activePage class to the first page link
    $('.paging .pageLink:first').addClass('activePage');

    //  establish the length of the page (thisShow) elements

    if (currPg === totPgs) {
        endShow = beginShow + showOverflow;
    }
    else {
        endShow = beginShow + showStdPage;
    }
    $('.student-list').children().hide();                      //   hide the comlpete list of  elements inside content div


    if ( eventType == 'pageSelect' ) {                                      //  standard page selection
        $('.student-list').children().slice(beginShow, endShow).show();

    } else if ( eventType == 'searchNoPaging' ) {                           //  name search no paging (short list)
        $(".selected").show();

    } else {                                                                //  name search with paging (long list)
        $(".selected").slice(beginShow, endShow).show();

    }

    return;   //  Just to make it obvious
}

function clickListener()
{
    //  *********************************************************************************
    //  *********************************************************************************
    //  click Processing
    //  *********************************************************************************
    //  *********************************************************************************

    //  capture click

    $ ( ".page" ).on( "click", "a", function()
    {
        eventType = 'pageSelect';
        var selection = $(this).attr('longdesc');


        if (selection === '<' )
        {
            prevPage();
        }
        else if (selection === '>')
        {
            nextPage();
        }
        else if (parseInt(selection,10))
        {
            pageNum = parseInt(selection,10);
            goToPage(pageNum);
        }
        else if (selection === 'reset')
        {
            $('.student-list').children().removeClass("selected");     //   reset any previously select students

            //  sets up for redisplay of page one
            currPg = 1;
            beginShow = 0;
            reset = true;
            buildPaging();
            $('.page').append(pagingHtml);                             //   re-estabilsh paging buttons

        }
        else if (selection === 'nameSrch')
        {
            $('.student-list').children().removeClass("selected");     //   reset any previously select students
            buildSearchSet();                                          //   populate the search list

            if ( eventType === 'searchWithPaging' )                    //   if name search results in pagaination
            {
                currPg = 1;
                beginShow = 0;
                buildPaging();                                         //   build the display totals again
                $('.page').append(pagingHtml);                         //   set up the page selector buttons, based on total pages (includes '<' & '>' & 'reset'
            }

        }

        showPage(eventType);

    });

}
//  *********************************************************************************
//  *********************************************************************************
//  First Pass Processing
//  *********************************************************************************
//  *********************************************************************************

$('.page-header').append(searchHtml);                     //  set up the search capability (searchbox and button)
buildPaging();

$('.page').append(pagingHtml);                            //  set up the page selector buttons, based on total pages (includes '<' & '>' & 'reset'

showPage(eventType);

clickListener();                                          //  listen for clicks
