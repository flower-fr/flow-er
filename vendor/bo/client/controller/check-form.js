/* eslint-disable no-mixed-spaces-and-tabs */
const getCurrentDate = (formated = true) => {
    let now = new Date(), year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate()
    if (month < 10) month = "0" + month
    if (day < 10) day = "0" + day
    if (formated) return year + "-" + month + "-" + day
    else return day + "/" + month + "/" + year
};

// checkNumber returns null if the given number is valid, else a localized error message
function checkNumber(number, min, max) {
	
    // Regex for localized number formats
    var numberFormat = /^-?\d+(\,?\d+)?$/
    var numberFormat2 = /^-?\d+(\.?\d+)?$/

    if (min <= 0 && !number) return null
	
    if (!numberFormat.test(number) && !numberFormat2.test(number)) {
        return "The number format is invalid"
    }

    if (number.indexOf(",") >= 0) {
        number = number.split(",")
        number = number[0] + "." + number[1]
    }
    else if (number.indexOf(".") >= 0) {
        number = number.split(".")
        number = number[0] + "." + number[1]
    }
    number = parseFloat(number)
    if (number < min) {
	   	return "Too small value"
    }
    else if (number > max) {
        return "Too big value"
    }
    else return null
}

function getNumber(number, precision) {

    var power = 1
    for (i = 0; i < precision; i++) power *= 10

    if (number.indexOf(".") >= 0) {
        number = number.split(".")
        number = number[0] + "." + number[1]
    }
    else if (number.indexOf(",") >= 0) {
        number = number.split(",")
        number = number[0] + "." + number[1]
    }
    return Math.round(parseFloat(number * power)) / power
}

// checkDate returns null if the given date is valid, else a localized error message
function checkDate(date) {

    const dateFormat = /^\d{1,2}[\/.]\d{1,2}[\/.]\d{4}$/
	
    if (!dateFormat.test(date)) {
        return "The date format should be mm/dd/yyyy"
    }
    else {
	    date = date.split("/")
	    date[1] -=1 // Adjust month
	    var testDate = new Date()
	    testDate.setFullYear(date[2])
	    testDate.setMonth(date[1], date[0])
	    testDate.setDate(date[0])
	    if (testDate.getFullYear() != parseInt(date[2]) ||
	 	    testDate.getMonth() != parseInt(date[1]) ||
	        testDate.getDate() != parseInt(date[0])) {
		    return "This date does not exist"
        }
	    else return null
    }
}

// checkTime returns null if the given time is valid, else a localized error message
function checkTime(time) {

    // Regex for time
    const timeFormat = new RegExp("^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$")
		
    if (time && !timeFormat.test(time)) return "The time is invalid"
    else return null
}

// checkEmail returns null if the given email is valid, else a localized error message
function checkEmail(value) {

    // Regex for email format
    const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/
	
    if (!emailFormat.test(value)) return "Invalid email format"
    else return null
}

// checkPhone returns null if the given phone number is valid, else a localized error message
function checkPhone(value) {

    // Regex for phone format
    const phoneFormat = /^\+?([0-9\. ]*)$/
	
    if (!phoneFormat.test(value)) return "Invalid phone format"
    else return null
}

function checkForm() {

    const checkAll = () => {
        let isValid = true

        $(".updateDate").each(function () {
            if ($(this).val() && checkDate($(this).val()) !== null) isValid = false
        })

        $(".updateEmail").each(function () {
            if ($(this).val() && !$(this).val().match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) isValid = false
        })

        $(".updatePhone").each(function () {
            if ($(this).val() && !$(this).val().match(/^\+?([0-9\. ]*)$/)) isValid = false
        })

        $(".updateNumber").each(function () {
            if ($(this).val() && null != checkNumber($(this).val(), -999999, 999999)) isValid = false
        })

        $(".updateTime").each(function () {
            if ($(this).val() && checkTime($(this).val()) !== null) isValid = false
        })
        
        if (isValid) $(".submitButton").prop("disabled", false)
        else $(".submitButton").prop("disabled", true)
    }

    // Initial check

    $(".updateDate").each(function () {
        if ($(this).val() && checkDate($(this).val())) {
            $(this).addClass("is-invalid")
            $(".submitButton").prop("disabled", true)
        }
    })

    $(".updateEmail").each(function () {
        if ($(this).val() && !$(this).val().match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            $(this).addClass("is-invalid")
            $(".submitButton").prop("disabled", true)
        }
    })

    $(".updatePhone").each(function () {
        if ($(this).val() && !$(this).val().match(/^\+?([0-9\. ]*)$/)) {
            $(this).addClass("is-invalid")
            $(".submitButton").prop("disabled", true)
        }
    })

    $(".updateNumber").each(function () {
        if ($(this).val()) {
            const error = checkNumber($(this).val(), -999999, 999999)
            if (null != error) {
                $(this).addClass("is-invalid")
                $(".submitButton").prop("disabled", true)
            }else{
                checkAll()
            }
        }
    })

    $(".updateTime").each(function () {
        if ($(this).val()) {
            const error = checkTime($(this).val())
            if (error) {
                $(this).addClass("is-invalid")
                $(".submitButton").prop("disabled", true)
            }
        }
    })

    // Check on input value change

    $(".updateDate").change(function () {
        if (!$(this).val() || !checkDate($(this).val())) {
            $(this).removeClass("is-invalid")
            checkAll()
        }
        else {
            $(this).addClass("is-invalid")
            $(".submitButton").prop("disabled", true)
        }
    })

    $(".updateEmail").change(function () {
        if (!$(this).val() || $(this).val().match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
            $(this).removeClass("is-invalid")
            checkAll()
        }
        else {
            $(this).addClass("is-invalid")
            checkAll()
        }
    })

    $(".updatePhone").change(function () {
        if (!$(this).val() || $(this).val().match(/^\+?([0-9\. ]*)$/)) {
            $(this).removeClass("is-invalid")
            checkAll()
        }
        else {
            $(this).addClass("is-invalid")
            $(".submitButton").prop("disabled", true)
        }
    })

    $(".updateNumber").change(function () {
        const error = checkNumber($(this).val(), -999999, 999999)
        if (null == error) {
            $(this).removeClass("is-invalid")
            checkAll()
        }
        else {
            $(this).addClass("is-invalid")
            checkAll()
        }
    })

    $(".updateTime").change(function () {
        const error = checkTime($(this).val())
        if (!error) {
            $(this).removeClass("is-invalid")
            checkAll()
        }
        else {
            $(this).addClass("is-invalid")
            $(".submitButton").prop("disabled", true)
        }
    })
}
