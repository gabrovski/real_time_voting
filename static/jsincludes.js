//hijack the vote buttons so that clicking them runs a js function
function jack_this_form_id_with_this_function(id, func){
    $("form#" + id + " input[type='submit']").click(function(){
            func();
            return false;
    });
}

function convert_seconds_since_vid_start_into_date(seconds){
    // we offset the timestamp by this amount so that it starts at midnight and we get nicer timestamps
    offset = units_array['hours']*5;

    return new Date(seconds*1000+offset);
}
