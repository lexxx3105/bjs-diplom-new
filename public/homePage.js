"use strict"

function funcLogout(){
   ApiConnector.logout((response) => {
    if (response.success) {
        location.reload();
    } else {
        loginErrorMessageBox();
    }
   });
}
let logout  = new LogoutButton();
logout.action = funcLogout;

ApiConnector.current((response)=> {
    if(response.success) {ProfileWidget.showProfile(response.data)};
});

let course = new RatesBoard();
let requestCourses = function() {
    ApiConnector.getStocks((response) => {
        if (response.success){
            course.clearTable();
            course.fillTable(response.data);
        }
    });
};
requestCourses();
setInterval(requestCourses, 6000);

let money = new MoneyManager();
function showMessage (response){
    if (response.success){
        ProfileWidget.showProfile(response.data);
        money.setMessage(true, String("Операция прошла успешно"));
    } else {
        money.setMessage(false, String(response.error));
    };
};

money.addMoneyCallback = function(data){
    ApiConnector.addMoney(data, (response) => {
        showMessage(response);
    });
};

money.conversionMoneyCallback = function(data){
    ApiConnector.convertMoney(data, (response) => {
        showMessage(response);
    });
};

money.sendMoneyCallback = function(){
    ApiConnector.transferMoney(data, (response) => {
        console.log (response);
        console.log (data);
        console.log (data, amount);
        showMessage(response);
    });
};

let favorites = new FavoritesWidget();
function fillTable(response){
    favorites.clearTable();
    favorites.fillTable(response.data);
    money.updateUsersList(response.data);
};
ApiConnector.getFavorites((response) => {
    if (response.success){
        fillTable(response);
    }
});
favorites.addUserCallback = function(data){
    let userName = data.name
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success){
            fillTable(response);
            favorites.setMessage(true, String(`${userName} успешно добавлен`));
        } else {
            favorites.setMessage(false, String(response.error));
        }
    });
}

favorites.removeUserCallback = function(data){
    let userId = data;
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success){
            fillTable(response);
            favorites.setMessage(true, String(`адрес с id ${userId} успешно удален`));
        } else {
            favorites.setMessage(false, String(response.error));
        }
    });
}    