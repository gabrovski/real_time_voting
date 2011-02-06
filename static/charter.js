function compare(a, b) {
    return a[0].getTime() - b[0].getTime();
}

function cluster_data(){
    // grab the parameters from the form where they say how they want to cluster
    var units = units_array[document.getElementById("time_units").value];
    var interval = parseInt(document.getElementById("time_interval").value) * units;
    console.log(interval);

    // where we'll keep the clustered data
    data_arr_clustered = new Array();

    // bootstrapping
    data_arr_clustered[0] = data_arr[0];
    var data_arr_clustered_index = 0;
    var num_votes_in_current_cluster = 1;

    // loop through all of the votes
    for (var data_arr_index=0; data_arr_index<data_arr.length; data_arr_index++){
        // case: the current vote should be the start of a new cluster
        if (data_arr[data_arr_index][0] - data_arr_clustered[data_arr_clustered_index][0] > interval){
            console.log(data_arr[data_arr_index][0] - data_arr_clustered[data_arr_clustered_index][0] );
            data_arr_clustered_index++;
            data_arr_clustered[data_arr_clustered_index] = data_arr[data_arr_index];
            num_votes_in_current_cluster = 1;
        }
        // case: the current vote should be added to the current cluster
        else{
            data_arr_clustered[data_arr_clustered_index][1] *= num_votes_in_current_cluster;
            data_arr_clustered[data_arr_clustered_index][1] += data_arr[data_arr_index][1];
            num_votes_in_current_cluster++;
            data_arr_clustered[data_arr_clustered_index][1] /= num_votes_in_current_cluster;
        }
    
    }
    
}

function prepareChartData() {
    splitted_data = splitUsers(pyToJs());
    
    var units = units_array[document.getElementById("time_units").value];
    var interval = parseInt(document.getElementById("time_interval").value) * units;
    
    var ready_data = new Array();
    var matches = new Array();
    var index = 0;
    matches[index++] = splitted_data[0];

    var last = 0;
    splitted_data.sort(compare);
    for (var i = 1; i < splitted_data.length; i++) {
        if (splitted_data[i][0] - splitted_data[last][0] <= interval) {
            matches[index++] = splitted_data[i];
        }
        else {
            ready_data = ready_data.concat((averageOutUser(matches)));
            matches = new Array();
            matches[0] = splitted_data[i];
            index = 1;
            last = i;
        }
    }

    if (matches != 'undefined' && matches.length > 0) 
        ready_data = ready_data.concat((averageOutUser(matches)));

    return ready_data;
}

// NOTE: we're not using this right now. it's also not commented and might be useless
// but it appears that this is helpful for clustering/chunking
// that is, the merging all votes that are close to each-other into one vote
function averageOutUser(match) {
    if (match.length < 2)
	return match;

    for (var i = 1; i < match.length; i++) 
	match[i][0] = match[0][0];

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

	//average thme out and stuff it in res
	average = sum / (0.0+count);
	match[firstlast][i-1] = average;
	res[index++] = match[firstlast];
    }
    return res;
}

function drawChart() {
    cluster_data();

    var data = new google.visualization.DataTable();

    data.addColumn('datetime', 'Date and Time');
    data.addColumn('number', 'Weight');
    data.addColumn('string', 'User');                                             	   
    data.addColumn('string', 'Description');     
    
    
    data.addRows(data_arr_clustered);

    console.log(data_arr_clustered) //TODO: DEBUG
    
    var chart = new google.visualization.AnnotatedTimeLine(document.getElementById('chart_div'));
    chart.draw(data, {
	    'colors': ['blue', 'red', 'yellow', 'green', 'purple', 'orange', 'pink', 'black','gray'],
	     'displayAnnotations': false,
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



