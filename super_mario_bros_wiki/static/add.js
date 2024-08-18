function check_spaces(id) {
    var val = $("#" + id).val()
    
    if (val.replace(/\s+/g, "").length == 0) {
        return false
    } else {
        return true
    }
}

function validate_string(input_s, parent_s, name) {
    var val = $(input_s).val().trim()
    var valid = true
    if (val.length == 0) {
        $(input_s).addClass("is-invalid")
        if (name == "enemies") {
            $(parent_s).append($("<div class='invalid-feedback'></div>").html("Please provide a list of " + name + "."))
        }
        else {
            $(parent_s).append($("<div class='invalid-feedback'></div>").html("Please provide a " + name + "."))
        }
        valid = false;
    } else if (val.replace(/\s+/g, "").length == 0) {
        $(input_s).addClass("is-invalid")
        $(parent_s).append(get_feedback("Invalid spaces."))
        valid = false
    }
    return valid
}

function validate_int(input_s, parent_s, name, upper_bound) {
    var val = $(input_s).val()
    var valid = true
    
    if (val.length == 0) {
        $(input_s).addClass("is-invalid")
        $(parent_s).append($("<div class='invalid-feedback'></div>").html("Please provide a " + name + " value."))
        valid = false;
    } else {
        var val = Number(val)        
        
        if (val==NaN || (!Number.isInteger(val))) {
            
            $(input_s).addClass("is-invalid")
            $(parent_s).append($("<div class='invalid-feedback'></div>").html("Please use a integer."))
            valid = false;
        } else if (val<1 || val>upper_bound) {
            $(input_s).addClass("is-invalid")
            $(parent_s).append($("<div class='invalid-feedback'></div>").html("Please use a number between 1 and " + upper_bound + "."))
            valid = false;
        }
    }
    return valid
}

function validate_image_url(input_s, parent_s) {
    var val = $(input_s).val().trim()
    var valid = true

    if (val.length == 0) {
        $(input_s).addClass("is-invalid")
        $(parent_s).append($("<div class='invalid-feedback'></div>").html("Please provide a url."))
        valid = false;
    } else if (val.replace(/\s+/g, "").length == 0) {
        $(input_s).addClass("is-invalid")
        $(parent_s).append($("<div class='invalid-feedback'></div>").html("Invalid spaces."))
        valid = false
    }
    return valid
}


function valid_nickname(input_name, input_nickname, parent_nickname) {
    boss_name = $(input_name).val().trim().toLowerCase()
    nickname = $(input_nickname).val().trim().toLowerCase()
    var valid = true
    if (boss_name == nickname) {
        $(input_nickname).addClass("is-invalid")
        $(parent_nickname).append($("<div class='invalid-feedback'></div>").html("Please input a unique nickname, not the same as name."))
        valid = false;
    }
    return valid
}

function validate_inputs() {
    var valid = true

    // validate name
    new_name = $("#input-name").val().trim()
    var included = false
    $.each(names, function (index, name_used) {
        name_used = name_used.toLowerCase()
        if (new_name.toLowerCase()==name_used) {
            included = true
        }
    });
    if (included) {
        $("#input-name").addClass("is-invalid")
        $("#form-name").append($("<div class='invalid-feedback'></div>").html("Name have already been taken. Please use a different name."))
        valid = false;
    } else if (!validate_string("#input-name", "#form-name", "name")) {
        valid = false
    }

    // validate nickname
    if (!validate_string("#input-nickname", "#form-nickname", "nickname") || !valid_nickname("#input-name", "#input-nickname","#form-nickname")) {
        valid = false
    }

    // validate difficultty
    if (!validate_int("#input-difficulty", "#form-difficulty", "difficulty", 10)) {
        valid = false
    }

    if (!validate_int("#input-world_level", "#form-world_level", "world_level", 9)) {
        valid = false
    }

    // validate image url
    if (!validate_image_url("#input-image", "#form-image")) {
        valid = false
    }

    // validate summary
    if (!validate_string("#input-summary", "#form-summary", "summary")) {
        valid = false
    }
    

    // validate description
    if (!validate_string("#input-enemies", "#form-enemies", "enemies")) {
        valid = false
    }

    return valid
}

$(document).ready(function () {

    $('.alert').hide()

    $("#new-form").submit(function(event) {
        event.preventDefault()
        
        $(".form-control").removeClass("is-invalid")
        $(".invalid-feedback").remove()
        var valid = validate_inputs()
        console.log(valid);

        if (valid) {
            var enemies = $("#input-enemies").val().trim().split(","); 
            var boss = {
                "name": $("#input-name").val().trim(),
                "image": $("#input-image").val(),
                "boss-level": $("#input-world_level").val().trim(),
                "summary": $("#input-summary").val().trim(),
                "difficulty":$("#input-difficulty").val().trim(),
                "nickname": $("#input-nickname").val().trim(),
                "enemies":  enemies
            }
            
            $.ajax({
                type: "POST",
                url: "add_entry",
                dataType : "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(boss),
                success: function (response) {
                    console.log("success");
                    $('.alert').show()
                    $("#success-notification").empty()
                    $("#success-notification").html("New enemy successfully created. <a href='" + response["url"] + "'>Go to new enemy wikipage<\a>")
                    $(".form-control").val("")
                    $("#input-name").focus();
                },
                error: function(request, status, error){
                    console.log("Error");
                    console.log(request)
                    console.log(status)
                    console.log(error)
                }
            });
        }
        
    })

});