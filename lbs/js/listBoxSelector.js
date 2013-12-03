/**
 * File Name: listBoxSelector.js Summary: listBoxSelector plugin。
 * 
 * Author: Ximing Wang 
 */
(function() {

    var methods = {
        init: function(options) {
            return this.each(function() {
                var self = this;
                var isInitialized = $(self).data("isInitialized");
                if (isInitialized == null) {
                	var defaultOptions = {
                		left: [],
                		right: [],
                		leftTitle: '',
                		rightTitle: '',
                		sort: false,
                		confirm: null
                	};
                	
                	options = mergeOptions(options, defaultOptions);
                	
                	// if not initialize,initialize it
                	// save options
                    $(self).data('options', options);
                    
                    // render html on page
                    render(self);
                    
                    // init left and right items
                    initializeData(self);
                    
                    // init buttons event
                    initializeEvents(self);
                    
                    // init buttons css when window resize event 
                    initializeResizeEvent(self);

                    $(self).data("isInitialized", 'true');
                }
            })
        },
        
        /**
         * get left and right items
         * 
         * @author Ximing Wang
         */
        getItems: function () {
			var left = methods['getLeft'].call(this);
			var right = methods['getRight'].call(this);
			
			return { left: left, right: right };
        },
        
        /**
         * get left select items
         * 
         * @author Ximing Wang
         */
        getLeft: function () {
        	var leftOptions = $(this).find('.lbs-left-select').find('option');
			var left = [];
			
			// find left options
			$.each(leftOptions, function (index, option) {
				left.push({ text: option.text, value: option.value });
			});
			
			return left;
        },
        
        /**
         * get right select items
         * 
         * @author Ximing Wang
         */
        getRight: function () {
        	var rightOptions = $(this).find('.lbs-right-select').find('option');
			var right = [];
			
			// find right options
			$.each(rightOptions, function (index, option) {
				right.push({ text: option.text, value: option.value });
			});
			
			return right;
        },
        
        /**
         * set left select items
         * 
         * @author Ximing Wang
         */
        setLeft: function (items) {
        	if (items == undefined || items == null) {
        		return;
        	}
        	
        	var self = this;
        	var options = $(self).data('options');
        	options.left = items;
        	$(self).data('options', options);
        	var leftSelect = $(self).find('.lbs-left-select');
        	var option = null;
        	
        	// empty left select
        	leftSelect.empty();
        	
        	// update data
        	$.each(items, function (index, item) {
        		if (item.text != undefined) {
        			option = new Option(item.text, item.value);
        			option.title = item.text;
        		}
        		else {
        			option = new Option(item, '');
            		option.title = item;
        		}
        		leftSelect.append(option);
        	});
        	
        	changeBtnStatus(self);
        },
        
        /**
         * set left select title
         * 
         * @author Ximing Wang
         */
        setLeftTitle: function (title) {
        	if (title == undefined || title == null) {
        		return;
        	}
        	
        	var self = this;
        	var options = $(self).data('options');
        	options.leftTitle = title;
        	$(self).data('options', options);
        	
        	var leftTitleElement = $(self).find('.lbs-left-title');
        	leftTitleElement.html(title);
        },
        
        /**
         * set right select items
         * 
         * @author Ximing Wang
         */
        setRight: function (items) {
        	if (items == undefined || items == null) {
        		return;
        	}
        	
        	var self = this;
        	var options = $(self).data('options');
        	options.right = items;
        	$(self).data('options', options);
        	var rightSelect = $(self).find('.lbs-right-select');
        	var option = null;
        	
        	// empty right empty
        	rightSelect.empty();
        	
        	// update data
        	$.each(items, function (index, item) {
        		if (item.text != undefined) {
        			option = new Option(item.text, item.value);
        			option.title = item.text;
        		}
        		else {
        			option = new Option(item, '');
            		option.title = item;
        		}
        		rightSelect.append(option);
        	});
        	
        	changeBtnStatus(self);
        },
        
        /**
         * set right select title
         * 
         * @author Ximing Wang
         */
        setRightTitle: function (title) {
        	if (title == undefined || title == null) {
        		return;
        	}
        	
        	var self = this;
        	var options = $(self).data('options');
        	options.rightTitle = title;
        	$(self).data('options', options);
        	
        	var rightTitleElement = $(self).find('.lbs-right-title');
        	rightTitleElement.html(title);
        }
    };
    
    /**
     * render on the page
     * 
     * @author Ximing Wang
     */
    var render = function (instance) {
    	var html = '<div class="lbs-content">' +
	    		'<div class="lbs-left-container">' +
	    			'<div class="lbs-left-title"></div>' +
	    			'<select multiple class="form-control lbs-left-select"></select>' +
    			'</div>' +
	    		'<div class="lbs-center-container">' +
	    			'<div class="lbs-change-btns-split"></div>' +
	    			'<div class="lbs-change-btns">' +
	    				'<div class="lbs-change-btn-container">' +
		    				'<div class="btn lbs-add-one lbs-change-btn">›</div>' +
		    			'</div>' +
		    			'<div class="lbs-change-btn-container">' +
		    				'<div class="btn lbs-add-all lbs-change-btn">»</div>' +
	    				'</div>' +
		    			'<div class="lbs-change-btn-container">' +
		    				'<div class="btn lbs-remove-one lbs-change-btn">‹</div>' +
	    				'</div>' +
		    			'<div class="lbs-change-btn-container">' +
		    				'<div class="btn lbs-remove-all lbs-change-btn">«</div>' +
	    				'</div>' +
	    			'</div>' +
	    		'</div>' +
	    		'<div class="lbs-right-container">' +
	    			'<div class="lbs-right-title"></div>' +
	    			'<select multiple class="form-control lbs-right-select"></select>' +
    			'</div>' +
	    	'</div>';
    	var options = $(instance).data('options');
    	var confirm = options.confirm;
    	if (confirm != null) {
    		html += '<div class="lbs-buttons">' +
	    		'<div class="btn lbs-confirm-btn">' + confirm.text + '</div>' +
	    	'</div>';
    	}
    	$(instance).append(html);
    	if (confirm == null) {
    		$(instance).find('.lbs-content').addClass('lbs-content-height');
    	}
    };
    
    /**
     * iniialize options data
     * 
     * @author Ximing Wang
     */
    var initializeData = function (instance) {
    	var options = $(instance).data('options');
    	var leftItems = options.left;
    	var leftSelect = $(instance).find('.lbs-left-select');
    	var leftTitle = options.leftTitle;
    	var leftTitleElement = $(instance).find('.lbs-left-title');
    	var rightItems = options.right;
    	var rightSelect = $(instance).find('.lbs-right-select');
    	var rightTitle = options.rightTitle;
    	var rightTitleElement = $(instance).find('.lbs-right-title');
    	
    	var option = null;
    	
    	// init left select data
    	$.each(leftItems, function (index, item) {
    		if (item.text != undefined) {
    			option = new Option(item.text, item.value);
    			option.title = item.text;
    		}
    		else {
    			option = new Option(item, '');
        		option.title = item;
    		}
    		leftSelect.append(option);
    	});

    	// init left title
    	leftTitleElement.html(leftTitle);
    	
    	// init right select data
    	$.each(rightItems, function (index, item) {
    		if (item.text != undefined) {
    			option = new Option(item.text, item.value);
    			option.title = item.text;
    		}
    		else {
    			option = new Option(item, '');
        		option.title = item;
    		}
    		rightSelect.append(option);
    	});
    	
    	// init right title
    	rightTitleElement.html(rightTitle);
    };

    /**
     * initialize all events
     */
    var initializeEvents = function (instance) {
    	var leftSelect = $(instance).find('.lbs-left-select');
    	var rightSelect = $(instance).find('.lbs-right-select');
    	var leftOptions = leftSelect.find('option');
    	var rightOptions = rightSelect.find('option');
    	var addOne = $(instance).find('.lbs-add-one');
    	var addAll = $(instance).find('.lbs-add-all');
    	var removeOne = $(instance).find('.lbs-remove-one');
    	var removeAll = $(instance).find('.lbs-remove-all');
    	var options = $(instance).data('options');
    	
    	// left select change event
    	leftSelect.unbind('change');
    	leftSelect.bind('change', function () {
    		addOne.removeClass('disabled');
    		cancelSelected(instance, rightSelect);
    		changeBtnStatus(instance);
    	});
    	
    	// right select change event
    	rightSelect.unbind('change');
    	rightSelect.bind('change', function () {
    		removeOne.removeClass('disabled');
    		cancelSelected(instance, leftSelect);
    		changeBtnStatus(instance);
    	});
    	
    	// addOne button click event
    	addOne.unbind('click');
    	addOne.bind('click', function (event) {
    		if ($(this).hasClass('disabled')) {
    			// if button is disabled, return
    			event.preventDefault();
    			return false;
    		}
    		
    		// find the selected option
    		var selected = leftSelect.find('option:selected');
    		
    		if (selected.length > 0) {
    			// if has the selected option,move it to selected select
    			rightSelect.append(selected);
    			
    			// sort
    			if (options.sort) {
    				selectSort(instance, rightSelect);
    			}
    		}
    		
    		cancelSelected(instance, instance);
    		
    		changeBtnStatus(instance);
    	});
    	
    	// addAll button click event
    	addAll.unbind('click');
    	addAll.bind('click', function (event) {
    		if ($(this).hasClass('disabled')) {
    			// if button is disabled, return
    			event.preventDefault();
    			return false;
    		}
    		
    		// move all the options to selected select
    		var options = leftSelect.find('option');
    		rightSelect.append(options);
    		
    		// sort
    		if (options.sort) {
    			selectSort(instance, rightSelect);
    		}
    		
    		cancelSelected(instance, instance);
    		
    		changeBtnStatus(instance);
    	});
    	
    	// removeOne button click event
    	removeOne.unbind('click');
    	removeOne.bind('click', function (event) {
    		if ($(this).hasClass('disabled')) {
    			// if button is disabled, return
    			event.preventDefault();
    			return false;
    		}
    		
    		// find the selected option
    		var selected = rightSelect.find('option:selected');
    		
    		if (selected.length > 0) {
    			// if has the selected option,move it to left select
    			leftSelect.append(selected);
    			
    			// sort
    			if (options.sort) {
    				selectSort(instance, leftSelect);
    			}
    		}

    		cancelSelected(instance, instance);
    		
    		changeBtnStatus(instance);
    	});
    	
    	// removeAll button click event
    	removeAll.unbind('click');
    	removeAll.bind('click', function (event) {
    		if ($(this).hasClass('disabled')) {
    			// if button is disabled, return
    			event.preventDefault();
    			return false;
    		}
    		
    		// move all the options to left select
    		var options = rightSelect.find('option');
    		leftSelect.append(options);
    		
    		// sort
    		if (options.sort) {
    			selectSort(instance, leftSelect);
    		}

    		cancelSelected(instance, instance);
    		
    		changeBtnStatus(instance);
    	});
    	
    	changeBtnStatus(instance);
    	
    	var options = $(instance).data('options');
    	var confirm = options.confirm;
    	if (confirm != null && confirm.callback != undefined && confirm.callback != null) {
    		// if has confirm button,callback
    		var confirmBtn = $(instance).find('.lbs-confirm-btn');
    		confirmBtn.unbind('click');
    		confirmBtn.bind('click', function () {
    			var leftOptions = leftSelect.find('option');
    			var rightOptions = rightSelect.find('option');
    			var leftItems = [];
    			var rightItems = [];
    			
    			// find left options
    			$.each(leftOptions, function (index, option) {
    				leftItems.push({ text: option.text, value: option.value });
    			});
    			
    			// find right options
    			$.each(rightOptions, function (index, option) {
    				rightItems.push({ text: option.text, value: option.value });
    			});
    			confirm.callback({ left: leftItems, right: rightItems });
    		});
    	}
    };
    
    /**
     * cancel select options selected
     * 
     * @author Ximing Wang
     */
    var cancelSelected = function (isntance, select) {
    	var options = $(select).find('option');
    	$.each(options, function (index, option) {
    		option.selected = false;
    	});
    };
    
    /**
     * change the buttons status
     * 
     * @author Ximing Wang
     */
    var changeBtnStatus = function (instance) {
    	var leftSelect = $(instance).find('.lbs-left-select');
    	var rightSelect = $(instance).find('.lbs-right-select');
    	var leftOptions = leftSelect.find('option');
    	var rightOptions = rightSelect.find('option');
    	var leftSelected = leftSelect.find('option:selected');
    	var rightSelected = rightSelect.find('option:selected');
    	var addOne = $(instance).find('.lbs-add-one');
    	var addAll = $(instance).find('.lbs-add-all');
    	var removeOne = $(instance).find('.lbs-remove-one');
    	var removeAll = $(instance).find('.lbs-remove-all');
    	
    	// disable or enable addOne button
    	if (leftSelected.length > 0) {
    		addOne.removeClass('disabled');
    	}
    	else {
    		addOne.addClass('disabled');
    	}
    	
    	// disable or enable addAll button
    	if (leftOptions.length > 0) {
    		addAll.removeClass('disabled');
    	}
    	else {
    		addAll.addClass('disabled');
    	}
    	
    	// disable or enable removeOne button
    	if (rightSelected.length > 0) {
    		removeOne.removeClass('disabled');
    	}
    	else {
    		removeOne.addClass('disabled');
    	}
    	
    	// disable or enable removeAll button
    	if (rightOptions.length > 0) {
    		removeAll.removeClass('disabled');
    	}
    	else {
    		removeAll.addClass('disabled');
    	}
    };
    
    /**
     * select sort by text
     * 
     * @author Ximing Wang
     */
    var selectSort = function (instance, select) {
    	select.find('option').sort(function (a, b) {
			return a.text > b.text;
		}).appendTo(select);
    };
    
    /**
     * initialize resize event, change all buttons css
     * 
     * @author Ximing Wang
     */
    var initializeResizeEvent = function (instance) {
    	var options = $(instance).data('options');
    	var confirmCallback = options.confirm;
    	if (confirmCallback != null) {
    		// init confirm button css
    		var confirmBtn = $(instance).find('.lbs-confirm-btn');
    		var containerHeight = confirmBtn.parent().height();
    		var confirmBtnHeight = (containerHeight - 10) * 0.7;
    		confirmBtn.css('width', confirmBtnHeight * 2 + 'px');
    		confirmBtn.css('height', confirmBtnHeight + 'px');
    		confirmBtn.css('font-size', confirmBtnHeight * 0.8 + 'px');
    		confirmBtn.css('line-height', confirmBtnHeight + 'px');
    		confirmBtn.css('margin-top', (containerHeight - 10) * 0.15 + 'px');
    		
    		$(window).resize(function () {
    			var confirmBtn = $(instance).find('.lbs-confirm-btn');
        		var containerHeight = confirmBtn.parent().height();
        		var confirmBtnHeight = (containerHeight - 10) * 0.7;
        		confirmBtn.css('width', confirmBtnHeight * 2 + 'px');
        		confirmBtn.css('height', confirmBtnHeight + 'px');
        		confirmBtn.css('font-size', confirmBtnHeight * 0.8 + 'px');
        		confirmBtn.css('line-height', confirmBtnHeight + 'px');
        		confirmBtn.css('margin-top', (containerHeight - 10) * 0.15 + 'px');
    		});
    	}
    	
    	// init change buttons css
    	var changeBtns = $(instance).find('.lbs-change-btn');
    	var container = $(changeBtns[0]).parent();
    	var containerHeight = container.height() * 0.7;
    	var containerWidth = container.width();
    	var changeBtnElement = null;
    	$.each(changeBtns, function (index, changeBtn) {
    		changeBtnElement = $(changeBtn);
    		changeBtnElement.css('width', containerWidth + 'px');
    		changeBtnElement.css('height', containerHeight + 'px');
    		changeBtnElement.css('font-size', containerHeight + 'px');
    		changeBtnElement.css('line-height', containerHeight + 'px');
    		changeBtnElement.css('margin-top', container.height() * 0.15 + 'px');
    	});
    	
    	// init titles css
    	var leftTitle = $(instance).find('.lbs-left-title');
    	var height = leftTitle.height();
    	leftTitle.css('font-size', height * 0.8 + 'px');
    	leftTitle.css('line-height', height * 0.9 + 'px');
    	var rightTitle = $(instance).find('.lbs-right-title');
    	height = rightTitle.height();
    	rightTitle.css('font-size', height * 0.8 + 'px');
    	rightTitle.css('line-height', height * 0.9 + 'px');
    	
    	$(window).resize(function () {
    		var changeBtns = $(instance).find('.lbs-change-btn');
        	var container = $(changeBtns[0]).parent();
        	var containerHeight = container.height() * 0.7;
        	var containerWidth = container.width();
        	var changeBtnElement = null;
        	$.each(changeBtns, function (index, changeBtn) {
        		changeBtnElement = $(changeBtn);
        		changeBtnElement.css('width', containerWidth + 'px');
        		changeBtnElement.css('height', containerHeight + 'px');
        		changeBtnElement.css('font-size', containerHeight + 'px');
        		changeBtnElement.css('line-height', containerHeight + 'px');
        		changeBtnElement.css('margin-top', container.height() * 0.15 + 'px');
        	});
        	
        	// init titles css
        	var leftTitle = $(instance).find('.lbs-left-title');
        	var height = leftTitle.height();
        	leftTitle.css('font-size', height * 0.8 + 'px');
        	leftTitle.css('line-height', height * 0.9 + 'px');
        	var rightTitle = $(instance).find('.lbs-right-title');
        	height = rightTitle.height();
        	rightTitle.css('font-size', height * 0.8 + 'px');
        	rightTitle.css('line-height', height * 0.9 + 'px');
    	});
    };
    
    /**
     * merge options
     * 
     * @author Ximing Wang
     */
    var mergeOptions = function (options, defaultOptions) {
    	if (options == undefined || options == null) {
    		return defaultOptions;
    	}
    	
    	if (options.left != undefined && options.left != null) {
    		defaultOptions.left = options.left;
    	}
    	
    	if (options.right != undefined && options.right != null) {
    		defaultOptions.right = options.right;
    	}
    	
    	if (options.leftTitle != undefined && options.leftTitle != null) {
    		defaultOptions.leftTitle = options.leftTitle;
    	}
    	
    	if (options.rightTitle != undefined && options.rightTitle != null) {
    		defaultOptions.rightTitle = options.rightTitle;
    	}
    	
    	if (options.sort != undefined && options.sort != null) {
    		defaultOptions.sort = options.sort;
    	}
    	
    	if (options.confirm != undefined && options.confirm != null) {
    		defaultOptions.confirm = options.confirm;
    		
    		if (options.confirm.text == undefined) {
    			defaultOptions.confirm.text = 'OK';
    		}
    	}
    	
    	return defaultOptions;
    };

    $.fn.listBoxSelector = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jquery.audio');
        }
    };

})(jQuery);