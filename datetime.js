/**
 * Created by User on 5/1/2017.
 */
var DatetimePicker = function (mode, timestamp, options, eventListeners) {
    if (!mode) {
        throw Error("Mode is required");
    }

    if (typeof options === "undefined") {
        options = {};
    }

    if (typeof eventListeners === "undefined") {
        eventListeners = {};
    }

    var weekdayNames;
    if (typeof options.weekdays !== "undefined"
        && options.weekdays instanceof Array
        && options.weekdays.length == 7
    ) {
        weekdayNames = options.weekdays;
    } else {
        weekdayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
    }

    var monthNames;
    if (typeof options.months !== "undefined"
        && options.months instanceof Array
        && options.months.length == 12
    ) {
        monthNames = options.months;
    } else {
        monthNames = [
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
    }

    var initTime;
    if (!timestamp) {
        initTime = new Date();
    } else {
        initTime = new Date(timestamp);
    }

    var currentYear = initTime.getFullYear();
    var currentMonth = initTime.getMonth();
    var currentDate = initTime.getDate();

    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth();
    var nowDate = now.getDate();

    this.widget = function (wrapper, options) {
        if (!wrapper) {
            throw Error("Wrapper is required");
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
        wrapper.appendChild(table);

        var topBlock = document.createElement("thead");
        topBlock.className = "top-block";
        table.appendChild(topBlock);

        // Year row
        var yearRow = document.createElement("tr");
        yearRow.className = "year-row";
        topBlock.appendChild(yearRow);

        var previousYearCell = document.createElement("td");
        previousYearCell.className = "previous-year-cell";
        yearRow.appendChild(previousYearCell);
        previousYearCell.addEventListener("click", function (event) {
            if (currentYear == 0) {
                currentYear = 11;
                currentYear--;
            } else {
                currentYear--;
            }
            printPicker();
        });

        var previousYearSpan = document.createElement("span");
        previousYearCell.appendChild(previousYearSpan);

        var yearCell = document.createElement("td");
        yearCell.className = "year-cell";
        yearCell.colSpan = 5;
        yearRow.appendChild(yearCell);

        var yearSpan = document.createElement("span");
        yearCell.appendChild(yearSpan);

        var nextYearCell = document.createElement("td");
        nextYearCell.className = "next-year-cell";
        yearRow.appendChild(nextYearCell);
        nextYearCell.addEventListener("click", function (event) {
            if (currentYear == 11) {
                currentYear = 0;
                currentYear++;
            } else {
                currentYear++;
            }
            printPicker();
        });
        
        var nextYearSpan = document.createElement("span");
        nextYearCell.appendChild(nextYearSpan);

        function printYear() {
            yearSpan.innerHTML = currentYear;
        }

        // Month row
        var monthRow = document.createElement("tr");
        monthRow.className = "month-row";
        topBlock.appendChild(monthRow);

        var previousMonthCell = document.createElement("td");
        previousMonthCell.className = "previous-month-cell";
        monthRow.appendChild(previousMonthCell);
        previousMonthCell.addEventListener("click", function (event) {
            if (currentMonth == 0) {
                currentMonth = 11;
                currentYear--;
            } else {
                currentMonth--;
            }
            printPicker();
        });

        var previousMonthSpan = document.createElement("span");
        previousMonthCell.appendChild(previousMonthSpan);

        var monthCell = document.createElement("td");
        monthCell.className = "month-cell";
        monthCell.colSpan = 5;
        monthRow.appendChild(monthCell);

        var monthSpan = document.createElement("span");
        monthCell.appendChild(monthSpan);

        var nextMonthCell = document.createElement("td");
        nextMonthCell.className = "next-month-cell";
        monthRow.appendChild(nextMonthCell);
        nextMonthCell.addEventListener("click", function (event) {
            if (currentMonth == 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
            printPicker();
        });

        var nextMonthSpan = document.createElement("span");
        nextMonthCell.appendChild(nextMonthSpan);

        function printMonth() {
            monthSpan.innerHTML = monthNames[currentMonth];
        }

        // Calendar block
        var calendarBlock = document.createElement("tbody");
        calendarBlock.className = "calendar-block";
        table.appendChild(calendarBlock);

        var weekdaysRow = document.createElement("tr");
        weekdaysRow.className = "weekdays-row";
        calendarBlock.appendChild(weekdaysRow);

        var weekdayCell;
        var weekdaySpan;
        for (var i = 0; i < 7; i++) {
            weekdayCell = document.createElement("td");
            weekdayCell.className = "weekday-cell";
            weekdaysRow.appendChild(weekdayCell);

            weekdaySpan = document.createElement("span");
            weekdaySpan.innerHTML = weekdayNames[i];
            weekdayCell.appendChild(weekdaySpan);
        }

        function printCalendar() {
            // Empty calendar block without first row
            while (calendarBlock.children[1]) {
                calendarBlock.removeChild(calendarBlock.children[1]);
            }

            // Calendar data
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
                if (year_month.monthPos == 0 && currentDate > daysInMonth) {
                    currentDate = daysInMonth;
                }
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

            var datesRow;
            var dateCell;
            var dateSpan;
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
                    datesRow = document.createElement("tr");
                    datesRow.className = "dates-row";
                    calendarBlock.appendChild(datesRow);
                }
                if (datesRow) {
                    dateCell = document.createElement("td");
                    dateCell.className = "date-cell";

                    // Marks item is today
                    if (item.isToday) {
                        dateCell.classList.add("today");
                    }

                    // Marks item is before/current/after month
                    if (item.monthPos == -1) {
                        dateCell.classList.add("before-month");
                    } else if (item.monthPos == 1) {
                        dateCell.classList.add("after-month");
                    } else {
                        dateCell.classList.add("current-month");
                    }

                    // Marks item is before/current/after date
                    if (item.datePos == -1) {
                        dateCell.classList.add("before-date");
                    } else if (item.datePos == 1) {
                        dateCell.classList.add("after-date");
                    } else {
                        dateCell.classList.add("current-date");
                    }

                    // Binds data year/month/date/day to each item
                    dateCell.setAttribute("data-year", String(item.year));
                    dateCell.setAttribute("data-month", String(item.month));
                    dateCell.setAttribute("data-date", String(item.date));

                    dateSpan = document.createElement("span");
                    dateSpan.innerHTML = item.date;

                    dateCell.appendChild(dateSpan);
                    datesRow.appendChild(dateCell);

                    dateCell.addEventListener("click", function (event) {
                        currentDate = parseInt(this.getAttribute("data-date"));
                        currentMonth = parseInt(this.getAttribute("data-month"));
                        currentYear = parseInt(this.getAttribute("data-year"));
                        printPicker();
                    });
                }
            }
        }

        // Jump to today
        var bottomBlock = document.createElement("tfoot");
        bottomBlock.className = "bottom-block";
        table.appendChild(bottomBlock);

        var jump2todayRow = document.createElement("tr");
        jump2todayRow.className = "jump2today-row";
        bottomBlock.appendChild(jump2todayRow);

        var jump2todayCell = document.createElement("td");
        jump2todayCell.className = "jump2today-cell";
        jump2todayCell.colSpan = 7;
        jump2todayRow.appendChild(jump2todayCell);
        jump2todayCell.addEventListener("click", function () {
            currentDate = nowDate;
            currentMonth = nowMonth;
            currentYear = nowYear;
            printPicker();
        });

        var jump2todaySpan = document.createElement("span");
        jump2todayCell.appendChild(jump2todaySpan);

        function printPicker() {
            printYear();
            printMonth();
            printCalendar();
            if (eventListeners.change instanceof Function) {
                eventListeners.change({
                    "year": currentYear,
                    "month": currentMonth,
                    "date": currentDate
                });
            }
        }

        printPicker();
    }
};