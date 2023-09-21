/*    function changeImage()
{
    var image = document.getElementById("image123");
    image.src = "new-image.png";
}*/

let playersURL = "/rest/players";
let countURL = "/rest/players/count";

//main function
function get_list(pageNumber) {

    if(pageNumber == null) {pageNumber = 0}

    let accPerPage = accNumPerPage();
    if(accPerPage == null) {accPerPage = 3}

    $.ajax({
        type: "GET",
        url: playersURL,
        data: {"pageNumber": pageNumber, "pageSize": accPerPage},
        success: populatePlayers
    });

    let count = get_count();
    let numberOfPages = Math.ceil(count / accPerPage);

    let pages = createPageButtons(numberOfPages);

    let changeBtnColor = $("#btn"+pageNumber)
        .css("color", "aqua")
        .css("background-color", "dimgrey");

    let currentPage = getCurrentPage();
}

function populatePlayers(data) {
    let mainTable = document.getElementById("mainTable"); //select whole table Element
    let imgEditSrc = "/img/edit.png"
    let imgDeleteSrc = "/img/delete.png"

    $("tr.tableRow").remove() //delete previous loaded table rows with class attribute "tableRow"

    //loop through data objects
    for (let player of data) {

        //create new row <tr> with attribute class "tableRow"
        let tableRowElement = document.createElement("tr");
        tableRowElement.setAttribute("class", "tableRow");

        //create html table data cells <td> for each player value
        let playerId = document.createElement("td");
        let playerName = document.createElement("td");
        let playerTitle = document.createElement("td");
        let playerRace = document.createElement("td");
        let playerProfession = document.createElement("td");
        let playerLevel = document.createElement("td");
        let playerBirthday = document.createElement("td");
        let playerBanned = document.createElement("td");
        let playerEdit = document.createElement("td");
        let playerDelete = document.createElement("td");

        //create html button elements <button>
        let playerEditBtn = document.createElement("button");
        let playerDeleteBtn = document.createElement("button");
        playerEditBtn.setAttribute("id", "edit_btn" + data.indexOf(player));
        playerDeleteBtn.setAttribute("id", "delete_btn" + data.indexOf(player));
        //set deleteAcc(id) function as button attribute for account deletion
        playerDeleteBtn.setAttribute("onclick", "deleteAcc(" + player.id + ")");

        //create image elements <img>
        let playerEditImg = document.createElement("img");
        let playerDeleteImg = document.createElement("img");
        playerEditImg.setAttribute("src", imgEditSrc);
        playerDeleteImg.setAttribute("src", imgDeleteSrc);

        //insert player values as text into data tags
        playerId.textContent = player.id;
        playerName.textContent = player.name;
        playerTitle.textContent = player.title;
        playerRace.textContent = player.race;
        playerProfession.textContent = player.profession;
        playerLevel.textContent = player.level;
        playerBirthday.textContent = new Date(player.birthday).toLocaleDateString();
        playerBanned.textContent = player.banned;

        playerEdit.insertAdjacentElement('beforeend', playerEditBtn)
            .insertAdjacentElement('beforeend', playerEditImg);
        playerDelete.insertAdjacentElement('beforeend', playerDeleteBtn)
            .insertAdjacentElement('beforeend', playerDeleteImg);

        tableRowElement.appendChild(playerId);
        tableRowElement.appendChild(playerName);
        tableRowElement.appendChild(playerTitle);
        tableRowElement.appendChild(playerRace);
        tableRowElement.appendChild(playerProfession);
        tableRowElement.appendChild(playerLevel);
        tableRowElement.appendChild(playerBirthday);
        tableRowElement.appendChild(playerBanned);
        tableRowElement.insertAdjacentElement('beforeend', playerEdit);
        tableRowElement.insertAdjacentElement('beforeend', playerDelete);

        mainTable.insertAdjacentElement('beforeend', tableRowElement);
    }
}

function accNumPerPage() {
    let selectElement = document.getElementById("accounts");
    return parseInt(selectElement.value);
}

function get_count(){
    let numberOfAcc = 0;
    $.ajax({
        type: "GET",
        url: countURL,
        async: false,
        success: function(data) {
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
        button.setAttribute("onclick", "get_list("+ i +")");
        button.setAttribute("value", "" + i)
        button.textContent = "" + (i + 1);
        docFrag.appendChild(button);
    }
    return document.getElementById("button_row").appendChild(docFrag);
}

function deleteAcc(id) {
    let idURL = playersURL.concat("/" + id);
    $.ajax({
        type: "DELETE",
        url: idURL,
        success: function() {
            console.log("idURL: " + idURL)
            alert("Player with id: " + id + " was deleted");
            get_list(getCurrentPage())
        }
    })
}

/*Метод не работает, возвращает инициализацию*/
function getCurrentPage() {
    let currentPage = 0;
    let pageButtons = document.getElementsByClassName("button_class");

    for (let pageButton of pageButtons) {
        if (pageButton.style('text-color') === '#00ffff') {
            currentPage = (parseInt(pageButton.value));
        }
    }
    console.log("current page is " + currentPage);
    return currentPage;
}