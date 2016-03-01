
name_data = {};

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function loadData() {
    $.getJSON("https://rpg.rigden.us/seeds_of_infinity/resources/json/names.json", function(json_response) {
    //$.getJSON("names.json", function(json_response) {

        name_data = json_response.data;
        name_data.all_first_names = [];
        //name_data.all_first_names.concat(name_data.first_names.feminine);
        //name_data.all_first_names.concat(name_data.first_names.masculine);
        //Array.prototype.push.apply(name_data.all_first_names, name_data.first_names.feminine, name_data.first_names.masculine);
        name_data.all_first_names = $.merge(name_data.all_first_names, name_data.first_names.feminine);
        name_data.all_first_names = $.merge(name_data.all_first_names, name_data.first_names.masculine);
        renderRandomNames();
        activate_buttons();
        renderStats();
        console.log(name_data);
    });
}

function activate_buttons() {
    $( "#random_name_button" ).click(function() {
        renderRandomNames();
    });
}

function renderStats() {
    randomNameCombos = name_data.all_first_names.length * name_data.last_names.length
    $("#random_name_combinations").html(numeral(randomNameCombos).format('0,0'));

    randomNameCombos = name_data.first_names.feminine.length * name_data.last_names.length
    $("#random_feminine_name_combinations").html(numeral(randomNameCombos).format('0,0'));

    randomNameCombos = name_data.first_names.masculine.length * name_data.last_names.length
    $("#random_masculine_name_combinations").html(numeral(randomNameCombos).format('0,0'));


}

function renderRandomNames() {
    name = generateFirstAndLastName();
    $("#generated_name").html(name);
    name = generateFeminineFirstAndLastName();
    $("#generated_feminine_name").html(name);
    name = generateMasculineFirstAndLastName();
    $("#generated_masculine_name").html(name);

}


function generateFirstAndLastName() {
    first_name = generate_first_name() ;
    last_name = generate_last_name();
    name = toTitleCase(first_name + " " + last_name)
    return name
}

function generateFeminineFirstAndLastName() {
    first_name = generate_feminine_first_name() ;
    last_name = generate_last_name();
    name = toTitleCase(first_name + " " + last_name)
    return name
}


function generateMasculineFirstAndLastName() {
    first_name = generate_masculine_first_name() ;
    last_name = generate_last_name();
    name = toTitleCase(first_name + " " + last_name)
    return name
}


function generate_first_name() {
    var first_name = name_data.all_first_names[Math.floor(Math.random()*name_data.all_first_names.length)];
    return first_name
}

function generate_feminine_first_name() {
    var first_name = name_data.first_names.feminine[Math.floor(Math.random()*name_data.first_names.feminine.length)];
    return first_name
}

function generate_masculine_first_name() {
    var first_name = name_data.first_names.masculine[Math.floor(Math.random()*name_data.first_names.masculine.length)];
    return first_name
}

function generate_last_name() {
    var last_name = name_data.last_names[Math.floor(Math.random()*name_data.last_names.length)];
    return last_name
}




$( document ).ready(function() {
    loadData();
});
