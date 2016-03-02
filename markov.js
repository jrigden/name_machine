
var first_name_bundle = {};
var last_name_bundle = {};

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
function isVowel(letter) {
    var lowerLetter = letter.toLowerCase()
    return ['a', 'e', 'i', 'o', 'u', 'y'].indexOf(lowerLetter) !== -1

}

function apostrophize(word) {
    var apostrophePositions = []
    var consonantSeriesCounter = 0;
    var word_length = word.length;
    var new_word = "";
    for (i = 0; i < word_length; i++) {
        if (isVowel(word[i])) {
            //console.log("vowel")
            new_word = new_word.concat(word[i])
            consonantSeriesCounter = 0;
        } else {
            consonantSeriesCounter = consonantSeriesCounter + 1;
            new_word = new_word.concat(word[i])
        }
        if (consonantSeriesCounter > 2) {
            new_word = new_word.concat("'")
            consonantSeriesCounter = 0;

        }
    }
    return new_word;

}

function loadData() {
    $.when(
        $.getJSON("json/first_name_chain.json", function(data) {
            first_name_bundle = data.data;
        }),
        $.getJSON("json/last_name_chain.json", function(data) {
            last_name_bundle = data.data;
        })
        ).then(function() {
            console.log("ssss")
            renderName();
            $( "#chain_name_button" ).click(function() {
                renderName();
            });
        });
}

function generateFirstNameLetter(current_item) {
    var item = first_name_bundle[current_item][Math.floor(Math.random() * first_name_bundle[current_item].length)];
    return item;
}

function generateFirstName() {
    var series_active = true;
    var firstName = [];
    var current_item = null;
    while (series_active) {
        current_item = generateFirstNameLetter(current_item);
        if (current_item == null) {
            series_active = false
        } else {
            firstName.push(current_item)
        }
    }
    return firstName.join("")
}

function filteredFirstName() {
    var invalidName = true;
    var firstName = "";
    while (invalidName) {
        invalidName = false
        firstName = generateFirstName();
        if (firstName.length < 3) {
            invalidName = true
        }
        if (firstName.length > 10) {
            invalidName = true
        }
    }
    firstName = apostrophize(firstName)
    return firstName;

}


function generateLastNameLetter(current_item) {
    var item = last_name_bundle[current_item][Math.floor(Math.random() * last_name_bundle[current_item].length)];
    return item;
}

function generateLastName() {
    var series_active = true;
    var lastName = [];
    var current_item = null;
    while (series_active) {
        current_item = generateLastNameLetter(current_item);
        if (current_item == null) {
            series_active = false
        } else {
            lastName.push(current_item)
        }
    }
    return lastName.join("")
}


function filteredLastName() {
    var invalidName = true;
    var lastName = "";
    while (invalidName) {
        invalidName = false
        lastName = generateLastName();
        if (lastName.length < 3) {
            invalidName = true
        }
        if (lastName.length > 10) {
            invalidName = true
        }
    }
    lastName = apostrophize(lastName)
    return lastName;

}

function generateName() {
    var firstName = filteredFirstName()
    var lastName = filteredLastName()
    var fullName = firstName + " " + lastName;
    fullName = toTitleCase(fullName);
    return fullName
}

function renderName() {
    var name = generateName();
    $("#chain_name").html(name);

}

$( document ).ready(function() {
    loadData();
});
