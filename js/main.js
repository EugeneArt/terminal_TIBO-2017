$(document).ready(function(){

    $(".item").click(function () {
        var name = $(this).find(".item_title").text();
        var price = $(this).find(".item_price").text();
        var img = $(this).find("img").attr("src");

        addToItemPopup(name,price, img);
    });


    $(".calc-btn_accept").click(function () {
        calculate();
        hideButton($(".calc-btn"));
        $(".fullprice span").hide();
        $(".fullprice span").text("0 руб.");
    });

    $(".calc-btn_cancel").click(function () {
        clearLists();
        hideButton($(".calc-btn"));
        $(".fullprice span").hide();
        $(".fullprice span").text("0 руб.");
    });


    $(".accept").click(function () {

        var printer = $('<div/>').addClass("printer");
        var img = $('<img/>').attr("src", "images/print.png");
        printer.append(img);
        $("body").append(printer);
        setInterval( function () {
            printer.remove();
        }, 2000);

        clearLists();
    });

    $(".cancel").click(function () {
        clearLists();
    });


    // item-popup
    $("#count_min").click(function () {
        var val = $("#count").val();
        var intVal = parseInt(val);
        if(intVal > 1) {
            var dec = intVal - 1;
        } else {
            var dec = 1;
        }
        $("#count").val(dec);
    });

    $("#count_max").click(function () {
        var val = $("#count").val();
        var inc = parseInt(val) + 1;
        $("#count").val(inc);
    });

    $(".item-popup_btn").click(function () {
        $(".item-popup_wrapper").hide();
    });

    $(".item-popup_btn-cancel").click(function () {
        clearPopup();
    });
    $(".item-popup_btn-accept").click(function () {
        takePopupItem();
        showButton($(".calc-btn"));
        $(".fullprice span").show();
    });


    var click = 0;
    var callAmount = 0;
    $(".clock").click(function () {
        if (click > 15) {

            var boobs = $('<div/>').addClass("boobs");
            var img = $('<img/>').attr("src", "images/easter-egg/boobs.jpg");
            boobs.append(img);
            $("body").append(boobs);
            setInterval( function () {
                boobs.remove();
            }, 2000);
            click = 0;
            localStorage.setItem('boobsAmount', ++callAmount );

        } else {
            click += 1;
        }
    });

    var checkResult = 0;
    $(".logo").click(function () {
        if (checkResult > 20) {
            var result = $('<span/>').text("Boobs amount: " + localStorage.boobsAmount);
            $(".logo").append(result);
            setInterval( function () {
                result.remove();
            }, 3000);
            checkResult = 0;
        } else {
            checkResult += 1;
        }
    });

});

function addToItemPopup(name,price, img) {
    $(".item-popup_title").text(name);
    $(".item-popup_price").text(price);
    $(".item-popup img").attr("src", img);
    $(".item-popup_wrapper").show();
}
function calculate() {
    var list = $(".list li");

    list.each(function () {
        var str = $(this).text();
        var price = $(this).find("span").text();
        var name = str.split("  ")[0];

        addTextToList(name, price, $(".popup-list"));
    });


    $(".popup").show();
    $(".accept").show();

    var sum = 0;
    $('.list li span').each(function()
    {
        var str = $(this).text();
        if(str.length) {
            var string = $(this).text().slice(0,-4);
            var int = parseFloat(string);
            sum += int;
        }

    });

    if(sum == 0) {
        $(".accept").hide();
        $(".popup h1").text("Вы ничего не заказали!");
    }else {
        $(".popup h1").text("Сумма заказа: " + sum.toFixed(2) + " руб.");
    }
}

function addTextToList(name,price, listName) {
    var li = $('<li/>').text(name);
    var icon = $('<icon/>').addClass('glyphicon glyphicon-remove');
    var span = $('<span/>').text(price);
    icon.attr('onClick', 'removeFromList(this);');
    span.append(icon);
    li.append(span);
    listName.append(li);
}

function removeFromList(item) {
    var currentLi = item.closest("li");
    currentLi.remove();

    var sum = 0;
    $('.list li span').each(function()
    {
        var str = $(this).text();
        if(str.length) {
            var string = $(this).text().slice(0,-4);
            var int = parseFloat(string);
            sum += int;
        }

    });

    $(".fullprice span").text(sum.toFixed(2) + " руб.");


}

function scrollToBottom() {
    $(".terminal").animate({
        scrollTop: $(".terminal")[0].scrollHeight
    }, 1);
}

function addToSum(newprice) {
    var oldprice = $(".fullprice span").text().slice(0,-4);
    var sum = parseFloat(oldprice) + parseFloat(newprice);
    $(".fullprice span").text(sum.toFixed(2) + " руб.");

}

function takePopupItem() {
    var name = $(".item-popup_title").text();
    var price = $(".item-popup_price").text().slice(0,-4);
    var quantity = $("#count").val();

    var intPrice = parseFloat(price);
    var fullprice = quantity*intPrice;

    var product = getEqualProduct(name,quantity, fullprice);

    if ($.isEmptyObject(product)) {
        addTextToList(name + " (" + quantity + " шт.)   ", fullprice.toFixed(2) + " руб.", $(".list"));
    } else {
        addTextToList(product.name + " (" + product.fullQuantity + " шт.)   ",product.fullPrice.toFixed(2) + " руб.", $(".list"));
    }

    scrollToBottom();
    addToSum(fullprice);
    clearPopup();
}
function clearPopup() {

    $(".item-popup_title").text("");
    $(".item-popup_price").text("");
    $(".item-popup img").attr("src", " ");
    $("#count").val(1);
}
function hideButton(btn) {
    btn.prop('disabled', false);
    btn.css("opacity", ".5");
}
function showButton(btn) {
    btn.prop('disabled', false);
    btn.css("opacity", "1");
}
function clearLists() {
    $(".popup").hide();
    $(".list").empty();
    $(".popup-list").empty();
}

function getEqualProduct(name, quantity, price) {
    var list = $(".list li");
    product = {};
    list.each(function () {
        var str = $(this).text();
        var listName = str.split("  ")[0].split(" ").slice(0,-2).join(" ");
        var listQuantity = str.split("  ")[0].split(" ").slice(-2)[0].substring(1, str.length);
        var listPrice = $(this).find("span").text();
        if (listName == name) {
            $(this).remove();
            product.name = name;
            product.fullQuantity = parseInt(listQuantity) + parseInt(quantity);
            product.fullPrice = parseFloat(listPrice) + parseFloat(price);
        }
    });

    return product;

}