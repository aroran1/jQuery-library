/**
 * @projectDescription: Provides generic validation methods to be applied to form elements.
 * Allows for custom validation methods to be passed in.
 * @version: 1.4
 */
(function($){
	
	$.Validation = function($elem, opts){
		this.opts = $.extend(true,{
			selectors: {
				submit: 	'.submit',
				question: 	'.question'
			},
			classes: {
				pairs: {
					valid: {
						yes: 	'valid',
						no: 	'notValid'
					},
					match: {
						yes:	'match',
						no:		'notMatch'
					}
				},
				custom:				'custom',
				checked: 			'checked',
				required: 			'required',
				email: 				'email',
				postcode: 			'postcode',
				mobile: 			'mobile',
				phone: 				'phone',
				password: 			'password', //doesn't have any rules attached but needed for confirmPassword
				confirmPassword: 	'confirmPassword',
				dob: 				'dob'
			},
			rules: [] //{className: 'password', classPair: ['valid', 'notValid'], fnc: function(){//define custom rule. Must return bool}}
		}, opts);
		this.allValid = [];
		this.$elem = $elem;
		this.$submit = $elem.find(this.opts.selectors.submit);
		this.validate();
	}
	
	$.Validation.prototype = {
		/**
		 * Initial function call.
		 */
		validate: function(){
			var obj = this;
			this.loopFormElems(true);
			this.$submit.click(function(e){
				e.preventDefault();
				obj.submitEvent();
			});
			this.$elem.bind('submitvalidation', function(){
				obj.submitEvent();
			});
		},
		/**
		 * Catches the submit click event and triggers onsubmit.validation with a boolean submit value,
		 * which should be bound onto to submit the form.
		 */
		submitEvent: function(){
			this.loopFormElems();
			for(index in this.allValid){
				if(this.allValid[index] == false){
					this.$elem.trigger('onsubmitvalidation', false);
					this.allValid = [];
					return;
				}
			}
			this.allValid = [];
			this.$elem.trigger('onsubmitvalidation', true);
		},
		/**
		 * Loops form elements and calls relevant validate functions.
		 * 
		 * @param: setEvents {boolean} - Set validation code within events or not.
		 */
		loopFormElems: function(setEvents){
			var obj = this;
			this.$elem.find(this.opts.selectors.question + ' input').each(function(){
				if(obj.isCorrectType($(this))){
					if($(this).attr('type') == 'checkbox'){
						obj.validateCheckbox($(this), setEvents);
					}
					else if($(this).attr('type') == 'radio'){
						obj.validateRadio($(this), setEvents);
					}
					else if($(this).attr('type') == 'text' || $(this).attr('type') == 'password'){
						obj.validateText($(this), setEvents);
					}
				}
			});
			this.$elem.find(this.opts.selectors.question + ' select').each(function(){
				obj.validateSelect($(this), setEvents);
			});
		},
		/**
		 * Returns boolean value based on whether the input type can be validated or not.
		 * 
		 * @param: $node {jQuery object} - input element.
		 * @returns: boolean.
		 */
		isCorrectType: function($node){
			var type = $node.attr('type');
			if(type == 'submit' || type == 'image' || type == 'button' || type == 'reset' || type == 'hidden'){
				return false;
			}
			return true;
		},
		/**
		 * Validates a select element.
		 * 
		 * @param: $node {jQuery object} - select element.
		 * @param: setEvents - Set validation code within change and blur event or not.
		 */
		validateSelect: function($node, setEvents){
			var obj = this,
				$parent = $node.parents(this.opts.selectors.question).eq(0),
				classPair = [this.opts.classes.pairs.valid.yes, this.opts.classes.pairs.valid.no];
				
			if(setEvents){
				$node.change(function(){
					validFncs($parent);
				});
				$node.blur(function(){
					validFncs($parent);
				});
			}
			else{
				validFncs($parent);
			}
			
			function validFncs($parent){
				var valid = false,
					$checkedNode = $parent,
					$node = $parent.find('input'),
					classPair = [obj.opts.classes.pairs.valid.yes, obj.opts.classes.pairs.valid.no];
					
				if($parent.hasClass(obj.opts.classes.required)){
					valid = isValid();
				}
				else if($parent.hasClass(obj.opts.classes.dob)){
					valid = obj.isDOBValid($checkedNode);
				}	
				
				obj.setClasses(classPair, valid, $checkedNode);
				if(!setEvents){
					obj.allValid.push(valid);
				}
			}
			
			function isValid(){
				if($node.prop('selectedIndex') != 0){
					return true;
				}
				else{
					return false;
				}
			}
		},
		/**
		 * Validates a checkbox.
		 * 
		 * @param: $node {jQuery object} - input element.
		 * @param: setEvents - Set validation code within click event or not.
		 */
		validateCheckbox: function($node, setEvents){
			var obj = this,
				$parent = $node.parents(this.opts.selectors.question).eq(0),
				classPair = [this.opts.classes.pairs.valid.yes, this.opts.classes.pairs.valid.no];

			if($parent.hasClass(this.opts.classes.required)){
				if(setEvents){
					if($parent.hasClass(this.opts.classes.custom)){
						$node.parent().bind('checked.checkbox', function(){
							obj.setClasses(classPair, true, $parent);
							if(!setEvents){obj.allValid.push(true);}
						});
						$node.parent().bind('unchecked.checkbox', function(){
							obj.setClasses(classPair, false, $parent);
							if(!setEvents){obj.allValid.push(true);}
						});
					}
					else{
						$node.click(function(){
							checkValid();
						});
					}
				}
				else{
					checkValid();
				}
			}
			
			function checkValid(){
				if($node.is(':checked')){
					obj.setClasses(classPair, true, $parent);
					if(!setEvents){obj.allValid.push(true);}
				}
				else{
					obj.setClasses(classPair, false, $parent);
					if(!setEvents){obj.allValid.push(false);}
				}
			}
		},
		/**
		 * Validates a set of radio buttons.
		 * 
		 * @param: $node {jQuery object} - input element.
		 * @param: setEvents - Set validation code within click event or not.
		 */
		validateRadio: function($node, setEvents){
			var obj = this,
				$parent = $node.parents(this.opts.selectors.question).eq(0),
				classPair = [this.opts.classes.pairs.valid.yes, this.opts.classes.pairs.valid.no];
			if($parent.hasClass(this.opts.classes.required)){
				if(setEvents){
					$node.click(function(){
						checkValid();
					});
				}
				else{
					checkValid();
				}
			}
			
			function checkValid(){
				var valid = false;
				$parent.find('input').each(function(){
					if($(this).is(':checked')){
						valid = true;
					}
				});
				
				obj.setClasses(classPair, valid, $parent);
				if(!setEvents){obj.allValid.push(valid);}
			}
		},
		/**
		 * Validates a input type 'text'. Calls more specific validate functions if applicable.
		 * 
		 * @param: $node {jQuery object} - input element.
		 * @param: setEvents - Set validation code within click event or not.
		 */
		validateText: function($node, setEvents){
			var obj = this,
				$nodeParent = $node.parents(this.opts.selectors.question).eq(0);

			if(setEvents){
				$node.blur(function(){
					if($node[0] == $nodeParent.find('input:last')[0]){
						validFncs($nodeParent);
						$nodeParent.addClass(obj.opts.classes.checked);
					}
				});
				$node.keyup(function(e){
					if(e.keyCode != 9 && $nodeParent.hasClass(obj.opts.classes.checked)){ //not tab key
						validFncs($nodeParent);
					}
				});
			}
			else{
				$nodeParent.addClass(obj.opts.classes.checked);
				validFncs($nodeParent);
			}
			
			function validFncs($parent){
				var valid = false,
					$checkedNode = $parent,
					$node = $parent.find('input'),
					classPair = [obj.opts.classes.pairs.valid.yes, obj.opts.classes.pairs.valid.no];
					
				if($parent.hasClass(obj.opts.classes.required)){
					valid = isValid();
				}
				else if($parent.hasClass(obj.opts.classes.email)){
					valid = obj.isEmailValid($node.val());
				}
				else if($parent.hasClass(obj.opts.classes.postcode)){
					valid = obj.isPostcodeValid($parent);
				}
				else if($parent.hasClass(obj.opts.classes.mobile)){
					valid = obj.isMobileValid($node.val());
				}
				else if($parent.hasClass(obj.opts.classes.phone)){
					valid = obj.isPhoneValid($node.val());
				}
				else if($parent.hasClass(obj.opts.classes.password) && $parent.hasClass(obj.opts.classes.checked)){
					if(obj.$elem.find('.' + obj.opts.classes.confirmPassword).length){
						validFncs(obj.$elem.find('.' + obj.opts.classes.confirmPassword));
					}
					valid = true;
				}
				else if($parent.hasClass(obj.opts.classes.confirmPassword)){
					valid = obj.isConfirmPasswordValid($parent);
					classPair = [obj.opts.classes.pairs.match.yes, obj.opts.classes.pairs.match.no];
				}
				else if($parent.hasClass(obj.opts.classes.password)){
					//password doesn't have any rules associated with it.
					//it exists only to allow confirmPassword validation.
					valid = true;
				}
				
				obj.setClasses(classPair, valid, $checkedNode);
				if(!setEvents){
					obj.allValid.push(valid);
				}
				
				var customValid = false;
				for(rule in obj.opts.rules){
					if($parent.hasClass(obj.opts.rules[rule].className)){
						customValid = obj.opts.rules[rule].fnc($node);
						
						if(!customValid){
							obj.setClasses(obj.opts.rules[rule].classPair, false, $parent);
							if(!setEvents){
								obj.allValid.push(false);
							}
						}
						else if(valid && customValid){
							obj.setClasses(classPair, true, $parent);
							if(!setEvents){
								obj.allValid.push(true);
							}
						}
						else{
							obj.setClasses(classPair, false, $parent);
							if(!setEvents){
								obj.allValid.push(false);
							}
						}
					}
				}
			}
			
			function isValid(){
				if($node.val() != ''){
					return true;
				}
				else{
					return false;
				}
			}
		},
		/**
		 * Returns boolean value based on whether the value is a valid email address.
		 * 
		 * @param: value {String} - value of input element.
		 * @returns: boolean.
		 */
		isEmailValid: function(value){
			var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return value.match(regex) || false;
		},
		/**
		 * Returns boolean value based on whether the value is a valid postcode. Allows for
		 * one or two inputs.
		 * 
		 * @param: $parent {jQuery object} - wrapper of inputs.
		 * @returns: boolean.
		 */
		isPostcodeValid: function($parent){
			var valid = false,
				$input = $parent.find('input');
			if($input.length == 1){
				var regex = /^([a-zA-Z]){1}([0-9][0-9]|[0-9]|[a-zA-Z][0-9][a-zA-Z]|[a-zA-Z][0-9][0-9]|[a-zA-Z][0-9]){1}([ ]?)([0-9][a-zA-z][a-zA-z]){1}$/;
				return $input.val().match(regex) || false;
			}
			else{
				var regex1 = /^([a-zA-Z]){1}([0-9][0-9]|[0-9]|[a-zA-Z][0-9][a-zA-Z]|[a-zA-Z][0-9][0-9]|[a-zA-Z][0-9]){1}$/,
					regex2 = /^([0-9][a-zA-z][a-zA-z]){1}$/;
					
				if($input.eq(0).val().match(regex1) && $input.eq(1).val().match(regex2)){
					return true;
				}
				return false;
			}
		},
		/**
		 * Returns boolean value based on whether the value is a valid mobile number.
		 * 
		 * @param: value {String} - value of input element.
		 * @returns: boolean.
		 */
		isMobileValid: function(value){
			var regex = /^((00|\+)44|0)7\d{9}$/;
			return value.replace(/\s/g,'').match(regex) || false;
		},
		/**
		 * Returns boolean value based on whether the value is a valid UK phone number.
		 * 
		 * @param: value {String} - value of input element.
		 * @returns: boolean.
		 */
		isPhoneValid: function(value){
			var regex = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
			return value.match(regex) || false;
		},
		/**
		 * Returns boolean value based on whether the value is equal to the password value.
		 * 
		 * @param: $parent {jQuery object} - wrapper of inputs.
		 * @returns: boolean.
		 */
		isConfirmPasswordValid: function($parent){
			var password = this.$elem.find('.' + this.opts.classes.password).find('input').val(),
				confirmPassword = $parent.find('input').val();
				
			return password == confirmPassword;
		},
		/**
		 * Returns boolean value based on whether the DOB selected is valid
		 * 
		 * @param: $parent {jQuery object} - wrapper of selects.
		 * @returns: boolean.
		 */
		isDOBValid: function($parent){
			var valid = true,
				$selects = $parent.find('select');
			$selects.each(function(i){
				if($(this).prop('selectedIndex') == 0){
					valid = false;
				}
				var val = $(this).val();
				if(i == 1 && (val == 4 || val == 6 || val == 9 || val == 11)){
					if($selects.eq(0).val() > 30){
						valid = false;
					}
				}
				else if(i == 1 && val == 2){
					var isLeapYear = new Date($selects.eq(2).val(), 1, 29).getDate() == 29;
					if($selects.eq(0).val() > 28){
						valid = false;
						if($selects.eq(0).val() == 29 && isLeapYear){
							valid = true;
						}
					}
				}
			});
			return valid;
		},
		/**
		 * Adds or removes valid and notValid classes.
		 * 
		 * @param: classPair {Object literal} - pair of class names
		 * @param: valid {Boolean} - whether value of input is valid or not.
		 * @param: $node {jQuery object} - element to add/remove classes.
		 */
		setClasses: function(classPair, valid, $node){
			var addClass = '',
				removeClass = '';
				
			for(i in this.opts.classes.pairs){
				for(j in this.opts.classes.pairs[i]){
					$node.removeClass(this.opts.classes.pairs[i][j]);
				}
			}
				
			if(valid){
				addClass = classPair[0];
				removeClass = classPair[1];
			}
			else{
				addClass = classPair[1];
				removeClass = classPair[0];
			}

			$node.addClass(addClass);
			$node.removeClass(removeClass);
			$node.trigger('oncheckvalidation', valid);
		}
	}
	
})(jQuery);