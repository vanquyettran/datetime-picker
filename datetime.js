/**
 * Created by User on 5/1/2017.
 */

var Now = function () {
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
};

var DatetimePicker = function (container, timestamp, options) {

    var self = this;

    if (!container) {
        throw Error("Container is required");
    }
    if (container.nodeName !== "TABLE") {
        throw Error("Container must be the table");
    }
    this.container = container;

    if (typeof options == "undefined") {
        options = {};
    }
    if (options instanceof Object == false) {
        throw Error("Datetime picker options must be an object");
    }

    if (typeof options.weekdays === "undefined"
        || !options.weekdays instanceof Array
        || !options.weekdays.length == 7
    ) {
        options.weekdays = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];
    }

    if (typeof options.months === "undefined"
        || !options.months instanceof Array
        || !options.months.length == 12
    ) {
        options.months = [
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

    this.options = options;

    this.initTime = !timestamp ? new Date() : new Date(timestamp);

    this.currentTime = {
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

    this.currentTime.year = this.initTime.getFullYear();
    this.currentTime.month = this.initTime.getMonth();
    this.currentTime.date = this.initTime.getDate();
    this.currentTime.hours = this.initTime.getHours();
    this.currentTime.minutes = this.initTime.getMinutes();
    this.currentTime.seconds = this.initTime.getSeconds();

    if (typeof options.onChange == "function") {
        this.currentTime.addEventListeners("change", function () {
            options.onChange(self.currentTime);
        });
    }
};

/**
 *
 * @param options
 * @returns {DatetimePicker}
 */
DatetimePicker.prototype.widget = function (options) {
    var self = this;

    if (typeof options == "undefined") {
        options = {};
    }
    if (options instanceof Object == false) {
        throw Error("Widget options must be an object");
    }
    this.container.appendChild(this.yearMonthBlock(options.yearMonthBlock));
    this.container.appendChild(this.dateBlock(options.dateBlock));
    this.container.appendChild(this.timeBlock(options.timeBlock));
    this.container.appendChild(this.controlBlock(options.controlBlock))  ;
    return this;
};

/**
 *
 * @param options
 * @returns {Element}
 */
DatetimePicker.prototype.timeBlock = function (options) {
    var self = this;
    
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
                actSpan.addEventListener("click", function (event) {
                    if (act == "increase") {
                        self.currentTime[unit] += change;
                    } else {
                        self.currentTime[unit] -= change;
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
        hoursSpan.innerHTML = self.currentTime.hours;
        minutesSpan.innerHTML = self.currentTime.minutes;
        secondsSpan.innerHTML = self.currentTime.seconds;
    }

    printTime();
    self.currentTime.addEventListeners("change", printTime);

    return timeBlock;
};

/**
 *
 * @param options
 * @returns {Element}
 */
DatetimePicker.prototype.yearMonthBlock = function (options) {
    var self = this;
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
                        self.currentTime[unit] += change;
                    } else {
                        self.currentTime[unit] -= change;
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
        yearSpan.innerHTML = self.currentTime.year;
        monthSpan.innerHTML = self.options.months[self.currentTime.month];
    }

    printYearMonth();
    self.currentTime.addEventListeners("change", printYearMonth);

    return yearMonthBlock;
};

/**
 *
 * @param options
 * @returns {Element}
 */
DatetimePicker.prototype.controlBlock = function (options) {
    var self = this;

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
    jump2nowRow.appendChild(jump2nowCell);
    jump2nowCell.className = "jump2now-cell";
    jump2nowCell.colSpan = 7;

    var jump2nowSpan = document.createElement("span");
    jump2nowCell.appendChild(jump2nowSpan);

    jump2nowSpan.addEventListener("click", function () {
        var now = new Now();
        self.currentTime.year = now.year;
        self.currentTime.month = now.month;
        self.currentTime.date = now.date;
        self.currentTime.hours = now.hours;
        self.currentTime.minutes = now.minutes;
        self.currentTime.seconds = now.seconds;
    });

    return controlBlock;
};

/**
 *
 * @param options
 * @returns {Element}
 */
DatetimePicker.prototype.dateBlock = function (options) {
    var self = this;
    // Normalize
    if (typeof options == "undefined") {
        options = {};
    } else if (options instanceof Object == false) {
        throw Error("Date block options must be an object");
    }

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
        weekdaySpan.innerHTML = self.options.weekdays[i];
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

        var threeMonths = [{
            "year": self.currentTime.year,
            "month": self.currentTime.month,
            "monthPos": 0
        }];
        if (self.currentTime.month == 0) {
            threeMonths.unshift({
                "year": self.currentTime.year - 1,
                "month": 11,
                "monthPos": -1
            });
            threeMonths.push({
                "year": self.currentTime.year,
                "month": 1,
                "monthPos": 1
            });

        } else if (self.currentTime.month == 11) {
            threeMonths.unshift({
                "year": self.currentTime.year,
                "month": 10,
                "monthPos": -1
            });
            threeMonths.push({
                "year": self.currentTime.year + 1,
                "month": 0,
                "monthPos": 1
            });
        } else {
            threeMonths.unshift({
                "year": self.currentTime.year,
                "month": self.currentTime.month - 1,
                "monthPos": -1
            });
            threeMonths.push({
                "year": self.currentTime.year,
                "month": self.currentTime.month + 1,
                "monthPos": 1
            });
        }

        threeMonths.forEach(function (year_month) {
            var daysInMonth = new Date(year_month.year, year_month.month + 1, 0).getDate(); // date "zero" of next month
            if (year_month.monthPos == 0 && self.currentTime.date > daysInMonth) {
                self.currentTime.date = daysInMonth;
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
                        : (date - self.currentTime.date) / Math.abs(date - self.currentTime.date) || 0,
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
                dateRow.appendChild(dateCell);
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

                dateSpan = document.createElement("span");
                dateCell.appendChild(dateSpan);

                // Binds data year/month/date/day to each item
                dateSpan.setAttribute("data-year", item.year);
                dateSpan.setAttribute("data-month", item.month);
                dateSpan.setAttribute("data-date", item.date);

                dateSpan.innerHTML = item.date;
                dateSpan.addEventListener("click", function (event) {
                    self.currentTime.date = this.getAttribute("data-date");
                    self.currentTime.month = this.getAttribute("data-month");
                    self.currentTime.year = this.getAttribute("data-year");
                    // printCalendar();

                    if (typeof options.onClick == "function") {
                        options.onClick(self.currentTime);
                    }
                });
            }
        }
    }

    printDate();
    self.currentTime.addEventListeners("change", printDate);

    return dateBlock;
};