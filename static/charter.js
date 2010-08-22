//hijack the vote buttons so that clicking them runs a js function
//thanks parker
function jack_this_form_id_with_this_function(id, func){
    $("form#" + id + " input[type='submit']").click(function(){
	    func();
	    return false;
        });
}

function compare(a, b) {
    return a[0].getTime() - b[0].getTime();
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
    //   alert("dssd");
    var last = 0;
    splitted_data.sort(compare);
    for (var i = 1; i < splitted_data.length; i++) {
	if (splitted_data[i][0] - splitted_data[last][0] <= interval) {
	    matches[index++] = splitted_data[i];
	    //alert(splitted_data[last][0]+" "+splitted_data[i][0] + " " + (splitted_data[i][0] - splitted_data[last][0]));
	    // alert("if");
	}
	else {
	    //  alert("bla0");
	    ready_data = ready_data.concat((averageOutUser(matches)));
	    // alert("bla1");
	    //alert("####" + ready_data + "   " + matches);
	    
	    //ready_data.push(splitted_data[i]);
	    //alert(ready_data + "   " + matches);
	    matches = new Array();
	    matches[0] = splitted_data[i];
	    index = 1;
	    last = i;
	    // alert("else");
	}
    }
    // alert("done forloop");
    if (matches != 'undefined' && matches.length > 0) {
	//	alert('if2');
	//alert([].concatArray(averageOutUser(matches)));
	ready_data = ready_data.concat((averageOutUser(matches)));
	//alert(ready_data);
	//	alert('doneif2');
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
    //    alert(match);
    for (var i = 1; i < match.length; i++) {
	match[i][0] = match[0][0];
    }

    // alert("wtf"+match[0][0]);
    var sum, count, average, last, firstlast;
    var res = new Array();
    var index = 0;
    var found = false;
    // go along users
    for (var i = 2; i < match[0].length; i+=3) {
	//find first entry for this user
	for (last = 0; last < match.length; last++) {
	    if (match[last][i] != 'undefined') {
		found = true;
		break;
	    }
	}
	
	if (found)
	    found = false;
	else 
	    continue;
	//	alert('first '+match[last][i]);
	sum = match[last][i-1];
	count = 1;
	firstlast = last; // save first user entry for row
	//sum up all the weights for this user in this chunk
	//	alert(last);
	for (var j = last+1; j < match.length && match[j][i] != 'undefined'; j++) {
	    if (match[last][i] == match[j][i]) {
		sum += match[j][i-1];
		count++;
		last = j;
	    }
	}
	//     	alert(sum+" "+count);
	//average thme out and stuff it in res
	average = sum / (0.0+count);
	//       	alert(average);
	match[firstlast][i-1] = average;
	//	alert(match[firstlast][i-1]);
	res[index++] = match[firstlast];
	//	alert('wtf');
    }
    //alert('done '+res);
    return res;
}

function splitUsers(data) {
    var parsed_data = new Array();
    for (var i = 0 ; i < data.length; i++) 
	data[i] = data[i].split(/[\$ :#]/);
    // alert(data[0]);
    for (var i = 0; i < data.length; i++) {
	parsed_data[i] = new Array();
	parsed_data[i][0] = new Date(parseFloat(data[i][1]), parseFloat(data[i][2]), parseFloat(data[i][3]), parseFloat(data[i][4]), parseFloat(data[i][5]), parseFloat(data[i][6]));
	for (var j = 1; j < data[0].length-6; j++)
	    parsed_data[i][j] = data[i][j+6];
    }

    var anchor_date_milliseconds = parsed_data[0][0].getTime();
    if (has_video) {
	for (var i = 0 ; i < parsed_data.length; i++) {
	    //alert(parsed_data[i][0]);
	    parsed_data[i][0].setTime(anchor_date_milliseconds + parseInt(data[i][0])*1000);
	    // alert(parsed_data[i][0]);
	}
    }
	    
    // alert(parsed_data[0]);

    for (var i = 0; i < parsed_data.length; i++)
        for (var j = 1; j < parsed_data[0].length; j = j+ 3)
	    if (parsed_data[i][j] != 'undefined')
            parsed_data[i][j] = parseFloat(parsed_data[i][j]);
    
    //alert(parsed_data);
    //alert(parsed_data[0]+"\n"+parsed_data[120]);
    return parsed_data;
}

function drawChart() {
    var ready_data = prepareChartData();
    //alert(ready_data);
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'Date and Time');
 
    //  alert(ready_data);
    // add strings only once in the first row
    // this is a peculiarity of the google api
    // assumes the strings are the user and his/her description
    for (var i = 0; i < (ready_data[0].length-1) / 3; i++) {
	data.addColumn('number', 'Weight');                                                       data.addColumn('string', 'User');                                             	    data.addColumn('string', 'Description');     
    }
    
    var users_descr = new Array();
    var indx = 0;
    var num_user = (ready_data[0].length - 1) / 3;
    for (var i = 0; i < ready_data.length && users_descr.length < num_user; i++) {
	//users_descr[start] = new Array();
	//	alert(users[indx][0] + " " + ready_data[i]);
	for (var j = 2; j < ready_data[0].length; j+=3) {
	    if (ready_data[i][j] == users[indx][0]) {
		users_descr[(j-2)/3] = new Array();
		users_descr[(j-2)/3][0] = users[indx][0];
		users_descr[(j-2)/3][1] = users[indx++][1];
		i = -1;
		break;
	    }
	}
    }
    
    //alert(users);
    //    alert(ready_data[0]);
    // data.addRow(ready_data[0]);
    var numbers = ready_data;
    // alert('nums')
    for (var i = 0; i < numbers.length; i++) {
	//	document.writeln(numbers[i]);
	for (var k = 0; k < numbers[0].length; k++) {
	    //	    alert('a  '+numbers[i][k]);
	    if (numbers[i][k] != undefined && numbers[i][k].constructor.toString().indexOf('String') != -1){
		numbers[i][k] = undefined;
		//	alert(numbers[i][k]);
	    }
	}
    }
    // alert(numbers);
    //add users and descriptions
    indx = 0;
    for (var i = 0; i < numbers.length && indx < num_user; i++) {
	if (numbers[i][3*indx+1] != undefined) {
	    //  alert(i +" " + (3*indx+2));
	    numbers[i][3*indx+2] = users_descr[indx][0];
	    numbers[i][3*indx+3] = users_descr[indx][1];
	    indx++;
	    i = -1;
	}
    }
    //alert(numbers);

    for (var i = 0; i < ready_data.length; i++)
        data.addRow(numbers[i]);

    
    // alert('draw');
    var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
    chart.draw(data, {
	    'colors': ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'black','gray'],
	     'displayAnnotations': true,
	     'displayExactValues': true, // Do not truncate values (i.e. using K suffix)
	     'displayRangeSelector' : true, // Do not sow the range selector
	     'displayZoomButtons': true, // DO not display the zoom buttons
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



