//hijack the vote buttons so that clicking them runs a js function
//thanks parker
function jack_this_form_id_with_this_function(id, func){
    $("form#" + id + " input[type='submit']").click(function(){
	    func();
	    return false;
        });
}

function prepareChartData() {
    splitted_data = splitUsers(pyToJs());
    // alert(splitted_data);
    var units = units_array[document.getElementById("time_units").value];
    var interval = parseInt(document.getElementById("time_interval").value) * units;
    //alert(interval+" " + units);
    // alert(splitted_data[0][0]- new Date(splitted_data[0][0]-interval));
    var ready_data = new Array();
    var matches = new Array();
    var index = 0;
    //alert(splits);
    matches[index++] = splitted_data[0];
    //    alert(splitted_data);
    var last = 0;
    for (var i = 1; i < splitted_data.length; i++) {
	if (splitted_data[i][0] - splitted_data[last][0] <= interval) {
	    matches[index++] = splitted_data[i];
	    //alert(splitted_data[last][0]+" "+splitted_data[i][0] + " " + (splitted_data[i][0] - splitted_data[last][0]));

	}
	else {
	    //alert("bla0");
	    ready_data = ready_data.concat((averageOutUser(matches)));
	    // alert("bla1");
	    //alert("####" + ready_data + "   " + matches);
	    
	    ready_data.push(splitted_data[i]);
	    //alert(ready_data + "   " + matches);
	    matches = new Array();
	    matches[0] = splitted_data[i];
	    index = 1;
	    last = i;
	}
    }
    //    alert("done forloop");
    if (matches != 'undefined' && matches.length > 0) {
	//alert(matches);
	//alert([].concatArray(averageOutUser(matches)));
	ready_data = ready_data.concat((averageOutUser(matches)));
	//alert(ready_data);
    }
    // alert(splitted_data);
    // alert(ready_data);
    // draw chart
    // alert("Done computing");
    //alert(ready_data);
    //google.setOnLoadCallback(drawChart);
    return ready_data;
}

function averageOutUser(match) {
    if (match.length < 2)
	return match;

    //var match ;//= new Array();
    //match = (matches);
    // alert(matches);
    for (var i = 1; i < match.length; i++) {
	match[i][0] = match[0][0];
    }

    // alert("wtf"+match[0][0]);
    var sum, count, average, last, firstlast;
    var res = new Array();
    var index = 0;
    // go along users
    for (var i = 2; i < match[0].length; i+=3) {
	//find first entry for this user
	for (last = 0; last < match.length; last++)
	    if (match[last][i] != 'undefined')
		break;
	sum = match[last][i-1];
	count = 1;
	firstlast = last; // save first user entry for row
	//sum up all the weights for this user in this chunk
	for (var j = last+1; j < match.length && match[j][i] != 'undefined'; j++) {
	    if (match[last][i] == match[j][i]) {
		sum += match[j][i-1];
		count++;
		last = j;
	    }
	}
	//	alert(sum+" "+count);
	//average thme out and stuff it in res
	average = sum / (0.0+count);
	//	alert(average);
	match[firstlast][i-1] = average;
	//	alert(match[firstlast][i-1]);
	res[index++] = match[firstlast];
	//alert(res);
    }
    return res;
}

function splitUsers(data) {
    var parsed_data = new Array();
    for (var i = 0 ; i < data.length; i++) 
	data[i] = data[i].split(/[\$ :#]/);
    // alert(data[0]);
    for (var i = 0; i < data.length; i++) {
	parsed_data[i] = new Array();
	parsed_data[i][0] = new Date(parseFloat(data[i][0]), parseFloat(data[i][1]), parseFloat(data[i][2]), parseFloat(data[i][3]), parseFloat(data[i][4]), parseFloat(data[i][5]));
	for (var j = 1; j < data[0].length-5; j++)
	    parsed_data[i][j] = data[i][j+5];
    }
    //alert(new Date(parseInt(data[0][0]), parseFloat(data[0][1]),parseInt(data[0][2])));

    //alert(parsed_data[3]);

    for (var i = 0; i < parsed_data.length; i++)
        for (var j = 1; j < parsed_data[0].length; j = j+ 3)
	    if (parsed_data[i][j] != 'undefined')
            parsed_data[i][j] = parseInt(parsed_data[i][j]);
    
    //alert(parsed_data[3]);

    return parsed_data;
}

function drawChart() {
    var ready_data = (prepareChartData());
    //alert(ready_data[0]);
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'Date and Time');
 
    //  alert(ready_data);
    // add strings only once in the first row
    // this is a peculiarity of the google api
    // assumes the strings are the user and his/her description
    for (var i = 0; i < (ready_data[0].length-1) / 3; i++) {
	data.addColumn('number', 'Weight');                                                   data.addColumn('string', 'User');                                             	    data.addColumn('string', 'Description');     
    }

    data.addRow(ready_data[0]);
    var numbers =ready_data;
    for (var i = 0; i < numbers.length; i++)
	for (var k = 0; k < numbers[0].length; k++)
	    if (numbers[i][k].constructor.toString().indexOf('String') != -1)
		numbers[i][k] = '';
    
    for (var i = 1; i < ready_data.length; i++)
	data.addRow(numbers[i]);

    var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
    chart.draw(data, {
	     'colors': ['blue', 'red', '#0000bb'],
	     'displayAnnotations': true,
	     'displayExactValues': true, // Do not truncate values (i.e. using K suffix)
	     'displayRangeSelector' : true, // Do not sow the range selector
	     'displayZoomButtons': false, // DO not display the zoom buttons
		 //'fill': 30, // Fill the area below the lines with 20% opacity
	     //'legendPosition': 'newRow', // Can be sameRow
	     //'max': 100000, // Override the automatic default
	     //'min':  100000, // Override the automatic default
	     //'scaleColumns': [0, 1, 2, 3], // Have two scales, by the first and second lines
	     //'scaleType': 'allfixed', // See docs...
	     'thickness': 1, // Make the lines thicker
	     //'zoomStartTime': new Date(2009, 1 ,2), //NOTE: month 1 = Feb (javascript to blame)
	     //'zoomEndTime': new Date(2009, 1 ,5) //NOTE: month 1 = Feb(javascript to blame)
	});

}



