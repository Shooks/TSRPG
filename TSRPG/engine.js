var Library = (function() {
/*
This function is where all the data from data.xml is saved and retrived. In an array (lib), with many array in it (eg. event_title, special_description).
Get will ask for a key and an index, KEY specifies what array you are after and INDEX specifies what part of the array you want.
If INDEX is not defined it will out put the entire array that KEY specified.
*/
    var lib = ["event_title", "event_text", "event_effects", "event_buttons", "event_requirements", "location_name", "location_description",
               "location_threat", "location_ontravel", "location_enemies", "location_event", "location_discover", "location_master",
               "enemy_name", "enemy_health", "enemy_damage", "enemy_event", "enemy_gender", "item_name", "item_price", "item_event", "item_use", "special_name",
               "special_effect", "special_description"];
    $.each(lib, function(index, value) {
        lib[value] = [];
    });
    return{
        get: function(key, index) {
            if(index !== "undefined" || lib[key][index] !== "undefined") {
                return lib[key][index];
            }else if(index === "undefined" && lib[key] !== "undefined") {
                return lib[key];
            }
            return "undefined";
        },
        set: function(key, id, value) {
            id = parseInt(id);
            key = String(key);
            value = String(value);
            if(id === "undefined" || id === "NaN" || key === "undefined" || value === "undefined") {
                return false;
            }
            lib[key][id] = value;
        }
    }
}());

function xmlparser(txt) {
/*
This is where parsing magic takes place. We select the child elements of DATA(the first element) with the TAGS array.
*/
    var itemId = [], i = 0, use, effects, discoverables, enemies, but, temp, req, event, placeinarr, id, name, gender,
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
                if(name, $(this).find("price").text()) {
                    Library.set("item_name", id, name);
                    Library.set("item_price", id, $(this).find("price").text());
                    Library.set("item_use", id, use);
                    Library.set("item_event", id, event);
                } else {
                    if(debug) {
                        console.log("XMLParser: Item must contain Name and Price.");
                    }
                }
            } else if (index === 1) {
                if(name && $(this).find("onTravel").text() && $(this).find("threat").text()) {
                    $(this).find("discoverable discover").each(function (x, v) {
                        discoverables += (discoverables.length > 0 ? "," : "") + $(v).text();
                    });
                    $(this).find("enemies enemy").each(function (x, v) {
                        enemies += (enemies.length > 0 ? "," : "") + $(v).text();
                    });
                    Library.set("location_name", id, name);
                    Library.set("location_ontravel", id, $(this).find("onTravel").text());
                    Library.set("location_threat", id, $(this).find("threat").text());
                    Library.set("location_discover", id, discoverables);
                    Library.set("location_enemies", id, enemies);
                    Library.set("location_event", id, event);
                    Library.set("location_master", id, $(this).find("master").text());
                } else {
                    if(debug) {
                        console.log("XMLParser: Location must contain Name, OnTravel and Threat.");
                    }
                }
            } else if (index === 2) {
                if(name && $(this).find("basehealth").text() && $(this).find("basedamage").text()) {
                    $(this).find("genders gender").each(function (x, v) {
                        if($.inArray($(v).text(), valid_genders) !== -1) {
                            //Transform gender name into an id (eg, 1, 2 and 3).
                            gender += (gender.length > 0 ? "," : "") + $.inArray($(v).text(), valid_genders);
                        } else if (debug) {
                            console.log("XMLParser: '" + $(v).text() + "' is not a valid gender.");
                        }
                    });
                    Library.set("enemy_name", id, name);
                    Library.set("enemy_health", id, $(this).find("basehealth").text());
                    Library.set("enemy_damage", id, $(this).find("basedamage").text());
                    Library.set("enemy_event", id, event);
                    Library.set("enemy_gender", id, gender);
                } else {
                    if(debug) {
                        console.log("XMLParser: Enemy must contain Name, Health and Damage.");
                    }
                }
            } else if (index === 3) {
                if($(this).find("title").text() && $(this).find("text").text()) {
                    temp = $(this).find("buttons button");
                    $.each(temp, function() {
                        placeinarr = $.inArray($(this).attr("type"), valid_buttons);
                        if(placeinarr !== -1) {
                            but += (but.length > 0 ? "," : "") + valid_buttons[placeinarr] + ";" + $(this).attr("id") + ";" + $(this).text();
                        }
                    });
                    Library.set("event_title", id, $(this).find("title").text());
                    Library.set("event_text", id, $(this).find("text").text());
                    Library.set("event_effects", id, use);
                    Library.set("event_buttons", id, but);
                    Library.set("event_requirements", id, req);
                } else {
                    if(debug) {
                        console.log("XMLParser: Event must contain Title and Text.");
                    }
                }
            } else if (index === 4) {
                if(name && $(this).find("description").text() && use) {
                    Library.set("special_name", id, name);
                    Library.set("special_description", id, $(this).find("description").text());
                    Library.set("special_effect", id, use);
                } else {
                    if(debug) {
                        console.log("XMLParser: Special must contain Name, Description and Effects.");
                    }
                }
            }
        });
    });
}

$.ajax({
url: "data.xml",
isLocal: true,
processData: false,
async: false // Firefox fix, otherwise it will just continue to show the "spinning" animation.
}).done(function(data) {
    xmlparser($(data).find("data"));
}).fail(function() {
});

var player = (function () {
/*
Here we store all the player related stuff. It's also used for retriving stuff with GET.
*/
    var stats = {},
        key,
        changeExceptions = ["health", "mana", "energy", "lust"],
        maxValue = ["healthMax", "manaMax", "energyMax", "lustMax"],
        numInArr,
        tmpArr;
    stats.stamina = 1;
    stats.agility = 1;
    stats.strength = 1;
    stats.libido = 1;
    stats.charisma = 1;
    stats.intelligence = 1;
    stats.skillpoint = 10;
    stats.health = 30;
    stats.healthMax = 30;
    stats.energy = 100;
    stats.energyMax = 100;
    stats.level = 1;
    stats.experience = 0;
    stats.experienceMax = 150;
    stats.lust = 0;
    stats.lustMax = 100;
    stats.gender = 0;
    stats.bodytype = 0;
    stats.haircolor = 0;
    stats.skincolor = 0;
    stats.origin = 0;
    stats.special = 0;
    stats.difficulty = 0;
    stats.name = "";
    stats.surname = "";
    stats.events = "";
    stats.location = 0;
    stats.money = 0;
    stats.inventory = "";
    stats.mana = 20;
    stats.manaMax = 20;
    stats.twelvehourclock = 0;
    stats.home = 0;
    stats.time = 0; //Hours past we started the game.
    stats.customitems = "";
    stats.bgcolorsetting = "";
    stats.locationsdiscovered = "9";
    stats.placesdiscovered = "0";
    stats.equiped_weapon = "";
    stats.equiped_helm = "";
    stats.equiped_chest = "";
    stats.equiped_boots = "";
    stats.equiped_hands = "";
    stats.barter = 1;
    stats.damage = 0;
    stats.potion_potency = 1;
    return {
        update_stats : function () {
            //Just make sure that all the stats are calculated.
            stats.healthMax = parseInt(20 * (1 + (stats.stamina * 0.1)), 10);
            stats.experienceMax = parseInt(15 * stats.level, 10);
            stats.lustMax = parseInt(100 + (stats.stamina * 0.5), 10);
            stats.manaMax = parseInt(20 * (1 + (stats.intelligence * 0.1)), 10);
        },
        get: function (key) {
            //Returns the value of element KEY in STATS. eg. health or mana.
            player.update_stats();
            return stats[key];
        },
        set: function (key, value) {
            if (stats[key] === "undefined") {
                return false;
            }
            player.update_stats();
            stats[key] = value;
            $(".stat ." + key).text(value);
        },
        change: function (key, value) {
            /* Contrary to set, changes the value of KEY by VALUE. Eg. if KEY = 1 and VALUE = -2 then KEY will be changed to -1 because 1 - 2 = -1. */
            if(stats[key] === "undefined") {
                return false;
            }
            player.update_stats();
            stats[key] = parseInt(stats[key], 10) + parseInt(value, 10);
            if (stats[key] < 0) {
                stats[key] = 0;
            }
            if($.inArray(key, changeExceptions) !== -1) {
                numInArr = $.inArray(key, changeExceptions);
                if(stats[key] > stats[maxValue[numInArr]]) {
                    stats[key] = stats[maxValue[numInArr]];
                }
            }
            $(".stat ." + key).text(stats[key]);
        },
        add : function (key, value, divider) {
            /*  We just add VALUE to KEY, and add a comma if KEY's length is greater than 1. So that we can parse it as an array later. */
            if (typeof stats[key] !== "string" || value === "undefined") {
                return false;
            }
            if (!divider) {
                divider = ",";
            }
            stats[key] += (stats[key].length > 0 ? divider + value : value);
        },
        remove: function (key, index) {
            if (stats[key] === "undefined") {
                return false;
            }
            tempArr = stats[key].split(",");
            tempArr.splice(index, 1);
            stats[key] = String(tempArr);
        },
        arr: function (key, divider) {
            /* Returns KEY as array divided by DIVIDER, and if DIVIDER is not set, then default to semicolon ";". */
            if (typeof stats[key] !== "string") {
                return false;
            }
            if (!divider) {
                divider = ";";
            }
            return stats[key].split(divider);
        },
        len : function(key) {
            /* Returns the length of the value of KEY */
            if (typeof stats[key] === "undefined") {
                return false;
            }
            return stats[key].length;
        },
        savegame : function() {
            if ('localStorage' in window && window.localStorage !== null) {
                localStorage.clear();
                localStorage.setItem("acceptwarning", true);
                $.each(stats, function (index, value) {
                    localStorage.setItem(index, Base64.encode(String(value)));
                });
            }
        },
        savefile : function () {
            /* Opens up a window with save game data to be saved by used on hdd. Firefox will automatically pop up a download prompt. */
            if (url){ URL.revokeObjectURL(url); }else { var url; }
            var savefile = "";
            $.each(stats, function (index, value) {
                if (!value && value !== 0){ value = ""; }
                savefile += Base64.encode(String(index))+ " " +Base64.encode(String(value))+ "\n";
            });
            window.open("data:text/save;base64," + Base64.encode(savefile));  
              
        },
        loadgame : function () {
            if ('localStorage' in window && window.localStorage !== null) {
                var checklist = ["stamina","agility","strength","libido","charisma","intelligence","skillpoint","health","health_max","energy","energy_max","level","experience","experience_max","lust","lust_max","gender","bodytype","haircolor","skincolor","origin","special","difficulty","name","surname","events","location","money","inventory","mana","mana_max","bj_bet","twelvehourclock","home","time","customitems","bgcolorsetting","locationsdiscovered","placesdiscovered","costumitems", "equiped_weapon", "equiped_chest", "equiped_boots", "equiped_helm", "equiped_hands"],
                i;
              for (i = 0; i < checklist.length; i++) {
                    player.set(checklist[i], (localStorage.getItem(checklist[i])?Base64.decode(String(localStorage.getItem(checklist[i]))):""));
                    $(".stat ." + checklist[i]).text(stats[checklist[i]]);
                }
            }
            go2base();
        }
    };
}());
var tempcustomitem = "",
    difficulty_multiplier = [0.5, 0.75, 1, 1.25, 1.5],
    currentSmallWindow = "",
    listofvalues = ["strength", "agility", "charisma", "stamina", "energy", "intelligence"],
    short_listofvalues = ["str", "agi", "cha", "sta", "ene", "int"],
    page_settings_colors = ["#468966","#FFF0A5", "#FFB03B", "#B64926", "#8E2800", "#39322f", "#94bce0", "#466fb0", "#5c3547", "#ffffff", "#cec5c2", "#323233"];

$(document).ready(function () {
  "use strict";
    startgame();
    $(".page_settings_rgb_input").keyup(function (event) {
        $(event.target).val($(event.target).val().replace(/[^\d]/g, ""));
        if ($(event.target).val()>255){
            $(event.target).val(255);
        }
        preview_color($("#page_settings_rgb_red").val()+ "," +$("#page_settings_rgb_green").val()+ "," +$("#page_settings_rgb_blue").val());
    });
    $.each(page_settings_colors, function (index, value) {
        $("#page_settings_color_frame").append("<div class='page_settings_color' onclick='preview_color(\"" +value+ "\");' style='background:" +(/#/.test(value)?value:"rgb(" +value+ ")")+ ";'></div>");
    });
    
    var URL = window.webkitURL || window.URL;

    var url;

    $("#text_save_button").click(function () {
        player.savefile();
    });
    $("#save_button").click(function () {
        player.savegame();
    });
    
    $("#savecolor, #dontsavecolor").click(function() {
        if($(this).text() === "Save") {
            savecolor(1);
        }else{
            savecolor(0);
        }
    });
    
    $("#ng_load button, #load_file").click(function() {
        small_window('load');
    });
    
    $("#load_game").click(function() {
        player.loadgame();
    });
    
    $("#new_game").click(function() {
        new_game();
    });
    
    $("#overlay").click(function() {
        if(!localStorage.getItem("acceptwarning")) { return; }
        if($("#small_window").css("display") === "block") {
            overlay("#small_window");
        }else if($("#page_settings").css("display") === "block") {
            overlay("#page_settings");
        }
    });
});

function sortSparseArray(arr) {
    "use strict";
    var tempArr = [];
    var indexes = [];
    for (var i = 0; i < arr.length; i++) {
        // find all array elements that exist
        if (arr[i] !== undefined) {
            tempArr.push(arr[i]);    // save value
            indexes.push(i);         // save index
        }
    }
    // sort values
    tempArr.sort();
    // put sorted values back into the indexes in the original array that were used
    for (i = 0; i < indexes.length; i++) {
        arr[indexes[i]] = tempArr[i];
    }
    return(arr);
}

function trigger_event(id) {
    if(Library.get("event_title", id) === false) {
        return false;
    }
    var tmp;
    if(Library.get("event_requirements")) {
    $.each(Library.get("event_requirements").split(";"), function(index, value) {
        switch(value[2]) {
            case "=":
                if(Player.get(value[0]) === value[1]) {
                    return false;
                }
            break;
            case ">":
                if(value[1] < Player.get(value[0])) {
                    return false;
                }
            break;
            case "<":
                if(value[1] > Player.get(value[0])) {
                    return false;
                }
            break;
            case ">=":
                if(value[1] <= Player.get(value[0])) {
                    return false;
                }
            break;
            case "<=":
                if(value[1] >= Player.get(value[0])) {
                    return false;
                }
            break;
        }
    });
    }
    $("#content").html("<h2>" + Library.get("event_title", id) + "</h2>" + Library.get("event_text", id));
    if(Library.get("event_buttons", id)) {
        tmp = Library.get("event_buttons", id).split(";");
        action_bar(tmp[0] + ";" + tmp[1] + (tmp[2] ? ";" + tmp[2] : ""));
    }
}

function equip_item(custom_item_id) {
    "use strict";
    var item = player.arr("customitems", ",")[custom_item_id],
        olditem,
        itemtype = parseInt(item.split(";")[9], 10);
        
    player.remove("customitems", custom_item_id);
    
    if(itemtype === 0) {
        //Weapon
        olditem = player.get("equiped_weapon");
        player.set("equiped_weapon", item);
    }else if(itemtype === 1) {
        //Chest
        olditem = player.get("equiped_chest");
       player.set("equiped_chest", item);
    }else if(itemtype === 2) {
        //Boots
        olditem = player.get("equiped_boots");
        player.set("equiped_boots", item);
    }else if(itemtype === 3) {
        //Helm
        olditem = player.get("equiped_helm");
        player.set("equiped_helm", item);
    }else if(itemtype === 4) {
        //Gloves
        olditem = player.get("equiped_hands");
        player.set("equiped_hands", item);
    }else {
        //If something were to happen just return the item we tried to equip.
        olditem = item;
        return;
    }
    /*  Strength, Stamina, Agility, Charisma, Intelligence, Damage  */
    if (olditem.length > 0) {
        player.add("customitems", olditem);
        olditem = olditem.split(";");
        player.change("strength", -olditem[1]);
        player.change("stamina", -olditem[2]);
        player.change("agility", -olditem[3]);
        player.change("charisma", -olditem[4]);
        player.change("intelligence", -olditem[5]);
        player.change("damage", -olditem[6]);
    }
    item = item.split(";");
    player.change("strength", item[1]);
    player.change("stamina", item[2]);
    player.change("agility", item[3]);
    player.change("charisma", item[4]);
    player.change("intelligence", item[5]);
    player.change("damage", item[6]);
    initiate();
        
    if ($("#small_window").css("display")==="block"){ $("#item_hover").hide(); show_inventory(true); }
}

function rgb2hex(rgb) {
    "use strict";
    rgb = rgb.replace(/#/, "");
    if (rgb.length<6){ return -1; }
    var hex = parseInt(rgb.slice(0,2), 16)+ "," +parseInt(rgb.slice(2,4), 16)+ "," +parseInt(rgb.slice(4,6), 16);
    return hex;
}
function savecolor(v) {
    "use strict";
    if (v===0) {
        overlay("#page_settings");
        preview_color(player.get("bgcolorsetting"));
    }else if (v===1) {
        overlay("#page_settings");
        player.set("bgcolorsetting", $("#page_settings_rgb_red").val()+ "," +$("#page_settings_rgb_green").val()+ "," +$("#page_settings_rgb_blue").val());
    }
    return;
}
function preview_color(c) {
    "use strict";
    if (/#/.test(c) === true){ c=rgb2hex(c); }
    $("#page_settings_rgb_red").val(c.split(",")[0]);
    $("#page_settings_rgb_green").val(c.split(",")[1]);
    $("#page_settings_rgb_blue").val(c.split(",")[2]);
    $("#page_settings_rgb_preview").css("background", "rgb(" +c.split(",")[0]+ "," +c.split(",")[1]+ "," +c.split(",")[2]+ ")");
    document.body.style.backgroundColor = "rgb(" +c+ ")";
}
function new_game() {
    "use strict";
    var r = confirm("Are you sure you want to start a new game?\nYour current save will be DELETED.\nIf you want to start a new game but be able to return, please use the Text Save button first.");
    if (r === true) {
        localStorage.clear();
        $("#new_character").fadeIn(300);
        startgame();
    }
    return;
}

function shuffle(array) {
    "use strict";
    var tmp, current, top = array.length;
    if (top) {
    while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
        }
    }
    return array;
}

function overlay(element) {
    "use strict";
    if($("#overlay").css("display") === "none") {
        $(element).fadeIn(150);
        $("#overlay").fadeIn(150);
    }else{
        preview_color(player.get("bgcolorsetting"));
        $(element).fadeOut(150);
        $("#overlay").fadeOut(150);
        if(currentSmallWindow.length>0) {
            $(currentSmallWindow).fadeOut(150);
            currentSmallWindow = "";
        }
    }
}

function ng_slide(page) {
    "use strict";
    $("#ng_slider").css({ "left": "-" + (page * 100) + "%" });
    $(".ng_select").eq(page).css({
        "background": "#188acb",
        "color" : "#ffffff"
    });
    $(".ng_select").filter(function (index) {
        return index !== page;
    }).css({
        "background": "",
        "color" : "#333"
    });
    return;
}

function meter(id, value, max, cname) {
    "use strict";
    var dist = 0,
        i;
    if (value > max) {
        value = max;
    }
    value = Math.floor(value);
    var oval = ($(id).data("value") ? $(id).data("value") : 0);
    $(id).data("value", value);
    var multiplier = 176/100,
    y = 0,
    obj = $(id).find('.meter').css("width").replace(/px/, "");
    $(id).find('.meter').css("width", (multiplier * ((value / max) * 100)));
    $(id).find('.text').html((cname?cname:id.slice(1)) + "<span class=\"right\">" + value + "/" + max + "</span>");
}

function initiate() {
    "use strict";
    meter('#health', player.get("health"), player.get("healthMax"));
    meter('#experience', player.get("experience"), player.get("experienceMax"));
    meter('#energy', player.get("energy"), player.get("energyMax"));
    meter('#lust', player.get("lust"), player.get("lustMax"));
    meter('#mana', player.get("mana"), player.get("manaMax"));
    $('.charactername').text(player.get("name") + (player.len("surname") > 0 ? "" + player.get("surname") : ""));
    clock(0);
    xp(0);
}

function item_description(id) {
    "use strict";
    var out = "", val;
    var special_word = [];
        special_word.health = "Restores";
        special_word.mana = "Restores";
    if (Library.get("item_use", id) !== "undefined"){
        $.each(Library.get("item_use", id).split(","), function (index, value) {
            val = value.split(";")[1];
            if(special_word[value.split(";")[0]] !== "undefined") {
                out += special_word[value.split(";")[0]] + " " + val.replace(/%/, "") * player.get("potion_potency") + (value.slice(value.length-1) === "%" ? "%" : "") + " " + value.split(";")[0] + ".";
            } else {
                out += "Increases " + value.split(";")[0] + " by " + val + ".";
            }
        });
    }
    return out;
}

function use_item(id) {
    "use strict";
    var tmp;
    editinventory(id, 1, true);
    if ($("#small_window").css("display")==="block"){
        overlay("#small_window");
    }
    $.each(Library.get("item_use", id).split(","), function (index, value) {
        trigger_effect(value, true);
    });
}

function trigger_effect(effect, ispotion) {
    if(effect.length < 1) {
        return;
    }
    var tmp = effect.split(";")[0],value = effect.split(";")[1], pp = player.get("potion_potency"),
        valueswithmeter = ["health", "mana", "lust", "energy"];
        
        if(tmp !== "experience") {
            if(value.slice(value.length-1) === "%" && player.get(tmp + "Max") !== "undefined") {
                player.change(tmp, parseInt(player.get(tmp + "Max") * (value.replace(/%/, "") / 100) * (ispotion ? pp : 1), 10));
            } else {
                player.change(tmp, value.replace(/%/, "") * (ispotion ? pp : 1));
            }
            if($.inArray(tmp, valueswithmeter) !== -1) {
                meter("#" + tmp, player.get(tmp), player.get(tmp + "Max"));
            }
        } else {
            xp(value.replace(/%/, ""));
        }
}

function xp(add) {
    "use strict";
    player.change("experience", parseInt(add, 10) * (player.get("special") === 14 ? 1.10 : 1));
    while (player.get("experience") >= player.get("experienceMax")) { /*  Level up  */
        player.change("level", 1);
        player.change("skillpoint", 5);
        player.change("experience", -player.get("experienceMax"));
        $(".level").text(player.get("level"));
        $(".skillpoint").text(player.get("skillpoint"));
        player.set("experienceMax", 150 * player.get("level"));
    }
    meter('#experience',player.get("experience"), player.get("experienceMax"));
}

var SkillSelect = function (element) {
    "use strict";
    var atr = {};
    atr.strength = 0,
    atr.intelligence = 0,
    atr.agility = 0,
    atr.charisma = 0,
    atr.stamina = 0,
    atr.skillpoint = 0;
    return {
        updateAtr : function () {
            $.each(atr, function(index) {
                atr[index] = player.get(index);
                $(element + " input." + index).val(atr[index]);
            });
        },
        increase : function (key) {
            if(atr.skillpoint<1){
                return;
            }
            atr.skillpoint--;
            atr[key]++
            $(element + " input." + key).val(atr[key]);
            $(element + " input.skillpoint").val(atr.skillpoint);
        },
        decrease : function (key) {
            if(atr[key] - 1 < player.get(key)) {
                return;
            }
            atr.skillpoint++;
            atr[key]--;
            $(element + " input." + key).val(atr[key]);
            $(element + " input.skillpoint").val(atr.skillpoint);
        },
        save : function () {
            $.each(atr, function(index, value) {
                player.set(index, value);
            });
            player.savegame();
            initiate();
        }
    }
}

var NewGame = function () {
    var atr = {}, error;
    atr.gender;
    atr.bodytype;
    atr.haircolor;
    atr.skincolor;
    atr.origin;
    atr.special;
    atr.difficulty;
    atr.name;
    atr.surname;

    return {
        set : function (key, change) {
            atr[key] = change;
            error = 0;
            if(typeof atr.gender === "undefined") { error = 1; }
            if(typeof atr.bodytype === "undefined") { error = 1; }
            if(typeof atr.haircolor === "undefined") { error = 1; }
            if(typeof atr.skincolor === "undefined") { error = 1; }
            if(typeof atr.origin === "undefined") { error = 1; }
            if(typeof atr.special === "undefined") { error = 1; }
            if(typeof atr.difficulty === "undefined") { error = 1; }
            if(typeof atr.name === "undefined") { error = 1; }
            if(error !== 1) {
                $('#ng_finish_button').removeAttr("disabled").addClass("focus");
            }
        },
        save : function () {
            $.each(atr, function(index, value) {
                player.set(index, value);
            });
        $('#new_character').fadeOut(400);
        $('#main').fadeIn(600);
        $('#content').html("<span class='longtext'>" + story[0] + "..." + startingtext[atr.origin] + "</div>");
        action_bar("5");
        player.savegame();
        initiate();
        }
    }
};

function finish_ng() {
    "use strict";
    go2base();
    $('#new_character').fadeOut(400);
    $('#main').fadeIn(600);
    player.savegame();
    initiate();
}

function popup(preset, title, desc) {
    "use strict";
    if (!preset) {
        preset = false;
    }
    overlay("#popup");
    if (preset !== false) {
        title = popup_preset[preset].split("|")[0];
        desc = popup_preset[preset].split("|")[1];
    }
    $("#popup").find("h2").text(title);
    $("#popup").find("span").text(desc);
}

function small_window(preset, custom) {
    "use strict";
    overlay("#small_window");
    switch(preset) {
        case 'warning':
            $("#explicit").show();
            currentSmallWindow = "#explicit";
        break;
        case 'load':
            $("#loadfromfile").show();
            currentSmallWindow = "#loadfromfile";
        break;
        case 'skill':
            $("#spendpoints").show();
            currentSmallWindow = "#spendpoints";
            var skill = new SkillSelect("#spendpoints");
            skill.updateAtr();
            $("#spendpoints").find("button").mousedown(function() {
                var key = $(this).parent().attr("id");
                if($.inArray(key, ["strength", "stamina", "charisma", "intelligence", "agility", "skillpoint"]) === -1) {
                    return;
                }
                if($(this).text() === "+") {
                    skill.increase(key);
                }else{
                    skill.decrease(key);
                }
            });
            $("#saveskillpoints").click(function() { 
                skill.save();
                overlay("#small_window");
            });
        break;
    }
    if(custom) {
        $("#customwindow").html("<div onclick=\"overlay('#small_window')\" class=\"close_button\">&#10006;</div>" + custom);
        $("#customwindow").show();
        currentSmallWindow = "#customwindow";
    }
    if (preset==='load') {
        var dropZone = document.getElementById('drop_zone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', readBlob, false);
    }
}

function explore() {
    "use strict";
    var tmp = "<h2>Exploration & Travel</h2>",
    exploration = "",
    travel = "";
    
    $.each(player.arr("locationsdiscovered", ","), function (index, value) {
        if (location_place_master[value]){
            travel += "<div onclick='go2location(" + value + ")' class='list-object'>" + Library.get("location_name", value) + "</div>";
        }else{
             exploration += "<div onclick='go2location(" + value + ")' class='list-object'>" + Library.get("location_name", value) + "</div>";
        }
    });
    
    tmp += "<div class='list-object-container '><h3>Exploration</h3>" + exploration + "</div>";
    tmp += "<div class='list-object-container '><h3>Travel</h3>" + travel + "</div>";
    $("#content").html(tmp);
}

function go2location(id) {
//This is such a mess you shouldn't probably even look at it.
    "use strict";
    var temp;
    if(Library.get("location_event", id)) {
        temp = shuffle(Library.get("location_event", id).split(","));
        $.each(temp, function(index, value) {
            if(Math.random() * value.split(";")[1] > Math.random() * 100) {
                if(trigger_event(value) !== false) {
                    return;
                }
            }
        });
    }
    if (parseInt(player.get("energy"), 10) - 8 < 0) {
        popup(2);
        return;
    } /*  Not enough energy  */
    var tmp = Math.floor(Math.random()*5)+1,
        i;
    clock(tmp);
    player.set("location", id);
    if (5 * tmp>player.get("energy")){ tmp = player.get("energy") / 10; }
    energy(-5 * tmp);
    if (Math.random() * Library.get("location_threat", id) > Math.random() * 100 && Library.get("location_enemies", id)) {
        var le = Library.get("location_enemies", id).split(",");
        combat.trigger(le[Math.floor( Math.random () * le.length )]); return;
    }
    var out = "<h2>" + Library.get("location_name", id) + "</h2><p>" + Library.get("location_ontravel", id) + "</p>",
        randomlyselecteddiscovery = false;
    if (Library.get("location_discover", id)){
        var chanceofdiscoveryarray = [];
        var chanceofdiscoverysum = 0;
        $.each(Library.get("location_discover", id).split(","), function (index, value) {
            if ($.inArray(value, player.arr("locationsdiscovered", ","))===-1) {
                chanceofdiscoverysum += (value.split(";")||value.split(";")===0?(value.split(";")?100:value.split(";")):10)+1;
                chanceofdiscoveryarray[index] = chanceofdiscoverysum;
            }
        });    
        var n = Math.random()*chanceofdiscoverysum;
        if (Math.random()*100<(n*tmp)) { /*  I know, it's ugly, I'm rusty at chance. I figured this will give an estimate. It's no big deal really. */
            for(i=0;i<chanceofdiscoveryarray.length;i++) {
            if (n<chanceofdiscoveryarray[i]){ randomlyselecteddiscovery = i; break; }
        }
        player.add("locationsdiscovered", Library.get("location_discover", id).split(",")[randomlyselecteddiscovery]);
        out += "After " +tmp+ " hour(s) of exploring you spot something. ";
        out += "<strong>You have discovered " + Library.get("location_name", randomlyselecteddiscovery) + "</strong>.";
        }
    }
    if (!randomlyselecteddiscovery&&!Library.get("location_master", id)) {
        out += "After scouering around for " + tmp + " hour(s), you decide to head back to your camp.";
    }
    if (Library.get("location_master", id)) {
        out += Library.get("location_description", id);
        action_bar("0;0,6");
    }else{
        action_bar("6");
    }
    $("#content").html(out);
}
function go2base() {
   "use strict";
    player.set("location", -1);
    var out = "<h2>Camp</h2>";
    action_bar("5,0");
    $("#content").html(out);
}

var combat = (function() {
    var id, name, level, gender, health, health_max, combatlog = [], genders, player_damage, enemy_damage, passouttime, coinlost, monster_value, tmp, critical,
        gender_name = ["Male", "Female", "Herm"];

    return {
        trigger: function(id) {
            if(Library.get("enemy_name", id) === "undefined") {
                return;
            }
            /*
            Load enemy info so combat can be had.
            */
            combatlog = [];
            id = id;
            name = Library.get("enemy_name", id);
            level = Math.floor( parseInt(player.get("level"), 10) +(Math.random() * 3) );

            //Enemy base health + ((base health / 2) * player level).
            health_max = parseInt(Library.get("enemy_health", id), 10) + Math.floor((Library.get("enemy_health", id) / 8) * player.get("level"));
            health = health_max;

            genders = (Library.get("enemy_gender", id) === "undefined" ? [1, 2, 3] : Library.get("enemy_gender", id).split(","));
            gender = genders[Math.floor(Math.random()*genders.length)];
            
            enemy_damage = Math.floor(parseInt(Library.get("enemy_damage", id), 10) + Math.floor((Library.get("enemy_damage", id) / 10) * player.get("level")));
            difficulty = level * (enemy_damage / health_max);

            var out = "<h2>" + level + " " + gender_name[gender] + " " + name + "<span class='right'><div id='chealth' class='meter_holder chealth'><div class='text'></div><div class='meter'></div></div></span></h2><div id='combat-log'></div>";
            $("#content").html(out);
            meter('#chealth', health, health_max, name);
            combat.playerturn();
        },
        playerattack: function() {
            critical = 0;
            player_damage = Math.floor((player.get("strength") * 0.30) + player.get("damage"));
            if (Math.random() * 100 < (Math.random()*player.get("agility")) / 2.66) {
                /* Critical Strike, 75% chance at 200 agility. */
                player_damage = player_damage * 2;
                critical = 1;
            }
            health = parseInt(health, 10) - player_damage;
            meter('#chealth', health, health_max, enemy_name[id]);
            energy(-3);
            combat.log("You attack " + name + " for " + player_damage + " health." + (critical === 1 ? " <b>Critical hit!</b>" : ""));
            if (health < 0) {
                combat.win();
            } else {
                combat.enemyattack();
            }
        },
        playerturn: function() {
            action_bar("10,11");
        },
        enemyattack: function() {
            //Enemy base damage + ((base damage / 10) * player level).
            trigger_event("health;" + "-" + enemy_damage);
            combat.log(name + " attacked you for " + enemy_damage + " health.");
            if (player.get("health") <= 0){
                combat.lose();
            } else {
                combat.playerturn();
            }
        },
        escape: function() {
            energy(-10);
            if (Math.random()*(player.get("agility") * 2.66) > Math.random() * 100) {
                combat.log("You managed to escape unharmed.");
                action_bar("5");
            }else{
                combat.log("You try to run, but ultimately it's just a waste of breath. You quickly find yourself engaged in combat again.");
                action_bar("6;2;Next");
            }
        },
        win: function() {
            //Xp is the enemy level * the damage to health ratio, i.e. difficulty and then multiply that by 10, or it'd be really low.
            monster_value = difficulty * (Math.random() * 5 + 1);
            xp(difficulty * 10);
            player.change("money", monster_value);
            combat.log("You quickly finish " + name + ". On the body you find $" + parseInt(monster_value, 10) + ". You recive " + parseInt(difficulty * 10, 10) + " experience points.");
            action_bar("6");
        },
        lose: function() {
            passouttime = parseInt(Math.random()*12, 10);
            coinlost = parseInt(player.get("money") * (Math.random() * 0.3), 10);
            combat.log("You pass out. You wake up " + passouttime + " hour" + (passouttime > 1 ? "(s)" : "") + " later. Missing $" +coinlost+ ". You head back to camp, tail between your legs.");
            player.change("money", -coinlost); // 0-30% of your total wealth is lost if you lose.
            player_sleep(passouttime);
            action_bar("6");
        },
        log: function(add) {
            combatlog[combatlog.length++] = add;
            $("#combat-log").html("");
            for(i = (combatlog.length > 15 ? combatlog.length - 15 : 0);i<combatlog.length;i++) {
                $("<span />", {
                    html: combatlog[i]
                }).appendTo("#combat-log");
            }
            $("#combat-log").scrollTop(document.getElementById("combat-log").scrollHeight);
        }
    }
}());

function generate_item(itemtype) {
    "use strict";
    if (!itemtype && itemtype !== 0) { /*  Decides if it's a weapon or a piece of armor  */
        itemtype = Math.round(Math.random() * 4);
    }
    var itemtypebasearmor = [1, 1, 0.6, 0.8, 0.6],
        itemlowerlimit = player.get("level"),
        itemupperlimit = Math.round(player.get("level") * 3),
        rarity = Math.floor(Math.random() * 175) + 25; /*  Let minimum value be around 25 or so or items will be shit.  */
    if (Math.random() * 100 > 20 && rarity > 100) {
        rarity = Math.floor(rarity / 2);
    } /*  80% Chance that the rarity value will be cut by half.  */
    var itemvalue = Math.floor((Math.random() * itemupperlimit) * (rarity / 100) + itemlowerlimit),
        pointsleft = itemvalue,
        highest = 0,
        temp = [0, 1, 2, 3, 4, 5],
        tmp;
    /*  Strength, Stamina, Agility, Charisma, Intelligence, Damage  */
    var attributes = [];
    attributes[0] = 0;
    attributes[1] = 0;
    attributes[2] = 0;
    attributes[3] = 0;
    attributes[4] = 0;
    attributes[5] = 0;
    shuffle(temp);
    var x = 0,
        hi = 0;
    $.each(attributes, function (index) {
        tmp = Math.round(Math.random() * pointsleft);
        attributes[temp[x]] = tmp;
        pointsleft -= tmp;
        if (tmp > highest) {
            highest = tmp;
            hi = temp[x];
        }
        x++;
    });
    var damagearmor = (parseInt(itemvalue, 10) + parseInt(pointsleft, 10) + attributes[5])*itemtypebasearmor[itemtype];
    if (damagearmor<1){ damagearmor = 1; }
    var itemtypename = "";
    switch(itemtype) {
        case 0:
            itemtypename = GI_weapon_names[Math.floor(Math.random()*GI_weapon_names.length+1)];
        break;
        case 1:
            itemtypename = GI_chest_names[Math.floor(Math.random()*GI_chest_names.length+1)];
        break;
        case 2:
            itemtypename = GI_boots_names[Math.floor(Math.random()*GI_boots_names.length+1)];
        break;
        case 3:
            itemtypename = GI_helm_names[Math.floor(Math.random()*GI_helm_names.length+1)];
        break;
        case 4:
            itemtypename = GI_gloves_names[Math.floor(Math.random()*GI_gloves_names.length+1)];
        break;    
    }
    var itemname = GI_rarity_names[Math.floor(rarity / (200 / GI_rarity_names.length))] + " " + itemtypename + " of " + GI_stat_name[hi];
    return itemname + ";" + String(attributes).split(",").join(";") + ";" + damagearmor + ";" + rarity + ";" + itemtype + ";" + itemvalue; /*  <itemname>, (attribute), <damage/armor>  */
}

function accept_warning() {
    "use strict";
    localStorage.setItem("acceptwarning", true);
    overlay("#small_window", true);
}

function startgame() {
    "use strict";
    var ob;
    if (localStorage.getItem("stamina")) {
        player.loadgame();
        $('#new_character').hide();
        $('#main').fadeIn(300);
    } else {
        if ($("#main").css("display") === "block") {
            $('#main').fadeOut(300);
        }
        $("#new_character").fadeIn(400);
        if (!localStorage.getItem("acceptwarning")) {
            small_window("warning");
        }
        ng_slide(0);
        var ng = NewGame();
        $.each(specialDesc, function(index, value) {
            $("<div/>", {
                "class": "choice",
                "html": value
            }).appendTo("#ng_special_select");
        });
        $("#ng_gender_select .choice").on("click", function() {
        ng.set("gender", $(this).index());
        $("#ng_gender_select .choice").removeClass("selected");
        $(this).addClass("selected");
        });
        $("#ng_finish_button").click(function() {
            ng.save();
        });
        $("#ng_difficulty_select .choice").on("click", function() {
            ng.set("difficulty", $(this).index());
            $("#ng_difficulty_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_special_select .choice").on("click", function() {
            ng.set("special", $(this).index());
            $("#ng_special_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_skincolor_select .choice").on("click", function() {
            ng.set("skincolor", $(this).index());
            $("#ng_skincolor_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_bodytype_select .choice").on("click", function() {
            ng.set("bodytype", $(this).index());
            $("#ng_bodytype_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_haircolor_select .choice").on("click", function() {
            ng.set("haircolor", $(this).index());
            $("#ng_haircolor_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        var skill = new SkillSelect("#ng_skill_select");
        skill.updateAtr();
        $("#ng_skill_select").find("button").mousedown(function() {
            var key = $(this).parent().attr("id");
            if ($.inArray(key, ["strength", "stamina", "charisma", "intelligence", "agility", "skillpoint"]) === -1) {
                return;
            }
            if ($(this).text() === "+") {
                skill.increase(key);
            } else {
                skill.decrease(key);
            }
        });
        $.each(origin, function (index) {
            ob="";
            $.each(origin_bonus[index].split(","), function (index, value){ ob += (index>0?"<br>":"")+listofvalues[$.inArray(value.split(":")[0], short_listofvalues)]+ " + " +value.split(":")[1]+ " "; });
            $("<div/>", {
                "class" : "choice",
                "html" : "<span>" + origin[index] + "</span><div class='origin_bonus'>" + ob + "</div>"
            }).appendTo("#ng_origin_select");
        });
        $("#ng_origin_select .choice").on("click", function() {
        ng.set("origin", $(this).index());
        $("#ng_origin_select .choice").removeClass("selected");
        $(this).addClass("selected");
        });
        $('#cname').keyup(function (event) {
            document.getElementById("cname").value = document.getElementById("cname").value.replace(/[^A-Za-z]/g, "");
            setTimeout(function () {
                ng.set("name", $('#cname').val().text());
            }, 10);
        });
        $('#surname').keyup(function () {
            document.getElementById("surname").value = document.getElementById("surname").value.replace(/[^A-Za-z]/g, "");
            setTimeout(function () {
                ng.set("surname", $('#cname').val().text());
            }, 10);
        });
    }
    preview_color(player.get("bgcolorsetting"));
    initiate();
}

function get_price(n, sell) {
    "use strict";
    n = Math.round(n * ((100 - (player.get("charisma") / 2)) / 100))*(player.get("special") === 9 ? 0.95 : 1);
    if (sell) {
        n = n * (player.get("special") === 9 ? 0.55 : 0.5);
    }
    if (n < 0) {
        n = 0;
    }
    return parseInt(n, 10);
}

function energy(nval) {
    "use strict";
    player.change("energy", nval);
    meter('#energy', player.get("energy"), player.get("energyMax"));
}

function readBlob(evt) {
    "use strict";
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files;
    var file = files[0];
    var start = 0;
    var stop = file.size - 1;
    var reader = new FileReader();
    reader.onloadend = function (evt) {
        var checklist = ["c3RhbWluYQ==","YWdpbGl0eQ==","c3RyZW5ndGg=","bGliaWRv","Y2hhcmlzbWE=","aW50ZWxsaWdlbmNl","c2tpbGxwb2ludA==","aGVhbHRo","aGVhbHRoX21heA==","ZW5lcmd5","ZW5lcmd5X21heA==","bGV2ZWw=","ZXhwZXJpZW5jZQ==","ZXhwZXJpZW5jZV9tYXg=","bHVzdA==","bHVzdF9tYXg=","Z2VuZGVy","Ym9keXR5cGU=","aGFpcmNvbG9y","c2tpbmNvbG9y","b3JpZ2lu","c3BlY2lhbA==","ZGlmZmljdWx0eQ==","bmFtZQ==","c3VybmFtZQ==","ZXZlbnRz","bG9jYXRpb24=","bW9uZXk=","aW52ZW50b3J5","bWFuYQ==","bWFuYV9tYXg=","YmpfYmV0","dHdlbHZlaG91cmNsb2Nr","aG9tZQ==","dGltZQ==","Y3VzdG9taXRlbXM=","Ymdjb2xvcnNldHRpbmc=","bG9jYXRpb25zZGlzY292ZXJlZA==","cGxhY2VzZGlzY292ZXJlZA==","ZXF1aXBlZF93ZWFwb24=","ZXF1aXBlZF9oZWxt","ZXF1aXBlZF9jaGVzdA==","ZXF1aXBlZF9ib290cw==","ZXF1aXBlZF9oYW5kcw=="],
        loadgame = evt.target.result,
        temp = String(loadgame.split("\n")),
        i = null;
        
        var error = "";
        for (i = 0; i < checklist.length; i++) {
            if (checklist[i] !== temp.split(",")[i].split(" ")[0]) {
                error += "\nLooked for: " +checklist[i]+ " But found: " +temp.split(",")[i].split(" ")[0];
            }
        }
        if (error.length>0) {
            alert(error + "!\nThe save file is corrupt!\nIf you think it should work, try another version of the game.");
            return;
        }
        for (i = 0; i < checklist.length; i++) {
            player.set(Base64.decode(temp.split(",")[i].split(" ")[0]), Base64.decode(temp.split(",")[i].split(" ")[1]));
        }
        overlay("#small_window");
        finish_ng(1);
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

function vendor(id) {
    "use strict";
    if (!id && id!==0) {
        return;
    }
    var tmp = "<h2>" + vendor_name[id] + "</h2><span class='notice'>" + vendor_dialogue[id] + "</span><p/>";
    $.each(vendor_items[id], function (index, value) {
        tmp += "<div onclick='buy_item(" +value+ ");' class='tradesquare'><span>" + Library.get("item_name", value) + "</span><span class='price'>$" + get_price(Library.get("item_price", value)) + "</span><span class='desc'>" + item_description(value) + "</span></div>";
    });
    $("#content").html(tmp);
    action_bar("4;" +id+ ",3");
}

function gamble(action) {
    "use strict";
    var out = "<h2>Gamble</h2>";
        out += "All of the prices are <strong>" +get_price(player.get("level")*50)+ "</strong>";
        action_bar("7;0;Buy Weapon,7;1;Buy Chest piece,7;2;Buy Boots,7;3;Buy Helmet,7;4;Buy Gloves,6");
        var attributes_names = ["Strength", "Stamina", "Agility", "Charisma", "Intelligence", "Damage"];
    if (action || action === 0) {
        var tempcustomitem = generate_item(action);
        out += item_display(tempcustomitem);
    }
    player.add("customitems", String(tempcustomitem));
    $("#content").html(out);
}

function buy_item(id, amount) {
    "use strict";
    if (!amount){ amount = 1; }
    if (get_price(Library.get("item_price", id)*amount)>player.get("money")){ popup(1); return; }
    player.change("money",-get_price(Library.get("item_price", id)));
    editinventory(id, amount);
}

function sell_item_menu() {
    "use strict";
    var out="<h2>Sell Items</h2>";
    if (player.len("inventory") <= 0){ out+="Your inventory is empty!"; }else{
        $.each(player.arr("inventory", ","), function (index, value) {
            out += "<div onclick='sell_item(" +value.split(";")[0]+ ")' class='tradesquare'><span>" + Library.get("item_name", value.split(";")[0]) + "</span><span class='price'>$" + get_price(Library.get("item_price", value.split(";")[0]), true) + "<span class='right'>Amount: " + value.split(";")[1] + "</span></span><span class='desc'>" + item_description(value.split(";")[0]) + "</span></div>";
        });
    }
    $("#content").html(out);
}

function sell_item(id, amount) {
    "use strict";
    if (!amount){ amount = 1; }
    player.change("money", get_price(Library.get("item_price", id)));
    editinventory(id, amount, true);
    sell_item_menu();
}

function editinventory(id, amount, remove) {
    "use strict";
    /* If remove isn't set, the item*amount will be ADDED. */
    var position = null,
        available_amount = null,
        tmp = null;
    if ($.inArray(String(id), player.get("inventory").replace(/[;](\d*)($|,)/g, ",").split(","))!==-1){
        position = $.inArray(String(id), player.get("inventory").replace(/[;](\d*)($|,)/g, ",").split(","));
        available_amount = parseInt(player.arr("inventory", ",")[position].split(";")[1], 10);
    }
    if (!remove) {
        if (!position&&position!==0) {
            /* Item doesn't exist in inventory, add new item.*/
            player.add("inventory", id+ ";" +amount);
        }else{
            /* Item DOES exist, edit current. */
            tmp = player.arr("inventory", ",");
            tmp[position] = id+ ";" +(available_amount+parseInt(amount, 10));
            player.set("inventory", String(tmp));
        }
    }else{
        if (position===-1){ return false; }
        if (available_amount<=amount) {
            tmp = player.get("inventory");
            tmp = tmp.split(",");
            tmp.splice(position, 1);
            player.set("inventory", String(tmp));
        }else{
            tmp = player.arr("inventory", ",");
            tmp[position] = id+ ";" +parseInt(available_amount-amount, 10);
            player.set("inventory", String(tmp));
        }
    }
}

function show_inventory(update) {
    "use strict";
    var out = "";
    if (!update) {
    out = "<h2>Inventory</h2><div class='inventory_type_description'>Misc.</div><div class='inventory_type_description'>Weapon & Armor</div><div id='inventory-mi' class='list-object-inventory'>";
    }
    if (player.len("inventory") > 0) {
        $.each(player.arr("inventory", ","), function (index, value) {
            out += "<div onclick='use_item(\"" +value.split(";")[0]+ "\")' class='list-object' title='" +item_description(value.split(";")[0])+ "'>" + (value.split(";")[1]?value.split(";")[1]:1) + " " + Library.get("item_name", value.split(";")[0]) + "<span class='right'>" +item_description(value.split(";")[0])+ "</span></div>";
        });
    }
    if (!update) {
        out += "</div><div id='inventory-wa' class='list-object-inventory'>";
    }
    if (update) {
        $("#inventory-mi").html(out);
        out = "";
        $("#inventory-wa").html("");
    }
    if (!update) {
        out += "</div>";
        small_window('', out);
    }
    /*  Strength, Stamina, Agility, Charisma, Intelligence, Damage  */
    var itemtypes = ["equiped_weapon", "equiped_chest", "equiped_boots", "equiped_helm", "equiped_hands"];
    if (player.len("customitems") > 0) {
            $.each(player.arr("customitems", ","), function (index, value) {
                $("<div/>", {
                    "class": "item",
                    html: item_display(value, index, true),
                    mouseenter: function () {
                        var pos = $(this).offset();
                        $('#item_hover').show().css({
                            left: pos.left - 430 + "px",
                            top: pos.top + "px"
                        }).html(item_display(player.get([itemtypes[value.split(";")[9]]])));
                    },
                    mouseleave: function () {
                            $('#item_hover').hide();
                    }    
                }).appendTo("#inventory-wa");
            });
            
        }
}

function item_display(item, id, compare) {
    "use strict";
    if (!item){
        return "You have nothing equiped in this slot.";
    }
    var attributes_names = ["Strength", "Stamina", "Agility", "Charisma", "Intelligence", "Damage"],
    itemtypes = ["equiped_weapon", "equiped_chest", "equiped_boots", "equiped_helm", "equiped_hands"],
    attributes = "",
    compclass = "",
    value = String(item).split(";"),
    i = 1;
    compare = (player.len(itemtypes[value[9]]) > 0 ? player.arr(itemtypes[value[9]])[8] : 0);
    attributes = (value[9]===0?"<div class='extra-object " +(compare?(compare<value[7]?"better":"worse"):"")+ "'>Damage " +value[7]+ "(+ " +value[6]+ ")</div>":"<div class='extra-object " +(compare<value[7]?"better":"worse")+ "'>Armor " +value[7]+ "</div>");
    var b = (value[9]===0?6:7);
    for(i;i<b;i++) {
        if (value[i]>0) {
            compare = (player.len(itemtypes[value[9]]) > 0 ? player.arr(itemtypes[value[9]])[i]:0);
            if (compare===value[i]) { compclass = ""; }
            if (compare<value[i]) { compclass = "better"; }
            if (compare>value[i]) { compclass = "worse"; }
            attributes += (attributes.length>0?"":"")+ "<div class='extra-object " +(compare?compclass:"")+ "'>" +attributes_names[i-1]+ " + " +value[i]+ "</div>";
        }
    }                
    var raritycolor = Math.floor(value[8]/33.4);
        return "<div class='name r" +raritycolor+ "'>" +value[0]+ " ilvl " +value[10]+ "</div><div class='extra'>" +attributes+ "</div>" +(id||id===0? "<button onclick='equip_item(" +id+ ")' class='item-equip-button'>Equip</button>" : "");
}

function handleDragOver(evt) {
    "use strict";
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function action_bar(x) {
    "use strict";
    var out="",
        buttons = ["Travel", "vendor", "dwelling", "Sell Items", "Buy Items", "Sleep", "Leave", "Gabmle", "Travel", "Event", "Attack", "Escape"],
        buttons_function_name = ["explore", "vendor", "buy_dwelling", "sell_item_menu", "vendor", "player_sleep", "go2base", "gamble", "go2location", "event", "combat.playerattack", "combat.esacape"];
    $.each(x.split(","), function (index, value) {
        if(typeof parseInt(value.split(";")[0]) !== "number") {
            value = $.inArray(String(value).split(";")[0], buttons_function_name) + (String(value).split(";")[1] ? ";" + String(value).split(";")[1] : "") + (String(value).split(";")[2] ? ";" + String(value).split(";")[2] : "");
        }
        out += "<button onclick='" + buttons_function_name[value.split(";")[0]] + "(" + (value.split(";")[1] ? value.split(";")[1] : "") + ")'>" + (value.split(";")[2] ? value.split(";")[2] : buttons[value.split(";")[0]]) + "</button>";
    });
    $("#action_control").html(out);
}

function change_clock_type() {
    "use strict";
    if (player.get("twelvehourclock") === 0) {
        player.set("twelvehourclock", 1);
        clock(0);
    } else {
        player.set("twelvehourclock", 0);
        clock(0);
    }
}

function clock(t) {
    "use strict";
    var time = Math.floor(parseInt(player.get("time") + t, 10) / 24),
    out;
    time = Math.floor(parseInt(player.get("time") + t, 10) - (time * 24));
    player.change("time", parseInt(t, 10));
    if (player.get("twelvehourclock") === 1) {
        out = (time > 12 ? parseInt(time-12) + ":00 PM" : time + ":00 AM");
    } else {
        out = (time < 10 ? "0" + time : time) + ":00";
    }
    $(".time").text(out);
    $(".day").text(Math.floor(player.get("time")/24));
}

function player_sleep(definedtime) {
    "use strict";
    var energy_per_hour = 12,
        health_percent_per_hour = 0.07,
        mana_percent_per_hour = 0.07,
        timeslept,
        out = "";

        if (!definedtime) {
            if(player.get("energy")===player.get("energyMax")&&player.get("health")===player.get("healthMax")&&player.get("mana")===player.get("manaMax")) {
                out += "You try to sleep, but in vain. All of your stats are as good as they ever are going to be.";
            } else {
            out += "<h2>Camp</h2>";
            if ((player.get("energyMax") - player.get("energy")) / energy_per_hour < 8&&player.get("health")===player.get("healthMax")&&player.get("mana")===player.get("manaMax")) {
                timeslept = Math.floor((player.get("energyMax") - player.get("energy")) / energy_per_hour );
                energy(player.get("energyMax"));
                out += "You slept for " + timeslept + " hour(s), restoring your all of your energy.";
            } else {
                timeslept = 8;
                energy(energy_per_hour * timeslept);
                out += "You slept for 8 hours restoring " + energy_per_hour * 8 + " energy.";
            } /*  Make sure the player doesn't sleep for a really long time if energy is high.  */
            clock(timeslept);
            trigger_effect("health;" + timeslept * (player.get("healthMax") * health_percent_per_hour));
            trigger_effect("mana;" + timeslept*(player.get("manaMax")*mana_percent_per_hour));
            out += "<br>You restored " +Math.floor(timeslept*(player.get("manaMax")*mana_percent_per_hour))+ " mana, ";
            out += Math.floor(timeslept*(player.get("healthMax")*health_percent_per_hour))+ " health, while sleeping.</br>";
            }
            $("#content").html(out);
        }else{
            timeslept = definedtime;
            clock(timeslept);
            energy(energy_per_hour * timeslept);
            trigger_effect("health;" + timeslept * (player.get("healthMax") * health_percent_per_hour));
            trigger_effect("mana;" + timeslept*(player.get("manaMax")*mana_percent_per_hour));
        }
}
