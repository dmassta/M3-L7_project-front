let playersURL = "/rest/players";
let countURL = "/rest/players/count";

//main function
function get_list(pageNumber) {

    if (pageNumber == null) {
        pageNumber = 0
    }

    let accPerPage = accNumPerPage();
    if (accPerPage == null) {
        accPerPage = 3
    }

    $.ajax({
        type: "GET",
        url: playersURL,
        data: {"pageNumber": pageNumber, "pageSize": accPerPage},
        success: populatePlayers
    });

    let count = get_count();
    let numberOfPages = Math.ceil(count / accPerPage);

    let pages = createPageButtons(numberOfPages);

    let changeBtnColor = $("#btn" + pageNumber)
        .css("color", "aqua")
        .css("background-color", "dimgrey");

}

function populatePlayers(data) {
    let mainTable = document.getElementById("mainTable"); //select whole table Element
    let imgEditSrc = "/img/edit.png"
    let imgDeleteSrc = "/img/delete.png"

    $("tr.tableRow").remove() //delete previous loaded table rows with class attribute "tableRow"

    //loop through data objects
    for (let player of data) {

        let tableRowElement = document.createElement("tr");
        tableRowElement.setAttribute("class", "tableRow");

        let playerId = document.createElement("td");
        playerId.setAttribute("id", "playerId" + player.id);

        let playerName = document.createElement("td");
        playerName.setAttribute("id", "playerName" + player.id);

        let playerTitle = document.createElement("td");
        playerTitle.setAttribute("id", "playerTitle" + player.id);

        let playerRace = document.createElement("td");
        playerRace.setAttribute("id", "playerRace" + player.id);

        let playerProfession = document.createElement("td");
        playerProfession.setAttribute("id", "playerProfession" + player.id);

        let playerLevel = document.createElement("td");
        let playerBirthday = document.createElement("td");
        let playerBanned = document.createElement("td");
        playerBanned.setAttribute("id", "playerBanned" + player.id);

        let playerEdit = document.createElement("td");
        let playerDelete = document.createElement("td");

        let playerEditBtn = document.createElement("button");
        let playerDeleteBtn = document.createElement("button");
        playerEditBtn.setAttribute("id", "edit_btn" + player.id);
        playerDeleteBtn.setAttribute("id", "delete_btn" + player.id);

        playerEditBtn.setAttribute("onclick", "editAccount(" + player.id + ")");
        playerDeleteBtn.setAttribute("onclick", "deleteAcc(" + player.id + ")");

        let playerEditImg = document.createElement("img");
        let playerDeleteImg = document.createElement("img");
        playerEditImg.setAttribute("src", imgEditSrc);
        playerDeleteImg.setAttribute("src", imgDeleteSrc);

        playerId.textContent = player.id;
        playerName.textContent = player.name;
        playerTitle.textContent = player.title;
        playerRace.textContent = player.race;
        playerProfession.textContent = player.profession;
        playerLevel.textContent = player.level;
        playerBirthday.textContent = new Date(player.birthday).toLocaleDateString();
        playerBanned.textContent = player.banned;

        tableRowElement.appendChild(playerId);
        tableRowElement.appendChild(playerName);
        tableRowElement.appendChild(playerTitle);
        tableRowElement.appendChild(playerRace);
        tableRowElement.appendChild(playerProfession);
        tableRowElement.appendChild(playerLevel);
        tableRowElement.appendChild(playerBirthday);
        tableRowElement.appendChild(playerBanned);
        tableRowElement.appendChild(playerEdit)
            .appendChild(playerEditBtn)
            .appendChild(playerEditImg);
        tableRowElement.appendChild(playerDelete)
            .appendChild(playerDeleteBtn)
            .appendChild(playerDeleteImg);

        mainTable.appendChild(tableRowElement);
    }
}

function accNumPerPage() {
    let selectElement = document.getElementById("accounts");
    return parseInt(selectElement.value);
}

function get_count() {
    let numberOfAcc = 0;
    $.ajax({
        type: "GET",
        url: countURL,
        async: false,
        success: function (data) {
            numberOfAcc = data;
        }
    })
    return numberOfAcc;
}

function createPageButtons(numberOfPages) {
    $("button.button_class").remove()
    let docFrag = document.createDocumentFragment();
    for (let i = 0; i < numberOfPages; i++) {
        let button = document.createElement("button");
        button.setAttribute("id", "btn" + i);
        button.setAttribute("class", "button_class");
        button.setAttribute("onclick", "get_list(" + i + ")");
        button.setAttribute("value", "" + i)
        button.textContent = "" + (i + 1);
        docFrag.appendChild(button);
    }
    return document.getElementById("button_row").appendChild(docFrag);
}

function deleteAcc(id) {
    let idURL = playersURL.concat("/" + id);
    if (confirm("Are you sure you want to delete account with id " + id + "?")) {
        $.ajax({
            type: "DELETE",
            url: idURL,
            success: function () {
                alert("Account with id " + id + " was deleted");
                get_list(getCurrentPage())
            }
        })
    }
}

function getCurrentPage() {
    let currentPage = 0;
    let pageButtons = document.getElementsByClassName("button_class");

    for (let pageButton of pageButtons) {
        if (pageButton.style.color === 'aqua') {
            currentPage = parseInt(pageButton.value);
        }
    }
    return currentPage;
}

function editAccount(id) {
    const imgSrc = "/img/save.png"
    const editButton = document.getElementById("edit_btn" + id);
    const deleteButton = document.getElementById("delete_btn" + id);

    deleteButton.remove();

    const saveButton = document.createElement("button");
    saveButton.setAttribute("id", "save_btn" + id);
    saveButton.setAttribute("onclick", "saveAccount(" + id + ")");

    const saveButtonImg = document.createElement("img");
    saveButtonImg.setAttribute("src", imgSrc);

    saveButton.appendChild(saveButtonImg);
    editButton.replaceWith(saveButton);

    const name = document.getElementById("playerName" + id);
    const title = document.getElementById("playerTitle" + id);
    const race = document.getElementById("playerRace" + id);
    const profession = document.getElementById("playerProfession" + id)
    const banned = document.getElementById("playerBanned" + id);

    let current_name = $(name).html();
    let current_title = $(title).html();

    //manage name and title inputs
    let name_input = "name_input" + id;
    let title_input = "title_input" + id;

    name.innerHTML = "<input id='" + name_input + "' type='text' " +
        "value='" + current_name + "' maxlength='12'>";
    title.innerHTML = "<input id='" + title_input + "' type='text' " +
        "value='" + title.innerHTML + "' maxlength='30'>";

    function setNewName() {
        let new_name = $(name_input).val();
        if (new_name == null) {
            return current_name;
        } else {
            return new_name
        }
    }

    $(name_input).on("change", setNewName());

    function setNewTitle() {
        let new_title = $(title_input).val();
        if (new_title == null) {
            return current_title;
        } else {
            return new_title
        }
    }

    $(title_input).on("change", setNewTitle());

    // select menu for race
    let currentRace = $(race).html();

    function raceSelectMenu(playerId) {
        let race_select = "race_select" + playerId;
        return "<select id='" + race_select + "' style='background-color: dodgerblue'>" +
            "<option value='HUMAN'>HUMAN</option>" +
            "<option value='DWARF'>DWARF</option>" +
            "<option value='ELF'>ELF</option>" +
            "<option value='GIANT'>GIANT</option>" +
            "<option value='ORC'>ORC</option>" +
            "<option value='TROLL'>TROLL</option>" +
            "<option value='HOBBIT'>HOBBIT</option></select>"
    }

    race.innerHTML = raceSelectMenu(id);
    let race_select = document.getElementById("race_select" + id);
    $(race_select).val(currentRace).change();

    // select menu for profession
    let currentProf = $(profession).html();

    function profSelectMenu(playerId) {
        let prof_select = "prof_select" + playerId;
        return "<select id='" + prof_select + "' style='background-color: dodgerblue'>" +
            "<option value='WARRIOR'>WARRIOR</option>" +
            "<option value='ROGUE'>ROGUE</option>" +
            "<option value='SORCERER'>SORCERER</option>" +
            "<option value='CLERIC'>CLERIC</option>" +
            "<option value='PALADIN'>PALADIN</option>" +
            "<option value='NAZGUL'>NAZGUL</option>" +
            "<option value='WARLOCK'>WARLOCK</option>" +
            "<option value='DRUID'>DRUID</option></select>"
    }

    profession.innerHTML = profSelectMenu(id);
    let prof_select = document.getElementById("prof_select" + id);
    $(prof_select).val(currentProf).change();

    // banned menu
    let currentBanned = $(banned).html();

    function bannedMenu(playerId) {
        let banned_select = "banned_select" + playerId;
        return "<select id='" + banned_select + "' style='background-color: dodgerblue'>" +
            "<option value='false'>false</option>" +
            "<option value='true'>true</option></select>"
    }

    banned.innerHTML = bannedMenu(id);
    let banned_select = document.getElementById("banned_select" + id);
    $(banned_select).val(currentBanned).change();
}

function saveAccount(id) {
    let idURL = playersURL.concat("/" + id);

    const name_input = document.getElementById("name_input" + id);
    const title_input = document.getElementById("title_input" + id);
    const race_select = document.getElementById("race_select" + id);
    const prof_select = document.getElementById("prof_select" + id)
    const banned_select = document.getElementById("banned_select" + id);

    let newName = $(name_input).val();
    let newTitle = $(title_input).val();
    let newRace = $(race_select).val();
    let newProf = $(prof_select).val();
    let newBanned = $(banned_select).val();

    let requestBody = JSON.stringify({
        "name": newName,
        "title": newTitle,
        "race": newRace,
        "profession": newProf,
        "banned": newBanned
    })

    if (confirm("Are you sure you want to save these changes?")) {
        $.ajax({
            type: "POST",
            url: idURL,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            async: false,
            data: requestBody,
            success: function () {
                get_list(getCurrentPage())
                alert("Changes to the account with id " + id + " are saved.\n" +
                    "new name is " + newName + "\n" +
                    "new title is " + newTitle + "\n" +
                    "new race is " + newRace + "\n" +
                    "new profession is " + newProf + "\n" +
                    "new banned status is " + newBanned)
            }
        })
    }
}

function createAccount() {

    let newName_input = $("#create_name").val()
    let newTitle_input = $("#create_title").val()
    let newRace_input = $("#create_race").val()
    let newProf_input = $("#create_prof").val()
    let newBD_input = new Date($("#create_bd").val()).getTime()
    let newBanned_input = $("#create_banned").val()
    let newLevel_input = $("#create_level").val()

    let requestBody = JSON.stringify({
        "name": newName_input,
        "title": newTitle_input,
        "race": newRace_input,
        "profession": newProf_input,
        "level": newLevel_input,
        "birthday": newBD_input,
        "banned": newBanned_input
    })

    if (newName_input === "" || newTitle_input === "" || newLevel_input === "") {
        alert("Name, title or level can't be empty. Please enter at least 1 symbol")
    } else {
        if (confirm("Create this account?")) {
            $.ajax({
                type: "POST",
                url: playersURL,
                dataType: "json",
                contentType: "application/json;charset=UTF-8",
                async: false,
                data: requestBody,
                success: function () {
                    get_list(getCurrentPage(""))
                    alert("Account created.\n" +
                        "Name is " + newName_input + "\n" +
                        "Title is " + newTitle_input + "\n" +
                        "Race is " + newRace_input + "\n" +
                        "Profession is " + newProf_input + "\n" +
                        "Level is " + newLevel_input + "\n" +
                        "Birthdate is " + new Date($("#create_bd").val()).toLocaleDateString() + "\n" +
                        "Banned status is " + newBanned_input)

                    $("#create_name").val("")
                    $("#create_title").val("")
                    $("#create_race").val("")
                    $("#create_prof").val("")
                    $("#create_bd").val("")
                    $("#create_banned").val("")
                    $("#create_level").val("")
                }
            })
        }
    }
}