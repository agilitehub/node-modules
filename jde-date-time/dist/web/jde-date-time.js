
var returnTypeOf = function returnTypeOf(input) {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;
    var booleanConstructor = true.constructor;
    var integerConstructor = (123).constructor;

    var result = null;

    if (input === undefined) {
        result = "undefined";
    } else if (input === null) {
        result = null;
    } else if (input.constructor === stringConstructor) {
        result = "String";
    } else if (input.constructor === arrayConstructor) {
        result = "Array";
    } else if (input.constructor === objectConstructor) {
        result = "Object";
    } else if (input.constructor === booleanConstructor) {
        result = "Boolean";
    } else if (input.constructor === integerConstructor) {
        result = "Number";
    }

    return result;
};

var convertJDEDateToJSDate = function(jde_date) {
    var result = "";
    var jde_month = "";
    var tmpDate = null;

    if (jde_date === null || jde_date === "" || returnTypeOf(jde_date) !== "Number" || jde_date.toString().length > 6 || jde_date.toString().length < 4) {
        result = "JDE Date parameter needs to be of type 'Number' with max 6 characters";
    } else {
        switch (jde_date.toString().length) {
            case 4:
                jde_date = jde_date.toString().substr(0, 3) + "00" + jde_date.toString().substr(3, 1);
                break;
            case 5:
                jde_date = jde_date.toString().substr(0, 3) + "0" + jde_date.toString().substr(3, 2);
                break;
        }

        jde_month = parseInt(jde_date.toString().substr(3, 3));
        tmpDate = new Date(1900 + jde_date / 1000, 0, jde_month);
        result = tmpDate.toDateString();
    }

    return result;
};

var convertJDETimeToJSTime = function(time) {
    var result = "";

    if (time === null || time === "" || returnTypeOf(time) !== "Number" || time.length > 6) {
        return "JDE Time parameter needs to be of type 'Number' with max 6 characters";
    } else {
        time = time.toString();

        time = time.replace(/^(?:(?:(\d)?(\d))?(\d\d))?(\d\d)$/, function (all, hr1, hr2, min, sec) {
            return (hr1 || '0') + (hr2 || '0') + ':' + (min || '00') + '.' + sec;
        });

        var hr = time.substr(0, 2);
        var min = time.substr(3, 2);
        var sec = time.substr(6, 2);
        var date = new Date();
        date.setHours(hr, min, sec);
        date = date.toTimeString().split(' ')[0];
        result = date;
    }

    return result;
};

var convertJSTimeToJDETime = function(time) {
    var result = "";
    if (time === null || time === "" || returnTypeOf(time) !== "String" || time.length > 8) {
        return "JS Time parameter needs to be of type 'String' with max 8 characters, including 2 colons";
    } else {
        if (typeof time === "string") {
            time = time.replace(/:/g, '');
            result = time;
        }
    }

    return result;
};

var convertJSDateToJDEDate = function(date) {
    var result = "";
    if (date === null || date === "" || returnTypeOf(date) !== "String" || date.length > 10) {
        return "JS Date parameter needs to be of type 'String' with max 10 characters, including dashes or slashes";
    } else {
        var yy = date.substr(0, 4);
        yy = yy % 100;

        var c = 1;
        var js_date = new Date(date);
        var start = new Date(js_date.getFullYear(), 0, 0);
        var diff = js_date - start;
        var oneDay = 24 * 60 * 60 * 1000;
        var day = Math.floor(diff / oneDay);

        jde_date = c.toString() + yy.toString() + day.toString();

        result = jde_date;
    }

    return result;
};