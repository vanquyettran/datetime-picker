/**
 * Created by User on 5/1/2017.
 */
var DatetimePicker = function (timestamp, options, eventListeners) {

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

    var initTime = !timestamp ? new Date() : new Date(timestamp);

    var current = {
        _year: 0,
        _month: 0,
        _date: 0,
        _hours: 0,
        _minutes: 0,
        _seconds: 0,

        get year() {
            return this._year;
        },
        get month() {
            return this._month;
        },
        get date() {
            return this._date;
        },
        get hours() {
            return this._hours;
        },
        get minutes() {
            return this._minutes;
        },
        get seconds() {
            return this._seconds;
        },

        set year(value) {
            value = parseInt(value) || 0;
            this._year = value;
        },
        set month(value) {
            value = parseInt(value) || 0;
            if (value > 11) {
                this._month = 11;
            } else if (value < 0) {
                this._month = 0;
            } else {
                this._month = value;
            }
        },
        set date(value) {
            value = parseInt(value) || 0;
            var daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
            if (value > daysInMonth) {
                this._date = daysInMonth;
            } else if (value < 1) {
                this._date = 1;
            } else {
                this._date = value;
            }
        },
        set hours(value) {
            value = parseInt(value) || 0;
            if (value > 23) {
                this._hours = 23;
            } else if (value < 0) {
                this._hours = 0;
            } else {
                this._hours = value;
            }
        },
        set minutes(value) {
            value = parseInt(value) || 0;
            if (value > 59) {
                this._minutes = 59;
            } else if (value < 0) {
                this._minutes = 0;
            } else {
                this._minutes = value;
            }
        },
        set seconds(value) {
            value = parseInt(value) || 0;
            if (value > 59) {
                this._seconds = 59;
            } else if (value < 0) {
                this._seconds = 0;
            } else {
                this._seconds = value;
            }
        }
    };

    current.year = initTime.getFullYear();
    current.month = initTime.getMonth();
    current.date = initTime.getDate();
    current.hours = initTime.getHours();
    current.minutes = initTime.getMinutes();
    current.seconds = initTime.getSeconds();

    function Now() {
        var now = new Date();
        Object.defineProperties(this, {
            "year": {
                "value": now.getFullYear(),
                "writable": false
            },
            "month": {
                "value": now.getMonth(),
                "writable": false
            },
            "date": {
                "value": now.getDate(),
                "writable": false
            },
            "hours": {
                "value": now.getHours(),
                "writable": false
            },
            "minutes": {
                "value": now.getMinutes(),
                "writable": false
            },
            "seconds": {
                "value": now.getSeconds(),
                "writable": false
            }
        });
    }

    this.widget = function (wrapper, options) {
        this.calendar(wrapper, options);
        this.clock(wrapper, options);
    };

    this.clock = function (wrapper, options) {
        if (!wrapper) {
            throw Error("Wrapper is required");
        }

        // Creates table for the calendar
        var table = document.createElement("table");
        wrapper.appendChild(table);

        var actRow;
        var actCell;
        var actSpan;
        ["increase", "decrease"].forEach(function (act) {
            actRow = document.createElement("tr");
            actRow.className = act + "-row";
            table.appendChild(actRow);
            ["hours", "minutes", "seconds"].forEach(function (unit) {
                [10, 1].forEach(function (change) {
                    actCell = document.createElement("td");
                    actCell.className = act + "-" + change + "-" + unit + "-cell";
                    actRow.appendChild(actCell);
                    actSpan = document.createElement("span");
                    actCell.appendChild(actSpan);
                    actCell.addEventListener("click", function (event) {
                        if (act == "increase") {
                            current[unit] += change;
                        } else {
                            current[unit] -= change;
                        }
                        printTime();
                    });
                });
            });
        });

        // Time row
        var timeRow = document.createElement("tr");
        timeRow.className = "time-row";
        table.insertBefore(timeRow, table.children[1]);

        var hoursCell = document.createElement("td");
        hoursCell.className = "hours-cell";
        hoursCell.colSpan = 2;
        timeRow.appendChild(hoursCell);

        var hoursSpan = document.createElement("span");
        hoursCell.appendChild(hoursSpan);

        var minutesCell = document.createElement("td");
        minutesCell.className = "minutes-cell";
        minutesCell.colSpan = 2;
        timeRow.appendChild(minutesCell);

        var minutesSpan = document.createElement("span");
        minutesCell.appendChild(minutesSpan);
        
        var secondsCell = document.createElement("td");
        secondsCell.className = "seconds-cell";
        secondsCell.colSpan = 2;
        timeRow.appendChild(secondsCell);

        var secondsSpan = document.createElement("span");
        secondsCell.appendChild(secondsSpan);

        printTime();

        function printTime() {
            hoursSpan.innerHTML = current.hours;
            minutesSpan.innerHTML = current.minutes;
            secondsSpan.innerHTML = current.seconds;
            if (eventListeners.change instanceof Function) {
                eventListeners.change(current);
            }
        }

        var jump2nowRow = document.createElement("tr");
        jump2nowRow.className = "jump2now-row";
        table.appendChild(jump2nowRow);

        var jump2nowCell = document.createElement("td");
        jump2nowCell.className = "jump2now-cell";
        jump2nowCell.colSpan = 6;
        jump2nowRow.appendChild(jump2nowCell);
        jump2nowCell.addEventListener("click", function () {
            var now = new Now();
            current.hours = now.hours;
            current.minutes = now.minutes;
            current.seconds = now.seconds;
            printTime();
        });

        var jump2nowSpan = document.createElement("span");
        jump2nowCell.appendChild(jump2nowSpan);

    };

    this.calendar = function (wrapper, options) {
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
            if (current.year == 0) {
                current.year = 11;
                current.year--;
            } else {
                current.year--;
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
            if (current.year == 11) {
                current.year = 0;
                current.year++;
            } else {
                current.year++;
            }
            printPicker();
        });
        
        var nextYearSpan = document.createElement("span");
        nextYearCell.appendChild(nextYearSpan);

        function printYear() {
            yearSpan.innerHTML = current.year;
        }

        // Month row
        var monthRow = document.createElement("tr");
        monthRow.className = "month-row";
        topBlock.appendChild(monthRow);

        var previousMonthCell = document.createElement("td");
        previousMonthCell.className = "previous-month-cell";
        monthRow.appendChild(previousMonthCell);
        previousMonthCell.addEventListener("click", function (event) {
            if (current.month == 0) {
                current.month = 11;
                current.year--;
            } else {
                current.month--;
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
            if (current.month == 11) {
                current.month = 0;
                current.year++;
            } else {
                current.month++;
            }
            printPicker();
        });

        var nextMonthSpan = document.createElement("span");
        nextMonthCell.appendChild(nextMonthSpan);

        function printMonth() {
            monthSpan.innerHTML = monthNames[current.month];
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

            var now = new Now();

            // Calendar data
            var calendar = [];

            var year_months = [{
                "year": current.year,
                "month": current.month,
                "monthPos": 0
            }];
            if (current.month == 0) {
                year_months.unshift({
                    "year": current.year - 1,
                    "month": 11,
                    "monthPos": -1
                });
                year_months.push({
                    "year": current.year,
                    "month": 1,
                    "monthPos": 1
                });

            } else if (current.month == 11) {
                year_months.unshift({
                    "year": current.year,
                    "month": 10,
                    "monthPos": -1
                });
                year_months.push({
                    "year": current.year + 1,
                    "month": 0,
                    "monthPos": 1
                });
            } else {
                year_months.unshift({
                    "year": current.year,
                    "month": current.month - 1,
                    "monthPos": -1
                });
                year_months.push({
                    "year": current.year,
                    "month": current.month + 1,
                    "monthPos": 1
                });
            }

            year_months.forEach(function (year_month) {
                var daysInMonth = new Date(year_month.year, year_month.month + 1, 0).getDate(); // date "zero" of next month
                if (year_month.monthPos == 0 && current.date > daysInMonth) {
                    current.date = daysInMonth;
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
                            : (date - current.date) / Math.abs(date - current.date) || 0,
                        "isToday": year_month.year == now.year && year_month.month == now.month && date == now.date
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
                        current.date = parseInt(this.getAttribute("data-date"));
                        current.month = parseInt(this.getAttribute("data-month"));
                        current.year = parseInt(this.getAttribute("data-year"));
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
            var now = new Now();
            current.date = now.date;
            current.month = now.month;
            current.year = now.year;
            printPicker();
        });

        var jump2todaySpan = document.createElement("span");
        jump2todayCell.appendChild(jump2todaySpan);

        function printPicker() {
            printYear();
            printMonth();
            printCalendar();
            if (eventListeners.change instanceof Function) {
                eventListeners.change(current);
            }
        }

        printPicker();
    };

};