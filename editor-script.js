var type = "item";
var valid_req = ["health", "mana", "strength", "stamina", "agility", "intelligence", "charisma", "libido", "energy", "lust" , "origin", "location", "level", "height", "luck", "barter", "fertility_multiplier", "coin_find_multiplier", "item_find_multiplier", "potion_potency", "experience_multiplier", "genital_growth_multiplier", "hitchance", "enemy_spawn_multiplier"],
    valid_effects = ["health", "mana", "experience", "libido", "strength", "stamina", "agility", "intelligence", "charisma", "energy", "lust", "height", "eyecolor", "haircolor", "bodytype", "skincolor", "luck", "barter", "fertility_multiplier", "coin_find_multiplier", "item_find_multiplier", "potion_potency", "experience_multiplier", "genital_growth_multiplier", "hitchance", "enemy_spawn_multiplier", "damage", "armor", "extraLust", "extraMana", "extraHealth", "energyMax", "penisSize", "penisAmount", "vaginaDepth", "breastSize", "breastAmount", "ballSize", "ballAmount", "semen_amount_multiplier", "milk_amount_multiplier", "tail"],
    valid_buttons = ["playerEvent.trigger", "go2location", "combat.trigger", "gamble", "vendor", "playerMagic.learn", "go2base"],
    valid_multipliers = ["health", "maxHealth", "minDamage", "maxDamage", "critChance", "critMultiplier", "hitChance", "level"],
    valid_attributes = ["strength", "stamina", "agility", "charisma", "intelligence", "damage", "armor", "level"];
var ui = ["item", "location", "enemy", "event", "feat", "character", "origin", "vendor", "attack"];
ui.item = ["id", "name", "price", "effect", "event", "slot", "attributes", "type", "ilvl", "rarity"],
ui.location = ["id", "name", "ontravel", "threat", "discoverables", "enemies", "event", "master", "children", "startwith", "button", "ondiscover"],
ui.enemy = ["id", "name", "basehealth", "basedamage", "event", "gender", "onloss", "onwin", "onmaxlust", "loot", "description", "hitchance", "critchance", "critmultiplier", "minlevel", "maxlevel", "attacks"];
ui.event = ["id", "name", "text", "effect", "button", "requirement", "maxrun", "loot"],
ui.feat = ["id", "name", "description", "effect"],
ui.character = ["notfinished", "id", "name", "cgender", "event", "talk"];
ui.origin = ["id", "description", "effect"];
ui.vendor = ["id", "name", "text", "sell"];
ui.attack = ["attacknote", "id", "name", "description", "effect", "multipliers", "basedamage", "dot"];

$(document).ready(function() {
    var jqxhr = $.ajax("data.xml")
        .done(function(data) { xmlparser(data); })
        .fail(function() { alert("Failed to load data.xml. You can still use the editor."); });
    $("#id").show();
    $("#option_container").find(".option").click(function() {
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
    $.each(valid_attributes, function(index, value) {
        $("<option/>", { text: value }).appendTo("#sel-attributes");
    });

    var tmp = "", error = 0;

    $("#add-sel-but").click(function() {
        var tmp = "";
        if(editxml.get("button")) {
            tmp = editxml.get("button");
        }
        tmp += (tmp.length > 1 ? "," : "") + $("#sel-but").find(":selected").text();
        editxml.set("button", tmp);
        update.upt("button");
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
        update.upt("effect");
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
        update.upt("multipliers");
    });
    $("#add-but-loot").click(function() {
        tmp = "";
        if(editxml.get("loot")) {
            tmp = editxml.get("loot");
        }
        tmp += (tmp.length > 0 ? "," : " ");
        editxml.set("loot", tmp);
        update.upt("loot");
    });
    $("#add-but-attributes").click(function() {
        tmp = "";
        if(editxml.get("attributes")) {
            tmp = String(editxml.get("attributes"));
            $.each(tmp.split(","), function(index, value) {
                if(String($("#sel-attributes").find(":selected").index()) === value.split(";")[0]) {
                    error = 1;
                }
            });
            if(error === 1) {
                return;
            }
        }
        tmp += String((tmp.length > 0 ? "," : "") + $("#sel-attributes").find(":selected").index());
        editxml.set("attributes", tmp);
        update.upt("attributes");
    });
    $("#add-talk-but").click(function() {
        tmp = "";
        if(editxml.get("talk")) {
            tmp = editxml.get("talk");
        }
        tmp += (tmp.length > 0 ? "," : " ");
        editxml.set("talk", tmp);
        update.upt("talk");
    });
    $("#add-but-dot").click(function() {
        tmp = "";
        if(editxml.get("dot")) {
            tmp = editxml.get("dot");
        }
        tmp += (tmp.length > 0 ? "," : " ");
        editxml.set("dot", tmp);
        update.upt("dot");
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
        update.upt("requirement");
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
    $("#add-ilvl").keyup(function() { editxml.set("ilvl", $(this).val()); });
    $("#add-rarity").keyup(function() { editxml.set("rarity", $(this).val()); });
    $("#add-ondiscover").keyup(function() { editxml.set("ondiscover", $(this).val()); });
    $("#sel-type").find("option").click(function() { editxml.set("type", $(this).index()); });
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
var update = (function() {
    var idval, textval, amount, chance, opt, out, edit, tmp, rel, text, rounds;

    return {
        upt: function(key) {
            $("#list-" + key).html("");
            if(editxml.get(key)) {
                $.each(editxml.get(key).split(","), function(index, value) {
                    switch(key) {
                        case "button":
                            idval = editxml.get("button").split(",")[index].split(";")[1];
                            textval = editxml.get("button").split(",")[index].split(";")[2];
                            out = "<span class='small-add'>" + value + "<button class='rem-button'>-</button><input value='" + (textval ? textval : "") + "' class='input-short button-text edit-button' type='text'/><span class='plus'>Text</span><input value='" + (idval ? idval : "") + "' class='input-short button-id edit-button' type='text'/><span class='plus'>Trigger ID</span></span>";
                        break;
                        case "effect":
                            amount = editxml.get("effect").split(",")[index].split(";")[1];
                            chance = editxml.get("effect").split(",")[index].split(";")[2];
                            out = "<span class='small-add'>" + value + "<button class='rem-effect'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short effect-amount edit-effect'><span class='plus'>Amount</span><input type='text' value='" + (chance ? chance : "") + "' class='input-short effect-chance edit-effect'><span class='plus'>Chance</span></span>";
                        break;
                        case "multipliers":
                            amount = editxml.get("multipliers").split(",")[index].split(";")[1];
                            out = "<span class='small-add'>" + value + "<button class='rem-multiplier'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short multipliers-amount edit-multipliers'><span class='plus'>Amount</span></span>";
                        break;
                        case "requirement":
                            amount = value.split(";")[1];
                            opt = value.split(";")[2];
                            out = "<span class='small-add'>" + value.split(";")[0] + "<select class='requirement-op edit-requirement'><option" + (opt === "=" ? " selected" : "") +">=</option><option" + (opt === ">" ? " selected" : "") +">></option><option" + (opt === "<" ? " selected" : "") +"><</option></select><button class='rem-requirement'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short requirement-amount edit-requirement'><span class='plus'>Amount</span></span>";
                        break;
                        case "talk":
                            rel = value.split(";")[0];
                            text = value.split(";")[1];
                            out = "<span class='talk-add'><button class='rem-talk'>-</button><input value='" + (rel ? rel : "") + "' class='talk-rel edit-talk input-short' type='text'></input><br/><span class='plus'>Min. Relationship</span><br/><textarea class='talk-text edit-talk'>" + (text ? text : "") + "</textarea></span>";
                        break;
                        case "attributes":
                            amount = editxml.get("attributes").split(",")[index].split(";")[1];
                            out = "<span class='small-add'>" + valid_multipliers[value] + "<button class='rem-attributes'>-</button><input value='" + (amount ? amount : "") + "' type='text' class='input-short attributes-amount edit-attributes'><span class='plus'>Amount</span></span>";
                        break;
                        case "loot":
                            idval = editxml.get("loot").split(",")[index].split(";")[0];
                            chance = editxml.get("loot").split(",")[index].split(";")[1];
                            maxlevel = editxml.get("loot").split(",")[index].split(";")[2];
                            minlevel = editxml.get("loot").split(",")[index].split(";")[3];
                            out = "<span class='small-add'><button class='rem-loot'>-</button><input value='" + (maxlevel ? maxlevel : "") + "' type='text' class='input-short loot-maxlevel edit-loot'><span class='plus'>Max lvl</span>";
                            out += "<input value='" + (minlevel ? minlevel : "") + "' type='text' class='input-short loot-minlevel edit-loot'><span class='plus'>Min lvl</span>";
                            out += "<input value='" + (chance ? chance : "") + "' type='text' class='input-short loot-chance edit-loot'><span class='plus'>Chance</span></span>";
                            out += "<input value='" + (idval ? idval : "") + "' type='text' class='input-short loot-id edit-loot'><span class='plus'>Item ID</span>";
                        break;
                        case "dot":
                            idval = editxml.get("dot").split(",")[index].split(";")[0];
                            chance = editxml.get("dot").split(",")[index].split(";")[1];
                            rounds = editxml.get("dot").split(",")[index].split(";")[2];
                            out = "<span class='small-add'><button class='rem-dot'>-</button><input value='" + (chance ? chance : "") + "' type='text' class='input-short dot-chance edit-dot'><span class='plus'>Chance</span>";
                            out += "<input value='" + (rounds ? rounds : "") + "' type='text' class='input-short dot-rounds edit-dot'><span class='plus'>Rounds</span>";
                            out += "<input value='" + (idval ? idval : "") + "' type='text' class='input-short dot-id edit-dot'><span class='plus'>Attack ID</span></span>";
                        break;
                    }
                    $("#list-" + key).append(out);
                });
            }
            $(".rem-" + key).unbind().click(function() {
                    if(editxml.get(key)) {
                        tmp = editxml.get(key).split(",");
                        tmp.splice($(this).parent().index(), 1);
                        editxml.set(key, String(tmp));
                    }
                    update.upt(key);
            });
            $(".edit-" + key).unbind().keyup(function() {
                if(editxml.get(key)) {
                    update.edit(this, key);
                }
            });
        },
        edit: function(element, key) {
            tmp = String(editxml.get(key)).split(",");
            switch(key) {
                case "button":
                    tmp[$(element).parent().index()] = tmp[$(element).parent().index()].split(";")[0] + ($(element).parent().find(".button-id").val() ? ";" + $(element).parent().find(".button-id").val() : "") + ($(element).parent().find(".button-text").val() ? ";" + $(element).parent().find(".button-text").val() : "");
                break;
                case "effect":
                    tmp[$(element).parent().index()] = tmp[$(element).parent().index()].split(";")[0] + ";" + ($(element).parent().find(".effect-amount").val() ? $(element).parent().find(".effect-amount").val() : "") + ";" + ($(element).parent().find(".effect-chance").val() ? $(element).parent().find(".effect-chance").val() : "");
                break;
                case "multipliers":
                    tmp[$(element).parent().index()] = tmp[$(element).parent().index()].split(";")[0] + ";" + ($(element).parent().find(".multipliers-amount").val() ? $(element).parent().find(".multipliers-amount").val() : "");
                break;
                case "requirement":
                    tmp[$(element).parent().index()] = tmp[$(element).parent().index()].split(";")[0] + ";" + ($(element).parent().find(".req-amount").val() ? $(element).parent().find(".req-amount").val() : "") + ";" + $(element).parent().find(".req-op").find(":selected").text();
                break;
                case "talk":
                    tmp[$(element).parent().index()] = ($(element).parent().find(".talk-rel").val() ? $(element).parent().find(".talk-rel").val() : "") + ";" + $(element).parent().find(".talk-text").val();
                break;
                case "attributes":
                    tmp[$(element).parent().index()] = tmp[$(element).parent().index()].split(";")[0] + ";" + ($(element).parent().find(".attributes-amount").val() ? $(element).parent().find(".attributes-amount").val() : "");
                break;
                case "loot":
                    idval = $(element).parent().find(".loot-id").val();
                    chance = $(element).parent().find(".loot-chance").val();
                    maxlevel = $(element).parent().find(".loot-maxlevel").val();
                    minlevel = $(element).parent().find(".loot-minlevel").val();
                    tmp[$(element).parent().index()] = idval + ";" + (chance ? chance : "") + ";"  + (minlevel ? minlevel : "") + ";" + (maxlevel ? maxlevel : "");
                break;
                case "dot":
                    idval = $(element).parent().find(".dot-id").val();
                    chance = $(element).parent().find(".dot-chance").val();
                    rounds = $(element).parent().find(".dot-rounds").val();
                    tmp[$(element).parent().index()] = idval + ";" + (chance ? chance : "") + ";" + (rounds ? rounds : "");
                break;
            }
            editxml.set(key, String(tmp));
        }
    }
}());

function menu_select(id) {
    var valid = ["overview", "help", "add"], t = ["item", "location", "event", "feat", "enemy", "character", "origin", "vendor", "attack"];

    $.each(valid, function(index, value) {
        $("#" + value).css("display", "none");
        $("#option_container").find(".option").attr("class", "option");
    });
    $("#" + (id < 2 ? valid[id] : "add")).css("display", "block");
    $("#option_container").find(".option").eq(id).addClass("selected");
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
               "basehealth", "basedamage", "startwith", "onloss", "onwin", "children", "cgender", "sell", "maxrun", "talk", "multipliers",
               "attacks", "attributes", "type", "ilvl", "rarity", "dot", "ondiscover"],
        out = "", atr, eff, evt, gen, prev_gender, disc, e1, e2, req, but, bid, ene, chi, onloss, onwin, sell, talk, multi, atks, dot,
        exceptions = ["dot", "attributes", "gender", "event", "discoverables", "effect", "requirement", "button", "enemies", "onloss", "onwin", "sell", "loot", "talk", "multipliers", "attacks"],
        valid_genders = ["male", "female", "herm"]; 
    return {
        set: function(key, value) {
            if(all[key] === "undefined") {
                return false;
            }
            all[key] = (typeof value !== "number" ? value.replace(/\n/g, "\n\t") : value);
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
            e3 = "";
            e4 = "";
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
            atr = "";
            dot = "";
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
            if(all["talk"]) {
                $.each(all["talk"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    if(e1 !== "NaN") {
                        talk += "        <talk" + (e1 ? " relation=\"" + e1 + "\"" : "") + ">" + v.split(";")[1] + "</talk>\n";
                    }
                });
            }
            if(all["dot"]) {
                $.each(all["dot"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[0], 10);
                    e2 = parseInt(v.split(";")[1], 10);
                    e3 = parseInt(v.split(";")[2], 10);
                    if(e1 !== "NaN") {
                        dot += "        <dot" + (e2 ? " chance=\"" + e2 + "\"" : "") + (e3 ? " rounds=\"" + e3 + "\"" : "") + ">" + e1 + "</dot>\n";
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
                        multi += "        <multiplier type=\"" + v.split(";")[0] + "\">" + (e1 ? e1 : "0") + "</multiplier>\n";
                    }
                });
            }
            if(all["attributes"] && all["type"] > 0) {
                $.each(all["attributes"].split(","), function(x, v) {
                    e1 = parseInt(v.split(";")[1], 10);
                    if(e1 !== "NaN") {
                        atr += "        <attribute type=\"" + v.split(";")[0] + "\">" + (e1 ? e1 : "0") + "</attribute>\n";
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
                    e3 = parseInt(v.split(";")[2]);
                    e4 = parseInt(v.split(";")[3]);
                    if(e1 !== "NaN" && e2 !== "NaN") {
                        loot += "        <item" + (e2 ? " chance=\"" + e2 + "\"" : "") + (e3 && e3 < e4 ? " minlevel=\"" + e3 + "\"" : "") + (e4 ? " maxlevel=\"" + e4 + "\"" : "") + ">" + (e1 ? e1 : "0") + "</item>\n";
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
            if(atr && $.inArray("attributes", ui[type]) !== -1) {
                out += "    <attributes>\n" + atr + "   </attributes>\n";
            }
            if(dot && $.inArray("dot", ui[type]) !== -1) {
                out += "    <dots>\n" + dot + "   </dot>\n";
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
        debug = "", valid_genders = ["male", "female", "herm"], valid_effectspercent = ["health", "mana"], attributes = [];
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
            name = ($(this).find("name").text() ? $(this).find("name").text() : "Unnamed entitiy " + id);
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
            attributes["id"] = id;
            attributes["price"] = $(this).find("price").text();
            attributes["effect"] = (use ? use : "Nothing.");
            attributes["event"] = (event ? event : "Nothing.");
            attributes["ontravel"] = $(this).find("onTravel").text();
            attributes["threat"] = $(this).find("threat").text();
            attributes["discoverable"] = (discoverables ? discoverables : "false");
            attributes["enemies"] = (enemies ? enemies : "false");
            attributes["master"] = ($(this).find("master").text() ? $(this).find("master").text() : "false");
            attributes["startw"] = ($(this).find("startwith").text() ? "true" : "false");
            attributes["button"] = (but ? but : "false");
            attributes["children"] = (chi ? chi : "false");
            attributes["basehealth"] = $(this).find("basehealth").text();
            attributes["basedamage"] = $(this).find("basedamage").text();
            attributes["gender"] = (gender ? gender : "false");
            attributes["onwin"] = (onwin ? onwin : "false");
            attributes["onloss"] = (onloss ? onloss : "false");
            attributes["onmaxlust"] = (onmaxlust ? onmaxlust : "false");
            attributes["loot"] = (loot ? loot : "false");
            attributes["hitchance"] = $(this).find("hitchance").text();
            attributes["critchance"] = $(this).find("critchance").text();
            attributes["critmultiplier"] = $(this).find("critmultiplier").text();
            attributes["text"] = $(this).find("text").text();
            attributes["requirement"] = (req ? req : "false");
            attributes["maxrun"] = ($(this).find("maxrun").text() ? $(this).find("maxrun").text() : "infinite");
            attributes["description"] = $(this).find("description").text();
            attributes["talk"] = (talk ? talk : "false");
            attributes["cgender"] = $(this).find("cgender").text();
            attributes["sell"] = (sell ? sell : "false");
            attributes["multiplier"] = (multi ? multi : "false");
            $.each(ui[ui[index]], function(x, v) {
                out += "<div class='stat'><b>" + v + ":</b>" + attributes[v] + "</div>";
            });
            $("<div />", {
                html: "<span>" + name + "</span><div class='hid_stat'>" + out + "</div>",
                "class": "col_item"
            }).appendTo("#overview_" + ui[index]);
            
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