/**
 * Created by User on 5/1/2017.
 */

var DatetimePicker = function (initTime, options) {
    var self = this;

    this.initTime = initTime;

    this.options = options;

    if (typeof options != "object") {
        options = {};
    } else {
        if (!(options.weekdays instanceof Array) || options.weekdays.length != 7) {
            options.weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        }
        if (!(options.months instanceof Array) || options.months.length != 12) {
            options.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        }
    }

    if (!(initTime instanceof Date)) {
        initTime = new Date();
    }

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
            this.time.setFullYear(value);
            this.callEventListeners("change");
        },
        set month(value) {
            this.time.setMonth(value);
            this.callEventListeners("change");
        },
        set date(value) {
            this.time.setDate(value);
            this.callEventListeners("change");
        },
        set hours(value) {
            this.time.setHours(value);
            this.callEventListeners("change");
        },
        set minutes(value) {
            this.time.setMinutes(value);
            this.callEventListeners("change");
        },
        set seconds(value) {
            this.time.setSeconds(value);
            this.callEventListeners("change");
        }
    };

    this.currentTime.year = initTime.getFullYear();
    this.currentTime.month = initTime.getMonth();
    this.currentTime.date = initTime.getDate();
    this.currentTime.hours = initTime.getHours();
    this.currentTime.minutes = initTime.getMinutes();
    this.currentTime.seconds = initTime.getSeconds();

    if (typeof options.onChange == "function") {
        this.currentTime.addEventListeners("change", function () {
            options.onChange(self.currentTime);
        });
    }
};

DatetimePicker.prototype.renderItems = function (container, items, itemsReference, renderItem) {
    if (!(container instanceof HTMLElement)) {
        throw TypeError("renderItems: \"container\" must be an HTMLElement");
    }
    if (!(items instanceof Array)) {
        throw TypeError("renderItems: \"items\" must be an Array");
    }

    if (typeof itemsReference != "object") {
        throw TypeError("renderItems: \"itemsReference\" must be an Object");
    }
    if (typeof renderItem != "function") {
        throw TypeError("renderItems: \"render\" must be an Function");
    }

    var viewItems = [];

    items.forEach(function (itemName) {
        if (itemsReference.hasOwnProperty(itemName)) {
            viewItems.push(itemsReference[itemName]);
        }
    });

    if (viewItems.length == 0) {
        var itemName;
        for (itemName in itemsReference) {
            if (itemsReference.hasOwnProperty(itemName)) {
                viewItems.push(itemsReference[itemName])
            }
        }
    }

    viewItems.forEach(function (viewItem) {
        renderItem(container, viewItem);
    });
};

/**
 *
 * @param container
 * @param options
 * @returns {DatetimePicker}
 */
DatetimePicker.prototype.widget = function (container, options) {
    var self = this;

    if (!container) {
        throw Error("Container is required");
    } else if (container.nodeName != "TABLE") {
        throw Error("Container must be the table");
    }

    if (typeof options != "object") {
        options = {};
    }

    var itemsReference = {
        "yearMonthBlock": self.yearMonthBlock(options.yearMonthBlock),
        "dateBlock": self.dateBlock(options.dateBlock),
        "timeBlock": self.timeBlock(options.timeBlock),
        "controlBlock": self.controlBlock(options.controlBlock)
    };

    if (!(options.items instanceof Array)) {
        options.items = [];
    }

    var renderItem = function (container, viewItem) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        tr.appendChild(td);
        td.appendChild(viewItem);
        container.appendChild(tr);
    };

    this.renderItems(container, options.items, itemsReference, renderItem);

    return this;
};

/**
 *
 * @param options
 * @returns {Element}
 */
DatetimePicker.prototype.yearMonthBlock = function (options) {
    var self = this;

    if (typeof options != "object") {
        options = {};
    }

    var yearMonthBlock = document.createElement("table");
    yearMonthBlock.className = "year-month-block";

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
            } else {
                changes = [1];
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
    yearMonthRow.appendChild(yearCell);

    var yearSpan = document.createElement("span");
    yearCell.appendChild(yearSpan);

    var monthCell = document.createElement("td");
    monthCell.className = "month-cell";
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
DatetimePicker.prototype.dateBlock = function (options) {
    var self = this;

    if (typeof options != "object") {
        options = {};
    }

    if (typeof options.extendedWeeks != "object") {
        options.extendedWeeks = {"before": 0, "after": 0};
    } else {
        options.extendedWeeks.before = parseInt(options.extendedWeeks.before) || 0;
        options.extendedWeeks.after = parseInt(options.extendedWeeks.after) || 0;
        if (options.extendedWeeks.before > 3
            || options.extendedWeeks.before < 0
            || options.extendedWeeks.after > 3
            || options.extendedWeeks.after < 0
        ) {
            throw Error("Date block: Options.extendedWeeks.before/after must be in range [0, 3]");
        }
    }

    // Date block
    var dateBlock = document.createElement("table");
    dateBlock.className = "date-block";

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

        var now = new Date();

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

        threeMonths.forEach(function (theMonth) {
            var lastDayOfMonth = new Date(theMonth.year, theMonth.month + 1, 0).getDate(); // date "zero" of next month
            if (theMonth.monthPos == 0 && self.currentTime.date > lastDayOfMonth) {
                self.currentTime.date = lastDayOfMonth;
            }
            for (var date = 1; date <= lastDayOfMonth; date++) {
                calendar.push({
                    "year": theMonth.year,
                    "month": theMonth.month,
                    "date": date,
                    "day": new Date(theMonth.year, theMonth.month, date).getDay(),
                    "monthPos": theMonth.monthPos,
                    "datePos":
                        theMonth.monthPos != 0
                            ? theMonth.monthPos
                            : (date - self.currentTime.date) / Math.abs(date - self.currentTime.date) || 0,
                    "isToday":
                        theMonth.year == now.getFullYear()
                        && theMonth.month == now.getMonth()
                        && date == now.getDate()
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
                dateSpan.addEventListener("click", function () {
                    self.currentTime.date = this.getAttribute("data-date");
                    self.currentTime.month = this.getAttribute("data-month");
                    self.currentTime.year = this.getAttribute("data-year");

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

/**
 *
 * @param options
 * @returns {Element}
 */
DatetimePicker.prototype.timeBlock = function (options) {
    var self = this;

    if (typeof options != "object") {
        options = {};
    }

    // Creates table for the calendar
    var timeBlock = document.createElement("table");
    timeBlock.className = "time-block";

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
DatetimePicker.prototype.controlBlock = function (options) {
    var self = this;

    if (typeof options != "object") {
        options = {};
    }

    var controlBlock = document.createElement("table");
    controlBlock.className = "control-block";

    var row = document.createElement("tr");
    controlBlock.appendChild(row);

    var set2nowCell = document.createElement("td");
    set2nowCell.className = "set2now-cell";

    var set2nowSpan = document.createElement("span");
    set2nowCell.appendChild(set2nowSpan);

    set2nowSpan.addEventListener("click", function () {
        var now = new Date();
        self.currentTime.year = now.getFullYear();
        self.currentTime.month = now.getMonth();
        self.currentTime.date = now.getDate();
        self.currentTime.hours = now.getHours();
        self.currentTime.minutes = now.getMinutes();
        self.currentTime.seconds = now.getSeconds();
    });

    var resetCell = document.createElement("td");
    resetCell.className = "reset-cell";

    var resetSpan = document.createElement("span");
    resetCell.appendChild(resetSpan);

    resetSpan.addEventListener("click", function () {
        self.currentTime.year = self.initTime.getFullYear();
        self.currentTime.month = self.initTime.getMonth();
        self.currentTime.date = self.initTime.getDate();
        self.currentTime.hours = self.initTime.getHours();
        self.currentTime.minutes = self.initTime.getMinutes();
        self.currentTime.seconds = self.initTime.getSeconds();
    });

    var submitCell = document.createElement("td");
    submitCell.className = "submit-cell";

    var submitSpan = document.createElement("span");
    submitCell.appendChild(submitSpan);

    submitSpan.addEventListener("click", function () {
        if (typeof options.onSubmit == "function") {
            options.onSubmit(self.currentTime);
        }
    });

    var itemsReference = {
        "set2nowCell": set2nowCell,
        "resetCell": resetCell,
        "submitCell": submitCell
    };

    if (!(options.items instanceof Array)) {
        options.items = [];
    }

    var renderItem = function (container, viewItem) {
        container.appendChild(viewItem);
    };

    this.renderItems(row, options.items, itemsReference, renderItem);

    return controlBlock;
};
