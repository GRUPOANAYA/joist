// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button for a single screen in the navigation bar, shows the text and the navigation bar icon.
 *
 * @author Sam Reid
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HighlightNode = require( 'JOIST/HighlightNode' );
  var PushButtonModel = require( 'SUN/buttons/PushButtonModel' );
  var ButtonListener = require( 'SUN/buttons/ButtonListener' );
  var Multilink = require( 'AXON/Multilink' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  /**
   * Create a nav bar.  Layout assumes all of the screen widths are the same.
   * @param {Sim} sim
   * @param {Screen} screen
   * @param {number} navBarHeight
   * @constructor
   */
  function NavigationBarScreenButton( sim, screen, navBarHeight, minWidth ) {
    Node.call( this, {
      cursor: 'pointer'
    } );

    var icon = new Node( {children: [], scale: 1} );

    var selected = sim.simModel.screenIndexProperty.valueEquals( sim.screens.indexOf( screen ) );
    var buttonModel = new PushButtonModel( {
      listener: function() {
        sim.simModel.screenIndex = sim.screens.indexOf( screen );
      }
    } );
    this.addInputListener( new ButtonListener( buttonModel ) );

    var text = new Text( screen.name, {font: new PhetFont( 18 )} );

    var plusMinus = new Text( '+', {font: new PhetFont( 18 )} );

    var box = new VBox( {
      children: [new HBox( {spacing: 4, children: [text, plusMinus]} )],
      pickable: false,
      usesOpacity: true // hint, since we change its opacity
    } );

    //add an overlay so that the icons can be placed next to each other with an HBox, also sets the toucharea/mousearea
    var overlay = new Rectangle( 0, 0, minWidth, box.height );
    overlay.centerX = box.centerX;
    overlay.y = box.y;

    var normalHighlight = new HighlightNode( overlay.width + 4, overlay.height, {
      centerX: box.centerX,
      whiteHighlight: true,
      pickable: false
    } );
    var invertedHighlight = new HighlightNode( overlay.width + 4, overlay.height, {
      centerX: box.centerX,
      whiteHighlight: false,
      pickable: false
    } );

    this.addChild( box );
//    this.addChild( normalHighlight );
//    this.addChild( invertedHighlight );
    this.addChild( overlay );

    this.multilink = new Multilink( [selected, buttonModel.downProperty, buttonModel.overProperty, sim.useInvertedColorsProperty], function update() {
      // Color match yellow with the PhET Logo
      var selectedTextColor = sim.useInvertedColors ? 'black' : 'black';
      var unselectedTextColor = sim.useInvertedColors ? 'gray' : 'gray';

      text.fill = selected.get() ? selectedTextColor : unselectedTextColor;
      box.opacity = selected.get() ? 1.0 : buttonModel.down ? 0.65 : 0.5;
      normalHighlight.visible = !sim.useInvertedColors && ( buttonModel.over || buttonModel.down );
      invertedHighlight.visible = sim.useInvertedColors && ( buttonModel.over || buttonModel.down );
      plusMinus.text = selected.value ? '+' : '-';
    } );
  }

  return inherit( Node, NavigationBarScreenButton );
} );
