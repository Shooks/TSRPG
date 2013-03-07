$(document).ready(function() {
    $.ajax({
    url: "data.xml",
    isLocal: true,
    processData: false,
    async: false // Firefox fix, otherwise it will just continue to show the "spinning" animation.
    }).done(function(data) {
        xmlparser(data);
    }).fail(function() {
        });
});

function xmlparser(txt) {
/*
This is where parsing magic takes place. We select the child elements of DATA(the first element) with the TAGS array.
*/
    var itemId = [], i = 0, use, effects, discoverables, enemies, but, temp, req, event, placeinarr, id, name, gender, out = "",
        tags = ["items item", "locations location", "data > enemies enemy", "data > events event", "data > specials special"],
        valid_req = ["health", "mana", "strength", "stamina", "agility", "intelligence", "charisma", "libido", "energy", "lust" ,"special" ,"origin", "location", "level"],
        valid_buttons = ["event", "travel"], debug = "",
        valid_genders = ["male", "female", "herm"],
        valid_effects = ["health", "mana", "experience", "libido", "strength", "stamina", "agility", "intelligence", "charisma", "energy", "lust"],
        valid_effectspercent = ["health", "mana"];
    if($(txt).find("log").text() === "1" || "true") {
        debug = true;
    } else {
        debug = false;
    }
    $.each(tags, function (index, value) {
    itemId = [];
        $(txt).find(value).each(function() {
            use = "";
            discoverables = "";
            enemies = "";
            but = "";
            req = "";
            event = "";
            id = "";
            name = "";
            gender = "";
            out = "";
            if($(this).find("id").text() === "") {
                //Empty IDs are not loaded.
                if(debug) {
                    console.log("XMLParser: No ID defined.");
                }
                return;
            }
            if($.inArray($(this).find("id").text(), itemId) !== -1) {
                //Duplicated IDs are not loaded.
                if(debug) {
                    console.log("XMLParser: Did not load duplicated ID.");
                    }
                return;
            }
            id = $(this).find("id").text();
            name = $(this).find("name").text();;
            itemId[i++] = id;
            $(this).find("effects effect").each(function(x, v) {
                    if($.inArray($(v).attr("type"), valid_effects) !== -1) {
                        if($(v).text().slice($(v).text().length-1) === "%" && $.inArray($(v).attr("type"), valid_effectspercent) !== -1) {
                            use += (use.length > 0 ? "," : "") + $(v).attr("type") + ";" + $(v).text();
                        } else if($(v).text().slice($(v).text().length-1) !== "%" && $.inArray($(v).attr("type"), valid_effectspercent) !== -1) {
                            use += (use.length > 0 ? "," : "") + $(v).attr("type") + ";" + $(v).text();
                        } else if($(v).text().slice($(v).text().length-1) !== "%" && $.inArray($(v).attr("type"), valid_effectspercent) === -1) {
                            use += (use.length > 0 ? "," : "") + $(v).attr("type") + ";" + $(v).text();
                        } else if(debug) {
                            console.log("XMLParser: Only '" + String(valid_effectspercent) + "' are allowed to be percents.");
                        }
                    }
            });

            // We default to events having a 100% chance(given that the requirements are met) of happening if chance is undefined.
            $(this).find("events event").each(function(x, v) {
                event += (event.length > 0 ? "," : "") + $(v).text() + ";" + ($(v).attr("chance") ? $(v).attr("chance") : "100");
            });

            temp = $(this).find("requirement").text();
            $.each(valid_req, function(x, v) {
                if($(temp).find(v).length > 0) {
                    req += (req.length > 0 ? "," : "") + v + ";" + $(temp).find(v).text() + ($(temp).find(v).attr("operator") ? $(temp).find(v).attr("operator") : "=");
                }
            });

            if(index === 0) {
                out += "Price: " + $(this).find("price").text() + "<br/>";
                out += "Effect(s): " + use + "<br/>";
                out += "Event(s): " + event + "<br/>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#items");
            } else if (index === 1) {
                    $(this).find("discoverable discover").each(function (x, v) {
                        discoverables += (discoverables.length > 0 ? "," : "") + $(v).text();
                    });
                    $(this).find("enemies enemy").each(function (x, v) {
                        enemies += (enemies.length > 0 ? "," : "") + $(v).text();
                    });
                    out += "ontravel message: " + $(this).find("onTravel").text() + "<br/>";
                    out += "Threat: " + $(this).find("threat").text() + "(%)" + "<br/>";
                    out += "Discoverable(s): " + discoverables + "<br/>";
                    out += "Enimies: " + enemies + "<br/>";
                    out += "Event(s): " + event + "<br/>";
                    out += "Master: " + $(this).find("master").text() + "<br/>";
                    $("<div />", {
                    html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                    "class": "col_item"
                    }).appendTo("#locations");
            } else if (index === 2) {
                    $(this).find("genders gender").each(function (x, v) {
                        if($.inArray($(v).text(), valid_genders) !== -1) {
                            //Transform gender name into an id (eg, 1, 2 and 3).
                            gender += (gender.length > 0 ? "," : "") + $.inArray($(v).text(), valid_genders);
                        } else if (debug) {
                            console.log("XMLParser: '" + $(v).text() + "' is not a valid gender.");
                        }
                    });
                    out += "Base Health: " + $(this).find("basehealth").text() + "<br/>";
                    out += "Base Damage: " + $(this).find("basedamage").text() + "<br/>";
                    out += "Event(s): " + event + "<br/>";
                    out += "Gender Limit: " + gender + "<br/>";
                    $("<div />", {
                    html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                    }).appendTo("#enemies");
            } else if (index === 3) {
                    temp = $(this).find("buttons button");
                    $.each(temp, function() {
                        placeinarr = $.inArray($(this).attr("type"), valid_buttons);
                        if(placeinarr !== -1) {
                            but += (but.length > 0 ? "," : "") + valid_buttons[placeinarr] + ";" + $(this).attr("id") + ";" + $(this).text();
                        }
                    });
                    out += "Text: " + $(this).find("text").text() + "<br/>";
                    out += "Effect(s): " + use + "<br/>";
                    out += "Button(s): " + but + "<br/>";
                    out += "Requirement(s): " + req + "<br/>";
                    $("<span />", {
                    html: "<span>" + $(this).find("title").text() + "</span><div class='hid_stat'>" + out + "</div>",
                    "class": "col_item"
                    }).appendTo("#events");
            } else if (index === 4) {
                out += "Description: " + $(this).find("description").text() + "<br/>";
                out += "Effect(s): " + use + "<br/>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#specials");
            }
        });
    });
    $(".col").find(".col_item").click(function() {
        if($(this).find(".hid_stat").css("display") === "none") {
            $(this).find("span").css({"font-weight": "600", "background": "#188acb", "color": "#fff"});
            $(this).find(".hid_stat").fadeIn(0);
        } else {
            $(this).find("span").css({"font-weight": "300", "background": "", "color": ""});
            $(this).find(".hid_stat").fadeOut(0);
        }
    });
}