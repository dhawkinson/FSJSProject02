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
var firstPaging;
var firstPass = true;
var pageNum;
var thisShow;
var eventType = 'stdPaging';
// next three are initialized for first pass. They will be reset with each new selection
var currPg = 1;
var beginShow = 0;
var endShow = showStdPage;
var stop = false;

//  search globals
var searchHtml = '<div class="student-search"><input id="searchVal" type="text" placeholder="Search for students..."><button class="nameSrch">Search</button></div>';
var ptrnMatch = '';
var srchStr = '';
var searchToShow = 0;

//  ********************************************************************************
//  ********************************************************************************
//  Define functions
//  ********************************************************************************
//  ********************************************************************************

function buildSearchSet()         //    build name search control
{
    ptrnMatch = new RegExp(srchStr,"gi");  //  for pattern/character matching, case insensitive

    //  search for pattern in each child of student-list and build search-list
    var nameList = $(".student-details h3").toArray();
    var emailList = $(".email").toArray();

    for ( var i = 0; i < $(".student-list").children().length; i++ ) {

        var n = $(".student-details h3")[i].textContent.match(ptrnMatch);
        var x = $(".email")[i].textContent;
        var y = x.indexOf("@");
        var e = x.substring(0,y);
        var m = e.match(ptrnMatch);
        //  if there is a match on either name or email, add to the search-list by setting class 'selected'
        if ( n !== null || m !== null )
        {
            document.getElementsByClassName("student-item cf")[i].setAttribute("class", "student-item cf selected");
        }
    }
    //  Keep in mind - this next section is dynamic with each keystroke
    searchToShow = document.getElementsByClassName("student-item cf selected").length;   //  how many students selected?
    if ( searchToShow === 0 ) {
        eventType = 'noMatches'
    }
    else if( searchToShow <= showStdPage )
    {
        eventType = 'srchNoPaging';     // simple search  --  no paging involved
    }
    else
    {
        eventType = 'srchPaging';       // we have a paging search  --  more than will display on a page
        currPg = 1;
        beginShow = 0;
        endShow = showStdPage;
    }
    return;                             //  just to make it obvious
}

function buildPagingSet()                           //     builds student count, total pages, last page overflow
{
    if (eventType === 'srchPaging') {            //      builds a search set
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

    //  clear any previous paging
    //  build all the buttons that are required
    //      1 for prev page (<)
    //      1 for each specific page
    //      1 for next page (>)
    //      1 to reset (reset) and go back to page 1 (only when name search reults in more than one page)

    $(".pageNav").remove();                    //   removes the paging buttons

    //  build the paging buttons
    pagingHtml = '<div class="pageNav"><ul id="paging"><li><a href="#" class="btn prevLink" longdesc="<">' + "<" + '</a></li>';
    var loopPage=1;
    while(totPgs >= loopPage){
        pagingHtml += '<li><a href="#" class="btn pageLink" longdesc="' + loopPage +'">' + (loopPage) +'</a></li>';
        loopPage ++;
    }
    pagingHtml += '<li><a href="#" class="btn nextLink" longdesc=">">' + ">" +'</a></li>';

    if ( eventType === 'srchPaging' )
    {
        //add the reset button when coming from the name search
        pagingHtml += '<li><span> </span><a href="#" class="btn reset" longdesc="reset">' + "reset" +'</a></li></ul></div>';
    }
    else
    {
        pagingHtml += '</ul></div>';
    }

    $('.page').append(pagingHtml);             //   inserts paging buttons, based on total pages, includes '<' & '>' & (optionally) 'reset'

    return;                                    //   Just to be obvious
}

function showPage(eventType)            //    execute page display (paging or name search)
{
    //  Two Event Types
    //
    //      1.  stdPaging = simple page selection - (results from first pass)
    //      2.  srchNoPaging = name search but less then 10 matches
    //      3.  srchPaging = name search resulting in more than 10 matches

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


    if ( eventType === 'stdPaging' )                                      //  standard page selection
    {
        $('.student-list').children().slice(beginShow, endShow).show();
    }
    else if ( eventType === 'srchNoPaging' )                             //  name search no paging (short list)
    {
        $(".selected").show();
    }
    else if ( eventType === 'srchPaging')                                //  name search with paging (long list)
    {
        $(".selected").slice(beginShow, endShow).show();
    }
    else if ( eventType === 'noMatches' )                                //  no match
    {
        $('.student-list').children().slice(0, 10).show();
        $( ".pageNav" ).append("<p class='noMatch'><strong>NO MATCH FOUND</strong></p>")
    }

    return;                            //  Just to make it obvious
}

function prevPage()                            //    build "previous" page paging control
{
    var newPage = currPg - 1;
    if( newPage > 0 ){                        //  if there is an item before the current active link run the function
        goToPage(newPage);
    }
    return;
}

function nextPage()                          //    build "next" page paging control
{
    var newPage = currPg + 1;
    if( newPage <= totPgs ){                //  if the selection remains within the page range
        goToPage(newPage);
    }
    return;
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

    currPg = pageNum;
    return;                 //  just to be obvious
}

function keydownListener(k)
{

    $('.student-list').children().removeClass("selected");     //   reset any previously select students

    // build pattern match
    srchStr += k.key;                                          //   capture key value before calling any function

    // test pattern match
    // gather from pattern match
    // test for paging

    buildSearchSet();
    buildPagingSet();
    showPage(eventType);

};

function clickListener(c)
{
    srchStr = '';                      //  any click event resets the name search string
    eventType = 'stdPaging';
    var selection = c.target.textContent;

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
        buildPagingSet();
        $('.page').append(pagingHtml);                             //   re-estabilsh paging buttons

    }

    showPage(eventType);

};

//  *********************************************************************************
//  *********************************************************************************
//  First Pass Processing
//  *********************************************************************************
//  *********************************************************************************

$('.page-header').append(searchHtml);                     //  set up the search capability (searchbox and button)
buildPagingSet();
showPage(eventType);
//  event listeners
document.getElementById("searchVal").addEventListener("keydown",keydownListener,true);
document.getElementById("paging").addEventListener("click",clickListener,true);

