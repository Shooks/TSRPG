var type = "item";
var valid_req = ["health", "mana", "strength", "stamina", "agility", "intelligence", "charisma", "libido", "energy", "lust" ,"special" ,"origin", "location", "level", "height"],
        valid_effects = ["health", "mana", "experience", "libido", "strength", "stamina", "agility", "intelligence", "charisma", "energy", "lust", "height", "eyecolor", "haircolor", "bodytype", "skincolor"];
var ui = [];
ui.item = ["id", "name", "price", "effect", "event"],
ui.location = ["id", "name", "ontravel", "threat", "discoverables", "enemies", "event", "master", "startwith"],
ui.event = ["id", "name", "text", "effect", "button", "requirement"],
ui.special = ["id", "name", "description", "effect"],
ui.enemy = ["id", "name", "basehealth", "basedamage", "event", "gender"];
$(document).ready(function() {
    var jqxhr = $.ajax("data.xml")
        .done(function(data) { xmlparser(data); })
        .fail(function() { alert("Failed to load data.xml. You can still use the editor."); });
    $("#id").show();
    $("#menu").find(".option").click(function() {
        menu_select($(this).index());
    });
    $("#add-id").keyup(function() {
        editxml.set("id", $(this).val());
    });
    $("#add-name").keyup(function() { editxml.set("name", $(this).val()); });
    $("#add-price").keyup(function() { editxml.set("price", $(this).val()); });

    $.each(valid_effects, function(index, value) {
        tmp = "<option>" + value + "</option>";
        $("#sel-effect").append(tmp);
    });
    $.each(valid_req, function(index, value) {
        tmp = "<option>" + value + "</option>";
        $("#sel-req").append(tmp);
    }); 
    $("#exp-requirement, #exp-button").click(function() {
        if($(this).parent().css("height").replace(/px/, "") > 40) {
            $(this).parent().css("height", "40px");
        } else {
            $(this).parent().css("height", "auto");
        }
    });
    var tmp = "";

    $("#add-sel-but").click(function() {
        var tmp = "";
        if(editxml.get("button")) {
            tmp = editxml.get("button");
        }
        tmp += (tmp.length > 1 ? "," : "") + $("#sel-but").find(":selected").text();
        editxml.set("button", tmp);
        updatebutton();
    });
    $("#add-sel-effect").click(function() {
        tmp = "";
        if(editxml.get("effect")) {
            tmp = editxml.get("effect");
            if($.inArray($("#sel-effect").find(":selected").text(), editxml.get("effect").split(",")) !== -1) {
                return;
            }
        }
        tmp += (tmp.length > 1 ? "," : "") + $("#sel-effect").find(":selected").text();
        editxml.set("effect", tmp);
        updateffect();
    });
    $("#add-sel-req").click(function() {
        tmp = "";
        if(editxml.get("requirement")) {
            tmp = editxml.get("requirement");
            if($.inArray($("#sel-req").find(":selected").text(), editxml.get("requirement").split(",")) !== -1) {
                return;
            }
        }
        tmp += (tmp.length > 1 ? "," : "") + $("#sel-req").find(":selected").text();
        editxml.set("requirement", tmp);
        updatereq();
    });

    $("#add-event").keyup(function() { editxml.set("event", $(this).val()); });
    $("#add-description").keyup(function() { editxml.set("description", $(this).val()); });
    $("#add-text").keyup(function() { editxml.set("text", $(this).val()); });
    $("#add-master").keyup(function() { editxml.set("master", $(this).val()); });
    $("#add-basehealth").keyup(function() { editxml.set("basehealth", $(this).val()); });
    $("#add-basedamage").keyup(function() { editxml.set("basedamage", $(this).val()); });
    $("#add-ontravel").keyup(function() { editxml.set("ontravel", $(this).val()); });
    $("#add-event").keyup(function() { editxml.set("event", $(this).val()); });
    $("#add-discoverables").keyup(function() { editxml.set("discoverables", $(this).val()); });
    $("#add-enemies").keyup(function() { editxml.set("enemies", $(this).val()); });
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
function updatereq() {
    $("#list-req").html("");
    if(!editxml.get("requirement")) { return; }
    var amount, chance;
        $.each(editxml.get("requirement").split(","), function(index, value) {
            amount = editxml.get("requirement").split(",")[index].split(";")[1];
            chance = editxml.get("requirement").split(",")[index].split(";")[2];
            $("#list-req").append("<span class='small-add'>" + value + "<select class='req-op edit-req'><option>=</option><option>></option><option><</option><option>>=</option><option><=</option></select><button class='rem-req'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short req-amount edit-req'><span class='plus'>Amount</span></span>");
        });
            $(".rem-req").unbind().click(function() {
                var tmp = editxml.get("requirement").split(",");
                tmp.splice($(this).parent().index(), 1);
                editxml.set("requirement", String(tmp));
                updatereq();
            });
        $(".edit-req").unbind().bind('click keyup', function() {
            tmp = editxml.get("requirement").split(",");
            tmp[$(this).parent().index()] = tmp[$(this).parent().index()].split(";")[0] + ";" + ($(this).parent().find(".req-amount").val() ? $(this).parent().find(".req-amount").val() : "") + ";" + $(this).parent().find(".req-op").find(":selected").text();
            editxml.set("requirement", String(tmp));
        });
}
function updateffect() {
    $("#list-effect").html("");
    if(!editxml.get("effect")) { return; }
    var amount, chance;
        $.each(editxml.get("effect").split(","), function(index, value) {
            amount = editxml.get("effect").split(",")[index].split(";")[1];
            chance = editxml.get("effect").split(",")[index].split(";")[2];
            $("#list-effect").append("<span class='small-add'>" + value + "<button class='rem-effect'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short effect-amount edit-effect'><span class='plus'>Amount</span><input type='text' value='" + (chance ? chance : "") + "' class='input-short effect-chance edit-effect'><span class='plus'>Chance</span></span>");
        });
            $(".rem-effect").unbind().click(function() {
                var tmp = editxml.get("effect").split(",");
                tmp.splice($(this).parent().index(), 1);
                editxml.set("effect", String(tmp));
                updateffect();
            });
        $(".edit-effect").unbind().bind('click keyup', function() {
            tmp = editxml.get("effect").split(",");
            tmp[$(this).parent().index()] = tmp[$(this).parent().index()].split(";")[0] + ";" + ($(this).parent().find(".effect-amount").val() ? $(this).parent().find(".effect-amount").val() : "") + ";" + ($(this).parent().find(".effect-chance").val() ? $(this).parent().find(".effect-chance").val() : "");
            editxml.set("effect", String(tmp));
        });
}
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
        $(".remove-button").unbind().click(function() {
            if(editxml.get("button")) {
                tmp = editxml.get("button").split(",");
                tmp.splice($(this).parent().index(), 1);
                editxml.set("button", String(tmp));
            }
            updatebutton();
        });
        $(".button-edit").unbind().keyup(function() {
            tmp = editxml.get("button").split(",");
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
    editxml.generatexml();
}

function updateinput(id) {

    $(".add").filter(function() { return $(this).index() > 0; }).css("display", "none");
    $.each(ui[id], function(index, value) {
        $("#" + value).css("display", "block");
    });
}

var editxml = (function() {
    var all = ["id", "name", "price", "event", "effect", "gender", "ontravel", "threat", "discoverables", "enemies", "master",
               "requirement", "button", "text", "description", "basehealth", "basedamage", "startwith"],
        out = "", eff, evt, gen, prev_gender, disc, e1, e2, req, but, bid, ene,
        exceptions = ["gender", "event", "discoverables", "effect", "requirement", "button", "enemies"],
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
            ene = "";
            prev_gender = "";
            out = "<" + type + ">\n";
            if(all["startwith"] === "0"){ all["startwith"] = ""; }
            if(all["event"]) {
                $.each(all["event"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    e2 = parseInt(v.split(";")[1], 10);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        evt += "        <event" + (e2 ? " chance=\"" + e2 + "\"" : "") + ">" + e1 + "</event>\n";
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
                    e1 = parseInt(v.split(";")[0], 10);
                    e2 = parseInt(v.split(";")[1], 10);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        disc += "        <discover" + (e2 ? " chance=\"" + e2 + "\"" : "") + ">" + e1 + "</discover>\n";
                    }
                });
            }
            if(all["enemies"]) {
                $.each(all["enemies"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    e2 = parseInt(v.split(";")[1], 10);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        ene += "        <enemy" + (e2 ? " chance=\"" + e2 + "\"" : "") + ">" + e1 + "</enemy>\n";
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
                    e1 = parseInt(v.split(";")[1]);
                    e2 = parseInt(v.split(";")[2]);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        eff += "        <effect" + (e2 ? " chance=\"" + e2 + "\"" : "") + " type=\"" + v.split(";")[0] + "\">" + (e1 ? e1 : "0") + "</effect>\n";
                    }
                });
            }
            if(all["requirement"]) {
                $.each(all["requirement"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[1]);
                    if(e1 !== "NaN") {
                        req += "        <requirement type=\"" + v.split(";")[0] + "\" operator=\"" + (v.split(";")[2] ? v.split(";")[2] : "=")  +"\">" + (e1 ? e1 : "0") + "</requirement>\n";
                    }
                });
            }
            $.each(all, function(index, value) {
                if(String(all[value]) !== "undefined" && String(all[value]) !== "" && $.inArray(value, ui[type]) !== -1) {
                    if($.inArray(String(value), exceptions) === -1) {
                        out += "    <" + value + ">" + all[value] + "</" + value + ">\n";
                    }
                }
            });
            if(eff && $.inArray("effect", ui[type]) !== -1) {
                out += "    <effects>\n" + eff + "    </effects>\n";
            }
            if(evt && $.inArray("event", ui[type]) !== -1) {
                out += "    <events>\n" + evt + "   </events>\n";
            }
            if(gen && $.inArray("gender", ui[type]) !== -1) {
                out += "    <genders>\n" + gen + "   </genders>\n";
            }
            if(disc && $.inArray("discoverables", ui[type]) !== -1) {
                out += "    <discoverables>\n" + disc + "   </discoverables>\n";
            }
            if(req && $.inArray("requirement", ui[type]) !== -1) {
                out += "    <requirements>\n" + req + "   </requirements>\n";
            }
            if(but && $.inArray("button", ui[type]) !== -1) {
                out += "    <buttons>\n" + but + "   </buttons>\n";
            }
            if(ene && $.inArray("enemies", ui[type]) !== -1) {
                out += "    <enemies>\n" + ene + "   </enemies>\n";
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
                    }).appendTo("#xenemies");
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
                    out += "<b>Button(s)</b> " + but + "<br/>";
                    out += "<b>Requirement(s):</b>" + req + "<br/>";
                    $("<span />", {
                    html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
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