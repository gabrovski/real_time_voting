//hijack the vote buttons so that clicking them runs a js function
function jack_this_form_id_with_this_function(id, func){
    $("form#" + id + " input[type='submit']").click(function(){
            func();
            return false;
    });
}
