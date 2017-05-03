/**
 * Created by User on 5/1/2017.
 */
var DatetimePicker = function (container, timestamp, options) {

    if (!container) {
        throw Error("Container is required");
    }
    if (container.nodeName !== "TABLE") {
        throw Error("Wrapper must be table");
    }
    // this.container = container;

    if (typeof options == "undefined") {
        options = {};
    }
    if (options instanceof Object == false) {
        throw Error("Datetime picker options must be an object");
    }

    // if (typeof eventListeners === "undefined") {
    //     eventListeners = {};
    // }

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

    var current = this.current = {
        time: new Date(),
        eventListeners: {
            "change": []
        },
        addEventListeners: function (event, func) {
            if (this.eventListeners[event]) {
                this.eventListeners[event].push(func);
            }
        },
        callEventListeners: function (event) {
            if (this.eventListeners[event]) {
                this.eventListeners[event].forEach(function (func) {
                    func();
                });
            }
        },
        // Getter
        get year() {
            return this.time.getFullYear();
        },
        get month() {
            return this.time.getMonth();
        },
        get date() {
            return this.time.getDate();
        },
        get hours() {
            return this.time.getHours();
        },
        get minutes() {
            return this.time.getMinutes();
        },
        get seconds() {
            return this.time.getSeconds();
        },

        // Setter
        set year(value) {
            value = parseInt(value) || 0;
            this.time.setFullYear(value);
            this.callEventListeners("change");
        },
        set month(value) {
            value = parseInt(value) || 0;
            this.time.setMonth(value);
            this.callEventListeners("change");
        },
        set date(value) {
            value = parseInt(value) || 0;
            this.time.setDate(value);
            this.callEventListeners("change");
        },
        set hours(value) {
            value = parseInt(value) || 0;
            this.time.setHours(value);
            this.callEventListeners("change");
        },
        set minutes(value) {
            value = parseInt(value) || 0;
            this.time.setMinutes(value);
            this.callEventListeners("change");
        },
        set seconds(value) {
            value = parseInt(value) || 0;
            this.time.setSeconds(value);
            this.callEventListeners("change");
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

    this.widget = function (options) {
        if (typeof options == "undefined") {
            options = {};
        }
        if (options instanceof Object == false) {
            throw Error("Widget options must be an object");
        }
        this.appendYearMonthBlock(options.yearMonthBlock);
        this.appendDateBlock(options.dateBlock);
        this.appendTimeBlock(options.timeBlock);
        this.appendJump2nowBlock(options.jump2nowBlock);
        return this;
    };

    // if (callback instanceof Function) {
    //     current.addEventListeners("change", function (current) {
    //         callback(current);
    //     });
    // }

    this.appendTimeBlock = function (options) {
        // if (!table) {
        //     throw Error("Wrapper is required");
        // }
        // if (table.nodeName.toLowerCase() !== "table") {
        //     throw Error("Wrapper must be table");
        // }

        // var table = container;

        if (typeof options == "undefined") {
            options = {};
        }
        if (options instanceof Object == false) {
            throw Error("Time block options must be an object");
        }

        // Creates table for the calendar
        var timeBlock = document.createElement("tbody");
        timeBlock.className = "time-block";
        container.appendChild(timeBlock);

        var actRow;
        var actCell;
        var actSpan;
        ["increase", "decrease"].forEach(function (act) {
            actRow = document.createElement("tr");
            actRow.className = act + "-row";
            timeBlock.appendChild(actRow);
            ["hours", "minutes", "seconds"].forEach(function (unit) {
                [[10, 1], [1, 1]].forEach(function (change) {
                    actCell = document.createElement("td");
                    actCell.colSpan = change[1];
                    actCell.className = act + "-cell";
                    actCell.setAttribute("data-change", change[0]);
                    actCell.setAttribute("data-unit", unit);
                    actRow.appendChild(actCell);
                    actSpan = document.createElement("span");
                    actCell.appendChild(actSpan);
                    actCell.addEventListener("click", function (event) {
                        if (act == "increase") {
                            current[unit] += change[0];
                        } else {
                            current[unit] -= change[0];
                        }
                    });
                });
            });
        });

        // Time row
        var timeRow = document.createElement("tr");
        timeRow.className = "time-row";
        timeBlock.insertBefore(timeRow, timeBlock.children[1]);

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

        function printTime() {
            hoursSpan.innerHTML = current.hours;
            minutesSpan.innerHTML = current.minutes;
            secondsSpan.innerHTML = current.seconds;
        }

        printTime();
        current.addEventListeners("change", printTime);

        // return this;
    };

    this.appendYearMonthBlock = function (options) {
        if (typeof options == "undefined") {
            options = {};
        }
        if (options instanceof Object == false) {
            throw Error("Year-month block options must be an object");
        }

        var yearMonthBlock = document.createElement("tbody");
        yearMonthBlock.className = "year-month-block";
        container.appendChild(yearMonthBlock);

        // Act row
        var actRow;
        var actCell;
        var actSpan;
        ["increase", "decrease"].forEach(function (act) {
            actRow = document.createElement("tr");
            actRow.className = act + "-row";
            yearMonthBlock.appendChild(actRow);
            ["year", "month"].forEach(function (unit) {
                var changes;
                if (unit == "year") {
                    changes = [[1000, 1], [100, 1], [10, 1], [1, 1]];
                } else {
                    changes = [[1, 3]];
                }
                changes.forEach(function (change) {
                    actCell = document.createElement("td");
                    actCell.colSpan = change[1];
                    actCell.className = act + "-cell";
                    actCell.setAttribute("data-change", change[0]);
                    actCell.setAttribute("data-unit", unit);
                    actRow.appendChild(actCell);
                    actSpan = document.createElement("span");
                    actCell.appendChild(actSpan);
                    actCell.addEventListener("click", function (event) {
                        if (act == "increase") {
                            current[unit] += change[0];
                        } else {
                            current[unit] -= change[0];
                        }
                    });
                });
            });
        });

        // Year-month row
        var yearMonthRow = document.createElement("tr");
        yearMonthRow.className = "year-month-row";
        yearMonthBlock.insertBefore(yearMonthRow, yearMonthBlock.children[1]);

        var yearCell = document.createElement("td");
        yearCell.className = "year-cell";
        yearCell.colSpan = 4;
        yearMonthRow.appendChild(yearCell);

        var yearSpan = document.createElement("span");
        yearCell.appendChild(yearSpan);

        var monthCell = document.createElement("td");
        monthCell.className = "month-cell";
        monthCell.colSpan = 3;
        yearMonthRow.appendChild(monthCell);

        var monthSpan = document.createElement("span");
        monthCell.appendChild(monthSpan);

        // Year row
        // var yearRow = document.createElement("tr");
        // yearRow.className = "year-row";
        // yearMonthBlock.appendChild(yearRow);
        //
        // var previousYearCell = document.createElement("td");
        // previousYearCell.className = "previous-year-cell";
        // yearRow.appendChild(previousYearCell);
        // previousYearCell.addEventListener("click", function (event) {
        //     if (current.year == 0) {
        //         current.year = 11;
        //         current.year--;
        //     } else {
        //         current.year--;
        //     }
        // });
        //
        // var previousYearSpan = document.createElement("span");
        // previousYearCell.appendChild(previousYearSpan);
        //
        // var yearCell = document.createElement("td");
        // yearCell.className = "year-cell";
        // yearCell.colSpan = 5;
        // yearRow.appendChild(yearCell);
        //
        // var yearSpan = document.createElement("span");
        // yearCell.appendChild(yearSpan);
        //
        // var nextYearCell = document.createElement("td");
        // nextYearCell.className = "next-year-cell";
        // yearRow.appendChild(nextYearCell);
        // nextYearCell.addEventListener("click", function (event) {
        //     if (current.year == 11) {
        //         current.year = 0;
        //         current.year++;
        //     } else {
        //         current.year++;
        //     }
        // });
        //
        // var nextYearSpan = document.createElement("span");
        // nextYearCell.appendChild(nextYearSpan);
        //
        // // Month row
        // var monthRow = document.createElement("tr");
        // monthRow.className = "month-row";
        // yearMonthBlock.appendChild(monthRow);
        //
        // var previousMonthCell = document.createElement("td");
        // previousMonthCell.className = "previous-month-cell";
        // monthRow.appendChild(previousMonthCell);
        // previousMonthCell.addEventListener("click", function (event) {
        //     if (current.month == 0) {
        //         current.month = 11;
        //         current.year--;
        //     } else {
        //         current.month--;
        //     }
        // });
        //
        // var previousMonthSpan = document.createElement("span");
        // previousMonthCell.appendChild(previousMonthSpan);
        //
        // var monthCell = document.createElement("td");
        // monthCell.className = "month-cell";
        // monthCell.colSpan = 5;
        // monthRow.appendChild(monthCell);
        //
        // var monthSpan = document.createElement("span");
        // monthCell.appendChild(monthSpan);
        //
        // var nextMonthCell = document.createElement("td");
        // nextMonthCell.className = "next-month-cell";
        // monthRow.appendChild(nextMonthCell);
        // nextMonthCell.addEventListener("click", function (event) {
        //     if (current.month == 11) {
        //         current.month = 0;
        //         current.year++;
        //     } else {
        //         current.month++;
        //     }
        // });
        //
        // var nextMonthSpan = document.createElement("span");
        // nextMonthCell.appendChild(nextMonthSpan);

        function printYearMonth() {
            yearSpan.innerHTML = current.year;
            monthSpan.innerHTML = monthNames[current.month];
        }

        printYearMonth();
        current.addEventListeners("change", printYearMonth);
    };

    this.appendJump2nowBlock = function (options) {
        // if (!table) {
        //     throw Error("Wrapper is required");
        // }
        // if (table.nodeName.toLowerCase() !== "table") {
        //     throw Error("Wrapper must be table");
        // }

        if (typeof options == "undefined") {
            options = {};
        }
        if (options instanceof Object == false) {
            throw Error("Jump2now block options must be an object");
        }

        var jump2nowBlock = document.createElement("tbody");
        jump2nowBlock.className = "jump2now-block";
        container.appendChild(jump2nowBlock);

        var jump2nowRow = document.createElement("tr");
        jump2nowRow.className = "jump2now-row";
        jump2nowBlock.appendChild(jump2nowRow);

        var jump2nowCell = document.createElement("td");
        jump2nowCell.className = "jump2now-cell";
        jump2nowCell.colSpan = 7;
        jump2nowRow.appendChild(jump2nowCell);
        jump2nowCell.addEventListener("click", function () {
            var now = new Now();
            current.year = now.year;
            current.month = now.month;
            current.date = now.date;
            current.hours = now.hours;
            current.minutes = now.minutes;
            current.seconds = now.seconds;
        });
        var jump2nowSpan = document.createElement("span");
        jump2nowCell.appendChild(jump2nowSpan);

        // return this;
    };

    this.appendDateBlock = function (options) {
        // if (!table) {
        //     throw Error("Wrapper is required");
        // }
        // if (table.nodeName.toLowerCase() !== "table") {
        //     throw Error("Wrapper must be table");
        // }

        // var table = container;

        // Normalize
        if (typeof options == "undefined") {
            options = {};
        }
        if (options instanceof Object == false) {
            throw Error("Date block options must be an object");
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
        // var table = document.createElement("table");
        // wrapper.appendChild(table);



        // Date block
        var dateBlock = document.createElement("tbody");
        dateBlock.className = "date-block";
        container.appendChild(dateBlock);

        var weekdayRow = document.createElement("tr");
        weekdayRow.className = "weekday-row";
        dateBlock.appendChild(weekdayRow);

        var weekdayCell;
        var weekdaySpan;
        for (var i = 0; i < 7; i++) {
            weekdayCell = document.createElement("td");
            weekdayCell.className = "weekday-cell";
            weekdayRow.appendChild(weekdayCell);

            weekdaySpan = document.createElement("span");
            weekdaySpan.innerHTML = weekdayNames[i];
            weekdayCell.appendChild(weekdaySpan);
        }

        function printDate() {
            // Empty calendar block without first row
            while (dateBlock.children[1]) {
                dateBlock.removeChild(dateBlock.children[1]);
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

            var dateRow;
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
                    dateRow = document.createElement("tr");
                    dateRow.className = "date-row";
                    dateBlock.appendChild(dateRow);
                }
                if (dateRow) {
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
                    dateCell.setAttribute("data-year", item.year);
                    dateCell.setAttribute("data-month", item.month);
                    dateCell.setAttribute("data-date", item.date);

                    dateSpan = document.createElement("span");
                    dateSpan.innerHTML = item.date;

                    dateCell.appendChild(dateSpan);
                    dateRow.appendChild(dateCell);

                    dateCell.addEventListener("click", function (event) {
                        current.date = this.getAttribute("data-date");
                        current.month = this.getAttribute("data-month");
                        current.year = this.getAttribute("data-year");
                        // printCalendar();
                    });
                }
            }
        }

        // Jump to today
        // var bottomBlock = document.createElement("tfoot");
        // bottomBlock.className = "bottom-block";
        // table.appendChild(bottomBlock);
        //
        // var jump2todayRow = document.createElement("tr");
        // jump2todayRow.className = "jump2today-row";
        // bottomBlock.appendChild(jump2todayRow);
        //
        // var jump2todayCell = document.createElement("td");
        // jump2todayCell.className = "jump2today-cell";
        // jump2todayCell.colSpan = 7;
        // jump2todayRow.appendChild(jump2todayCell);
        // jump2todayCell.addEventListener("click", function () {
        //     var now = new Now();
        //     current.date = now.date;
        //     current.month = now.month;
        //     current.year = now.year;
        // });
        //
        // var jump2todaySpan = document.createElement("span");
        // jump2todayCell.appendChild(jump2todaySpan);

        printDate();
        current.addEventListeners("change", printDate);

        // return this;
    };

};