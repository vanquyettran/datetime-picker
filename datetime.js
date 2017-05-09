/**
 * Created by User on 5/1/2017.
 */

var DatetimePicker = function (initTime, options) {
    var self = this;

    this.initTime = initTime;

    if (!(initTime instanceof Date)) {
        initTime = new Date();
    }

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

    this.current = {
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

    this.current.time = this.initTime.getTime();

    if (typeof options.onChange == "function") {
        this.current.addEventListener("change", function () {
            options.onChange(self.current);
        });
    }

    !function (document) {

        /**
         * walk objects and arrays
         * @param {Object} obj
         * @param {Function} iterator
         * @param {Object} context
         */
        function each(obj, iterator, context) {
            var i;

            if (!obj) {
                return;
            }

            if (obj.forEach) {
                obj.forEach(iterator, context);
            } else if (obj.length !== undefined) {
                i = 0;
                while (i < obj.length) {
                    iterator.call(context, obj[i], i, obj);
                    i++;
                }
            } else {
                for (i in obj) {
                    obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
                }
            }
        }

        /**
         *
         * @param options
         * @returns {Element}
         */
        DatetimePicker.prototype.widget = function (options) {
            // var self = this;

            if (typeof options != "object") {
                options = {};
            }

            var picker = document.createElement("table");
            picker.className = createClassName("widget");

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

            renderItems(picker, options.items, itemsReference, renderItem);

            // return picker
            return picker;
        };

        /**
         *
         * @param options
         * @returns {Element}
         */
        DatetimePicker.prototype.yearMonthBlock = function (options) {
            // var self = this;

            if (typeof options != "object") {
                options = {};
            }

            var yearMonthBlock = document.createElement("table");
            yearMonthBlock.className = createClassName("year-month-block");

            var yearMonthRow = document.createElement("tr");
            yearMonthRow.className = createClassName("year-month-row");
            yearMonthBlock.appendChild(yearMonthRow);

            var yearCell = document.createElement("td");
            yearCell.className = createClassName("year-cell");
            yearCell.unit = "year";
            yearCell.valueChanges = [100, 10, 1];
            yearCell.valueSpan = document.createElement("span");

            var monthCell = document.createElement("td");
            monthCell.className = createClassName("month-cell");
            monthCell.unit = "month";
            monthCell.valueChanges = [1];
            monthCell.valueSpan = document.createElement("span");

            [yearCell, monthCell].forEach(function (block) {
                ["increase", "decrease"].forEach(function (action) {
                    var actionRow = document.createElement("div");
                    actionRow.className = createClassName(action + "-div");
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
                valueDiv.className = createClassName("value-div");
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

            renderItems(yearMonthRow, options.items, itemsReference, renderItem);

            // Return block
            return yearMonthBlock;
        };

        /**
         *
         * @param options
         * @returns {Element}
         */
        DatetimePicker.prototype.dateBlock = function (options) {
            // var self = this;

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
                    throw Error("dateBlock: \"options.extendedWeeks.before/after\" must be in range [0, 3]");
                }
            }

            // Date block
            var dateBlock = document.createElement("table");
            dateBlock.className = createClassName("date-block");

            var weekdayRow = document.createElement("tr");
            weekdayRow.className = createClassName("weekday-row");
            dateBlock.appendChild(weekdayRow);

            self.options.weekdays.forEach(function (weekday) {
                var weekdayCell = document.createElement("td");
                weekdayCell.className = createClassName("weekday-cell");
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

                var calendar = createCalendar(self.current.year, self.current.month, self.current.date);

                var i, dateRow;

                for (i = 0; i < calendar.length; i++) {
                    var item = calendar[i];

                    if (item.day == 0) { // Monday
                        if (item.monthPos == -1) {
                            if (calendar[(i + 6) + 7 * options.extendedWeeks.before].monthPos == -1) {
                                i += 6;
                                continue;
                            }
                        }
                        if (item.monthPos == 1) {
                            if (calendar[i - 7 * options.extendedWeeks.after].monthPos == 1) {
                                break;
                            }
                        }
                        dateRow = document.createElement("tr");
                        dateRow.className = createClassName("date-row");
                        dateBlock.appendChild(dateRow);
                    } else if (!dateRow) {
                        continue;
                    }

                    !function (item) {
                        var dateCell = document.createElement("td");
                        var dateSpan = document.createElement("span");

                        dateCell.className = createClassName("date-cell");
                        dateRow.appendChild(dateCell);

                        // Marks item is today
                        if (item.isToday) {
                            dateCell.classList.add(createClassName("today"));
                        }

                        // Marks item is before/current/after month
                        if (item.monthPos == -1) {
                            dateCell.classList.add(createClassName("before-month"));
                        } else if (item.monthPos == 1) {
                            dateCell.classList.add(createClassName("after-month"));
                        } else {
                            dateCell.classList.add(createClassName("current-month"));
                        }

                        // Marks item is before/current/after date
                        if (item.datePos == -1) {
                            dateCell.classList.add(createClassName("before-date"));
                        } else if (item.datePos == 1) {
                            dateCell.classList.add(createClassName("after-date"));
                        } else {
                            dateCell.classList.add(createClassName("current-date"));
                        }

                        dateCell.appendChild(dateSpan);

                        // dateSpan.setAttribute("data-year", item.year);
                        // dateSpan.setAttribute("data-month", item.month);
                        // dateSpan.setAttribute("data-date", item.date);
                        // dateSpan.setAttribute("data-day", item.day);

                        dateSpan.innerHTML = item.date;
                        dateSpan.addEventListener("click", function () {
                            self.current.date = item.date;
                            self.current.month = item.month;
                            self.current.year = item.year;
                            if (typeof options.onClick == "function") {
                                options.onClick(self.current);
                            }
                        });
                    }(item);
                }
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
            // var self = this;

            if (typeof options != "object") {
                options = {};
            }

            // Creates table for the calendar
            var timeBlock = document.createElement("table");
            timeBlock.className = createClassName("time-block");

            var timeRow = document.createElement("tr");
            timeRow.className = createClassName("time-row");
            timeBlock.appendChild(timeRow);

            var hoursCell = document.createElement("td");
            hoursCell.className = createClassName("hours-cell");
            hoursCell.unit = "hours";
            hoursCell.valueChanges = [10, 1];
            hoursCell.valueSpan = document.createElement("span");

            var minutesCell = document.createElement("td");
            minutesCell.className = createClassName("minutes-cell");
            minutesCell.unit = "minutes";
            minutesCell.valueChanges = [10, 1];
            minutesCell.valueSpan = document.createElement("span");

            var secondsCell = document.createElement("td");
            secondsCell.className = createClassName("seconds-cell");
            secondsCell.unit = "seconds";
            secondsCell.valueChanges = [10, 1];
            secondsCell.valueSpan = document.createElement("span");

            [hoursCell, minutesCell, secondsCell].forEach(function (block) {
                ["increase", "decrease"].forEach(function (action) {
                    var actionRow = document.createElement("div");
                    actionRow.className = createClassName(action + "-div");
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
                valueDiv.className = createClassName("value-div");
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

            renderItems(timeRow, options.items, itemsReference, renderItem);

            // Return block
            return timeBlock;
        };

        /**
         *
         * @param options
         * @returns {Element}
         */
        DatetimePicker.prototype.controlBlock = function (options) {
            // var self = this;

            if (typeof options != "object") {
                options = {};
            }

            var controlBlock = document.createElement("table");
            controlBlock.className = createClassName("control-block");

            var row = document.createElement("tr");
            controlBlock.appendChild(row);

            var set2nowCell = document.createElement("td");
            set2nowCell.className = createClassName("set2now-cell");

            var set2nowSpan = document.createElement("span");
            set2nowCell.appendChild(set2nowSpan);

            set2nowSpan.addEventListener("click", function () {
                self.current.time = new Date().getTime();
            });

            var resetCell = document.createElement("td");
            resetCell.className = createClassName("reset-cell");

            var resetSpan = document.createElement("span");
            resetCell.appendChild(resetSpan);

            resetSpan.addEventListener("click", function () {
                self.current.time = self.initTime.getTime();
            });

            var submitCell = document.createElement("td");
            submitCell.className = createClassName("submit-cell");

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

            renderItems(row, options.items, itemsReference, renderItem);

            // Return block
            return controlBlock;
        };

        /**
         *
         * @param className
         * @returns {string}
         */
        function createClassName(className) {
            var prefix = "datetimePicker__";
            if (typeof self.options.classNamePrefix == "string") {
                prefix = self.options.classNamePrefix;
            }
            return prefix + className;
        }

        /**
         *
         * @param container
         * @param itemNames
         * @param itemsReference
         * @param renderItem
         */
        function renderItems(container, itemNames, itemsReference, renderItem) {
            /*
             if (!(container instanceof HTMLElement)) {
             throw TypeError("renderItems: \"container\" must be an HTMLElement");
             }
             if (!(itemNames instanceof Array)) {
             throw TypeError("renderItems: \"itemNames\" must be an Array");
             }

             if (typeof itemsReference != "object") {
             throw TypeError("renderItems: \"itemsReference\" must be an Object");
             }
             if (typeof renderItem != "function") {
             throw TypeError("renderItems: \"render\" must be an Function");
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
        function createCalendar(currentYear, currentMonth, currentDate) {

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

            threeMonths.forEach(function (theMonth, index) {
                var date, monthPos, day;
                var maxDate = new Date(theMonth[0], theMonth[1] + 1, 0).getDate(); // date "zero" of next month
                for (date = 1; date <= maxDate; date++) {
                    monthPos = index - 1; // -1, 0, 1
                    day = new Date(theMonth[0], theMonth[1], date).getDay();
                    if (monthPos == -1) {

                    }
                    calendar.push({
                        "year": theMonth[0],
                        "month": theMonth[1],
                        "date": date,
                        "day": day,
                        "monthPos": monthPos,
                        "datePos":
                            monthPos != 0
                                ? monthPos
                                : (date - currentDate) / Math.abs(date - currentDate) || 0,
                        "isToday":
                            theMonth[0] == now.getFullYear()
                            && theMonth[1] == now.getMonth()
                            && date == now.getDate()
                    });
                }
            });

            return calendar;
        }

    }(document);
};

