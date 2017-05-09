/**
 * Created by User on 5/1/2017.
 */
"use strict";

var DatetimePicker = function (initTime, options) {

    if (!(initTime instanceof Date)) {
        initTime = new Date();
    }

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

    var current = {
        // Stores "Date" object
        _time: new Date(),

        // Getter
        get time() {
            return this._time.getTime();
        },
        get year() {
            return this._time.getFullYear();
        },
        get month() {
            return this._time.getMonth();
        },
        get date() {
            return this._time.getDate();
        },
        get hours() {
            return this._time.getHours();
        },
        get minutes() {
            return this._time.getMinutes();
        },
        get seconds() {
            return this._time.getSeconds();
        },

        // Setter
        set time(value) {
            this._time.setTime(value);
            this.callEventListener("change");
        },
        set year(value) {
            this._time.setFullYear(value);
            this.callEventListener("change");
        },
        set month(value) {
            this._time.setMonth(value);
            this.callEventListener("change");
        },
        set date(value) {
            this._time.setDate(value);
            this.callEventListener("change");
        },
        set hours(value) {
            this._time.setHours(value);
            this.callEventListener("change");
        },
        set minutes(value) {
            this._time.setMinutes(value);
            this.callEventListener("change");
        },
        set seconds(value) {
            this._time.setSeconds(value);
            this.callEventListener("change");
        },

        // Event listeners
        _eventListeners: {
            "change": []
        },

        /**
         *
         * @param event
         * @param func
         */
        addEventListener: function (event, func) {
            if (this._eventListeners[event]) {
                this._eventListeners[event].push(func);
            }
        },

        /**
         *
         * @param event
         */
        callEventListener: function (event) {
            if (this._eventListeners[event]) {
                this._eventListeners[event].forEach(function (func) {
                    func();
                });
            }
        }
    };

    current.time = initTime.getTime();

    if (typeof options.onChange == "function") {
        current.addEventListener("change", function () {
            options.onChange(current);
        });
    }

    // Binds vars to object
    this.current = current;
    this.initTime = initTime;
    this.options = options;
};

!function (document) {

    /**
     *
     * @param options
     * @returns {Element}
     */
    DatetimePicker.prototype.widget = function (options) {
        var self = this;

        if (typeof options != "object") {
            options = {};
        }

        var picker = document.createElement("table");
        picker.className = self.createClassName("widget");

        // Render view
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

        _renderItems(picker, options.items, itemsReference, renderItem);

        // return picker
        return picker;
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
        yearMonthBlock.className = self.createClassName("year-month-block");

        var yearMonthRow = document.createElement("tr");
        yearMonthRow.className = self.createClassName("year-month-row");
        yearMonthBlock.appendChild(yearMonthRow);

        var yearCell = document.createElement("td");
        yearCell.className = self.createClassName("year-cell");
        yearCell.unit = "year";
        yearCell.valueChanges = [100, 10, 1];
        yearCell.valueSpan = document.createElement("span");

        var monthCell = document.createElement("td");
        monthCell.className = self.createClassName("month-cell");
        monthCell.unit = "month";
        monthCell.valueChanges = [1];
        monthCell.valueSpan = document.createElement("span");

        [yearCell, monthCell].forEach(function (block) {
            ["increase", "decrease"].forEach(function (action) {
                var actionRow = document.createElement("div");
                actionRow.className = self.createClassName(action + "-div");
                block.appendChild(actionRow);
                block.valueChanges.forEach(function (change) {
                    var actionSpan = document.createElement("span");
                    actionRow.appendChild(actionSpan);

                    // actionSpan.setAttribute("data-action", action);
                    // actionSpan.setAttribute("data-change", change);
                    // actionSpan.setAttribute("data-unit", block.unit);

                    actionSpan.addEventListener("click", function (event) {
                        if (action == "increase") {
                            self.current[block.unit] += change;
                        } else {
                            self.current[block.unit] -= change;
                        }
                    });
                });
            });
            var valueDiv = document.createElement("div");
            valueDiv.className = self.createClassName("value-div");
            valueDiv.appendChild(block.valueSpan);
            block.insertBefore(valueDiv, block.children[1]);
        });

        function printYearMonth() {
            yearCell.valueSpan.innerHTML = self.current.year;
            monthCell.valueSpan.innerHTML = self.options.months[self.current.month];
        }

        printYearMonth();
        self.current.addEventListener("change", printYearMonth);

        // Render view
        var itemsReference = {
            "yearCell": yearCell,
            "monthCell": monthCell
        };

        if (!(options.items instanceof Array)) {
            options.items = [];
        }

        var renderItem = function (container, viewItem) {
            container.appendChild(viewItem);
        };

        _renderItems(yearMonthRow, options.items, itemsReference, renderItem);

        // Return block
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

        // Date block
        var dateBlock = document.createElement("table");
        dateBlock.className = self.createClassName("date-block");

        var weekdayRow = document.createElement("tr");
        weekdayRow.className = self.createClassName("weekday-row");
        dateBlock.appendChild(weekdayRow);

        self.options.weekdays.forEach(function (weekday) {
            var weekdayCell = document.createElement("td");
            weekdayCell.className = self.createClassName("weekday-cell");
            weekdayRow.appendChild(weekdayCell);

            var weekdaySpan = document.createElement("span");
            weekdaySpan.innerHTML = weekday;
            weekdayCell.appendChild(weekdaySpan);
        });

        function printDate() {
            // Empty calendar block without first row
            while (dateBlock.children[1]) {
                dateBlock.removeChild(dateBlock.children[1]);
            }

            var calendar = _createCalendar(self.current.year, self.current.month, self.current.date);

            calendar.forEach(function (week) {
                var dateRow = document.createElement("tr");
                dateRow.className = self.createClassName("date-row");
                dateBlock.appendChild(dateRow);
                week.forEach(function (item) {
                    var dateCell = document.createElement("td");
                    var dateSpan = document.createElement("span");

                    dateCell.className = self.createClassName("date-cell");
                    dateRow.appendChild(dateCell);

                    // Marks whether item is current month, current date or today
                    dateCell.setAttribute("data-current-month", item.currentMonth);
                    dateCell.setAttribute("data-current-date", item.currentDate);
                    dateCell.setAttribute("data-today", item.today);

                    dateCell.appendChild(dateSpan);

                    // dateSpan.setAttribute("data-year", item.year);
                    // dateSpan.setAttribute("data-month", item.month);
                    // dateSpan.setAttribute("data-date", item.date);
                    // dateSpan.setAttribute("data-day", item.day);

                    dateSpan.innerHTML = item.date;
                    dateSpan.addEventListener("click", function () {
                        self.current.year = item.year;
                        self.current.month = item.month;
                        self.current.date = item.date;
                        if (typeof options.onClick == "function") {
                            options.onClick(self.current);
                        }
                    });
                });
            });
        }

        printDate();
        self.current.addEventListener("change", printDate);

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
        timeBlock.className = self.createClassName("time-block");

        var timeRow = document.createElement("tr");
        timeRow.className = self.createClassName("time-row");
        timeBlock.appendChild(timeRow);

        var hoursCell = document.createElement("td");
        hoursCell.className = self.createClassName("hours-cell");
        hoursCell.unit = "hours";
        hoursCell.valueChanges = [10, 1];
        hoursCell.valueSpan = document.createElement("span");

        var minutesCell = document.createElement("td");
        minutesCell.className = self.createClassName("minutes-cell");
        minutesCell.unit = "minutes";
        minutesCell.valueChanges = [10, 1];
        minutesCell.valueSpan = document.createElement("span");

        var secondsCell = document.createElement("td");
        secondsCell.className = self.createClassName("seconds-cell");
        secondsCell.unit = "seconds";
        secondsCell.valueChanges = [10, 1];
        secondsCell.valueSpan = document.createElement("span");

        [hoursCell, minutesCell, secondsCell].forEach(function (block) {
            ["increase", "decrease"].forEach(function (action) {
                var actionRow = document.createElement("div");
                actionRow.className = self.createClassName(action + "-div");
                block.appendChild(actionRow);
                block.valueChanges.forEach(function (change) {
                    var actionSpan = document.createElement("span");
                    actionRow.appendChild(actionSpan);

                    // actionSpan.setAttribute("data-action", action);
                    // actionSpan.setAttribute("data-change", change);
                    // actionSpan.setAttribute("data-unit", block.unit);

                    actionSpan.addEventListener("click", function (event) {
                        if (action == "increase") {
                            self.current[block.unit] += change;
                        } else {
                            self.current[block.unit] -= change;
                        }
                    });
                });
            });
            var valueDiv = document.createElement("div");
            valueDiv.className = self.createClassName("value-div");
            valueDiv.appendChild(block.valueSpan);
            block.insertBefore(valueDiv, block.children[1]);
        });

        function printTime() {
            hoursCell.valueSpan.innerHTML = self.current.hours;
            minutesCell.valueSpan.innerHTML = self.current.minutes;
            secondsCell.valueSpan.innerHTML = self.current.seconds;
        }

        printTime();
        self.current.addEventListener("change", printTime);

        // Render view
        var itemsReference = {
            "hoursCell": hoursCell,
            "minutesCell": minutesCell,
            "secondsCell": secondsCell
        };

        if (!(options.items instanceof Array)) {
            options.items = [];
        }

        var renderItem = function (container, viewItem) {
            container.appendChild(viewItem);
        };

        _renderItems(timeRow, options.items, itemsReference, renderItem);

        // Return block
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
        controlBlock.className = self.createClassName("control-block");

        var row = document.createElement("tr");
        controlBlock.appendChild(row);

        var set2nowCell = document.createElement("td");
        set2nowCell.className = self.createClassName("set2now-cell");

        var set2nowSpan = document.createElement("span");
        set2nowCell.appendChild(set2nowSpan);

        set2nowSpan.addEventListener("click", function () {
            self.current.time = new Date().getTime();
        });

        var resetCell = document.createElement("td");
        resetCell.className = self.createClassName("reset-cell");

        var resetSpan = document.createElement("span");
        resetCell.appendChild(resetSpan);

        resetSpan.addEventListener("click", function () {
            self.current.time = self.initTime.getTime();
        });

        var submitCell = document.createElement("td");
        submitCell.className = self.createClassName("submit-cell");

        var submitSpan = document.createElement("span");
        submitCell.appendChild(submitSpan);

        submitSpan.addEventListener("click", function () {
            if (typeof options.onSubmit == "function") {
                options.onSubmit(self.current);
            }
        });

        // Render view
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

        _renderItems(row, options.items, itemsReference, renderItem);

        // Return block
        return controlBlock;
    };

    /**
     *
     * @param className
     * @returns {string}
     */
    DatetimePicker.prototype.createClassName = function (className) {
        var self = this;

        var prefix = "datetimePicker__";

        if (typeof self.options.classNamePrefix == "string") {
            prefix = self.options.classNamePrefix;
        }

        return prefix + className;
    };

    /**
     *
     * @param container
     * @param itemNames
     * @param itemsReference
     * @param renderItem
     */
    function _renderItems(container, itemNames, itemsReference, renderItem) {
        /*
         if (!(container instanceof HTMLElement)) {
         throw TypeError("_renderItems: \"container\" must be an HTMLElement");
         }
         if (!(itemNames instanceof Array)) {
         throw TypeError("_renderItems: \"itemNames\" must be an Array");
         }

         if (typeof itemsReference != "object") {
         throw TypeError("_renderItems: \"itemsReference\" must be an Object");
         }
         if (typeof renderItem != "function") {
         throw TypeError("_renderItems: \"render\" must be an Function");
         }
         */

        var viewItems = [];

        itemNames.forEach(function (itemName) {
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
    }

    /**
     *
     * @param currentYear
     * @param currentMonth
     * @param currentDate
     * @returns {Array}
     */
    function _createCalendar(currentYear, currentMonth, currentDate) {

        var now = new Date();
        var calendar = [];
        var threeMonths = [[currentYear, currentMonth]];

        if (currentMonth == 0) {
            threeMonths.unshift([currentYear - 1, 11]);
            threeMonths.push([currentYear, 1]);
        } else if (currentMonth == 11) {
            threeMonths.unshift([currentYear, 10]);
            threeMonths.push([currentYear + 1, 0]);
        } else {
            threeMonths.unshift([currentYear, currentMonth - 1]);
            threeMonths.push([currentYear, currentMonth + 1]);
        }

        var week, day = new Date(threeMonths[0][0], threeMonths[0][1], 1).getDay();

        threeMonths.forEach(function (item, index) {
            var i, maxDate = new Date(item[0], item[1] + 1, 0).getDate();
            for (i = 1; i <= maxDate; i++) {
                if (week === undefined) {
                    if (day < 6) {
                        day ++;
                    } else {
                        week = [];
                    }
                } else {
                    week.push({
                        "year": item[0],
                        "month": item[1],
                        "date": i,
                        "currentMonth": index == 1,
                        "currentDate": item[0] == currentYear && item[1] == currentMonth && i == currentDate,
                        "today": item[0] == now.getFullYear() && item[1] == now.getMonth() && i == now.getDate()
                    });
                    if (week.length == 7) {
                        calendar.push(week);
                        week = [];
                    }
                }
            }
        });

        return calendar.filter(function (week) {
            return week.some(function (item) {
                return item.currentMonth;
            })
        });
    }

}(document);
