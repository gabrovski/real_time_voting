
function splitUsers(data) {
    var parsed_data = new Array();
    for (var i = 0 ; i < data.length; i++) 
	data[i] = data[i].split(/[- :#]/);

    for (var i = 0; i < data.length; i++) {
	parsed_data[i] = new Array();
	parsed_data[i][0] = new Date(data[i][0], data[i][1], data[i][2], data[i][3], data[i][4], data[i][5]);

	for (var j = 1; j < data[0].length-5; j++)
	    parsed_data[i][j] = data[i][j+5];
    }

    //alert(parsed_data[0]);
    return parsed_data;
}

function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'Date and Time');

    // add strings only once in the first row
    // this is a peculiarity of the google api
    // assumes the strings are the user and his/her description
    var info = splitUsers(splits);
    for (var i = 0; i < (info[0].length-1) / 3; i++) {
	data.addColumn('number', 'Weight');                                                   data.addColumn('string', 'User');                                             	    data.addColumn('string', 'Description');     
    }

    for (var i = 0; i < info.length; i++) 
	for (var j = 1; j < info[0].length; j = j+ 3)
	    info[i][j] = parseInt(info[i][j]);
    

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
	     //'zoomStartTime': new Date(2009, 1 ,2), //NOTE: month 1 = Feb (javascript to blame)
	     //'zoomEndTime': new Date(2009, 1 ,5) //NOTE: month 1 = Feb(javascript to blame)
	});

}



