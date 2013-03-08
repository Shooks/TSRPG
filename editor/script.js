var type = "item";
var valid_effects = ["health", "mana", "experience", "libido", "strength", "stamina", "agility", "intelligence",
                     "charisma", "energy", "lust"],
    valid_req = ["health", "mana", "strength", "stamina", "agility", "intelligence", "charisma", "libido", "energy",
                 "lust" ,"special" ,"origin", "location", "level"];
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
    $("#id").show();
    $("#menu").find(".option").click(function() {
        menu_select($(this).index());
    });
    $("#add-id").keyup(function() {
        editxml.set("id", $(this).val());
    });
    $("#add-name").keyup(function() { editxml.set("name", $(this).val()); });
    $("#add-price").keyup(function() { editxml.set("price", $(this).val()); });
    $(".add-button").click(function() {
        var tmp = "";
        if(editxml.get("button")) {
            tmp = editxml.get("button");
        }
        tmp += (tmp.length > 1 ? "," : "") + $(this).attr("id").replace(/button-/, "");
        editxml.set("button", tmp);
        updatebutton();
    });
    $("#exp-effect, #exp-requirement, #exp-button").click(function() {
        if($(this).parent().css("height").replace(/px/, "") > 40) {
            $(this).parent().css("height", "40px");
        } else {
            $(this).parent().css("height", "auto");
        }
    });
    var tmp = "";
    $.each(valid_effects, function(index, value) {
        tmp = "<span class='small-add'>" + value + "<input type='text' id='effect-" + value + "' class='add-effect'></input></span>";
        $("#effect").append(tmp);
    });
    $.each(valid_req, function(index, value) {
        tmp = "<span class='small-add'>" + value + "<input type='text' id='req-" + value + "' class='add-req'/></span>";
        $("#requirement").append(tmp);
    }); 
    $(".add-effect").keyup(function() {
        var tmp = "";
        $(".add-effect").each(function(index, value) {
            if(value.value.length > 0) {
                tmp += (tmp.length > 0 ? "," : "") + $(this).attr("id").toString().replace(/effect-/, "") + ";" + value.value;
            }
            editxml.set("effect", tmp);
        });
    });
    $(".add-req").keyup(function() {
        var tmp = "";
        $(".add-req").each(function(index, value) {
            if(value.value.length > 0) {
                tmp += (tmp.length > 0 ? "," : "") + $(this).attr("id").toString().replace(/req-/, "") + ";" + value.value;
            }
            editxml.set("requirement", tmp);
        });
    });
    $("#add-event").keyup(function() { editxml.set("event", $(this).val()); });
    $("#add-description").keyup(function() { editxml.set("description", $(this).val()); });
    $("#add-master").keyup(function() { editxml.set("master", $(this).val()); });
    $("#add-basehealth").keyup(function() { editxml.set("basehealth", $(this).val()); });
    $("#add-basedamage").keyup(function() { editxml.set("basedamage", $(this).val()); });
    $("#add-ontravel").keyup(function() { editxml.set("ontravel", $(this).val()); });
    $("#add-event").keyup(function() { editxml.set("event", $(this).val()); });
    $("#add-discoverables").keyup(function() { editxml.set("discoverables", $(this).val()); });
    $("#add-threat").keyup(function() { editxml.set("threat", $(this).val()); });
    $(".add-gender").find("option").click(function() {
        var tmp = "";
        $(".add-gender").find("option:selected").each(function(index, value) {
           tmp += (tmp.length > 0 ? "," : "") + value.text;
        });
        editxml.set("gender", tmp);
    });
    $("#add-startwith").click(function() {
        var tmp = "";
        editxml.set("startwith", $(this).find(":selected").attr("value"));
    });
    $("#add-type").find("option").click(function() { editxml.generatexml(); updateinput($("#add-type").find(":selected").text()); });
});
function updatebutton() {
        $("#button-added").html("");
        var idval, textval;
        if(editxml.get("button")) {
            $.each(editxml.get("button").split(","), function(index, value) {
                idval = editxml.get("button").split(",")[index].split(";")[1];
                textval = editxml.get("button").split(",")[index].split(";")[2];
                tmp = "<span class='small-add'>" + value + "<button class='remove-button'>-</button><input value='" + (textval ? textval : "") + "' class='input-short button-text button-edit' type='text'/><span class='plus'>Text</span><input value='" + (idval ? idval : "") + "' class='input-short button-id button-edit' type='text'/><span class='plus'>Trigger ID</span></span>";
                $("#button-added").append(tmp);
            });
        }
        $(".remove-button").click(function() {
            if(editxml.get("button")) {
                tmp = editxml.get("button").split(",");
                tmp.splice($(this).parent().index(), 1);
                editxml.set("button", String(tmp));
            }
            updatebutton();
        });
        $(".button-edit").keyup(function() {
            tmp = editxml.get("button").split(",");
            console.log($(this).parent().find(".button-id").val());
            tmp[$(this).parent().index()] = tmp[$(this).parent().index()].split(";")[0] + ($(this).parent().find(".button-id").val() ? ";" + $(this).parent().find(".button-id").val() : "") + ($(this).parent().find(".button-text").val() ? ";" + $(this).parent().find(".button-text").val() : "");
            editxml.set("button", String(tmp));
        });
}
function menu_select(id) {
    var valid = ["overview", "help", "add"], t = ["item", "location", "event", "special", "enemy"];
    $.each(valid, function(index, value) {
        $("#" + value).css("display", "none");
        $("#menu").find(".option").attr("class", "option");
    });
    $("#" + (id < 2 ? valid[id] : "add")).css("display", "block");
    $("#menu").find(".option").eq(id).addClass("selected");
    if(id > 1) {
        updateinput(t[id-2]);
        type = t[id-2];
    }
}

function updateinput(id) {
    var ui = [];
    ui.item = ["name", "price", "effect", "event"],
    ui.location = ["ontravel", "threat", "discoverables", "enemies", "event", "master", "startwith"],
    ui.event = ["title", "text", "effect", "button", "requirement"],
    ui.special = ["name", "description", "effect"],
    ui.enemy = ["name", "basehealth", "basedamage", "event", "gender"];

    $(".add").filter(function() { return $(this).index() > 0; }).css("display", "none");
    $.each(ui[id], function(index, value) {
        $("#" + value).css("display", "block");
    });
}

var editxml = (function() {
    var all = ["id", "name", "price", "event", "effect", "gender", "ontravel", "threat", "discoverables", "enemies", "master",
               "requirement", "button", "text", "title", "description", "basehealth", "basedamage", "startwith"],
        out = "", eff, evt, gen, prev_gender, disc, e1, e2, req, but, bid,
        exceptions = ["gender", "event", "discoverables", "effect", "requirement", "button"],
        valid_genders = ["male", "female", "herm"]; 
    return {
        set: function(key, value) {
            if(all[key] === "undefined") {
                return false;
            }
            all[key] = value;
            editxml.generatexml();
        },
        get: function(key) {
            if(all[key] === "undefined") {
                return false;
            }
            return all[key];
        },
        generatexml: function() {
            eff = "";
            evt = "";
            gen = "";
            disc = "";
            req = "";
            e1 = "";
            e2 = "";
            but = "";
            bid = "";
            prev_gender = "";
            out = "<" + type + ">\n";
            if(all["startwith"] === "0"){ all["startwith"] = ""; }
            if(all["event"]) {
                $.each(all["event"].split(","), function(x, v) {
                    v = parseInt(v, 10);
                    if(v !== "" && typeof v === "number" && String(v) !== "NaN") {
                        evt += "        <event>" + v + "</event>\n";
                    }
                });
            }
            if(all["gender"]) {
                $.each(all["gender"].split(","), function(x, v) {
                    if(v !== "" && $.inArray(v, valid_genders) !== -1 && v !== prev_gender) {
                        prev_gender = v;
                        gen += "        <gender>" + v + "</gender>\n";
                    }
                });
            }
            if(all["discoverables"]) {
                $.each(all["discoverables"].split(","), function(x, v) {
                    v = parseInt(v, 10);
                    if(v !== "" && typeof v === "number" && String(v) !== "NaN") {
                        disc += "        <discover>" + v + "</discover>\n";
                    }
                });
            }
            if(all["button"]) {
                $.each(all["button"].split(","), function(x, v) {
                    bid = parseInt(v.split(";")[1], 10);
                    if(bid !== "" && typeof bid === "number" && String(bid) !== "NaN") {
                        but += "        <button type=\"" + v.split(";")[0] + "\" id=\"" + bid + "\">" + (v.split(";")[2] ? v.split(";")[2] : "") + "</button>\n";
                    }
                });
            }
            if(all["effect"]) {
                $.each(all["effect"].split(","), function(x, v) {
                    e1 = v.split(";")[0];
                    e2 = v.split(";")[1];
                    e2 = parseInt(e2, 10);
                    if(v !== "" && typeof e2 === "number" && String(e2) !== "NaN" && $.inArray(e1, valid_effects) !== -1) {
                        eff += "        <effect type=\"" + e1 + "\">" + e2 + "</effect>\n";
                    }
                });
            }
            if(all["requirement"]) {
                $.each(all["requirement"].split(","), function(x, v) {
                    e1 = v.split(";")[0];
                    e2 = v.split(";")[1];
                    e2 = parseInt(e2, 10);
                    if(v !== "" && typeof e2 === "number" && String(e2) !== "NaN" && $.inArray(e1, valid_req) !== -1) {
                        req += "        <requirement type=\"" + e1 + "\">" + e2 + "</requirement>\n";
                    }
                });
            }
            $.each(all, function(index, value) {
                if(String(all[value]) !== "undefined" && String(all[value]) !== "") {
                    if($.inArray(String(value), exceptions) === -1) {
                        out += "    <" + value + ">" + all[value] + "</" + value + ">\n";
                    }
                }
            });
            if(eff) {
                out += "    <effects>\n" + eff + "    </effects>\n";
            }
            if(evt) {
                out += "    <events>\n" + evt + "   </events>\n";
            }
            if(gen) {
                out += "    <genders>\n" + gen + "   </genders>\n";
            }
            if(disc) {
                out += "    <discoverables>\n" + disc + "   </discoverables>\n";
            }
            if(req) {
                out += "    <requirements>\n" + req + "   </requirements>\n";
            }
            if(but) {
                out += "    <buttons>\n" + but + "   </buttons>\n";
            }
            out +="</" + type + ">"
            $("#add-xml").text(out);
        }
    }
}());

function xmlparser(txt) {
/*
This is where parsing magic takes place. We select the child elements of DATA(the first element) with the TAGS array.
*/
    var itemId = [], i = 0, use, effects, discoverables, enemies, but, temp, req, event, placeinarr, id, name, gender, out = "",
        tags = ["items item", "locations location", "data > enemies enemy", "data > events event", "data > specials special"],
        valid_buttons = ["event", "travel"], debug = "",
        valid_genders = ["male", "female", "herm"],
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
                out += "<b>ID:</b>" + id + "<br/>";
                out += "<b>Price:</b>" + $(this).find("price").text() + "<br/>";
                out += "<b>Effect(s):</b>" + (use ? use : "Nothing.") + "<br/>";
                out += "<b>Event(s):</b>" + (event ? event : "Nothing.") + "<br/>";
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
                    out += "<b>ID:</b>" + id + "<br/>";
                    out += "<b>Ontravel message:</b>" + $(this).find("onTravel").text() + "<br/>";
                    out += "<b>Threat:</b>" + $(this).find("threat").text() + "(%)" + "<br/>";
                    out += "<b>Discoverable(s):</b>" + (discoverables ? discoverables : "Nothing.") + "<br/>";
                    out += "<b>Enimies:</b>" + (enemies ? enemies : "Nothing.") + "<br/>";
                    out += "<b>Event(s):</b>" + (event ? event : "Nothing.") + "<br/>";
                    out += "<b>Master:</b>" + ($(this).find("master").text() ? $(this).find("master").text() : "Nothing.") + "<br/>";
                    out += "<b>Start With:</b>" + ($(this).find("startwith").text() ? $(this).find("startiwth").text() : "No.") + "<br/>";
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
                    out += "<b>ID:</b>" + id + "</br>";
                    out += "<b>Base Health:</b>" + $(this).find("basehealth").text() + "<br/>";
                    out += "<b>Base Damage:</b>" + $(this).find("basedamage").text() + "<br/>";
                    out += "<b>Event(s):</b>" + event + "<br/>";
                    out += "<b>Gender Limit:</b>" + gender + "<br/>";
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
                    out += "<b>ID:</b>" + id + "<br/>";
                    out += "<b>Text:</b>" + $(this).find("text").text() + "<br/>";
                    out += "<b>Effect(s):</b>" + use + "<br/>";
                    out += "<b>Button(s</b> " + but + "<br/>";
                    out += "<b>Requirement(s):</b>" + req + "<br/>";
                    $("<span />", {
                    html: "<span>" + $(this).find("title").text() + "</span><div class='hid_stat'>" + out + "</div>",
                    "class": "col_item"
                    }).appendTo("#events");
            } else if (index === 4) {
                out += "<b>ID:</b>" + id + "<br/>";
                out += "<b>Description:</b>" + $(this).find("description").text() + "<br/>";
                out += "<b>Effect(s):</b>" + use + "<br/>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#specials");
            }
        });
    });
    $(".col").each(function(index, value) {
        $(this).find("h2 .amount").text($(this).find(".col_item").length);
    });
    $(".col").find(".col_item").click(function() {
        if($(this).find(".hid_stat").css("display") === "none") {
            $(this).find("span").css({"background": "#188acb", "color": "#fff"});
            $(this).find(".hid_stat").fadeIn(0);
        } else {
            $(this).find("span").css({"background": "", "color": ""});
            $(this).find(".hid_stat").fadeOut(0);
        }
    });
}