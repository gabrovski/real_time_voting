//hijack the vote buttons so that clicking them runs a js function
//thanks parker
function jack_this_form_id_with_this_function(id, func){
    $("form#" + id + " input[type='submit']").click(function(){
	    func();
	    return false;
        });
}

function prepareChartData() {
    var units = units_array[document.getElementById("time_units").value];
    var interval = parseInt(document.getElementById("time_interval").value) * units;
    //    alert(interval+" " + units);
    //alert(splitted_data[0][0]- new Date(splitted_data[0][0]-units*interval));
    var ready_data = new Array();
    var matches = new Array();
    var index = 0;
    matches[index++] = splitted_data[0];
    for (var i = 1; i < splitted_data.length; i++) {
	if (splitted_data[i][0] - splitted_data[i-1][0] <= interval) 
	    matches[index++] = splitted_data[i];
	else {
	    ready_data.concatenate(averageOutUser(matches));
	    matches = new Array();
	}
    }
    //google.setOnLoadCallback(drawChart);
}

function averageOutUser(match) {
    for (var i = 1; i < match.length; i++)
	match[i][0] = match[0][0];

    var sum, count, average;
    for (var i = 2; i < match[0].length; i++) {
	sum = match[0][i-1];
	count = 1;
	for (var j = 1; j < match.length; j++) {
	    if (match[j-1][i] == match[j][i]) {
		sum += match[j][i-1];
		count++;
	    }
	}
	average = sum / (0.0+count);
	for (var j = 0; j < match.length; j++) {

	}
    }
    return match;
}

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

    for (var i = 0; i < parsed_data.length; i++)
        for (var j = 1; j < parsed_data[0].length; j = j+ 3)
            parsed_data[i][j] = parseInt(info[i][j]);

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



