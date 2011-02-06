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
         'dateFormat': 'H:m:s',
	     'displayAnnotations': false,
         'highlightDot': 'nearest',
	     'displayExactValues': true, // Do not truncate values (i.e. using K suffix)
	     'displayRangeSelector' : false, // Do not sow the range selector
	     'displayZoomButtons': false, // DO not display the zoom buttons
		 'fill': 30, // Fill the area below the lines with 20% opacity
	     //'legendPosition': 'newRow', // Can be sameRow
	     'max': 2, // Override the automatic default
	     'min':  -2, // Override the automatic default
	     //'scaleColumns': [0, 1, 2, 3], // Have two scales, by the first and second lines
	     //'scaleType': 'allfixed', // See docs...
	     'thickness': 1, // Make the lines thicker
	     //'zoomStartTime': data_arr_clustered[0][0], //NOTE: month 1 = Feb (javascript to blame)
	     //'zoomEndTime': data_arr_clustered[data_arr_clustered.length-1][0] //NOTE: month 1 = Feb(javascript to blame)
	});

}



