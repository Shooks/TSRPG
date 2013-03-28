var type = "item";
var valid_req = ["health", "mana", "strength", "stamina", "agility", "intelligence", "charisma", "libido", "energy", "lust" , "origin", "location", "level", "height", "luck", "barter", "fertility_multiplier", "coin_find_multiplier", "item_find_multiplier", "potion_potency", "experience_multiplier", "genital_growth_multiplier", "hitchance", "enemy_spawn_multiplier"],
    valid_effects = ["health", "mana", "experience", "libido", "strength", "stamina", "agility", "intelligence", "charisma", "energy", "lust", "height", "eyecolor", "haircolor", "bodytype", "skincolor", "luck", "barter", "fertility_multiplier", "coin_find_multiplier", "item_find_multiplier", "potion_potency", "experience_multiplier", "genital_growth_multiplier", "hitchance", "enemy_spawn_multiplier"],
    valid_buttons = ["playerEvent.trigger", "go2location", "combat.trigger", "gamble", "vendor", "playerMagic.learn", "go2base"];
    valid_multipliers = ["strength", "stamina", "agility", "intelligence", "charisma", "level"];
var ui = [];
ui.item = ["id", "name", "price", "effect", "event"],
ui.location = ["id", "name", "ontravel", "threat", "discoverables", "enemies", "event", "master", "children", "startwith", "button"],
ui.event = ["id", "name", "text", "effect", "button", "requirement", "maxrun"],
ui.feat = ["id", "name", "description", "effect"],
ui.enemy = ["id", "name", "basehealth", "basedamage", "event", "gender", "onloss", "onwin", "onmaxlust", "loot", "description", "hitchance", "critchance", "critmultiplier", "minlevel", "maxlevel", "attacks"];
ui.character = ["notfinished", "id", "name", "cgender", "event", "talk"];
ui.origin = ["id", "description", "effect"];
ui.vendor = ["id", "name", "text", "sell"];
ui.attack = ["attacknote", "id", "name", "description", "effect", "multipliers", "basedamage"];

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
        $("<option/>", { text: value }).appendTo("#sel-effect");
    });
    $.each(valid_req, function(index, value) {
       $("<option/>", { text: value }).appendTo("#sel-req");
    }); 
    $.each(valid_buttons, function(index, value) {
        $("<option/>", { text: value }).appendTo("#sel-but");
    });
    $.each(valid_multipliers, function(index, value) {
        $("<option/>", { text: value }).appendTo("#sel-multipliers");
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
    $("#add-multiplier-but").click(function() {
        tmp = "";
        if(editxml.get("multipliers")) {
            tmp = editxml.get("multipliers");
            if($.inArray($("#sel-multipliers").find(":selected").text(), editxml.get("multipliers").split(",")) !== -1) {
                return;
            }
        }
        tmp += (tmp.length > 1 ? "," : "") + $("#sel-multipliers").find(":selected").text();
        editxml.set("multipliers", tmp);
        updatmultipliers();
    });
    $("#add-talk-but").click(function() {
        tmp = "";
        if(editxml.get("talks")) {
            tmp = editxml.get("talks");
        }
        tmp += (tmp.length > 0 ? "," : " ");
        editxml.set("talks", tmp);
        updatetalk();
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
    $(".col").find("h2").click(function() {
        $(".col").css("height", "60px");
        $(".col h2").css({"background": "", "color": ""});
        $(this).css({"background": "#188acb", "color": "#fff"}).parent().css("height", "auto");
    });
    $("#add-event").keyup(function() { editxml.set("event", $(this).val()); });
    $("#add-description").keyup(function() { editxml.set("description", $(this).val()); });
    $("#add-text").keyup(function() { editxml.set("text", $(this).val()); });
    $("#add-master").keyup(function() { editxml.set("master", $(this).val()); });
    $("#add-basehealth").keyup(function() { editxml.set("basehealth", $(this).val()); });
    $("#add-basedamage").keyup(function() { editxml.set("basedamage", $(this).val()); });
    $("#add-ontravel").keyup(function() { editxml.set("onTravel", $(this).val()); });
    $("#add-event").keyup(function() { editxml.set("event", $(this).val()); });
    $("#add-discoverables").keyup(function() { editxml.set("discoverables", $(this).val()); });
    $("#add-loot").keyup(function() { editxml.set("loot", $(this).val()); });
    $("#add-children").keyup(function() { editxml.set("children", $(this).val()); });
    $("#add-onloss").keyup(function() { editxml.set("onloss", $(this).val()); });
    $("#add-onwin").keyup(function() { editxml.set("onwin", $(this).val()); });
    $("#add-enemies").keyup(function() { editxml.set("enemies", $(this).val()); });
    $("#add-threat").keyup(function() { editxml.set("threat", $(this).val()); });
    $("#add-sell").keyup(function() { editxml.set("sell", $(this).val()); });
    $("#add-maxrun").keyup(function() { editxml.set("maxrun", $(this).val()); });
    $("#add-hitchance").keyup(function() { editxml.set("hitchance", $(this).val()); });
    $("#add-critchance").keyup(function() { editxml.set("critchance", $(this).val()); });
    $("#add-critmultiplier").keyup(function() { editxml.set("critmultiplier", $(this).val()); });
    $("#add-talk").keyup(function() { editxml.set("talk", $(this).val()); });
    $("#add-minlevel").keyup(function() { editxml.set("minlevel", $(this).val()); });
    $("#add-maxlevel").keyup(function() { editxml.set("maxlevel", $(this).val()); });
    $("#add-attacks").keyup(function() { editxml.set("attacks", $(this).val()); });
    $("#sel-cgender").find("option").click(function() {
        editxml.set("cgender", $("#sel-cgender").find("option:selected").text());
    });
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
    $("#mail").click(function() {
        document.location = "mailto:voncarlsson@gmail.com?subject=TSRPG&data=" + $("#add-xml").text();
    });
});
function updatetalk() {
    $("#talk-list").html("");
    if(!editxml.get("talks")) { return; }
    var rel, text;
    $.each(editxml.get("talks").split(","), function(index, value) {
        rel = value.split(";")[0];
        text = value.split(";")[1];
        $("#talk-list").append("<span class='talk-add'><button class='rem-talk'>-</button><input value='" + (rel ? rel : "") + "' class='talk-rel add-talk input-short' type='text'></input><br/><span class='plus'>Min. Relationship</span><br/><textarea class='talk-text add-talk'>" + (text ? text : "") + "</textarea></span>");
    });
    $(".rem-talk").unbind().click(function() {
        var tmp = editxml.get("talks").split(",");
        tmp.splice($(this).parent().index(), 1);
        editxml.set("talks", String(tmp));
        updatetalk();
    });
    $(".add-talk").unbind().bind('click keyup', function() {
        tmp = editxml.get("talks").split(",");
        tmp[$(this).parent().index()] = ($(this).parent().find(".talk-rel").val() ? $(this).parent().find(".talk-rel").val() : "") + ";" + $(this).parent().find(".talk-text").val();
        editxml.set("talks", String(tmp));
    });
}
function updatereq() {
    $("#list-req").html("");
    if(!editxml.get("requirement")) { return; }
    var amount, opt;
        $.each(editxml.get("requirement").split(","), function(index, value) {
            amount = value.split(";")[1];
            opt = value.split(";")[2];
            $("#list-req").append("<span class='small-add'>" + value.split(";")[0] + "<select class='req-op edit-req'><option" + (opt === "=" ? " selected" : "") +">=</option><option" + (opt === ">" ? " selected" : "") +">></option><option" + (opt === "<" ? " selected" : "") +"><</option></select><button class='rem-req'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short req-amount edit-req'><span class='plus'>Amount</span></span>");
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
function updatmultipliers() {
    $("#list-multipliers").html("");
    if(!editxml.get("multipliers")) { return; }
    var amount, chance;
        $.each(editxml.get("multipliers").split(","), function(index, value) {
            amount = editxml.get("multipliers").split(",")[index].split(";")[1];
            $("#list-multipliers").append("<span class='small-add'>" + value + "<button class='rem-multiplier'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short multipliers-amount edit-multipliers'><span class='plus'>Amount</span></span>");
        });
            $(".rem-multiplier").unbind().click(function() {
                var tmp = editxml.get("multipliers").split(",");
                tmp.splice($(this).parent().index(), 1);
                editxml.set("multipliers", String(tmp));
                updatmultipliers();
            });
        $(".edit-multipliers").unbind().bind('click keyup', function() {
            tmp = editxml.get("multipliers").split(",");
            tmp[$(this).parent().index()] = tmp[$(this).parent().index()].split(";")[0] + ";" + ($(this).parent().find(".multipliers-amount").val() ? $(this).parent().find(".multipliers-amount").val() : "");
            editxml.set("multipliers", String(tmp));
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
    var valid = ["overview", "help", "add"], t = ["item", "location", "event", "feat", "enemy", "character", "origin", "vendor", "attack"];
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

    $(".add").css("display", "none");
    $.each(ui[id], function(index, value) {
        $("#" + value).css("display", "block");
    });
}

var editxml = (function() {
    var all = ["id", "name", "price", "event", "effect", "gender", "onTravel", "threat", "discoverables", "enemies", "master", "maxlevel",
               "onmaxlust", "loot", "hitchance", "critchance", "critmultiplier", "requirement", "button", "text", "description", "minlevel",
               "basehealth", "basedamage", "startwith", "onloss", "onwin", "children", "cgender", "sell", "maxrun", "talk", "multipliers", "attacks"],
        out = "", eff, evt, gen, prev_gender, disc, e1, e2, req, but, bid, ene, chi, onloss, onwin, sell, talk, multi, atks,
        exceptions = ["gender", "event", "discoverables", "effect", "requirement", "button", "enemies", "onloss", "onwin", "sell", "loot", "talk", "multipliers", "attacks"],
        valid_genders = ["male", "female", "herm"]; 
    return {
        set: function(key, value) {
            if(all[key] === "undefined") {
                return false;
            }
            all[key] = value.replace(/\n/g, "\n\t");
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
            ene = "";
            bid = "";
            chi = "";
            onloss = "";
            onwin = "";
            sell = "";
            prev_gender = "";
            loot = "";
            out = "<" + type + ">\n";
            talk = "";
            multi = "";
            atks = "";
            if(all["maxlevel"] && all["minlevel"]) {
                if(all["maxlevel"] < all["minlevel"]){
                    all["minlevel"] = "";
                }
            }
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
            if(all["talks"]) {
                $.each(all["talks"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    if(e1 !== "NaN") {
                        talk += "        <talk" + (e1 ? " relation=\"" + e1 + "\"" : "") + ">" + v.split(";")[1] + "</talk>\n";
                    }
                });
            }
            if(all["sell"]) {
                $.each(all["sell"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    e2 = parseInt(v.split(";")[1], 10);
                    if(e1 !== "NaN") {
                        sell += "        <item" + (e2 ? " amount=\"" + e2 + "\"" : "") + ">" + e1 + "</item>\n";
                    }
                });
            }
            if(all["onloss"]) {
                $.each(all["onloss"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    if(e1 !== "NaN") {
                        onloss += "        <event" + (v.split(";")[1] ? " name=\"" + v.split(";")[1] + "\"" : "") + ">" + e1 + "</event>\n";
                    }
                });
            }
            if(all["onwin"]) {
                $.each(all["onwin"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    if(e1 !== "NaN") {
                        onwin += "        <event" + (v.split(";")[1] ? " name=\"" + v.split(";")[1] + "\"" : "") + ">" + e1 + "</event>\n";
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
            if(all["attacks"]) {
                $.each(all["attacks"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    e2 = parseInt(v.split(";")[1], 10);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        atks += "        <attack" + (e2 ? " chance=\"" + e2 + "\"" : "") + ">" + e1 + "</attack>\n";
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
            if(all["multipliers"]) {
                $.each(all["multipliers"].split(","), function(x, v) {
                    e1 = parseFloat(v.split(";")[1]);
                    if(e1 !== "NaN") {
                        eff += "        <multiplier type=\"" + v.split(";")[0] + "\">" + (e1 ? e1 : "0") + "</multiplier>\n";
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
            if(all["children"]) {
                $.each(all["children"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0]);
                    if(e1 !== "NaN") {
                        chi += "        <child>" + (e1 ? e1 : "0") + "</child>\n";
                    }
                });
            }
            if(all["loot"]) {
                $.each(all["loot"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0]);
                    e2 = parseInt(v.split(";")[1]);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        loot += "        <item" + (e2 ? " chance=\"" + e2 + "\"" : "") + ">" + (e1 ? e1 : "0") + "</item>\n";
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
            if(chi && $.inArray("children", ui[type]) !== -1) {
                out += "    <children>\n" + chi + "   </children>\n";
            }
            if(onloss && $.inArray("onloss", ui[type]) !== -1) {
                out += "    <onloss>\n" + onloss + "   </onloss>\n";
            }
            if(onwin && $.inArray("onwin", ui[type]) !== -1) {
                out += "    <onwin>\n" + onwin + "   </onwin>\n";
            }
            if(sell && $.inArray("sell", ui[type]) !== -1) {
                out += "    <sell>\n" + sell + "   </sell>\n";
            }
            if(loot && $.inArray("loot", ui[type]) !== -1) {
                out += "    <loot>\n" + loot + "   </loot>\n";
            }
            if(talk && $.inArray("talk", ui[type]) !== -1) {
                out += "    <talks>\n" + talk + "   </talks>\n";
            }
            if(multi && $.inArray("multipliers", ui[type]) !== -1) {
                out += "    <multipliers>\n" + multi + "   </multipliers>\n";
            }
            if(atks && $.inArray("attacks", ui[type]) !== -1) {
                out += "    <attacks>\n" + atks + "   </attacks>\n";
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
    var itemId = [], i = 0, use, effects, discoverables, enemies, but, temp, req, event, placeinarr, id, name, gender, out = "", chi, sell, loot, talk,
        tags = ["items item", "locations location", "data > enemies enemy", "data > events event", "data > feats feat", "data > characters character", "data > origins origin", "data > vendors vendor", "data > attacks attack"],
        debug = "", valid_genders = ["male", "female", "herm"], valid_effectspercent = ["health", "mana"];
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
            chi = "";
            onloss = "";
            onwin = "";
            onmaxlust = "";
            sell = "";
            loot = "";
            talk = "";
            multi = "";
            atks = "";
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
            $(this).find("talks talk").each(function() {
                talk += (talk.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("relation") ? $(this).attr("relation") : "");
            });
            $(this).find("sell item").each(function() {
                    sell += (sell.length > 0 ? "," : "") + $(this).text();
            });
            $(this).find("children child").each(function(x, v) {
                if($(temp).find(v).length > 0) {
                    chi += (req.length > 0 ? "," : "") + v;
                }
            });
            $(this).find("loot item").each(function() {
                    loot += (loot.length > 0 ? "," : "") + $(this).text();
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
            $(this).find("attacks attack").each(function() {
                atks += (atks.length > 0 ? "," : "") + $(this).text() + ";" + ($(this).attr("chance") ? $(this).attr("chance") : "100");
            });
            $(this).find("multipliers multiplier").each(function() {
                multi += (multi.length > 0 ? "," : "") + $(this).attr("type") + ";" + $(this).text();
            });
            temp = $(this).find("buttons button");
                    $.each(temp, function() {
                        placeinarr = $.inArray($(this).attr("type"), valid_buttons);
                        if(placeinarr !== -1) {
                            but += (but.length > 0 ? "," : "") + valid_buttons[placeinarr] + ";" + $(this).attr("id") + ";" + $(this).text();
                        }
            });
            $(this).find("discoverable discover").each(function (x, v) {
                discoverables += (discoverables.length > 0 ? "," : "") + $(v).text();
            });
            $(this).find("enemies enemy").each(function (x, v) {
                enemies += (enemies.length > 0 ? "," : "") + $(v).text();
            });
            if(index === 0) {
                out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                out += "<div class='stat'><b>Price:</b>" + $(this).find("price").text() + "</div>";
                out += "<div class='stat'><b>Effect(s):</b>" + (use ? use : "Nothing.") + "</div>";
                out += "<div class='stat'><b>Event(s):</b>" + (event ? event : "Nothing.") + "</div>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#items");
            } else if (index === 1) {
                    
                    out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                    out += "<div class='stat'><b>Ontravel message:</b>" + $(this).find("onTravel").text() + "</div>";
                    out += "<div class='stat'><b>Threat:</b>" + $(this).find("threat").text() + "(%)" + "</div>";
                    out += "<div class='stat'><b>Discoverable(s):</b>" + (discoverables ? discoverables : "Nothing.") + "</div>";
                    out += "<div class='stat'><b>Enimies:</b>" + (enemies ? enemies : "Nothing.") + "</div>";
                    out += "<div class='stat'><b>Event(s):</b>" + (event ? event : "Nothing.") + "</div>";
                    out += "<div class='stat'><b>Master:</b>" + ($(this).find("master").text() ? $(this).find("master").text() : "Nothing.") + "</div>";
                    out += "<div class='stat'><b>Start With:</b>" + ($(this).find("startwith").text() ? "Yes." : "No.") + "</div>";
                    out += "<div class='stat'><b>Button(s)</b> " + but + "</div>";
                    out += "<div class='stat'><b>Children</b> " + chi + "</div>";
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
                    out += "<div class='stat'><b>ID:</b>" + id + "</br></div>";
                    out += "<div class='stat'><b>Base Health:</b>" + $(this).find("basehealth").text() + "</div>";
                    out += "<div class='stat'><b>Base Damage:</b>" + $(this).find("basedamage").text() + "</div>";
                    out += "<div class='stat'><b>Event(s):</b>" + event + "</div>";
                    out += "<div class='stat'><b>Gender Limit:</b>" + gender + "</div>";
                    out += "<div class='stat'><b>On Win:</b>" + onwin + "</div>";
                    out += "<div class='stat'><b>On Loss:</b>" + onloss + "</div>";
                    out += "<div class='stat'><b>On Max Lust:</b>" + onmaxlust + "</div>";
                    out += "<div class='stat'><b>Loot:</b>" + loot + "</div>";
                    out += "<div class='stat'><b>Hit chance:</b>" + $(this).find("hitchance").text() + "%</div>";
                    out += "<div class='stat'><b>Crit chance:</b>" + $(this).find("critchance").text() + "%</div>";
                    out += "<div class='stat'><b>Crit multiplier:</b>" + $(this).find("critmultiplier").text() + "X</div>";
                    $("<div />", {
                    html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                    }).appendTo("#xenemies");
            } else if (index === 3) {
                    out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                    out += "<div class='stat'><b>Text:</b>" + $(this).find("text").text() + "</div>";
                    out += "<div class='stat'><b>Effect(s):</b>" + use + "</div>";
                    out += "<div class='stat'><b>Button(s)</b> " + but + "</div>";
                    out += "<div class='stat'><b>Requirement(s):</b>" + req + "</div>";
                    out += "<div class='stat'><b>Max run:</b>" + ($(this).find("maxrun").text() ? $(this).find("text").text() : "Infinite.") + "</div>";
                    $("<span />", {
                    html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                    "class": "col_item"
                    }).appendTo("#events");
            } else if (index === 4) {
                out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                out += "<div class='stat'><b>Description:</b>" + $(this).find("description").text() + "</div>";
                out += "<div class='stat'><b>Effect(s):</b>" + use + "</div>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#specials");
            } else if (index === 5) {
                out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                out += "<div class='stat'><b>Talk:</b>" + talk + "</div>";
                out += "<div class='stat'><b>Event(s):</b>" + event + "</div>";
                out += "<div class='stat'><b>Gender:</b>" + $(this).find("cgender").text() + "</div>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#characters");
            } else if (index === 6) {
                out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                out += "<div class='stat'><b>Description:</b>" + $(this).find("description").text() + "</div>";
                out += "<div class='stat'><b>Effect(s):</b>" + use + "</div>";
                $("<div />", {
                html: "<span>Origin #" + id + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#origins");
            } else if (index === 7) {
                out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                out += "<div class='stat'><b>Text:</b>" + $(this).find("text").text() + "</div>";
                out += "<div class='stat'><b>Sell:</b>" + sell + "</div>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#vendors");
            } else if (index === 8) {
                out += "<div class='stat'><b>ID:</b>" + id + "</div>";
                out += "<div class='stat'><b>Name:</b>" + $(this).find("text").text() + "</div>";
                out += "<div class='stat'><b>Description:</b>" + $(this).find("description").text() + "</div>";
                out += "<div class='stat'><b>Base Damage:</b>" + $(this).find("basedamage").text() + "</div>";
                out += "<div class='stat'><b>Multipliers:</b>" + multi + "</div>";
                $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
                }).appendTo("#attacks");
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