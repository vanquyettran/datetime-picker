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
    if (options.months instanceof Array
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

    if (typeof options.onChange == "function") {
        current.addEventListeners("change", function () {
            options.onChange(current);
        });
    }

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
        container.appendChild(this.yearMonthBlock(options.yearMonthBlock));
        container.appendChild(this.dateBlock(options.dateBlock));
        container.appendChild(this.timeBlock(options.timeBlock));
        container.appendChild(this.controlBlock(options.controlBlock))  ;
        return this;
    };

    // if (callback instanceof Function) {
    //     current.addEventListeners("change", function (current) {
    //         callback(current);
    //     });
    // }

    this.timeBlock = function (options) {
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
        // container.appendChild(timeBlock);

        var actRow;
        var actCell;
        var actSpan;
        ["increase", "decrease"].forEach(function (act) {
            actRow = document.createElement("tr");
            actRow.className = act + "-row";
            timeBlock.appendChild(actRow);
            ["hours", "minutes", "seconds"].forEach(function (unit) {
                actCell = document.createElement("td");
                actCell.colSpan = 2;
                actCell.className = act + "-cell";
                actRow.appendChild(actCell);
                [10, 1].forEach(function (change) {
                    actSpan = document.createElement("span");
                    actCell.appendChild(actSpan);
                    actSpan.setAttribute("data-change", change);
                    actSpan.setAttribute("data-unit", unit);
                    actCell.addEventListener("click", function (event) {
                        if (act == "increase") {
                            current[unit] += change;
                        } else {
                            current[unit] -= change;
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

        return timeBlock;
    };

    this.yearMonthBlock = function (options) {
        if (typeof options == "undefined") {
            options = {};
        }
        if (options instanceof Object == false) {
            throw Error("Year-month block options must be an object");
        }

        var yearMonthBlock = document.createElement("tbody");
        yearMonthBlock.className = "year-month-block";
        // container.appendChild(yearMonthBlock);

        // Act row
        var actRow;
        var actCell;
        var actSpan;
        var changes;
        ["increase", "decrease"].forEach(function (act) {
            actRow = document.createElement("tr");
            actRow.className = act + "-row";
            yearMonthBlock.appendChild(actRow);
            ["year", "month"].forEach(function (unit) {
                actCell = document.createElement("td");
                if (unit == "year") {
                    changes = [100, 10, 1];
                    actCell.colSpan = 3;
                } else {
                    changes = [1];
                    actCell.colSpan = 4;
                }
                actCell.className = act + "-cell";
                actRow.appendChild(actCell);
                changes.forEach(function (change) {
                    actSpan = document.createElement("span");
                    actCell.appendChild(actSpan);
                    actSpan.setAttribute("data-change", change);
                    actSpan.setAttribute("data-unit", unit);
                    actSpan.addEventListener("click", function (event) {
                        if (act == "increase") {
                            current[unit] += change;
                        } else {
                            current[unit] -= change;
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
        yearCell.colSpan = 3;
        yearMonthRow.appendChild(yearCell);

        var yearSpan = document.createElement("span");
        yearCell.appendChild(yearSpan);

        var monthCell = document.createElement("td");
        monthCell.className = "month-cell";
        monthCell.colSpan = 4;
        yearMonthRow.appendChild(monthCell);

        var monthSpan = document.createElement("span");
        monthCell.appendChild(monthSpan);

        function printYearMonth() {
            yearSpan.innerHTML = current.year;
            monthSpan.innerHTML = monthNames[current.month];
        }

        printYearMonth();
        current.addEventListeners("change", printYearMonth);

        return yearMonthBlock;
    };

    this.controlBlock = function (options) {
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
            throw Error("Control block options must be an object");
        }

        var controlBlock = document.createElement("tbody");
        controlBlock.className = "control-block";
        // container.appendChild(controlBlock);

        var jump2nowRow = document.createElement("tr");
        jump2nowRow.className = "jump2now-row";
        controlBlock.appendChild(jump2nowRow);

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

        return controlBlock;
    };

    this.dateBlock = function (options, eventListeners) {
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
        } else if (options instanceof Object == false) {
            throw Error("Date block options must be an object");
        }

        // options.displayBeforeWeeks = parseInt(options.displayBeforeWeeks) || 0;
        // options.displayAfterWeeks = parseInt(options.displayAfterWeeks) || 0;
        // if (options.displayBeforeWeeks > 3
        //     || options.displayBeforeWeeks < 0
        //     || options.displayAfterWeeks > 3
        //     || options.displayAfterWeeks < 0
        // ) {
        //     throw Error("Option display before/after weeks must be in range [0, 3]");
        // }

        if (typeof options.extendedWeeks == "undefined") {
            options.extendedWeeks = {"before": 0, "after": 0};
        } else if (typeof options.extendedWeeks != "object") {
            throw TypeError("Date block: Options.extendedWeeks must be object");
        } else {
            options.extendedWeeks.before = parseInt(options.extendedWeeks.before) || 0;
            options.extendedWeeks.after = parseInt(options.extendedWeeks.after) || 0;
        }

        if (options.extendedWeeks.before > 3
            || options.extendedWeeks.before < 0
            || options.extendedWeeks.after > 3
            || options.extendedWeeks.after < 0
        ) {
            throw Error("Date block: Options.extendedWeeks.before/after must be in range [0, 3]");
        }


        // Date block
        var dateBlock = document.createElement("tbody");
        dateBlock.className = "date-block";
        // container.appendChild(dateBlock);

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
                        if (calendar[(j + 6) + 7 * options.extendedWeeks.before].monthPos == -1) {
                            j += 6;
                            continue;
                        }
                    }
                    if (item.monthPos == 1) {
                        if (calendar[j - 7 * options.extendedWeeks.after].monthPos == 1) {
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

                        if (typeof options.onClick == "function") {
                            options.onClick(current);
                        }
                    });
                }
            }
        }

        printDate();
        current.addEventListeners("change", printDate);

        return dateBlock;
    };

};