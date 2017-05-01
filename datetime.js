/**
 * Created by User on 5/1/2017.
 */
var DatetimePicker = function (mode, timestamp, options) {
    if (!mode) {
        throw Error("Mode required");
    }
    this.mode = mode;

    if (options.weekdays
        && options.weekdays.constructor === Array
        && options.weekdays.length == 7
    ) {
        this.weekdays = options.weekdays;
    } else {
        this.weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
    }
    this.months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var currentTime;
    if (!timestamp) {
        currentTime = new Date();
    } else {
        currentTime = new Date(timestamp);
    }
    var currentYear = currentTime.getFullYear();
    var currentMonth = currentTime.getMonth();
    var currentDate = currentTime.getDate();

    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth();
    var nowDate = now.getDate();

    this.widget = function (wrapper, options) {
        if (!wrapper) {
            throw Error("Wrapper required");
        }
        // Normalize
        if (!options) {
            options = {};
        }
        options.displayBeforeWeeks = parseInt(options.displayBeforeWeeks) || 0;
        options.displayAfterWeeks = parseInt(options.displayAfterWeeks) || 0;
        if (options.displayBeforeWeeks > 3
            || options.displayBeforeWeeks < 0
            || options.displayAfterWeeks > 3
            || options.displayAfterWeeks < 0
        ) {
            throw Error("Option display before/after weeks must be in range [0, 3]");
        }

        // Creates table for the calendar
        var table = document.createElement("table");

        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var i = 0; i < 7; i++) {
            var td = document.createElement("td");
            tr.appendChild(td);
            td.innerHTML = this.weekdays[i];
        }

        var calendar = [];

        var year_months = [{
            "year": currentYear,
            "month": currentMonth,
            "monthPos": 0
        }];
        if (currentMonth == 0) {
            year_months.unshift({
                "year": currentYear - 1,
                "month": 11,
                "monthPos": -1
            });
            year_months.push({
                "year": currentYear,
                "month": 1,
                "monthPos": 1
            });

        } else if (currentMonth == 11) {
            year_months.unshift({
                "year": currentYear,
                "month": 10,
                "monthPos": -1
            });
            year_months.push({
                "year": currentYear + 1,
                "month": 0,
                "monthPos": 1
            });
        } else {
            year_months.unshift({
                "year": currentYear,
                "month": currentMonth - 1,
                "monthPos": -1
            });
            year_months.push({
                "year": currentYear,
                "month": currentMonth + 1,
                "monthPos": 1
            });
        }

        year_months.forEach(function (year_month) {
            var daysInMonth = new Date(year_month.year, year_month.month + 1, 0).getDate(); // date "zero" of next month
            for (var date = 1; date <= daysInMonth; date++) {
                calendar.push({
                    "year": year_month.year,
                    "month": year_month.month,
                    "date": date,
                    "day": new Date(year_month.year, year_month.month, date).getDay(),
                    "monthPos": year_month.monthPos,
                    "datePos": year_month.monthPos != 0
                        ? year_month.monthPos
                        : (date - currentDate) / Math.abs(date - currentDate) || 0,
                    "isToday": year_month.year == nowYear && year_month.month == nowMonth && date == nowDate
                });
            }
        });

        tr = null;

        for (var j = 0; j < calendar.length; j++) {
            var item = calendar[j];
            if (item.day == 0) { // Monday
                if (item.monthPos == -1) {
                    if (calendar[(j + 6) + 7 * options.displayBeforeWeeks].monthPos == -1) {
                        j += 6;
                        continue;
                    }
                }
                if (item.monthPos == 1) {
                    if (calendar[j - 7 * options.displayAfterWeeks].monthPos == 1) {
                        break;
                    }
                }
                tr = document.createElement("tr");
                table.appendChild(tr);
            }
            if (tr != null) {
                td = document.createElement("td");
                td.className = "date";
                td.setAttribute("data-monthPos", item.monthPos);
                td.setAttribute("data-datePos", item.datePos);
                if (item.isToday) {
                    td.classList.add("today");
                }
                var span = document.createElement("span");
                span.innerHTML = item.date;
                td.appendChild(span);
                tr.appendChild(td);
            }
        }

        wrapper.appendChild(table);
    }
};