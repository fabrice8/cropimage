
		( function( $ ){
			'use strict';
			
			var OUTBOUNDS_COLOR = {
																black: 'rgba(20, 20, 20, .6)',
																white: 'rgba(250, 250, 250, .6)'
															},
					STATIC_RESIZE = false, // the get absolute input sizes
					AUTO_RESIZE = false, // scalable but keep the picture sizes format
					FREE_RESIZE = false // give ability to resize de image any how you want directly in the canvas
					
			$.hasOwnProperty( 'fn' ) ? $.fn.resizeImage = core : console.log('JQuery 2.0.0 plugin undefined')
			
			// Touch screen JQuery support events binding
			$.fn.extend({
				touchend: function( fn ){ return fn ? this.bind( 'touchend', fn ) : this.trigger('touchend') },
				touchstart: function( fn ){ return fn ? this.bind( 'touchstart', fn ) : this.trigger('touchstart') },
				touchmove: function( fn ){ return fn ? this.bind( 'touchmove', fn ) : this.trigger('touchmove') }
			})
			
			function CreateResizeBox( option ){
				// Create the resizing hoster block
				
				return '<div class="R-container">'
									+'<div class="R-cover"></div>'
									
									+'<div class="R-adapter">'
										+'<canvas class="statCanvas"></canvas>'
									
										+'<div class="R-scaler'+( option.circleCrop ? ' circle' : '' )+'">'
											+'<canvas class="dynaCanvas"></canvas>'
											
											+'<div class="R-col-1"></div>'
											+'<div class="R-col-2"></div>'
											+'<div class="R-col-3"></div>'
											
											+'<div class="R-raw-1"></div>'
											+'<div class="R-raw-2"></div>'
											+'<div class="R-raw-3"></div>'
											
											+'<div class="R-corner-lt" data-action="lt-resize"></div>'
											+'<div class="R-corner-rt" data-action="rt-resize"></div>'
											+'<div class="R-corner-rb" data-action="rb-resize"></div>'
											+'<div class="R-corner-lb" data-action="lb-resize"></div>'
											
											+'<div class="R-side-left" data-action="l-resize"></div>'
											+'<div class="R-side-top" data-action="t-resize"></div>'
											+'<div class="R-side-right" data-action="r-resize"></div>'
											+'<div class="R-side-bottom" data-action="b-resize"></div>'
										+'</div>'
									+'</div>'
							+'</div>'
			}
			
			function Scaler( e, adapted, callback ){
				// Define the responsivity of the scaler ( resizer ) in function of the picture and his adaptation to the container
				
				var rendWidth = adapted.width,
						rendHeight = adapted.height,
						
						destinationWidth,
						destinationHeight
						
				if( e.ratio != 1 ){
					if( e.ratio < 1 ){
						// Si le width du format souhaité est inferieur au height
						
						// ----- ( axe X )
						destinationWidth = rendWidth < rendHeight ?
														// si l'image est HAUT
														( rendWidth / rendHeight ) > ( e.minWidth / e.minHeight ) ? // Test de sensibilité entre les rapports de l'image normal et du formatage
																						( e.minWidth * rendHeight ) / e.minHeight // Considerable par rapport au width
																						: rendWidth // Plus ou moins
														
														// si l'image est LARGE
														: e.minWidth < e.minHeight ? 
																		( e.minWidth * rendHeight ) / e.minHeight // Considerable par rapport au height
																		: rendWidth // Plus ou moins
						// ----- ( axe Y )
						destinationHeight = rendWidth < rendHeight ? 
													// si l'image est HAUT
													( rendWidth / rendHeight ) > ( e.minWidth / e.minHeight ) ?// Test de sensibilité entre les rapports de l'image normal et du formatage
																							rendHeight // Plus ou moins
																							: ( e.minHeight * rendWidth ) / e.minWidth // Considerable par rapport au width
																							
													// si l'image est LARGE 
													: e.minWidth < e.minHeight ? 
																rendHeight // Plus ou moins
																: rendWidth * ( e.minHeight / rendHeight ) // Considerable par rapport au height
					} else {
						// Si le width du format souhaité est superieur au height ( commentaire inverse )
						
						destinationWidth = rendWidth < rendHeight ?
																							rendWidth 
																							: ( rendWidth / rendHeight ) > ( e.minWidth / e.minHeight ) ? 
																																														( e.minWidth * rendHeight) / e.minHeight 
																																														: rendWidth
						destinationHeight = rendWidth < rendHeight ? 
																							( e.minHeight * rendWidth ) / e.minWidth 
																							: ( rendWidth / rendHeight ) > ( e.minWidth / e.minHeight ) ? 
																																														rendHeight 
																																														: rendWidth * ( e.minHeight / rendHeight )
					}
				}
				else destinationWidth = destinationHeight = rendWidth < rendHeight ? rendWidth : rendHeight
				
				callback({
								width: destinationWidth,
								height: destinationHeight,
								left: adapted.HzImage ? ( rendWidth - destinationWidth ) / 2 : 0,
								top: adapted.HzImage ? 0 : ( rendHeight - destinationHeight ) / 2
							})
			}
			
			function AdaptImg( e, CONTAINER, callback ){
				// Adapt the image format to the container ( adaptation by responsive )
				
				var rendWidth = e.width,
						rendHeight = e.height,
						horizontalImage = e.width >= e.height,
						rendTop = 0,
						rendLeft = 0
				
				if( horizontalImage ){
					
					if( e.width > CONTAINER.width() ){
						
						rendHeight *= CONTAINER.width() / rendWidth
						rendWidth = CONTAINER.width()
						
						rendTop = ( CONTAINER.height() - rendHeight ) / 2
						
					} else {
						
						rendWidth *= CONTAINER.height() / rendHeight
						rendHeight = CONTAINER.height()
						
						rendLeft = ( CONTAINER.width() - rendWidth ) / 2
					}
					
				} else {
					
					if( e.height > CONTAINER.height() ){
						
						rendWidth *= CONTAINER.height() / rendHeight
						rendHeight = CONTAINER.height()
						
						rendLeft = ( CONTAINER.width() - rendWidth ) / 2
					}
				}
				
				callback({ 
								width: rendWidth, 
								height: rendHeight,
								left: rendLeft,
								top: rendTop,
								HzImage: e.width != e.height ? e.width > e.height : null
							})
			}
			
			function validateIMG( img, options, callback ){
				
					var MIN_SIZES = { width: 80, height: 80 }, // minimus size of image
							FORMAT
					
					if( /x/.test( options.imgFormat ) ){
						// Format 320x400, 1000/740, ...
						
						FORMAT = options.imgFormat.split('x')
						
						MIN_SIZES.width = parseInt( FORMAT[0] )
						MIN_SIZES.height = parseInt( FORMAT[1] )
						
						STATIC_RESIZE = true
						AUTO_RESIZE = false
						FREE_RESIZE = false
						$('.R-container [data-action]').hide()
					}
					
					else if( /[1-9]\/[1-9]/.test( options.imgFormat ) ){
						// Format 3/2, 1/6 ...
						
						FORMAT = options.imgFormat.split('/')
					
						MIN_SIZES.width *= parseInt( FORMAT[0] )
						MIN_SIZES.height *= parseInt( FORMAT[1] )
						
						STATIC_RESIZE = false
						AUTO_RESIZE = true
						FREE_RESIZE = false
						
						$('.R-container [data-action]').show()
						$('.R-container [class^=R-side-]').hide()
					} 
					
					else { 
						// automatic format and changeable
						
						STATIC_RESIZE = false
						AUTO_RESIZE = false
						FREE_RESIZE = true
						$('.R-container [data-action]').show()
					}
					
					
					if( img.width >= MIN_SIZES.width && img.height >= MIN_SIZES.height )
						callback({
											width: img.width,
											height: img.height,
											minWidth: MIN_SIZES.width,
											minHeight: MIN_SIZES.height,
											ratio: parseInt( MIN_SIZES.width ) / parseInt( MIN_SIZES.height )
										})
					
					else $(".R-container").html( '<div class="R-error">This image is smaller than '+ MIN_SIZES.width +'x'+ MIN_SIZES.height +'</div>' )
			}
			
			function core( options, callback ){
				
				/**---------------------------------------- resizer input configurations ----------------------------------------**/
				
				var OPTIONS = $.extend({
																image: false,
																imgFormat: 'auto', // Formats: 3/2, 200x360, auto
																device: 'all', // lg-md, sm-xs
																circleCrop: false, // true => circle, square ( by default )
																zoomable: true,
																zoomMax: 2,
																outBoundColor: 'black', // black, white
																btnDoneAttr: '.R-container .R-btn-done'
															}, options ),
						IMG_URL
						
				/**---------------------------------------- Create and init the resizer DOM components ----------------------------------------**/
				
				$(this).html( CreateResizeBox( OPTIONS ) )
				
				var  _IMG_ = new Image(),
						
						$_HOSTER = $(this),
						$_CONTAINER = $(".R-container"),
						$_ADAPTER = $(".R-adapter"),
						$_SCALER = $(".R-scaler"),
						$_COVER = $(".R-cover"),
						
						$_TRIGGERS = $('[class^="R-side-"], [class^="R-corner-"]')
				
				
				if( OPTIONS.image )
					IMG_URL = typeof OPTIONS.image !== 'string' ? window.URL.createObjectURL( OPTIONS.image ) : OPTIONS.image // create URL in case the IMG is a blob file
				
				else $_CONTAINER.html( '<div class="R-error">Configuration Error: Set the image URL or blob image file as options.image </div>' )
				
				/**---------------------------------------- Load and init the new image created ----------------------------------------**/
				
				_IMG_.onload = function(){
					
					/*************** Validate input image and apply resize configurations ***************/
					validateIMG( _IMG_, OPTIONS, function( originDetails ){
						
						/**---------------------------------------- init resize box elements variables ----------------------------------------**/
						
						var _statCanvas = document.querySelector(".statCanvas"),
								_dynaCanvas = document.querySelector(".dynaCanvas"),
								
								ctx_Static = _statCanvas.getContext("2d"),
								ctx_Dynamic = _dynaCanvas.getContext("2d")
								
						// static (container) and dynamic (scaler) canvas contexts
						ctx_Dynamic.imageSmoothingEnabled = true
						ctx_Dynamic.imageSmoothingQuality = 'high'
								
						// given the picture size to the static canvas
						_statCanvas.width = $_CONTAINER.width()
						_statCanvas.height = $_CONTAINER.height()
						
						/*************** Adapt the picture to the container ( responsive ) ***************/
						AdaptImg( originDetails, $_CONTAINER, function( ADAPTED ){
						
							// Cover only the space of the image
								$_COVER.css({ 
															left: ADAPTED.left +'px', 
															top: ADAPTED.top +'px', 
															right: ADAPTED.left +'px', 
															bottom: ADAPTED.top +'px', 
															background: OUTBOUNDS_COLOR[ OUTBOUNDS_COLOR.hasOwnProperty( OPTIONS.outBoundColor ) ? OPTIONS.outBoundColor : 'black' ]
														})
								
								/*************** Position and the size of the image resizer ( scaler ) in function of the container ***************/
								Scaler( originDetails, ADAPTED, function( SCALED ){
									
										$_SCALER.css({ // 4 => _SCALER border width
																	width: _dynaCanvas.width = SCALED.width - 4,
																	height: _dynaCanvas.height = SCALED.height - 4,
																	left: SCALED.left +'px', 
																	top: SCALED.top +'px' 
																})
										
										/**---------------------------------------- init variables ----------------------------------------**/
										
										// Scaler moving limits
										var MoveLimitLeft = 0,
												MoveLimitTop = 0,
												MoveLimitRight = ADAPTED.width - _dynaCanvas.width,
												MoveLimitBottom = ADAPTED.height - _dynaCanvas.height,
										
										// Scaler resizing limits
												ResizeLimitLeft = 0,
												ResizeLimitTop = 0,
												ResizeLimitRight = ResizeLimitLeft + ADAPTED.width,
												ResizeLimitBottom = ResizeLimitTop + ADAPTED.height,

										// Scaler minimun sizes
												MIN_WIDTH = $_SCALER.width() / 2,
												MIN_HEIGHT = $_SCALER.height() / 2,
										
										// transition informations variables
												NO_MOVE = false, // variable of transition between moving and resizing scale
												ZOOMING = { width: ADAPTED.width, height: ADAPTED.height, left: 0, top: 0 }, // init image zoom sizes and position
												MOVING = {}, // moving informations
												RESIZING = {}, // resizing informations
											
										// Static canvas zooming informations
												zoomUp = true,
												deffZoom = 0,
												zoom = 1
									
										/**---------------------------------------- init canvas images ----------------------------------------**/
										
										ctx_Static.drawImage( _IMG_, 0, 0, ADAPTED.width, ADAPTED.height ); // Set picture into the static canvas
										$_ADAPTER.css({ left: ADAPTED.left, top: ADAPTED.top, width: ADAPTED.width, height: ADAPTED.height }) // init the scaler sizes and position
										
										// Load first shot of image into the dynamic canvas ( scaler )
										ctx_Dynamic.drawImage( _statCanvas, SCALED.left+2, SCALED.top+2, SCALED.width, SCALED.height, 0, 0, SCALED.width, SCALED.height )
										
										/**---------------------------------------- events ----------------------------------------**/
										
										$_SCALER.mousedown( function(e){
											
												if( !NO_MOVE ){
													
													MOVING.t = $_SCALER
													MOVING.x = e.pageX - $_SCALER.position().left
													MOVING.y = e.pageY - $_SCALER.position().top
												}
												
												MoveLimitRight = ADAPTED.width - $_SCALER.width()
												MoveLimitBottom = ADAPTED.height - $_SCALER.height()
										} )
										
										.dblclick( function( e ){
											// zooming container image
											
												if( !OPTIONS.zoomable ) return 
											
												zoom == 1 ? zoomUp = true : null
												zoom > ( OPTIONS.zoomMax - 0.5 ) ? zoomUp = false : null
												
												MOVING.ox = Math.floor( e.pageX - $_COVER.offset().left )
												MOVING.oy = Math.floor( e.pageY - $_COVER.offset().top )
														
												zooming( zoomUp )
										} )
										
										.touchstart( function(e){
											
												if( !NO_MOVE ){
													
													MOVING.t = $_SCALER
													MOVING.x = e.originalEvent.touches[0].clientX - $_SCALER.position().left
													MOVING.y = e.originalEvent.touches[0].clientY - $_SCALER.position().top
												}
												
												MoveLimitRight = ADAPTED.width - $_SCALER.width()
												MoveLimitBottom = ADAPTED.height - $_SCALER.height()
										} )
										
										$_TRIGGERS.mousedown( function(e){
											
												NO_MOVE = true
												
												RESIZING.t = $(this)
												RESIZING.topHeight = $_SCALER.position().top + $_SCALER.height() // to calculate TOP by scale LEFT movement in AUTO RESIZING
										} )
										
										$(document).mouseup( function(){ stop() } )
										
										.mousemove( function(e){
												e.preventDefault()
												
												if( !STATIC_RESIZE && RESIZING.t ) resizing( e, RESIZING )
										} )
										
										.touchend( function(){ stop() } )
										
										$_ADAPTER.mousemove( function(e){
												e.preventDefault()
												
												if( MOVING.t ) moving( e, MOVING )
										} )
										
										.touchmove( function(e){
												e.preventDefault()
												
												if( MOVING.t )
													moving( e, MOVING, true )
												
												else if( RESIZING.t && ( RESIZING.x || RESIZING.y ) )
													resizing( e, RESIZING, true )
										} )
										
										// Trigger event when the resizing is declare as done
										$( OPTIONS.btnDoneAttr ).click( function(){ ( callback )( _dynaCanvas.toDataURL( 'image/jpeg' ) ) } )
										
										/**---------------------------------------- pilote functions ----------------------------------------**/
										
										function moving( e, MOVING, touch ){
											// moving scaler in the container
											
											// Scaler moving position
											var LEFT = ( touch ? e.originalEvent.touches[0].clientX : e.pageX ) - MOVING.x,
													TOP = ( touch ? e.originalEvent.touches[0].clientY : e.pageY ) - MOVING.y,
													
													M_X = ( LEFT >= MoveLimitLeft && LEFT <= ( MoveLimitRight - 4 ) ),
													M_Y = ( TOP >= MoveLimitTop && TOP <= ( MoveLimitBottom - 4 ) )
													
													
											M_X ? $_SCALER.css( 'left', LEFT +'px' ) : LEFT = $_SCALER.position().left
											M_Y ? $_SCALER.css( 'top', TOP +'px' ) : TOP = $_SCALER.position().top
											
											if( zoom > 1 ){
												// showing zoomed image ( out of the container sizes ) in function of the position of the mouse
												ctx_Static.clearRect( 0, 0, ZOOMING.width, ZOOMING.height );
												
												// mouse position
												MOVING.ox = Math.floor( e.pageX - $_COVER.offset().left )
												MOVING.oy = Math.floor( e.pageY - $_COVER.offset().top )
												
												// ration between original and zoomed image sizes
												// deffZoom = ( zoom - ( zoom > 1 ? ( zoom / 2 ) : 0 ) )
												
												ctx_Static.drawImage(_IMG_, -MOVING.ox * deffZoom, -MOVING.oy * deffZoom, ZOOMING.width, ZOOMING.height )
											}
											
											/* Note: left & top (+2) is to compensate the border size deficit */
											ctx_Dynamic.drawImage( _statCanvas, LEFT+2,  TOP+2, $_SCALER.width(), $_SCALER.height(), 0, 0, $_SCALER.width(), $_SCALER.height() ) // image of this position
										}
										
										function resizing( e, RESIZING, touch ){
											// Scaler image resizing
											
											// scaler left and top side postion
											var POS_X = ( touch ? e.originalEvent.touches[0].pageX : e.pageX ) - $_SCALER.offset().left,
													POS_Y = ( touch ? e.originalEvent.touches[0].pageY : e.pageY ) - $_SCALER.offset().top,
													
											// image relative position
													LEFT = ( touch ? e.originalEvent.touches[0].clientX : e.clientX ) - $_ADAPTER.offset().left,
													TOP = ( touch ? e.originalEvent.touches[0].clientY : e.clientY ) - $_ADAPTER.offset().top,
													
													SC_WIDTH,
													SC_HEIGHT
											
											/* Note: left & top (+2) is to compensate the border size deficit */
											switch( RESIZING.t.data('action') ){
													
													case 'l-resize': SC_WIDTH = $_SCALER.width() - POS_X;
													
																				if( ResizeLimitLeft <= LEFT && SC_WIDTH > MIN_WIDTH ){
																					
																					$_SCALER.css({ 'width': SC_WIDTH +'px', 'left': LEFT +'px' })
																					_dynaCanvas.width = SC_WIDTH
																					
																					ctx_Dynamic.drawImage( _statCanvas, LEFT+2, $_SCALER.position().top+2, SC_WIDTH, $_SCALER.height(), 0, 0, SC_WIDTH, $_SCALER.height() )
																				}
															break;
															
													case 'r-resize': SC_WIDTH = POS_X;

																				if( ResizeLimitRight-4 >= LEFT && SC_WIDTH > MIN_WIDTH ){
																					
																					$_SCALER.css( 'width', SC_WIDTH +'px' )
																					_dynaCanvas.width = SC_WIDTH
																					
																					ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, SC_WIDTH, $_SCALER.height(), 0, 0, SC_WIDTH, $_SCALER.height() )
																				}
															break;

													case 't-resize': SC_HEIGHT = $_SCALER.height() - POS_Y;
																				
																				if( ResizeLimitTop <= TOP && SC_HEIGHT > MIN_HEIGHT ){
																					
																					$_SCALER.css({ 'height': SC_HEIGHT +'px', 'top': TOP +'px' })
																					_dynaCanvas.height = SC_HEIGHT
																					
																					ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, TOP, $_SCALER.width()+2, SC_HEIGHT, 0, 0, $_SCALER.width(), SC_HEIGHT )
																				}
															break;
															
													case 'b-resize': SC_HEIGHT = POS_Y;
																				
																				if( ResizeLimitBottom-4 >= TOP && SC_HEIGHT > MIN_HEIGHT ){
																					
																					$_SCALER.css( 'height', SC_HEIGHT +'px' )
																					_dynaCanvas.height = SC_HEIGHT
																					
																					ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, $_SCALER.width(), SC_HEIGHT, 0, 0, $_SCALER.width(), SC_HEIGHT )
																				}
															break;
													
													case 'lt-resize': SC_WIDTH = $_SCALER.width() - POS_X
																				SC_HEIGHT = $_SCALER.height() - POS_Y
																					
																				if( AUTO_RESIZE ){
																					// proportional resizing ( width <=> height )
																					
																					if( ResizeLimitLeft <= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						SC_HEIGHT = SC_WIDTH / originDetails.ratio
																						TOP = RESIZING.topHeight - SC_HEIGHT
																						
																						if( ResizeLimitTop <= TOP && TOP <= ( ADAPTED.height - SC_HEIGHT - 4 ) && SC_HEIGHT > MIN_HEIGHT ){
																							
																							$_SCALER.css({ 'width': SC_WIDTH +'px', 'height': SC_HEIGHT +'px', 'left': LEFT +'px', 'top': TOP +'px' })
																							_dynaCanvas.width = SC_WIDTH
																							_dynaCanvas.height = SC_HEIGHT
																							
																							ctx_Dynamic.drawImage( _statCanvas, LEFT+2, TOP+2, SC_WIDTH, SC_HEIGHT, 0, 0, SC_WIDTH, SC_HEIGHT )
																						}
																					}
																				} else {
																					// free resizing
																				
																					if( ResizeLimitLeft <= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						$_SCALER.css({ 'width': SC_WIDTH +'px', 'left': LEFT +'px' })
																						_dynaCanvas.width = SC_WIDTH
																						
																						ctx_Dynamic.drawImage( _statCanvas, LEFT+2, $_SCALER.position().top+2, SC_WIDTH, $_SCALER.height(), 0, 0, SC_WIDTH, $_SCALER.height() )
																					}
																					
																					if( ResizeLimitTop <= TOP && SC_HEIGHT > MIN_HEIGHT ){
																						
																						$_SCALER.css({ 'height': SC_HEIGHT +'px', 'top': TOP +'px' })
																						_dynaCanvas.height = SC_HEIGHT
																						
																						ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, TOP+2, $_SCALER.width(), SC_HEIGHT, 0, 0, $_SCALER.width(), SC_HEIGHT )
																					}
																				}
															break;
															
													case 'lb-resize': SC_WIDTH = $_SCALER.width() - POS_X;
																				SC_HEIGHT = POS_Y;
														
																				if( AUTO_RESIZE ){
																					// proportional resizing ( width <=> height )
																					
																					if( ResizeLimitLeft <= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						SC_HEIGHT = SC_WIDTH / originDetails.ratio
																						
																						if( ResizeLimitBottom-4 >= TOP && SC_HEIGHT > MIN_HEIGHT && SC_HEIGHT < ( ADAPTED.height - $_SCALER.position().top - 4 ) ){
																							
																							$_SCALER.css({ 'width': SC_WIDTH +'px', 'height': SC_HEIGHT +'px', 'left': LEFT +'px' })
																							_dynaCanvas.width = SC_WIDTH
																							_dynaCanvas.height = SC_HEIGHT
																							
																							ctx_Dynamic.drawImage( _statCanvas, LEFT+2, $_SCALER.position().top+2, SC_WIDTH, SC_HEIGHT, 0, 0, SC_WIDTH, SC_HEIGHT )
																						}
																					}
																				} else {
																					// free resizing
																					
																					if( ResizeLimitLeft <= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						$_SCALER.css({ 'width': SC_WIDTH +'px', 'left': LEFT +'px' })
																						_dynaCanvas.width = SC_WIDTH
																						
																						ctx_Dynamic.drawImage( _statCanvas, LEFT+2, $_SCALER.position().top+2, SC_WIDTH, $_SCALER.height(), 0, 0, SC_WIDTH, $_SCALER.height() )
																					}
																					
																					if( ResizeLimitBottom-4 >= TOP && SC_HEIGHT > MIN_HEIGHT ){
																						
																						$_SCALER.css( 'height', SC_HEIGHT +'px' )
																						_dynaCanvas.height = SC_HEIGHT
																						
																						ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, $_SCALER.width(), SC_HEIGHT, 0, 0, $_SCALER.width(), SC_HEIGHT )
																					}
																				}
															break;
															
													case 'rt-resize': SC_WIDTH = POS_X;
																				SC_HEIGHT = $_SCALER.height() - POS_Y;
													
																				if( AUTO_RESIZE ){
																					// proportional resizing ( width <=> height )
																					
																					if( ResizeLimitRight-4 >= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						SC_HEIGHT = SC_WIDTH / originDetails.ratio
																						TOP = RESIZING.topHeight - SC_HEIGHT
																						
																						if( ResizeLimitTop <= TOP && SC_HEIGHT > MIN_HEIGHT ){
																							
																							$_SCALER.css({ 'width': SC_WIDTH +'px', 'height': SC_HEIGHT +'px', 'top': TOP +'px' })
																							_dynaCanvas.width = SC_WIDTH
																							_dynaCanvas.height = SC_HEIGHT
																							
																							ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, TOP+2, SC_WIDTH, SC_HEIGHT, 0, 0, SC_WIDTH, SC_HEIGHT )
																						}
																						
																						RESIZING.lastLeft = LEFT
																					}
																				} else {
																					// free resizing
																					
																					if( ResizeLimitRight-4 >= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						$_SCALER.css( 'width', SC_WIDTH +'px' )
																						_dynaCanvas.width = SC_WIDTH
																						
																						ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, SC_WIDTH, $_SCALER.height(), 0, 0, SC_WIDTH, $_SCALER.height() )
																					}
																					
																					if( ResizeLimitTop <= TOP && SC_HEIGHT > MIN_HEIGHT ){
																						
																						$_SCALER.css({ 'height': SC_HEIGHT +'px', 'top': TOP +'px' })
																						_dynaCanvas.height = SC_HEIGHT
																						
																						ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, TOP+2, $_SCALER.width(), SC_HEIGHT, 0, 0, $_SCALER.width(), SC_HEIGHT )
																					}
																				}
															break;
															
													case 'rb-resize': SC_WIDTH = POS_X;
																				SC_HEIGHT = POS_Y;
													
																				if( AUTO_RESIZE ){
																					// proportional resizing ( width <=> height )
																					
																					if( ResizeLimitRight-4 >= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						SC_HEIGHT = SC_WIDTH / originDetails.ratio
																						
																						if( ResizeLimitBottom-4 >= TOP && SC_HEIGHT > MIN_HEIGHT && SC_HEIGHT < ( ADAPTED.height - $_SCALER.position().top - 4 ) ){
																							
																							$_SCALER.css({ 'width': SC_WIDTH +'px', 'height': SC_HEIGHT +'px' })
																							_dynaCanvas.width = SC_WIDTH
																							_dynaCanvas.height = SC_HEIGHT
																							
																							ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, SC_WIDTH, SC_HEIGHT, 0, 0, SC_WIDTH, SC_HEIGHT )
																						}
																					}
																				} else {
																					// free resizing
																						
																					if( ResizeLimitRight-4 >= LEFT && SC_WIDTH > MIN_WIDTH ){
																						
																						$_SCALER.css( 'width', SC_WIDTH +'px' )
																						_dynaCanvas.width = SC_WIDTH
																						
																						ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, SC_WIDTH, $_SCALER.height(), 0, 0, SC_WIDTH, $_SCALER.height() )
																					}
																					
																					if( ResizeLimitBottom-4 >= TOP && SC_HEIGHT > MIN_HEIGHT ){
																						
																						$_SCALER.css( 'height', SC_HEIGHT +'px' )
																						_dynaCanvas.height = SC_HEIGHT
																						
																						ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, $_SCALER.width(), SC_HEIGHT, 0, 0, $_SCALER.width(), SC_HEIGHT )
																					}
																				}
															break;
											}
										}
										
										function zooming( zoomUp ){
											// zoom container image
											
											ctx_Static.clearRect( 0, 0, ZOOMING.width, ZOOMING.height )
											
											if( zoomUp && zoom < OPTIONS.zoomMax ) zoom++ // zoom up
											else if( zoom > 1 ) zoom-- // zoom down
											
											// Zoomed image dimensions
											ZOOMING.width = ADAPTED.width * zoom
											ZOOMING.height = ADAPTED.height * zoom
											
											// ration between original and zoomed image sizes
											deffZoom = ( zoom - ( zoom > 1 ? ( zoom / 2 ) : 0 ) )
											
											// Zoomed image left & top position
											ZOOMING.left = zoom > 1 ? - MOVING.ox * deffZoom : 0
											ZOOMING.top = zoom > 1 ? - MOVING.oy * deffZoom : 0
											
											
											ctx_Static.drawImage( _IMG_, ZOOMING.left, ZOOMING.top, ZOOMING.width, ZOOMING.height )
											
											/* Note: left & top (+2) is to compensate the border size deficit */
											ctx_Dynamic.drawImage( _statCanvas, $_SCALER.position().left+2, $_SCALER.position().top+2, $_SCALER.width(), $_SCALER.height(), 0, 0, $_SCALER.width(), $_SCALER.height() )
										}
										
										function stop(){
											// init scaler moving and resizing informations
											
											NO_MOVE = false 
											MOVING = {}
											RESIZING = {}
										}
								} )
						} )
					} )
				}
				
				_IMG_.src = IMG_URL
			}
			
		} )( $ || jquery )