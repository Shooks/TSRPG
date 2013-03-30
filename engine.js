var Library = (function() {
/*
This function is where all the data from data.xml is saved and retrived. In an array (lib), with many array in it (eg. event_name, feat_description).
Get will ask for a key and an index, KEY specifies what array you are after and INDEX specifies what part of the array you want.
If INDEX is not defined it will output the entire array that KEY specified.
*/
    var lib = ["event_name", "event_text", "event_effects", "event_buttons", "event_requirements", "event_maxrun", "event_loot", "location_name", "location_description",
               "location_threat", "location_ontravel", "location_enemies", "location_event", "location_discover", "location_master", "location_startwith",
               "location_buttons", "location_children", "enemy_name", "enemy_health", "enemy_minlevel", "enemy_maxlevel", "enemy_damage", "enemy_event",
               "enemy_gender", "enemy_onloss", "enemy_description", "enemy_onwin", "enemy_onmaxlust", "enemy_loot", "enemy_hitchance", "enemy_critchance",
               "enemy_critmultiplier", "enemy_attacks", "item_name", "item_price", "item_event", "item_use", "item_attribute", "item_itemlevel", "item_rarity",
               "item_type", "feat_name", "feat_effect", "feat_description", "character_name", "character_event", "character_gender", "character_talks",
               "origin_description", "origin_effect", "vendor_name", "vendor_text", "vendor_sell", "attack_name", "attack_description", "attack_basedamage", "attack_multipliers"];
    $.each(lib, function(index, value) {
        lib[value] = [];
    });
    return{
        get: function(key, index) {
            if(index || lib[key][index] || index === 0) {
                return lib[key][index];
            }else if(!index && lib[key] !== "undefined") {
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
    var itemId = [], i = 0, use, effects, discoverables, enemies, but, temp, req, event, placeinarr, id, name,
        gender, startw, children, onloss, onwin, sell, loot, description, talk, multi, atks, atr,
        tags = ["items item", "locations location", "data > enemies enemy", "data > events event", "data > feats feat", "data > characters character", "data > origins origin", "data > vendors vendor", "data > attacks attack"],
        valid_buttons = ["playerEvent.trigger", "go2location", "combat.trigger", "gamble", "vendor", "playerMagic.learn", "go2base"], debug = "",
        valid_genders = ["male", "female", "herm"],
        valid_req = ["health", "mana", "strength", "stamina", "agility", "intelligence", "charisma", "libido", "energy", "lust" ,"origin", "location", "level", "height", "luck", "barter", "fertility_multiplier", "coin_find_multiplier", "item_find_multiplier", "potion_potency", "experience_multiplier", "genital_growth_multiplier", "hitchance", "enemy_spawn_multiplier"],
        valid_effects = ["health", "mana", "experience", "libido", "strength", "stamina", "agility", "intelligence", "charisma", "energy", "lust", "height", "eyecolor", "haircolor", "bodytype", "skincolor", "luck", "barter", "fertility_multiplier", "coin_find_multiplier", "item_find_multiplier", "potion_potency", "experience_multiplier", "genital_growth_multiplier", "hitchance", "enemy_spawn_multiplier"],
        valid_effectspercent = ["health", "mana", "experience"];
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
            gender = "";
            startw = "";
            children = "";
            onloss = "";
            onwin = "";
            sell = "";
            onmaxlust = "";
            loot = "";
            talk = "";
            multi = "";
            atks = "";
            atr = ["0","0","0","0","0","0","0","0"];
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
            name = $(this).find("name").text();
            description = ($(this).find("description").text() ? $(this).find("description").text().replace(/,/g, "&#044;") : "");
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
                event += (event.length > 0 ? "," : "") + ($(v).text() ? $(v).text().replace(/,/g, "") : "") + ";" + ($(v).attr("chance") ? $(v).attr("chance").replace(/,/g, "") : "100");
            });

            $(this).find("requirements requirement").each(function(x, v) {
                if($.inArray($(this).attr("type"), valid_req) !== -1) {
                    req += (req.length > 0 ? "," : "") + $(this).attr("type") + ";" + ($(this).text() ? $(this).text().replace(/,/g, "") : "") + ";" +  ($(this).attr("operator") ? $(this).attr("operator").replace(/,/g, "") : "=");
                }
            });
            
            $(this).find("buttons button").each(function() {
                        placeinarr = $.inArray($(this).attr("type"), valid_buttons);
                        if(placeinarr !== -1) {
                            but += (but.length > 0 ? "," : "") + valid_buttons[placeinarr] + ";" + ($(this).attr("id") ? $(this).attr("id").replace(/,/g, "") : "") + ";" + ($(this).text() ? $(this).text().replace(/,/g, "") : "");
                        }
            });
            $(this).find("attacks attack").each(function() {
                atks += (atks.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("chance") ? $(this).attr("chance") : "100");
            });
            $(this).find("talks talk").each(function() {
                talk += (talk.length > 0 ? "," : "") + $(this).text().replace(/,/g, "&#044;") + "§" + ($(this).attr("relation") ? $(this).attr("relation") : "");
            });
            $(this).find("children child").each(function() {
                children += (children.length > 0 ? "," : "") + $(this).text().replace(/,/g, "&#44;");
            });
            $(this).find("multipliers multiplier").each(function() {
                multi += (multi.length > 0 ? "," : "") + $(this).attr("type") + ";" + $(this).text();
            });
            $(this).find("loot item").each(function() {
                loot += (loot.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("chance") ? $(this).attr("chance") : "50") + ";" + ($(this).attr("minlevel") ? $(this).attr("minlevel") : "0") + ";" + ($(this).attr("maxlevel") ? $(this).attr("maxlevel") : "0");
            });
            $(this).find("sell item").each(function() {
                sell += (sell.length > 0 ? "," : "") + $(this).text();
            });
            $(this).find("onloss event").each(function() {
                onloss += (onloss.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("name") ? $(this).attr("name") : "");
            });
            $(this).find("onwin event").each(function() {
                onwin += (onwin.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("name") ? $(this).attr("name") : "");
            });
            $(this).find("onmaxlust event").each(function() {
                onmaxlust += (onmaxlust.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("name") ? $(this).attr("name") : "");
            });
            $(this).find("attributes attribute").each(function() {
                atr[$(this).attr("type")] = $(this).text();
            });

            if(index === 0) {
                if(name, $(this).find("price").text()) {
                    Library.set("item_name", id, name);
                    Library.set("item_price", id, $(this).find("price").text());
                    Library.set("item_use", id, use);
                    Library.set("item_event", id, event);
                    Library.set("item_attribute", id, String(atr).replace(/,/g, ";"));
                    Library.set("item_rarity", id, ($(this).find("rarity").text() ? $(this).find("rarity").text() : 0));
                    Library.set("item_itemlevel", id, ($(this).find("ilvl").text() ? $(this).find("ilvl").text() : 0));
                    Library.set("item_type", id, ($(this).find("type").text() ? $(this).find("type").text() : 0));
                } else {
                    if(debug) {
                        console.log("XMLParser: Item must contain Name and Price.");
                    }
                }
            } else if (index === 1) {
                if(name && $(this).find("onTravel").text() && $(this).find("threat").text()) {
                    startw = $(this).find("startwith").text();
                    $(this).find("discoverable discover").each(function (x, v) {
                        discoverables += (discoverables.length > 0 ? "," : "") + $(v).text() + ";" + ($(v).attr("chance") ? $(v).attr("chance") : -1);
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
                    Library.set("location_startwith", id, startw);
                    Library.set("location_buttons", id, but);
                    Library.set("location_children", id, children);
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
                    Library.set("enemy_onloss", id, onloss);
                    Library.set("enemy_onwin", id, onwin);
                    Library.set("enemy_onmaxlust", id, onmaxlust);
                    Library.set("enemy_loot", id, loot);
                    Library.set("enemy_description", id, description);
                    Library.set("enemy_hitchance", id, $(this).find("hitchance").text());
                    Library.set("enemy_critchance", id, $(this).find("critchance").text());
                    Library.set("enemy_minlevel", id, $(this).find("minlevel").text());
                    Library.set("enemy_maxlevel", id, $(this).find("maxlevel").text());
                    Library.set("enemy_attacks", id, atks);
                } else {
                    if(debug) {
                        console.log("XMLParser: Enemy must contain Name, Health and Damage.");
                    }
                }
            } else if (index === 3) {
                if(name && $(this).find("text").text()) {
                    Library.set("event_name", id, name);
                    Library.set("event_text", id, $(this).find("text").text());
                    Library.set("event_effects", id, use);
                    Library.set("event_buttons", id, but);
                    Library.set("event_requirements", id, req);
                    Library.set("event_maxrun", id, ($(this).find("maxrun").text() ? $(this).find("maxrun").text() : -1));
                } else {
                    if(debug) {
                        console.log("XMLParser: Event must contain Name and Text.");
                    }
                }
            } else if (index === 4) {
                if(name && $(this).find("description").text() && use) {
                    Library.set("feat_name", id, name);
                    Library.set("feat_description", id, description);
                    Library.set("feat_effect", id, use);
                } else {
                    if(debug) {
                        console.log("XMLParser: Special must contain Name, Description and Effects.");
                    }
                }
            } else if (index === 5) {
                if(name) {
                    Library.set("character_name", id, name);
                    Library.set("character_event", id, event);
                    Library.set("character_gender", id, $(this).find("cgender").text());
                    Library.set("character_talks", id, talk);
                } else {
                    if(debug) {
                        console.log("XMLParser: Character must contain Name.");
                    }
                }
            } else if (index === 6) {
                if($(this).find("description").text()) {
                    Library.set("origin_description", id, description);
                    Library.set("origin_effect", id, use);
                } else {
                    if(debug) {
                        console.log("XMLParser: Origin must contain Description.");
                    }
                }
            } else if (index === 7) {
                if(name) {
                    Library.set("vendor_name", id, name);
                    Library.set("vendor_text", id, $(this).find("text").text());
                    Library.set("vendor_sell", id, sell);
                } else {
                    if(debug) {
                        console.log("XMLParser: Vendor must contain Name.");
                    }
                }
            } else if (index === 8) {
                if(name, $(this).find("basedamage").text()) {
                    Library.set("attack_name", id, name);
                    Library.set("attack_basedamage", id, $(this).find("basedamage").text());
                    Library.set("attack_multipliers", id, multi);
                    Library.set("attack_description", id, description);
                } else {
                    if(debug) {
                        console.log("XMLParser: Attack must contain Name and Base Damage.");
                    }
                }
            }
        });
    });
}

function update_startwith() {
    $.each(Library.get("location_startwith"), function(index, value) {
        if(value) {
            if($.inArray(String(index), player.get("locationsdiscovered").split(",")) === -1) {
                player.add("locationsdiscovered", index);
            }
        }
    });
}

var player = (function () {
/*
Here we store all the player related stuff. It's also used for retriving stuff with GET.
*/
    var stats = {},
        key,
        changeExceptions = ["health", "mana", "energy", "lust"],
        maxValue = ["healthMax", "manaMax", "energyMax", "lustMax"],
        numInArr,
        tmpArr,
        newVal;
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
    stats.feat = 0;
    stats.difficulty = 1;
    stats.name = "";
    stats.surname = "";
    stats.events = "";
    stats.location = 0;
    stats.money = 0;
    stats.inventory = "";
    stats.mana = 20;
    stats.manaMax = 20;
    stats.twelvehourclock = 0;
    stats.time = 0;
    stats.customitems = "";
    stats.bgcolorsetting = "";
    stats.locationsdiscovered = "";
    stats.placesdiscovered = "0";
    stats.equiped_weapon = "";
    stats.equiped_helm = "";
    stats.equiped_chest = "";
    stats.equiped_boots = "";
    stats.equiped_hands = "";
    stats.barter = 1;
    stats.damage = 1;
    stats.armor = 1;
    stats.potion_potency = 1;
    stats.height = 1;
    stats.coin_find_multiplier = 1;
    stats.item_find_multiplier = 1;
    stats.fertility_multiplier = 1;
    stats.experience_multiplier = 1;
    stats.enemy_spawn_multiplier = 1;
    stats.luck = 1;
    stats.genital_growth_multiplier = 1;
    stats.event_data_maxrun = "";
    stats.eyecolor = "";
    stats.magic = "";
    stats.hitchance = 60;
    stats.character_data_relation = "";
    stats.featpoints = 0;

    return {
        allNames: function() {
            var temp = "";
            $.each(stats, function(index, value) {
                    temp += (temp.length > 0 ? "," : "") + index;
            });
            return temp.split(",");
        },
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
            if(key === "location") {
                if(value === -1) {
                    $(".stat .location").text("Camp");
                } else {
                    $(".stat .location").text(Library.get("location_name", value));
                }
            } else if(key === "money") {
                $(".stat .money").text(getPrice.preview(stats["money"]));
            }
        },
        changeFloat: function (key, value) {
            if(stats[key] === "undefined") {
                return false;
            }
            newVal = String(parseFloat(stats[key]) + parseFloat(value)).split(".");
            stats[key] = parseInt(newVal[0]) + (newVal[1] ? "." + parseInt(newVal[1].slice(0, 2)) : "");
            if (stats[key] < 0) {
                stats[key] = 0;
            }
            player.update_stats();
            if($.inArray(key, changeExceptions) !== -1) {
                numInArr = $.inArray(key, changeExceptions);
                if(stats[key] > stats[maxValue[numInArr]]) {
                    stats[key] = stats[maxValue[numInArr]];
                }
            }
            $(".stat ." + key).text(stats[key]);
            if(key === "money") {
                $(".stat .money").text(getPrice.preview(stats["money"]));
            }
        },
        changeInt: function (key, value) {
            if(stats[key] === "undefined") {
                return false;
            }
            stats[key] = parseInt(stats[key], 10) + parseInt(value, 10);
            if (stats[key] < 0) {
                stats[key] = 0;
            }
            player.update_stats();
            if($.inArray(key, changeExceptions) !== -1) {
                numInArr = $.inArray(key, changeExceptions);
                if(stats[key] > stats[maxValue[numInArr]]) {
                    stats[key] = stats[maxValue[numInArr]];
                }
            }
            $(".stat ." + key).text(stats[key]);
            if(key === "money") {
                $(".stat .money").text(getPrice.preview(stats["money"]));
            }
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
                var checklist = player.allNames(),
                i;
              for (i = 0; i < checklist.length; i++) {
                    player.set(checklist[i], (localStorage.getItem(checklist[i])?Base64.decode(String(localStorage.getItem(checklist[i]))):""));
                    $(".stat ." + checklist[i]).text(stats[checklist[i]]);
                }
                update_startwith();
            }
            go2base();
        }
    };
}());

var tempcustomitem = "",
    currentSmallWindow = "",
    page_settings_colors = ["#468966","#FFF0A5", "#FFB03B", "#B64926", "#8E2800", "#39322f", "#94bce0", "#466fb0", "#5c3547", "#ffffff", "#cec5c2", "#323233"];

    
var playerMagic = (function() {
    var magic = ["name", "attack_description", "base_damage", "critical_chance", "critical_multiplier", "base_mana"]
    magic["name"] = ["Fireball", "Blazing Hands", "Ice Blast", "Frost Spike", "Sparks", "Lightning"];
    magic["attack_description"] = ["You conjure a fireball into existance between your hands and throw it at %e for %d damage", "Fire spew from your hands, engulfing %e in flames, dealing %d damage.",
                           "You charge up and release a powerful blast of ice on %e for %d damage.", "Your form a spike of ice with your hands and shoot it at %e for %d damage.",
                           "Electricity shoots out of your finger tips, shocking %e for %d damage.", "You charge up electricity and release a thunderbolt at %e for %d damage."],
    magic["base_damage"] = [5, 3, 4, 6, 2, 5];
    magic["critical_chance"] = [15, 20, 15, 15, 50, 15];
    magic["critical_multiplier"] = [2, 1.5, 1.5, 2, 1.3, 2];
    magic["base_mana"] = [5, 4, 5, 5, 3, 5];
    return {
        get: function(key, index) {
            if(!magic[key]) {
                return false;
            }
            return magic[key][index];
        },
        learn: function(id) {
            if($.inArray(id, player.get("magic").split(",")) !== -1) {
                player.add("magic", id);
            }
        }
    }
}());

$(document).ready(function () {
  "use strict";
    $.ajax({
    url: "data.xml"
    }).done(function(data) {
        xmlparser($(data).find("data"));
        startgame();
    });
    
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

var character = (function() {
    var out, relation = 0;
    
    return {
        trigger: function(id) {
            var but = "";
            relation = -1;
            out = "<h2>" + Library.get("character_name", id) + "</h2>";
            $("#content").html(out);
            $.each(player.get("character_data_relation").split(","), function(index, value) {
                if(parseInt(value.split(";")[0], 10) === id) {
                    relation = value.split(";")[1];
                }
            });
            if(relation === -1) {
                player.add("character_data_relation", id + ";0");
            }
            actionBar.set("character.talk;" + id + ",go2base");
        },
        talk: function(id) {
            var evt = [],i = 0;
            relation = 0;
            out = "<h2>" + Library.get("character_name", id) + "</h2>";
            if(Library.get("character_talks", id)) {
                $.each(player.get("character_data_relation").split(","), function(index, value) {
                    if(parseInt(value.split(";")[0], 10) === id) {
                        relation = value.split(";")[1];
                    }
                });
                $.each(Library.get("character_talks", id).split(","), function(index, value) {
                    if(parseInt(value.split("§")[1], 10) <= relation) {
                        evt[i++] = value.split("§")[0];
                    }
                });
            }
            if(evt) {
                    shuffle(evt);
                    out += evt[0];
                } else {
                    out += Library.get("character_name", id) + " does not want to talk right now.";
                }
            $("#content").html(out);
        }
    }
}());

var playerEvent = (function() {
    var v1, v2, error;
    return {
        requirement: function(id) {
            if(Library.get("event_requirements", id)) {
            $.each(String(Library.get("event_requirements", id)).split(","), function(index, value) {
                v1 = value.split(";")[0];
                v2 = value.split(";")[1];
                error = 0;
                    switch(value.split(";")[2]) {
                        case "=":
                            if(player.get(v1) !== v2) {
                                error = 1;
                            }
                        break;
                        case ">":
                            if(v2 > player.get(v1)) {
                                error = 1;
                            }
                        break;
                        case "<":
                            if(v2 < player.get(v1)) {
                                error = 1;
                            }
                        break;
                    }
                });
            }
            if(error === 1) {
                return false;
            } else {
                return true;
            }
        },
        trigger: function(id) {
            if(Library.get("event_name", id) === false) {
                return false;
            }
            if(Library.get("event_maxrun", id) && Library.get("event_maxrun", id) !== "-1") {
                var playerHasMaxrun = 0;
                $.each(player.get("event_data_maxrun").split(","), function(index, value) {
                    if(String(id) === value.split(";")[0]){ playerHasMaxrun = [1, value.split(";")[1], index]; }
                });
                if(playerHasMaxrun !== 0) {
                    if(playerHasMaxrun[1] >= Library.get("event_maxrun", id)) {
                        return false;
                    }
                    player.remove("event_data_maxrun", playerHasMaxrun[2]);
                    player.add("event_data_maxrun", id + ";" + (parseInt(playerHasMaxrun[1], 10) + 1));
                } else {
                    player.add("event_data_maxrun", id + ";" + 1);
                }
            }
            var tmp, but = "";
            if(Library.get("event_effects", id)) {
                 $.each(String(Library.get("event_effects", id)).split(","), function(index, value) {
                    trigger_effect(value);
                 });
            }
            if(playerEvent.requirement(id) === false) { return false; }
            $("#content").html("<h2>" + Library.get("event_name", id) + "</h2><div class='longtext'>" + Library.get("event_text", id).replace(/\n/, "<br/>") + "</div>");
            if(Library.get("event_buttons", id)) {
                $.each(Library.get("event_buttons", id).split(","), function(index, value) {
                    but += (but.length > 0 ? "," : "") + value.split(";")[0] + ";" + value.split(";")[1] + (value.split(";")[2] ? ";" + value.split(";")[2] : "");
                });
                actionBar.set(but);
            } else {
                actionBar.set("go2base");
            }
        },
        random: function(arr) {
            //Arr should be formed like event_id;chance. Chance(default to 100) is optional.
            if(typeof arr !== "object") {
                return false;
            }
            var chanceArr = [], i = 0, id, chance;
            $.each(arr, function(index, value) {
                id = value.split(";")[0];
                chance = parseInt((value.split(";")[1] ? value.split(";")[1] : 100), 10);
                if(Library.get("event_name", id) && playerEvent.requirement(id) === true) {
                    if(Library.get("event_maxrun", id) !== "-1") {
                        var playerHasMaxrun = 0;
                        $.each(player.get("event_data_maxrun").split(","), function(x, v) {
                            if(String(id) === v.split(";")[0]){ playerHasMaxrun = [1, v.split(";")[1], x]; }
                        });
                        if(playerHasMaxrun === 0 || playerHasMaxrun[1] < Library.get("event_maxrun", id)) {
                            if(chance > Math.ceil(Math.random()*100)) {
                                chanceArr[i++] = id;
                            }
                        }
                    } else {
                        if(chance > Math.ceil(Math.random()*100)) {
                            chanceArr[i++] = id;
                        }
                    }
                }
            });
            if(chanceArr.length > 0) {
                playerEvent.trigger(shuffle(chanceArr)[0]);
            } else {
                return false;
            }
        }
    }
}());

function equip_item(custom_item_id, unequip) {
    "use strict";
    
    var pItemName = ["equiped_weapon", "equiped_chest", "equiped_boots", "equiped_helm", "equiped_hands"];
    if(unequip) {
        var item = player.get(pItemName[custom_item_id]);
    } else {
        var item = player.arr("customitems", ",")[custom_item_id];
        player.remove("customitems", custom_item_id);
    }
    var olditem = "", itemtype = parseInt(item.split(";")[9], 10);

    $.each(pItemName, function(index, value) {
        if(index === itemtype) {
            if(unequip) {
                olditem = item;
                player.set(value, "");
            } else {
                olditem = player.get(value);
                player.set(value, item);
            }
        }
    });

    /*  Strength, Stamina, Agility, Charisma, Intelligence, Damage  */
    if (olditem.length > 0) {
        player.add("customitems", olditem);
        olditem = olditem.split(";");
        player.changeInt("strength", -olditem[1]);
        player.changeInt("stamina", -olditem[2]);
        player.changeInt("agility", -olditem[3]);
        player.changeInt("charisma", -olditem[4]);
        player.changeInt("intelligence", -olditem[5]);
        player.changeInt("damage", -olditem[6]);
    }
    if(!unequip) {
        item = item.split(";");
        player.changeInt("strength", item[1]);
        player.changeInt("stamina", item[2]);
        player.changeInt("agility", item[3]);
        player.changeInt("charisma", item[4]);
        player.changeInt("intelligence", item[5]);
        player.changeInt("damage", item[6]);
    }

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
        player.set("strength", 1);
        player.set("intelligence", 1);
        player.set("charisma", 1);
        player.set("agility", 1);
        player.set("stamina", 1);
        player.set("skillpoint", 10);
        player.set("level", 1);
        $("#ng_finish_button").attr({"class": "", "disabled": "disabled"})
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
    var multiplier = 196/100,
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
    $('.charactername').text(player.get("name") + (player.get("surname") !== "undefined" ? "" + player.get("surname") : ""));
    clock(0);
    playerXP.add(0);
    $(".stat .money").text(getPrice.preview(player.get("money")));
}

function item_description(id) {
    "use strict";
    var out = "", val;
    var verb = [];
        verb.health = "Restores";
        verb.mana = "Restores";
    if (Library.get("item_use", id) !== "undefined"){
        $.each(Library.get("item_use", id).split(","), function (index, value) {
            val = value.split(";")[1];
            if(verb[value.split(";")[0]] !== "undefined") {
                out += verb[value.split(";")[0]] + " " + val.replace(/%/, "") * player.get("potion_potency") + (value.slice(value.length-1) === "%" ? "%" : "") + " " + value.split(";")[0] + ".";
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
                player.changeInt(tmp, parseInt(player.get(tmp + "Max") * (value.replace(/%/, "") / 100) * (ispotion ? pp : 1), 10));
            } else {
                player.changeInt(tmp, value.replace(/%/, "") * (ispotion ? pp : 1));
            }
            if($.inArray(tmp, valueswithmeter) !== -1) {
                meter("#" + tmp, player.get(tmp), player.get(tmp + "Max"));
            }
        } else {
            playerXP.add(value.replace(/%/, ""));
        }
}

var playerXP = (function() {
    var counter = 1;

    return {
        add: function(value) {
            player.changeInt("experience", parseInt(value, 10) * player.get("experience_multiplier"));
            while (player.get("experience") >= player.get("experienceMax")) { /*  Level up  */
                player.changeInt("level", 1);
                player.changeInt("skillpoint", 5);
                player.changeInt("experience", -player.get("experienceMax"));
                $(".level").text(player.get("level"));
                $(".skillpoint").text(player.get("skillpoint"));
                player.set("experienceMax", 150 * player.get("level"));
                if(counter === 5) {
                    player.changeInt("featpoints", 1);
                    counter = 1;
                } else {
                    counter++;
                }
            }
            meter('#experience',player.get("experience"), player.get("experienceMax"));
        }
    }
}());

var SkillSelect = function (element) {
    "use strict";
    var atr = {};
    atr.strength = 0,
    atr.intelligence = 0,
    atr.agility = 0,
    atr.charisma = 0,
    atr.stamina = 0,
    atr.skillpoint = 0;
    atr.featpoints = 0;
    var evt = [];
    return {
        set : function(key, value) {
            if(key === "event") {
                evt = value;
            } else {
                atr[key] = value;
            }
        },
        get: function(key) {
            if(key === "event") {
                return evt;
            } else {
                return atr[key];
            }
        },
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
            atr[key]++;
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
            $.each(evt, function(index, value) {
                $.each(Library.get("feat_effect", value).split(","), function(x, v) {
                    trigger_effect(v);
                });
            });
            player.savegame();
            initiate();
        }
    }
}

function masturbate() {
    var timePast = String(Math.random() * 2).slice(0, 3),
    out = "<h2>Camp</h2>You take " + timePast + " hours off and relieve yourself.";
    clock(timePast);
    $("#content").html(out);
    player.set("lust", 0);
    meter('#lust', player.get("lust"), player.get("lustMax"));
}

var NewGame = function () {
    var atr = ["gender", "bodytype", "haircolor", "skincolor", "origin", "feat", "difficulty", "name", "surname", "eyecolor", "height"], error;

    return {
        clear: function () {
            $.each(atr, function(index, value) {
                atr[value] = "";
            });
        },
        set : function (key, change) {
            atr[key] = change;
            error = 0;
            $.each(atr, function(index, value) {
                if(!atr[value] && atr[value] !== 0 && value !== "surname" && value !== "feat") { error = 1; }
            });
            
            if(error !== 1) {
                $('#ng_finish_button').removeAttr("disabled").addClass("focus");
            }
        },
        get: function (key) {
            if(!atr[key] && atr[key] !== 0) { return; }
            
            return atr[key];
        },
        save : function () {
            $.each(atr, function(index, value) {
                player.set(value, atr[value]);
            });
        $('#new_character').fadeOut(400);
        $('#main').fadeIn(600);
        $('#content').html("<span class='longtext'>" + Library.get("event_text", 0) + "</div>");
        actionBar.set("go2base;;Continue");
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
    update_startwith();
}

function popup(preset, title, desc) {
    "use strict";
    var popup_preset = [];
    popup_preset[1] = "Not enough coin|You do not have enough coin!";
    popup_preset[2] = "Exhausted|You are exhausted. You cannot preform any action requiring energy. Sleep or consume an energy potion to regain your energy.";
    popup_preset[3] = "Horny|You are too horny to do that.";
    popup_preset[4] = "Mana|You don't have enough mana to do that.";

    overlay("#popup");
    if (preset) {
        title = popup_preset[preset].split("|")[0];
        desc = popup_preset[preset].split("|")[1];
    }
    $("#popup").find("h2").text(title);
    $("#popup").find("span").text(desc);
}

function small_window(preset, custom, adinf = 0) {
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
            $("#spendpoints").show().find("h2").text(["Skill", "Feats"][adinf]);
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
            $("#spendfeatpoints_feats").html("");
            $.each(Library.get("feat_name"), function(index, value) {
                    $("<div/>", {
                    "class": "choice",
                    html: Library.get("feat_description", index)
                    }).appendTo("#spendfeatpoints_feats");
            });
            $(".featpointsremaining").text(skill.get("featpoints"));
            $("#spendfeatpoints_feats .choice").on("click", function() {
                var tmp = skill.get("event");
                if($.inArray(String($(this).index()), tmp) === -1 && skill.get("featpoints") > 0) {
                    tmp.splice(0, 0, String($(this).index()));
                    $(this).addClass("selected");
                    skill.set("featpoints", skill.get("featpoints") - 1);
                } else if($.inArray(String($(this).index()), tmp) !== -1){
                    $(this).removeClass("selected");
                    tmp.splice($.inArray(String($(this).index()), tmp), 1);
                    skill.set("featpoints", parseInt(skill.get("featpoints"), 10) + 1);
                } else {
                    return;
                }
                $(".featpointsremaining").text(skill.get("featpoints"));
                skill.set("event", tmp);
            });
            $("#skillfeat_slider").css("left", adinf * - 1020 + "px");
            $("#saveskillpoints").click(function() {
                skill.save();
                overlay("#small_window");
                localStorage.removeItem("tmp_feat");
            });
        break;
        case 'char':
            var out = "<div onclick=\"overlay('#small_window')\" class=\"close_button\">&#10006;</div>";
            show_character();
            currentSmallWindow = "#char";
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
    var tmp = "<h2>Exploration & Travel</h2>", risk = ["Very Low", "Low", "Medium", "High", "Very High"],
    exploration = "",
    travel = "";
    
    $.each(player.arr("locationsdiscovered", ","), function (index, value) {
        if (parseInt(Library.get("location_threat", value), 10) === 0){
            travel += "<div onclick='go2location(" + value + ")' class='list-object'>" + Library.get("location_name", value) + "</div>";
        }else{
            exploration += "<div onclick='go2location(" + value + ")' class='list-object'>" + Library.get("location_name", value) + "<span class='right'>Threat: " + risk[Math.floor(Library.get("location_threat", value) / 20)] + "</span></div>";
        }
    });
    
    tmp += "<div class='list-object-container '><h3>Exploration</h3>" + exploration + "</div>";
    tmp += "<div class='list-object-container '><h3>Travel</h3>" + travel + "</div>";
    $("#content").html(tmp);
}

function go2location(id) {
    //This is such a mess you shouldn't probably even look at it.
    "use strict";
    var temp, but = "", tmp, discoverId = false, discover = [], evt = [], i = 0;
        if(Library.get("location_event", id)) {
            $.each(Library.get("location_event", id).split(","), function(index, value) {;
               evt[i++] = value.split(";")[0] + ";" + value.split(";")[1];
            });
            if(playerEvent.random(evt) !== false) { return; }
        }
    if (parseInt(player.get("energy"), 10) - 8 < 0 && player.get("location") !== id) {
        popup(2);
        return;
    } /*  Not enough energy  */

    if (parseInt(player.get("lust"), 10) === parseInt(player.get("lustMax"), 10) && player.get("location") !== id) {
        popup(3);
        return;
    } /*  Not enough energy  */
    var timeSpent = Math.floor(Math.random()*5)+1,
        i, noadd = 0, noThreat = 0;
    if(player.get("location") !== id  && String(Library.get("location_threat", id)) === "0" || !Library.get("location_threat", id)) {
        timeSpent = 1;
        noThreat = 1;
    } else if (player.get("location") === id) {
        timeSpent = 0;
        noThreat = 1;
    }
    clock(timeSpent);
    player.set("location", id);
    player.changeInt("lust", 5 * timeSpent);
    meter('#lust', player.get("lust"), player.get("lustMax"));
    if (5 * timeSpent > player.get("energy")){ timeSpent = player.get("energy") / 10; }
    energy(-5 * timeSpent);
    if (Math.random() * (Library.get("location_threat", id) * player.get("enemy_spawn_multiplier")) > Math.floor(Math.random() * 100) && Library.get("location_enemies", id)) {
        var le = Library.get("location_enemies", id).split(",");
        combat.trigger(le[Math.floor( Math.random () * le.length )]); return;
    }
    var out = "<h2>" + Library.get("location_name", id) + "</h2><p>" + Library.get("location_ontravel", id) + "</p>";

    if (Library.get("location_discover", id)){
       $.each(Library.get("location_discover", id).split(","), function(index, value) {
            discover[index] = parseInt((value.split(";")[1] ? value.split(";")[1] : Math.random()*100), 10) + ";" + value.split(";")[0];
       });
       shuffle(discover);
       
       $.each(discover, function(index, value) {
            if(value.split(";")[0] > Math.random()*100) {
                discoverId = value.split(";")[1];
            }
       });
        if(discoverId) {
            if($.inArray(String(discoverId), player.get("locationsdiscovered").split(",")) === -1) {
                player.add("locationsdiscovered", discoverId);
                out += "You have discovered <b>" + Library.get("location_name", discoverId) + "</b>!<br/>";
            } else {
                discoverId = false;
            }
        }
    }

    out += "After " + timeSpent + " hour(s), you decide to head back to your camp.";
    if(Library.get("location_buttons", id)) {
        $.each(String(Library.get("location_buttons", id)).split(","), function(index, value) {
            tmp = value.split(";");
            but += (but.length > 0 ? "," : "") + tmp[0] + ";" + tmp[1] + (tmp[2] ? ";" + tmp[2] : "");
        });
    }
    if(Library.get("location_children", id)) {
        $.each(String(Library.get("location_children", id)).split(","), function(index, value) {
            if(Library.get("location_name", value)) {
                but += (but.length > 0 ? "," : "") + "go2location;" + value + ";" + Library.get("location_name", value);
            }
        });
    }
    if (Library.get("location_master", id)) {
        out += Library.get("location_description", id);
        actionBar.set((but ? but + "," : "") + "go2location;" + Library.get("location_master", id) + ",go2base");
    }else{
        actionBar.set((but ? but + "," : "") + "go2base");
    }
    $("#content").html(out);
}
function go2base() {
   "use strict";
    player.set("location", -1);
    var out = "<h2>Camp</h2><div id='shameless_ad'>Have any ideas for how to improve this game, or do you want to write stories, events, items and much more?<br/>Feel free to send <b>any</b> idea to <a href='mailto:voncarlsson@gmail.com'>voncarlsson(at)gmail(dot)com</a>.<br/>If you are confident with Github or like learning, then check out the projet page at <a href='http://www.github.com/voncarlsson/TSRPG' target='_blank'>http://www.github.com/voncarlsson/TSRPG</a>.</div>";
    actionBar.set("player_sleep,masturbate,explore");
    $("#content").html(out);
}

var combat = (function() {
    var e_id = 1, name, level, gender, health, health_max, combatlog = [], genders, total_damage = 0,
        player_damage, passouttime, coinlost, monster_value, tmp, critical, but = "", manause, attacks,
        enemy_hit_chance, enemy_crit_chance, enemy_min_damage, enemy_max_damage, enemy_damage, enemy_critchance,
        gender_name = ["Male", "Female", "Herm"], evt, enemy_attack;

    return {
        trigger: function(id) {
            if(!Library.get("enemy_name", id)) {
                return;
            }
            /*
            Load enemy info so combat can be had.
            */
            evt = "";
            combatlog = [];
            e_id = id;
            name = Library.get("enemy_name", e_id);
            level = Math.floor( parseInt(player.get("level"), 10) +(Math.random() * 3) );
            if(Library.get("enemy_minlevel", id)) {
                if(Library.get("enemy_minlevel", id) > level) {
                    level = Library.get("enemy_minlevel", id);
                }
            }
            if(Library.get("enemy_maxlevel", id)) {
                if(Library.get("enemy_maxlevel", id) < level) {
                    level = Library.get("enemy_maxlevel", id);
                }
            }

            //Enemy base health + ((base health / 2) * player level).
            health_max = Math.floor((parseInt(Library.get("enemy_health", e_id), 10) + (Library.get("enemy_health", e_id) / 8) * level) * player.get("difficulty"));
            health = health_max;

            genders = (!Library.get("enemy_gender", e_id) ? [0, 1, 2] : Library.get("enemy_gender", e_id).split(","));
            gender = genders[Math.floor(Math.random()*genders.length)];

            enemy_max_damage = Math.floor(parseInt(Library.get("enemy_damage", e_id), 10) + Math.floor((Library.get("enemy_damage", e_id) / 10) * level) * player.get("difficulty"));
            enemy_min_damage = Math.floor(enemy_max_damage * 0.90);
            difficulty = (enemy_max_damage / 4) + (health_max / 6);
            
            enemy_hit_chance = (Library.get("enemy_hitchance", id) ? Library.get("enemy_hitchance", id) : 75);
            enemy_crit_chance = (Library.get("enemy_critchance", id) ? Library.get("enemy_critchance", id) : 15);
            enemy_crit_multiplier = (Library.get("enemy_critmultiplier", id) ? Library.get("enemy_multiplier", id) : 1.5);

            var out = "<h2>" + level + " " + gender_name[gender] + " " + name + "<span class='right'><div id='chealth' class='meter_holder chealth'><div class='text'></div><div class='meter'></div></div></span></h2><div id='combat-log'></div>";
            $("#content").html(out);
            combat.log(Library.get("enemy_description", id));
            meter('#chealth', health, health_max, name);
            combat.playerturn();
        },
        playerattack: function() {
            critical = 0;
            total_damage = 0;
            energy(-4);
            player_damage = Math.floor((player.get("strength") * 0.30) + player.get("damage"));
            attacks = (player.get("agility") / 25 > 1 ? player.get("agility") / 25 : 1);
            for(i = 0;i < Math.ceil(attacks);i++) {
                if(player.get("hitchance") > Math.floor(Math.random() * 100)) {
                    if (Math.random() * 100 < (Math.random() * player.get("agility")) / 2.5) {
                        /* Critical Strike, 80% chance at 200 agility. */
                        player_damage = player_damage * 2;
                        critical = 1;
                    }
                    
                    total_damage += player_damage * (attacks - i > 1 ? 1 : attacks - i);
                }
            }
            total_damage = parseInt(total_damage, 10);
            health = parseInt(health, 10) - total_damage;
            meter('#chealth', health, health_max, name);
            combat.log("You attack " + name + (attacks > 1 ? " " + attacks + " times" : "") + " for " + total_damage + " health." + (critical === 1 ? " <b>Critical hit!</b>" : ""));
            if (health <= 0) {
                combat.win();
            } else {
                combat.enemyattack();
            }
        },
        playerUseMagic: function(magicId) {
            manause = parseInt(playerMagic.get("base_mana", magicId) * (player.get("intelligence") / 20 < 1 ? 1 : player.get("intelligence") / 20), 10);
            if(player.get("mana") < manause) {
                popup(4);
                return;
            }
            energy(-3);
            critical = 0;
            player_damage = parseInt(playerMagic.get("base_damage", magicId) * (player.get("intelligence") / 10 < 0.5 ? 0.5 : player.get("intelligence") / 10), 10);
            if (Math.random() * 100 < Math.random() * playerMagic.get("critical_chance", magicId)) {
                player_damage = player_damage * playerMagic.get("critical_multiplier", magicId);
                critical = 1;
            }
            health = parseInt(health, 10) - player_damage;
            player.changeInt("mana", -manause);
            meter('#chealth', health, health_max, name);
            meter("#mana", player.get("mana"), player.get("manaMax"));
            combat.log(playerMagic.get("attack_description", magicId).replace(/%e/g, name).replace(/%d/, player_damage) + (critical === 1 ? " <b>Critical hit!</b>" : ""));
            if (health <= 0) {
                combat.win();
            } else {
                combat.enemyattack(true);
            }
        },
        magic: function() {
            but = "";
                $.each(player.get("magic").split(","), function(index, value) {
                    but += (but.length > 0 ? "," : "") + "combat.playerUseMagic;" + value + ";" + playerMagic.get("name", value);
                });
            actionBar.set((but ? but + "," : "") + "combat.playerturn;;Return");
        },
        playerturn: function() {
            actionBar.set("combat.playerattack" + (player.get("magic") ? ",combat.magic" : "") + ",combat.escape");
        },
        enemyattack: function(wMagic) {
            enemy_critical = 0;
            enemy_attack = ["-1"];
            if(Library.get("enemy_attacks", e_id)) {
                $.each(Library.get("enemy_attacks", e_id).split(","), function (index, value) {
                    if(value.split(";")[1] > Math.floor(Math.random()*100)) {
                        enemy_attack[enemy_attack.length++] = value.split(";")[0];
                    }
                });
                shuffle(enemy_attack);
            }
            enemy_attack = enemy_attack[0];
            if(enemy_hit_chance > Math.floor(Math.random() * 100)) {
                if(enemy_attack === "-1") {
                    enemy_damage = Math.floor(Math.round(Math.random() * (enemy_max_damage - enemy_min_damage)) + enemy_min_damage);
                } else {
                    tmp = Library.get("attack_basedamage", enemy_attack);
                    if(Library.get("attack_multipliers", enemy_attack)) {
                        $.each(Library.get("attack_multipliers", enemy_attack).split(","), function(index, value) {
                            tmp = parseInt(tmp, 10) + (tmp * (player.get(value.split(";")[0]) * value.split(";")[1]));
                        });
                    }
                    enemy_damage = Math.floor(Math.round(Math.random() * (tmp - (tmp * 0.9) + (tmp * 0.9))));
                } 
                if(enemy_crit_chance > Math.floor(Math.random() * 100)) {
                    enemy_damage = Math.ceil(enemy_damage * enemy_crit_multiplier);
                    enemy_critical = 1;
                }
                trigger_effect("health;" + "-" + enemy_damage);
                if(enemy_attack === "-1") {
                    combat.log(name + " attacked you for " + enemy_damage + " damage." + (enemy_critical === 1 ? " <b>Critical hit!</b>" : ""));
                } else {
                    combat.log(Library.get("attack_description", enemy_attack).replace(/%[e|E]/, name).replace(/%[d|D]/, enemy_damage) + (enemy_critical === 1 ? " <b>Critical hit!</b>" : ""));
                }
            } else {
                combat.log(name + " missed.");
            }
            if (player.get("health") <= 0 || player.get("lust") === player.get("lustMax")){
                combat.lose();
            } else {
                if(wMagic) {
                    combat.magic();
                } else {
                    combat.playerturn();
                }
            }
        },
        escape: function() {
            energy(-10);
            if (Math.random()*(player.get("agility") * 2.66) > Math.random() * 100) {
                combat.log("You managed to escape unharmed.");
                actionBar.set("go2base");
            }else{
                combat.log("You try to run, but ultimately it's just a waste of breath. You quickly find yourself engaged in combat again.");
                actionBar.set("combat.enemyattack;;Next");
            }
        },
        win: function() {
            //Xp is the enemy level * the damage to health ratio, i.e. difficulty and then multiply that by 10, or it'd be really low.
            monster_value = difficulty * ((Math.random() * 1) + 1);
            playerXP.add(difficulty * 10);
            player.changeInt("money", monster_value);
            combat.log("You finish off " + name + ". On the body you find " + getPrice.preview(parseInt(monster_value, 10)) + ". You recive " + parseInt(difficulty * 10, 10) + " experience points.");
            if(Library.get("enemy_loot", e_id)) {
                $.each(Library.get("enemy_loot", e_id).split(","), function(index, value) {
                    console.log(value);
                    if(Math.ceil(Math.random() * 100) <= value.split(";")[1] && value.split(";")[2] < player.get("level") && value.split(";")[3] > player.get("level") || 0) {
                        combat.log("On the body you find "+ Library.get("item_name", value.split(";")[0]) + ".");
                        editinventory(value.split(";")[0], 1);
                    }
                });
            }
            if(Library.get("enemy_event", e_id)) {
                $.each(Library.get("enemy_event", e_id).split(","), function(index, value) {
                    evt[i++] = value.split(";")[0] + ";" + value.split(";")[1];
                });
                if(playerEvent.random(evt) !== false) { return; }
            } else if(Library.get("enemy_onwin", e_id)) {
                but = "";
                $.each(String(Library.get("enemy_onwin", e_id)).split(","), function(index, value) {
                    but += "playerEvent.trigger;" + value.split(";")[0] + ";" + value.split(";")[1]
                });
                actionBar.set("go2base," + but);
            } else {
                actionBar.set("go2base");
            }
        },
        lose: function() {
            if(player.get("lust") === player.get("lustMax") && Library.get("enemy_onmaxlust", e_id)) {
                $.each(Library.get("enemy_onmaxlust", e_id).split(","), function(index, value) {;
                    evt[i++] = value.split(";")[0] + ";" + value.split(";")[1];
                });
                if(playerEvent.random(evt) !== false) { return; }
            } else if(Library.get("enemy_onloss", e_id)) {
                $.each(Library.get("enemy_onloss", e_id).split(","), function(index, value) {;
                    evt[i++] = value.split(";")[0] + ";" + value.split(";")[1];
                });
                if(playerEvent.random(evt) !== false) { return; }
            } else {
                passouttime = parseInt(Math.random()*12, 10);
                coinlost = parseInt(player.get("money") * (Math.random() * 0.3), 10);
                combat.log("You pass out. You wake up " + passouttime + " hour" + (passouttime > 1 ? "(s)" : "") + " later. Missing " + getPrice.preview(coinlost) + ". You head back to camp, tail between your legs.");
                player.changeInt("money", -coinlost); // 0-30% of your total wealth is lost if you lose.
                player_sleep(passouttime);
                actionBar.set("go2base");
            }
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

var randomItem = (function() {
    "use strict";
    var GI_stat_name = ["Wrath", "the Bear", "agility", "charisma", "intelligence", "Pain", "Defence"],
    GI_weapon_names = ["Sword", "Dagger", "Axe", "Halberd", "Spear", "Gladius"],
    GI_chest_names = ["Tunic", "Doublet", "Coat", "Chain Mail", "Cuirass", "Plate Mail", "Harness", "Jacket"],
    GI_boots_names = ["Sandals", "Shoes", "Boots", "Chain Boots", "Sabatons", "Greaves", "Treads", "Spurs"],
    GI_helm_names = ["Hood", "Coif", "Cap", "Crown", "Helmet", "Mask", "Hat", "Bandana"],
    GI_gloves_names = ["Gloves", "Hide Gloves", "Chain Gloves", "Plate Gloves", "Gauntlets", "Grips", "Handwraps"],
    GI_rarity_names = ["Broken", "Cracked", "Damaged", "Rusty", "Poor", "Faulty", "Inferior", "Cheap", "Common", "Good", "Improved", "Superior",
                       "Fine", "Elegant", "Qualitative", "Masterful", "Perfect", "Heroic", "Epic", "Legendary", "Blessed", "Angelic", "Heavenly"];
    
    return {
        generate: function(itemtype) {
            var highest_value = "", itemtypename = "", x = 0, highest_value = 0, attributes, temp = [0, 1, 2, 3, 4, 5, 6, 7], attributes = [0, 0, 0 ,0, 0, 0, 0, 0];
            if (!itemtype && itemtype !== 0) { /*  Decides if it's a weapon or a piece of armor  */
                itemtype = Math.ceil(Math.random() * 4);
            }
            var itemtypebasearmor = [1, 1, 0.6, 0.8, 0.6],
                itemlowerlimit = player.get("level"),
                itemupperlimit = Math.round(player.get("level") * 1.5),
                rarity = Math.ceil(Math.random() * 200);
            if (Math.random() * 100 > 15 && rarity > 100) {
                rarity = Math.floor(rarity / 2);
            } /*  85% Chance that the rarity value will be cut by half.  */
            var itemvalue = Math.floor((Math.random() * itemupperlimit) * (rarity / 200) + itemlowerlimit),
                pointsleft = itemvalue,
                highest = 0,
                tmp;
            /*  Strength, Stamina, Agility, Charisma, Intelligence, Damage, Armor, level  */
            shuffle(temp);
            $.each(attributes, function (index) {
                if(index !== 7) {
                    if(itemtype === 0 && index !== 6) { /* We don't want weapons to have armor - at least not to have it generated. */
                        tmp = Math.round(Math.random() * pointsleft);
                        attributes[temp[x]] = tmp;
                        pointsleft -= tmp;
                        if (tmp > highest) {
                            highest = tmp;
                            highest_value = temp[x];
                        }
                        x++;
                    }
                }
            });

            if(pointsleft > 1) {
                attributes[Math.ceil(Math.random() * attributes.length - (itemtype === 0 ? 2 : 1))] += parseInt(pointsleft, 10);
            }

            switch(itemtype) {
                case 0:
                    itemtypename = GI_weapon_names[Math.floor(Math.random()*GI_weapon_names.length)];
                break;
                case 1:
                    itemtypename = GI_chest_names[Math.floor(Math.random()*GI_chest_names.length)];
                break;
                case 2:
                    itemtypename = GI_boots_names[Math.floor(Math.random()*GI_boots_names.length)];
                break;
                case 3:
                    itemtypename = GI_helm_names[Math.floor(Math.random()*GI_helm_names.length)];
                break;
                case 4:
                    itemtypename = GI_gloves_names[Math.floor(Math.random()*GI_gloves_names.length)];
                break;
            }
            var itemname = GI_rarity_names[Math.floor(rarity / (200 / GI_rarity_names.length))] + " " + itemtypename + " of " + GI_stat_name[highest_value];
            return itemname + ";" + String(attributes).split(",").join(";") + ";" + rarity + ";" + itemtype + ";" + itemvalue;
        },
        add2inventory: function(itemtype) {
            player.add("customitems", String(randomItem.generate(itemtype)));
        }
    }
}());

function accept_warning() {
    "use strict";
    localStorage.setItem("acceptwarning", true);
    overlay("#small_window", true);
}

function startgame() {
    "use strict";
    var ob, skill = new SkillSelect("#ng_skill_select"), difficulty_multiplier = [0.5, 0.75, 1, 1.25, 1.5];
    skill.updateAtr();
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
        ng.clear();
        $.each(Library.get("feat_name"), function(index) {
            $("<div/>", {
                "class": "choice",
                "html": Library.get("feat_description", index)
            }).appendTo("#ng_feat_select");
        });
        $(".featpointsremaining").text(5);
        $("#ng_gender_select .choice").on("click", function() {
        ng.set("gender", $(this).index());
        $("#ng_gender_select .choice").removeClass("selected");
        $(this).addClass("selected");
        });
        $("#ng_height_select .choice").on("click", function() {
        ng.set("height", $(this).attr("value"));
        $("#ng_height_select .choice").removeClass("selected");
        $(this).addClass("selected");
        });
        $("#ng_eyecolor_select .choice").on("click", function() {
        ng.set("eyecolor", $(this).text());
        $("#ng_eyecolor_select .choice").removeClass("selected");
        $(this).addClass("selected");
        });
        $("#ng_finish_button").click(function() {
            skill.save();
            ng.save();
            if(ng.get("feat")) {
                $.each(String(ng.get("feat")).split(","), function (index, value) {
                    $.each(String(Library.get("feat_effect", value)).split(","), function(x, v) {
                        trigger_effect(v);
                    });
                });
            }
            if(Library.get("origin_effect", ng.get("origin"))) {
                $.each(String(Library.get("origin_effect", ng.get("origin"))).split(","), function(index, value) {
                    trigger_effect(value);
                });
            }
            update_startwith();
        });
        $("#ng_difficulty_select .choice").on("click", function() {
            ng.set("difficulty", difficulty_multiplier[$(this).index()]);
            $("#ng_difficulty_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_feat_select .choice").on("click", function() {
            var tmp = (ng.get("feat") && ng.get("feat").length > 0 ? String(ng.get("feat")).split(",") : []);
            if($.inArray(String($(this).index()), tmp) === -1 && tmp.length < 5) {
                tmp.splice(0, 0, String($(this).index()));
                $(this).addClass("selected");
            } else if($.inArray(String($(this).index()), tmp) !== -1){
                $(this).removeClass("selected");
                tmp.splice($.inArray(String($(this).index()), tmp), 1);
            } else {
                return;
            }
            $(".featpointsremaining").text(5 - tmp.length);
            
            ng.set("feat", tmp);
        });
        $("#ng_skincolor_select .choice").on("click", function() {
            ng.set("skincolor", $(this).text());
            $("#ng_skincolor_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_bodytype_select .choice").on("click", function() {
            ng.set("bodytype", $(this).text());
            $("#ng_bodytype_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
        $("#ng_haircolor_select .choice").on("click", function() {
            ng.set("haircolor", $(this).text());
            $("#ng_haircolor_select .choice").removeClass("selected");
            $(this).addClass("selected");
        });
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
        $.each(Library.get("origin_description"), function (index) {
            ob="";
            if(Library.get("origin_effect", index)) {
                $.each(String(Library.get("origin_effect", index)).split(","), function (index, value){
                    ob += (index>0?" | ":"") + value.split(";")[0].replace(/_/g, "\s") + ": " + (value.split(";")[1] ? (value.split(";")[1] > 0 ? "+" : "") + value.split(";")[1] : "");
                });
            }
            $("<div/>", {
                "class" : "choice",
                "html" : "<span>" + Library.get("origin_description", index) + "</span><div class='origin_bonus'>" + ob + "</div>"
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
                ng.set("name", String($('#cname').val()));
            }, 10);
        });
        $('#surname').keyup(function () {
            document.getElementById("surname").value = document.getElementById("surname").value.replace(/[^A-Za-z]/g, "");
            setTimeout(function () {
                ng.set("surname", String($('#surname').val()));
            }, 10);
        });
    }
    preview_color(player.get("bgcolorsetting"));
    initiate();
}

var getPrice = (function() {
    "use strict";
    var copper = 0, silver = 0, gold = 0;
    return {
        plainBuy: function(n) {
            n = Math.ceil(n * ((100 - (player.get("charisma") / 2)) / 100) - (n * ("0." + player.get("barter"))));
            return (n > 0 ? n : 0);
        },
        plainSell: function(n) {
            n = getPrice.plainBuy(n);
            n = Math.ceil((n / 2) + (n * ("0." + player.get("barter"))));
            return (n > 0 ? n : 0);
        },
        preview: function(n) {
            gold = n / 1000;
            silver = (String(gold).split(".")[1] ? ("." + String(gold).split(".")[1]) * 10 : 0);
            copper = Math.floor(String(silver).split(".")[1] ? ("." + String(silver).split(".")[1]) * 100 : 0);
            return (parseInt(gold, 10) ? parseInt(gold, 10) + "g " : "") + (parseInt(silver, 10) ? parseInt(silver, 10) + "s " : "") + parseInt(copper, 10) + "c";
        },
        previewBuy: function(n) {
            n = getPrice.plainBuy(n);
            return getPrice.preview(n);
        },
        previewSell: function(n) {
            n = getPrice.plainSell(n);
            return getPrice.preview(n);
        }
    }
}());

function energy(nval) {
    "use strict";
    player.changeInt("energy", nval);
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
        var checklist = [],
            temp = evt.target.result.split("\n"), i = 0, error = "";
        
        $.each(player.allNames(), function(index, value) {
            checklist[index] = Base64.encode(value);
        });
        if(checklist.length > temp.length) {
            alert("Save file contains less information than expected. Savefile: " + checklist.length + ", Loadfile: " + temp.length);
            return;
        }
        for (i = 0; i < checklist.length; i++) {
            if (String(checklist[i]) !== String(temp[i].split(" ")[0])) {
                error += "\n" + Base64.decode(checklist[i]) + " != " + Base64.decode(temp[i].split(" ")[0]);
            }
        }
        if (error.length > 0) {
            alert(error + "\nThe save file is corrupt!\nIf you think it should work, try another version of the game.");
            return;
        }
        for (i = 0; i < checklist.length; i++) {
            player.set(Base64.decode(temp[i].split(" ")[0]), Base64.decode(temp[i].split(" ")[1]));
        }
        update_startwith();
        overlay("#small_window");
        finish_ng(1);
    };
    var blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

function vendor(id) {
    "use strict";
    if (!id && id !== 0 || !Library.get("vendor_name", id)) {
        return;
    }
    var tmp = "<h2>" + Library.get("vendor_name", id)  + "</h2><span class='notice'>" + Library.get("vendor_text", id) + "</span><p/>";
    if(Library.get("vendor_sell", id)) {
        $.each(Library.get("vendor_sell", id).split(","), function (index, value) {
            tmp += "<div onclick='buy_item(" +value+ ");' class='tradesquare'><span>" + Library.get("item_name", value) + "</span><span class='price'>" + getPrice.previewBuy(Library.get("item_price", value)) + "</span><span class='desc'>" + item_description(value) + "</span></div>";
        });
    }
    $("#content").html(tmp);
    actionBar.set("sell_item_menu;" +id+ ";Sell" + (player.get("location") !== -1 ? ",go2location;" + player.get("location") + ";Return" : "") + ",go2base;;Go to base");
}

function gamble(action) {
    "use strict";
    var out = "<h2>Gamble</h2>";
        out += "All of the prices are <b>" +getPrice.previewBuy(player.get("level")*200)+ "</b><p/><div id='gamble_buy' class='list-object-container'>";
        out += "<div class='list-object'>Buy Weapon</div><div class='list-object'>Buy Chest Piece</div><div class='list-object'>Buy Boots</div>";
        out += "<div class='list-object'>Buy Helmet</div><div class='list-object'>Buy Gloves</div></div><div id='bought-item' class='list-object-container'></div>";
        actionBar.set((player.get("location") !== -1 ? "go2location;" + player.get("location") + ";Return,go2base;;Go to base" : "go2base;;Go to base"));
        var attributes_names = ["Strength", "Stamina", "Agility", "Charisma", "Intelligence", "Damage"];
    $("#content").html(out);
    $("#gamble_buy").find(".list-object").click(function() {
        if(getPrice.plainBuy(player.get("level")*200) > player.get("money")) {
            popup(1);
            return;
        }
        var tempcustomitem = randomItem.generate($(this).index());
        $("<div />", {
            html: item_display(tempcustomitem),
            "class": "item"
        }).appendTo("#bought-item");
        player.add("customitems", String(tempcustomitem));
    });
}

function buy_item(id, amount) {
    "use strict";
    if (!amount){ amount = 1; }
    if (getPrice.plainBuy(Library.get("item_price", id)*amount)>player.get("money")){ popup(1); return; }
    player.changeInt("money",-getPrice.plainBuy(Library.get("item_price", id)));
    editinventory(id, amount);
}

function sell_item_menu(id) {
    "use strict";
    var out="<h2>Sell Items</h2>";
    if (player.len("inventory") <= 0){ out+="Your inventory is empty!"; }else{
        $.each(player.arr("inventory", ","), function (index, value) {
            out += "<div onclick='sell_item(" +value.split(";")[0]+ ")' class='tradesquare'><span>" + Library.get("item_name", value.split(";")[0]) + "</span><span class='price'>" + getPrice.previewSell(Library.get("item_price", value.split(";")[0])) + "<span class='right'>Amount: " + value.split(";")[1] + "</span></span><span class='desc'>" + item_description(value.split(";")[0]) + "</span></div>";
        });
    }
    actionBar.set("vendor;" + id + ";Buy" + (player.get("location") !== -1 ? ",go2location;" + player.get("location") + ";Return" : "") + ",go2base;;Go to base");
    $("#content").html(out);
}

function sell_item(id, amount) {
    "use strict";
    if (!amount){ amount = 1; }
    player.changeInt("money", getPrice.plainSell(Library.get("item_price", id)));
    editinventory(id, amount, true);
    sell_item_menu();
}

function editinventory(id, amount, remove) {
    "use strict";
    /* If remove isn't set, the item*amount will be ADDED. */
    var position = null,
        available_amount = null,
        tmp = null;
    if(Library.get("item_type", id) !== 0) {
        player.add("customitems", Library.get("item_name", id) + ";" + Library.get("item_attribute", id) + ";" + Library.get("item_rarity", id) + ";" + (Library.get("item_type", id) - 1) + ";" +  Library.get("item_itemlevel", id));
        return;
    }
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
    var out = "", tmp, id;
    if (update) {
        $("#inventory-mi, #inventory-wa, #inventory-eq").html("");
    }
    if (!update) {
        out = "<h2><a class='inv_sld'>Inventory</a> / <a class='inv_sld'>Equiped</a></h2>";
        out += "<div id='inventory_slider'>";
        out += "<div id='inventory-mi' class='list-object-inventory'></div><div id='inventory-wa' class='list-object-inventory'></div><div id='inventory-eq' class='list-object-inventory'></div></div></div><div class='small_window_container'></div>";
        small_window('', out);
        $(".inv_sld").unbind().click(function() {
            $(".inv_sld").css("color", "");
            $(this).css("color", "#444");
            $("#inventory_slider").css("left", $(this).index()  * -1020 + "px");
        });
        $(".inv_sld").eq(0).trigger('click');
    }
    if (player.get("inventory")) {
        $.each(player.arr("inventory", ","), function (index, value) {
            id = value.split(";")[0];
                $("<div />", {
                    html: "<div class='list-object' title='" +item_description(id)+ "'>" + (id ? id : 1) + " " + Library.get("item_name", id) + "<span class='right'>" +item_description(id)+ "</span></div>",
                    click: function() {
                        use_item(id);
                    }
                }).appendTo("#inventory-mi");
        });
    } else {
        $("#inventory-mi").text("Your inventory is empty.");
    }
    /*  Strength, Stamina, Agility, Charisma, Intelligence, Damage  */
    var itemtypes = ["equiped_weapon", "equiped_chest", "equiped_boots", "equiped_helm", "equiped_hands"];
    if (player.len("customitems") > 0) {
            $.each(player.arr("customitems", ","), function (index, value) {
                if(value) {
                    $("<div/>", {
                        "class": "item",
                        html: item_display(value, index, true),
                        mouseenter: function () {
                            var pos = $(this).offset();
                            $('#item_hover').show().css({
                                left: pos.left - 500 + "px",
                                top: pos.top + "px"
                            }).html(item_display(player.get([itemtypes[value.split(";")[10]]])));
                        },
                        mouseleave: function () {
                            $('#item_hover').hide();
                        }    
                    }).appendTo("#inventory-wa");
                }
            });
    }
    $.each(itemtypes, function(index, value) {
        $("<div/>", {
            "class": "item",
            html: item_display(player.get(value), index, false, true, index)
        }).appendTo("#inventory-eq");
    });
}

function show_character(update) {
    "use strict";
    var out = "<h2>Character</h2>",
        feet = String(player.get("height") / 30.48).slice(0, $.inArray(".", String(player.get("height") / 30.48).split(""))),
        inches = Math.round(String(player.get("height") / 30.48).slice($.inArray(".", String(player.get("height") / 30.48).split(""))) * 12);

    out += "You are " + player.get("height") + "cm (" + feet + "'" + inches + "\") tall.<br/>";
    out += "You have " + player.get("haircolor") + " hair and " + player.get("eyecolor") + " eyes, your skin is " + player.get("skincolor") + ".<br/>";
    out += player.get("time") + " hours have past since you started your adventure.";
    small_window('', out);
}

function item_display(item, id, compare, unequip, slot) {
    "use strict";
    var slotnames = ["weapon", "chest", "boots", "helm", "gloves"];
    if (!item){
        if(slot || slot === 0) {
            return "<h3>You have no " + slotnames[slot] + " equiped.</h3>";
        } else {
            return "<h3>You have nothing equiped in this slot.</h3>";
        }
    }
    var attributes_names = ["Strength", "Stamina", "Agility", "Charisma", "Intelligence", "Damage", "Armor", "Level"],
    itemtypes = ["equiped_weapon", "equiped_chest", "equiped_boots", "equiped_helm", "equiped_hands"],
    attributes = "",
    compclass = "",
    value = String(item).split(";"),
    i = 1;
    if(compare) {
        compare = (player.len(itemtypes[value[10]]) > 0 ? player.arr(itemtypes[value[10]])[8] : 0);
    }
    attributes = (value[10]===0?"<div class='extra-object " +(compare?(compare<value[7]?"better":"worse"):"")+ "'>Damage " +value[7]+ "(+ " +value[6]+ ")</div>":"<div class='extra-object " +(compare<value[7]?"better":"worse")+ "'>Armor " +value[7]+ "</div>");
    var b = (value[10]===0?6:7);
    for(i;i<b;i++) {
        if (value[i]>0) {
            if(compare) {
                compare = (player.len(itemtypes[value[10]]) > 0 ? player.arr(itemtypes[value[10]])[i]:0);
                if (compare === value[i]) { compclass = ""; }
                if (compare < value[i]) { compclass = "better"; }
                if (compare > value[i]) { compclass = "worse"; }
            }
            attributes += (attributes.length>0?"":"")+ "<div class='extra-object " +(compare ? compclass:"")+ "'>" +attributes_names[i-1]+ " + " +value[i]+ "</div>";
        }
    }                
    var raritycolor = Math.floor(value[8]/33.4);
    return "<div class='name r" +raritycolor+ "'>" +value[0]+ " ilvl " +value[10]+ "</div><div class='extra'>" +attributes+ "</div>" +(id || id === 0 ? (unequip ? "<button onclick='equip_item(" + value[9] + ", true)' class='item-unequip-button'>Unequip</button>" : "<button onclick='equip_item(" +id+ ")' class='item-equip-button'>Equip</button>") : "");
}

function handleDragOver(evt) {
    "use strict";
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

var actionBar = (function() {
    var button_function = ["explore", "sell_item_menu", "vendor", "player_sleep", "go2base", "gamble", "go2location", "playerEvent.trigger", "combat.trigger",
                         "combat.playerattack", "combat.escape", "combat.enemyattack", "masturbate", "combat.magic", "combat.playerturn", "combat.playerUseMagic", "playerMagic.learn", "character.trigger", "character.talk"],
        button_defaultname = ["Travel", "Sell Items", "Vendor", "Sleep", "Leave", "Gamble", "Travel", "Event", "Attack", "Attack", "Escape", "Continue", "Masturbate", "Magic", "Continue", "Use Magic", "Learn", "Character", "Talk"];
    var id = "", func;
                         
    return {
        set: function(buttons) {
            $("#action_control").find("button").unbind();
            $("#action_control").html("");
            $.each(buttons.split(","), function(index, value) {
                id = (value.split(";")[1] ? value.split(";")[1] : "");
                func = value.split(";")[0];
                $("<button />", {
                    text: (value.split(";")[2] ? value.split(";")[2] : button_defaultname[$.inArray(value.split(";")[0], button_function)]),
                    onclick: button_function[$.inArray(value.split(";")[0], button_function)] + "(" + id + ")"
                }).appendTo("#action_control");
            });
        }
    }
}());

$(document).keypress(function(e){
    if (e.which >= 49 && e.which <= 57){
        $("#action_control").find("button").eq(e.which - 49).click();
    }
});

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

function clock(addTime) {
    "use strict";
    player.changeFloat("time", addTime);
    var time = String((parseFloat(player.get("time") / 24) - parseInt(player.get("time") / 24, 10)) * 24).split("."),
    hour = (time[0].length <= 1 ? "0" + time[0] : time[0]), minute = (time[1] ? parseInt(("0." + time[1]) * 60) : "00");
    if(minute < 10 && minute !== "00") { minute = "0" + minute }
    
    if(player.get("twelvehourclock") === 0) {
         $(".time").text(hour + ":" + minute);
    } else {
         $(".time").text((hour <= 12 ? hour + ":" + minute + " AM" : parseInt(hour - 12) + ":" + minute + " PM"));
    }
   
    $(".day").text(Math.floor(player.get("time")/24));
}

function player_sleep(definedtime) {
    "use strict";
    var energy_per_hour = 12,
        lust_per_hour = 4,
        health_percent_per_hour = 0.07,
        mana_percent_per_hour = 0.07,
        time, tmp,
        timeslept, wakeupDesc = ["0-5;You wake up in the middle of the night.", "6-8;You wake up to as the sun rise.", "9-12;The sun is already up when you wake up, but the day is still young.",
                                 "13-17;You wake up in the middle of the day", "18-21;When you wake up it's already starting to get dark.", "22-24;You wake up as the sun set."],
        out = "<h2>Camp</h2>";

        if (!definedtime) {
            if(player.get("energy")===player.get("energyMax")&&player.get("health")===player.get("healthMax")&&player.get("mana")===player.get("manaMax")) {
                out += "You try to sleep, but in vain. All of your stats are as good as they ever are going to be.";
            } else {
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
            trigger_effect("lust;" + timeslept*lust_per_hour);
            out += " You restored " +Math.floor(timeslept*(player.get("manaMax")*mana_percent_per_hour))+ " mana, ";
            out += Math.floor(timeslept*(player.get("healthMax")*health_percent_per_hour))+ " health, while sleeping.</br>";
            time = parseInt((parseFloat(player.get("time") / 24) - parseInt(player.get("time") / 24, 10)) * 24, 10)
            $.each(wakeupDesc, function(index, value) {
                tmp = value.split(";")[0].split("-");
                if(tmp[0] < time && tmp[1] > time) {
                    out += "<br/>" + value.split(";")[1];
                }
            });
            }
            $("#content").html(out);
        }else{
            timeslept = definedtime;
            clock(timeslept);
            energy(energy_per_hour * timeslept);
            trigger_effect("health;" + timeslept * (player.get("healthMax") * health_percent_per_hour));
            trigger_effect("mana;" + timeslept*(player.get("manaMax")*mana_percent_per_hour));
            trigger_effect("lust;" + timeslept*lust_per_hour);
        }
}