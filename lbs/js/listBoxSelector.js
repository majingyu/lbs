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
        	var options = $(this).data('options');
        	options.left = items;
        	$(this).data('options', options);
        	var leftSelect = $(this).find('.lbs-left-select');
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
         * set right select items
         * 
         * @author Ximing Wang
         */
        setRight: function (items) {
        	if (items == undefined || items == null) {
        		return;
        	}
        	
        	var self = this;
        	var options = $(this).data('options');
        	options.right = items;
        	$(this).data('options', options);
        	var rightSelect = $(this).find('.lbs-right-select');
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
        }
    };
    
    /**
     * render on the page
     * 
     * @author Ximing Wang
     */
    var render = function (instance) {
    	var html = '<div class="lbs-content">' +
	    		'<div class="lbs-left-container"><select multiple class="form-control lbs-left-select"></select></div>' +
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
	    		'<div class="lbs-right-container"><select multiple class="form-control lbs-right-select"></select></div>' +
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
    	var rightItems = options.right;
    	var rightSelect = $(instance).find('.lbs-right-select');
    	
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
    };

    /**
     * initialize all events
     */
    var initializeEvents = function (instance) {
    	var leftSelect = $(instance).find('.lbs-left-select');
    	var rightSelect = $(instance).find('.lbs-right-select');
    	var addOne = $(instance).find('.lbs-add-one');
    	var addAll = $(instance).find('.lbs-add-all');
    	var removeOne = $(instance).find('.lbs-remove-one');
    	var removeAll = $(instance).find('.lbs-remove-all');
    	
    	// addOne button click event
    	addOne.on('click', function () {
    		// find the selected option
    		var selected = leftSelect.find('option:selected');
    		if (selected.length == 0 && leftSelect.find('option').length > 0) {
    			// if have no selected option and left select has options,
    			// selected the first one
    			selected = leftSelect.find('option:nth-child(1)');
    		}
    		
    		if (selected.length > 0) {
    			// if has the selected option,move it to selected select
    			rightSelect.append(selected);
    			
    			// sort
    			selectSort(instance, rightSelect);
    		}
    		
    		changeBtnStatus(instance);
    		
    		cancelAllSelected(instance);
    	});
    	
    	// addAll button click event
    	addAll.on('click', function () {
    		// move all the options to selected select
    		var options = leftSelect.find('option');
    		rightSelect.append(options);
    		
    		// sort
			selectSort(instance, rightSelect);
			
			changeBtnStatus(instance);
			
			cancelAllSelected(instance);
    	});
    	
    	// removeOne button click event
    	removeOne.on('click', function () {
    		// find the selected option
    		var selected = rightSelect.find('option:selected');
    		if (selected.length == 0 && rightSelect.find('option').length > 0) {
    			// if have no selected option and selected select has options,
    			// selected the first one
    			selected = rightSelect.find('option:nth-child(1)');
    		}
    		
    		if (selected.length > 0) {
    			// if has the selected option,move it to left select
    			leftSelect.append(selected);
    			
    			// sort
    			selectSort(instance, leftSelect);
    		}
    		
    		changeBtnStatus(instance);
    		
    		cancelAllSelected(instance);
    	});
    	
    	// removeAll button click event
    	removeAll.on('click', function () {
    		// move all the options to left select
    		var options = rightSelect.find('option');
    		leftSelect.append(options);
    		
    		// sort
			selectSort(instance, leftSelect);
			
			changeBtnStatus(instance);
			
			cancelAllSelected(instance);
    	});
    	
    	changeBtnStatus(instance);
    	
    	var options = $(instance).data('options');
    	var confirm = options.confirm;
    	if (confirm != null && confirm.callback != undefined && confirm.callback != null) {
    		// if has confirm button,callback
    		var confirmBtn = $(instance).find('.lbs-confirm-btn');
    		confirmBtn.on('click', function () {
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
     * cansel all options selected
     * 
     * @author Ximing Wang
     */
    var cancelAllSelected = function (instance) {
    	var options = $(instance).find('option');
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
    	var leftOptions = $(instance).find('.lbs-left-select').find('option');
    	var rightOptions = $(instance).find('.lbs-right-select').find('option');
    	var addOne = $(instance).find('.lbs-add-one');
    	var addAll = $(instance).find('.lbs-add-all');
    	var removeOne = $(instance).find('.lbs-remove-one');
    	var removeAll = $(instance).find('.lbs-remove-all');
    	
    	// disable or enable addOne button and addAll button
    	if (leftOptions.length > 0) {
    		addOne.removeClass('disabled');
    		addAll.removeClass('disabled');
    	}
    	else {
    		addOne.addClass('disabled');
    		addAll.addClass('disabled');
    	}
    	
    	// disable or enable removeOne button and removeAll button
    	if (rightOptions.length > 0) {
    		removeOne.removeClass('disabled');
    		removeAll.removeClass('disabled');
    	}
    	else {
    		removeOne.addClass('disabled');
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