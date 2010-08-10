// length of the list for the addrow function is affected by the nnumber of users
// you need to dynamically make the list the right size and attach them to the same date (or daterange)
// if some values do not exist for a coulumn add undefined in their place
// awful design
function splitUsers(data) {
    //find out how many users there are. extend the list appropriately
    // slow and memory-taxing
    

}

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'Date and Time');
    data.addColumn('number', 'Weight');
    data.addColumn('string', 'User');
    data.addColumn('string', 'Description');

    // add strings only once in the first row
    // this is a peculiarity of the google api
    // assumes the strings are the user and his/her description
    data.addRow(info[0]);
    var numbers = info;
    for (var i = 0; i < numbers.length; i++)
	for (var k = 0; k < numbers[0].length; k++)
	    if (numbers[i][k].constructor.toString().indexOf('String') != -1)
		numbers[i][k] = '';
    
    for (var i = 1; i < info.length; i++)
	data.addRow(numbers[i]);

    var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
    chart.draw(data, {
	 'colors': ['blue', 'red', '#0000bb'],
	 'displayAnnotations': true,
	     'displayExactValues': true, // Do not truncate values (i.e. using K suffix)
	     'displayRangeSelector' : true, // Do not sow the range selector
	     'displayZoomButtons': true, // DO not display the zoom buttons
	     'fill': 30, // Fill the area below the lines with 20% opacity
	     //'legendPosition': 'newRow', // Can be sameRow
	//'max': 100000, // Override the automatic default
	//'min':  100000, // Override the automatic default
	     //'scaleColumns': [0, 1, 2, 3], // Have two scales, by the first and second lines
	     //'scaleType': 'allfixed', // See docs...
	'thickness': 2, // Make the lines thicker
	//     'zoomStartTime': new Date(2009, 1 ,2), //NOTE: month 1 = Feb (javascript to blame)
	//     'zoomEndTime': new Date(2009, 1 ,5) //NOTE: month 1 = Feb(javascript to blame)
	});

}



