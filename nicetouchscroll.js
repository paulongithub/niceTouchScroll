	////////////////////////////////////////////////////////////////////////////
	//
	//    NiceScroll 
	//    Copyright 2015 Paul Darby
	//
	//    This program is free software: you can redistribute it and/or modify
	//    it under the terms of the GNU General Public License as published by
	//    the Free Software Foundation, either version 3 of the License, or
	//    (at your option) any later version.
	//
	//    This program is distributed in the hope that it will be useful,
	//    but WITHOUT ANY WARRANTY; without even the implied warranty of
	//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	//    GNU General Public License for more details.
	//
	//    You should have received a copy of the GNU General Public License
	//    along with this program in a file named COPYING.txt.  
	//    If not, see <http://www.gnu.org/licenses/>.
	//
	//
	/////////////////////////////////////////////////////////////////////////////



    var NiceScroll = function(navElement,loc)  {

	        $ = $ || jQuery;
	        if(typeof $ === 'undefined' || ! $) {
	                console.error('Nice Scroll Requires jQuery. Exiting');
	                return false;
	        }
                
	        if(typeof log === 'undefined')
	            window.log = function(){};

			if(typeof navElement === 'undefined' || ! navElement) {
				console.error('Nice Scroll. No navElement prodivded. Exiting');
				return false;
			}

			this.orientation = '';
			this.touchstart = false;
			this.moving = false;

			this.marginStart = '';
			this.marginEnd = '';
			this.paddingStart = '';
			this.paddingEnd = '';
			this.positionProperty = '';

			this.previousPageLoc = 0;
			this.lastPageLoc = 0;
			this.pageLoc = 0;
			this.startPageLoc = 0;
			this.moveLoc = 0;

			this.direction = null;
			this.minLoc = 0;
			this.loc = typeof loc === 'undefined' ? 0 : loc;

			this.navWindow = 0;
			this.ulStartOffset = 0;
			this.liDimension = 0;

			this.lastTimestamp = 0;
			this.previousTimestamp = 0;
			this.startTimestamp = 0;
			
			this.nav = $(navElement);
			var instance = this;

			if ($(this.nav).length !== 1) {
				console.error('Nice Scroll. navElement passed in: '+ navElement +' is not exactly one element. Exiting.');
				return false;
			}

			this.ul = $(navElement).children('ul');

            $(this.ul).attr('data-nicescroll-ul',true);

			if ($(this.ul).length !== 1) {
				console.error('Nice Scroll. navElement does not have exactly one ul child. Exiting.');
				return false;
			}


			$(this.nav).css({overflow:'hidden','white-space':'nowrap'});
			$(this.ul).css('position','relative');
		

			this.setOrientationBasedProperties();
			
			$(this.ul).on('touchstart',function(evt){

                        	log('touchstart: ul is moving: ' + instance.moving);

	                        evt.preventDefault();
                        
	                        instance.touchstart = true;
	                        $(this).stop(true);
	                        instance.pageLoc = instance.orientation === 'landscape' ? evt.originalEvent.touches[0].pageX : evt.originalEvent.touches[0].pageY;
	                        instance.startPageLoc = instance.pageLoc;
	                        instance.moveLoc = instance.pageLoc;
	                        instance.loc = parseInt($(instance.ul).css(instance.positionProperty),10);
	                        instance.lastTimestamp = new Date().getTime();
	                        instance.startTimestamp = instance.lastTimestamp;
               	 	});

				
			$(this.ul).on('touchmove',function(evt){

	                        //log('touchmove');
	                        //log('ul is moving: ' + instance.moving);
                        
	                        evt.preventDefault();
                                 
	                        if (! instance.touchstart) 
	                                return;

	                        if (! instance.moving) {
	                            instance.moving = true;
	                            log('touchmove: set moving = true');
	                        }
                                
	                        instance.previousMoveLoc = instance.moveLoc;
	                        var thisLoc = instance.orientation === 'landscape' ? evt.originalEvent.touches[0].pageX : evt.originalEvent.touches[0].pageY;
	                        instance.moveLoc = thisLoc < instance.moveLoc ? instance.moveLoc - 1 : instance.moveLoc + 1;
                                                                        
	                        instance.direction =  (instance.previousMoveLoc < instance.moveLoc) ? 'adding' : 'reducing';
	                        $(instance.ul).css(instance.positionProperty,instance.loc + thisLoc - instance.pageLoc);
                                
	                        instance.previousTimestamp = instance.lastTimestamp;
	                        instance.lastTimestamp = new Date().getTime();
                                
	                        instance.previousPageLoc = instance.lastPageLoc;
	                        instance.lastPageLoc = thisLoc;
                                
                });

			if (! ('ontouchstart' in document.documentElement)) {

	                        log('using mousedown');
                        
	                        $(this.ul).on('mousedown',function(evt){
                            
	                                log('mousedown: ul is moving: ' + instance.moving);
                                
	                                evt.preventDefault();
                                
	                                instance.touchstart = true;
	                                $(this).stop(true);
	                                instance.pageLoc = instance.orientation === 'landscape' ? evt.pageX : evt.pageY;
	                                instance.startPageLoc = instance.pageLoc;
	                                instance.moveLoc = instance.pageLoc;
	                                instance.loc = parseInt($(instance.ul).css(instance.positionProperty),10);
	                                instance.lastTimestamp = new Date().getTime();
	                                instance.startTimestamp = instance.lastTimestamp;
	                        });

	                        $(this.ul).on('mousemove',function(evt){
                                
	                                evt.preventDefault();
                                
	                                if (! instance.touchstart) 
	                                        return;
                                    
	                                if (! instance.moving) {
	                                    instance.moving = true;
	                                    log('mousemove: set moving = true');
	                                }
                        
	                                instance.previousMoveLoc = instance.moveLoc;
	                                var thisLoc = instance.orientation === 'landscape' ? evt.pageX : evt.pageY;
	                                instance.moveLoc = thisLoc < instance.moveLoc ? instance.moveLoc - 1 : instance.moveLoc + 1;
                                
	                                //log("did it move?: " + (instance.previousMoveLoc !== instance.moveLoc));
                                
	                                instance.direction =  (instance.previousMoveLoc < instance.moveLoc) ? 'adding' : 'reducing';
                                
	                                $(instance.ul).css(instance.positionProperty,instance.loc + thisLoc- instance.pageLoc);
                                
	                                instance.lastTimestamp = new Date().getTime();
                                
	                                instance.previousPageLoc = instance.lastPageLoc;
	                                instance.lastPageLoc = thisLoc;
	                        });
	                } else {
	                        log('using touchstart');
	                }
                        

                        
	                $(this.ul).on('mouseleave mouseup touchend',function(evt){

                                
	                        if (! instance.touchstart) {
	                           return;
                            }

	                        log('mouse/ touchend action');
                        
                        
	                        if($(evt.target).context.localName !== 'li') {
                            
	                            var element = $(evt.target).closest('li');
                            
	                            if (! element.length) {
	                                element = false;
	                            }
                            
	                        } else {
                            
	                            var element = $(evt.target);
	                        }
                        
	                        if(! instance.moving) {
	                                log('instance not moving');
	                                instance.touchstart = false;
	                                $(element).trigger('niceScrollClick');
	                                setTimeout(function(){
	                                        log('about to call adjust');
	                                        instance.adjustPosition(instance);
	                                },100);
	                                return;
	                        }

	                        instance.touchstart = false;
	                        instance.pageLoc = 0;
	                        instance.loc = parseInt($(instance.ul).css(instance.positionProperty),10);
	                        var endTime = new Date().getTime();
	                        var moveTime = endTime - instance.lastTimestamp;
                                
	                        var pageLocDifference = Math.abs(instance.lastPageLoc - instance.previousPageLoc);
	                        log("pageLocDifference: " + pageLocDifference);
                        
	                        if (! pageLocDifference) {
	                            $(element).trigger('niceScrollClick');
	                        }
                                
	                        var moveType = null;
	                        var moveDistance = 0;
	                        var moveLength = 0;
                        
	                        //if the navigation window is bigger than the ul, then reset position to 0
	                        if (instance.navWindow > instance.liDimension) {
	                                log("instance.navWindow is greater than instance.liDimension");
	                                log('about to call adjust');
	                                instance.adjustPosition(instance);
	                                return;
	                        }
                        
	                        var primeSpeed = (endTime - instance.startTimestamp) / Math.abs(instance.lastPageLoc - instance.startPageLoc);
	                        log("SPEED: " + primeSpeed);
                                
	                        if (primeSpeed < 0.7){
	                                moveType = 'quick flick';
	                                moveDistance = 800;
	                                moveLength = 600;
	                        } else if (primeSpeed < 1.3){
	                                moveType = 'medium flick';
	                                moveDistance = 400;
	                                moveLength = 600;
	                        } else if (moveTime / pageLocDifference > 15) {
	                                moveType = 'abrupt';
	                                moveDistance = 0;
	                                moveLength = 0;
	                        } else {
	                                moveType = 'moderate';
	                                moveDistance = 145;
	                                moveLength = 450
	                        }

				            log("moveType: " + moveType);

 				            //if the position is less than zero (ie moving away from start) and it's
				            //closer than the furthest away from the start it can be, then move - adjusting afterwards
				            //if we've gone too far
				            if (instance.loc < 0 && instance.loc > instance.minLoc) {
					            switch (instance.direction) {
						            case 'adding' :

	                                        var options = {};
	                                        options[instance.positionProperty] = instance.loc + moveDistance > 50 ? 50 : instance.loc + moveDistance;
	                                        log('about to animate - adding');
	                                        $(instance.ul).animate(options,moveLength,'easeOutQuad',function(){
	                                            log('about to call adjust');
	                                            instance.adjustPosition(instance);
	                                        });
	                                        log('finished animating');
	                                        return;
	                                        break;
                                        
	                                default :

	                                        var options = {};
	                                        options[instance.positionProperty] = instance.loc - moveDistance < instance.minLoc - 50 ? instance.minLoc - 50 : instance.loc - moveDistance;
	                                        log('about to animate - reducing');
	                                        $(instance.ul).animate(options,moveLength,'easeOutQuad',function(){
	                                            log('about to call adjust');
	                                            instance.adjustPosition(instance);
	                                        });
	                                        log('finished animating');
	                                        return;
	                                }
	                           }

				
				            instance.loc = parseInt($(instance.ul).css(instance.positionProperty),10);

				            //our position is greater than zero ie the starting li is away from it's beginning
				            //move it back to it's beginning
				            if (instance.loc >= 1) {

	                                var options = {};
	                                options[instance.positionProperty] = 0;
	                                $(instance.ul).animate(options,500,function(){
	                                    log('position >= 1 - moving back to beginning');
	                                    log('set moving = false');
	                                    instance.moving = false;
	                                });
	                        }

	                        //our position is less than our minimum ie the last li is away from the end
	                        //move it back to the end
	                        else if (instance.loc <= instance.minLoc) {

	                                var options = {};
	                                options[instance.positionProperty] = instance.minLoc;
	                                $(instance.ul).animate(options,500,function(){
	                                    log('position <= minLoc - move back to end');
	                                    log('set moving = false');
	                                    instance.moving = false;
	                                });
	                        }

                            //default - set moving to false
                            else {
                                    log('default - set moving to false');
                                    instance.moving = false;
                            }
                                
                });
        
                $(this.ul).on( 'DOMMouseScroll mousewheel',function(evt) {
                        var event = evt.originalEvent;

				if (typeof event.wheelDelta === 'undefined') return;

				evt.preventDefault();
				event.wheelDelta > 0 ? instance.handleMoveRequest('adding') : instance.handleMoveRequest('reducing');
			});
						
	}

	//when we action a move, we check on completion of 
	//the move to see if if we need to reset in any way
	NiceScroll.prototype.adjustPosition = function(instance) {
	    
		log('about to adjust');

		instance.loc = parseInt($(instance.ul).css(instance.positionProperty),10);
		
		log('instance.loc: ' + instance.loc);

	        if(instance.liDimension < instance.navWindow) {
            
	                log('instance.liDimension < instance.navWindow');
                
	                var options = {};
	                options[instance.positionProperty] = 0;
                
	                $(instance.ul).animate(options,500,'easeOutQuad',function(){
                    
	                    log('finished animating instance.liDimension < instance.navWindow');
	                    log('set moving = false');
	                    instance.moving = false;
	                });
	                return;
	        }
                        
	        if (instance.loc >= 1) {
            
	                log('about to animate loc >= 1');

			var options = {};
			options[instance.positionProperty] = 0;

	                $(instance.ul).animate(options,500,'easeOutQuad',function(){
                    
	                    log('finished animating loc >= 1');
	                    log('set moving = false');
	                    instance.moving = false;
	                });
	                return;
	        }

	        if (instance.loc <= instance.minLoc) {
	                var options = {};
	                options[instance.positionProperty] = instance.minLoc;
	                log('about to animate loc <= instance.minLoc');
	                $(instance.ul).animate(options,500,'easeOutQuad',function(){
                    
	                    log('finished animating loc <= instance.minLoc');
	                    log('set moving = false');
	                    instance.moving = false;
	                });
	                return;
	        }
        
	        log('no adjustment, set moving = false');
	        instance.moving = false;
        
	}

	NiceScroll.prototype.setOrientationBasedProperties = function() {

		this.orientation = (typeof $(this.nav).attr('data-view-orientation') === 'undefined' || ! $(this.nav).attr('data-view-orientation')) ? 'landscape' : $(this.nav).attr('data-view-orientation');
		this.liDimension = 0;

		$(this.ul).css({left:0,top:0});

		var instance = this;

		switch(this.orientation){

			case 'landscape' :
				
				this.positionProperty = 'left';
				this.marginStart = 'margin-left';
				this.marginEnd = 'margin-right';
				this.paddingStart = 'padding-left';
				this.paddingEnd = 'padding-right';
				var navInner = $(this.nav).innerWidth();
				$(this.ul).children('li').each(function(){
					instance.liDimension += $(this).outerWidth(true) + 4;
				});
				this.liDimension = this.liDimension -4;
				break;

			case 'portrait' :

				this.positionProperty = 'top';
				this.marginStart = 'margin-top';
				this.marginEnd = 'margin-bottom';
				this.paddingStart = 'padding-top';
				this.paddingEnd = 'padding-bottom';
				var navInner = $(this.nav).innerHeight();
				$(this.ul).children('li').each(function(){
					instance.liDimension += $(this).outerHeight(true);
				});
				break;
		}

		this.navWindow = navInner + parseInt($(this.nav).css(this.paddingStart),10) + parseInt($(this.nav).css(this.paddingEnd),10);
		this.ulStartOffset = parseInt($(this.ul).css(this.paddingStart),10) + parseInt($(this.ul).css(this.marginStart),10);
		this.minLoc = (this.liDimension - this.navWindow + this.ulStartOffset) * -1;
		this.minLoc = this.minLoc - parseInt($(this.nav).css(this.paddingEnd),10);

	}


	NiceScroll.prototype.handleMoveRequest = function(direction) {

		 $(this.ul).stop(true);

		 this.loc = parseInt($(this.ul).css(this.positionProperty),10);

		 var newPosition = direction === 'adding' ? this.loc + 150 : this.loc - 150;
		
		 var options = {};
		 options[this.positionProperty] = newPosition;
		 
		 var instance = this;
		 $(this.ul).animate(options,450,function(){instance.adjustPosition(instance)});
	}
