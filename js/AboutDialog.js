// Copyright 2002-2013, University of Colorado Boulder

/**
 * Shows the About dialog.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var VStrut = require( 'SUN/VStrut' );

  // strings
  var creditsTitleString = require( 'string!JOIST/credits.title' );
  var leadDesignString = require( 'string!JOIST/credits.leadDesign' );
  var softwareDevelopmentString = require( 'string!JOIST/credits.softwareDevelopment' );
  var teamString = require( 'string!JOIST/credits.team' );
  var qualityAssuranceString = require( 'string!JOIST/credits.qualityAssurance' );
  var graphicArtsString = require( 'string!JOIST/credits.graphicArts' );
  var translationTitleString = require( 'string!JOIST/credits.translation' );
  var thanksTitleString = require( 'string!JOIST/credits.thanks' );

  /**
   * @param {Sim} sim
   * @constructor
   */
  function AboutDialog( sim, Brand ) {

    var thisDialog = this;

    /*
     * Use ScreenView, to help center and scale content.
     * Renderer must be specified here because the AboutDialog is added directly to the scene,
     * instead of to some other node that already has svg renderer.
     */
    ScreenView.call( this, {renderer: 'svg'} );

    var children = [
      new Text( Brand.name, { font: new PhetFont( 16 ) } ),
      new Text( Brand.copyright, { font: new PhetFont( 12 ) } ),
      new VStrut( 15 ),
      new Text( sim.name, { font: new PhetFont( 28 ) } ),
      new Text( 'version ' + sim.version, { font: new PhetFont( 20 ) } )
    ];

    if ( sim.credits ) {
      children.push( new VStrut( 15 ) );
      children.push( createCreditsNode( sim.credits ) );
    }

    //Show the links from Brand (but not for phetEvents, since those sims have different licenses.)
    if ( Brand.links && Brand.links.length && !phetEvents.active ) {
      children.push( new VStrut( 15 ) );
      for ( var i = 0; i < Brand.links.length; i++ ) {
        var link = Brand.links[i];
        children.push( createLinkNode( link.text, link.url ) );
      }
    }

    var content = new VBox( { align: 'left', spacing: 5, children: children } );

    this.addChild( new Panel( content, {centerX: this.layoutBounds.centerX, centerY: this.layoutBounds.centerY, xMargin: 20, yMargin: 20 } ) );

    function resize() {
      thisDialog.layout( $( window ).width(), $( window ).height() );
    }

    //Fit to the window and render the initial scene
    $( window ).resize( resize );
    resize();
  }

  /**
   * Creates a hypertext link.
   * @param {string} text the text that's shown to the user
   * @param {string} url clicking the text opens a window/tab to this URL
   * @returns {Node}
   */
  var createLinkNode = function( text, url ) {

    var link = new Text( text, {
      font: new PhetFont( 14 ),
      fill: 'rgb(27,0,241)', // blue, like a typical hypertext link
      cursor: 'pointer'
    } );

    link.addInputListener( {
      up: function( evt ) {
        evt.handle(); // don't close the dialog
      },
      upImmediate: function( event ) {
        var newWindow = window.open( url, '_blank' ); // open in a new window/tab
        newWindow.focus();
      }
    } );

    return link;
  };

  /**
   * Creates node that displays the credits.
   * @param {Object} credits see implementation herein for supported {string} fields
   * @returns {Node}
   */
  var createCreditsNode = function( credits ) {

    var titleFont = new PhetFont( { size: 14, weight: 'bold' } );
    var font = new PhetFont( 12 );
    var multiLineTextOptions = { font: font, align: 'left' };
    var children = [];

    // Credits
    children.push( new Text( creditsTitleString, { font: titleFont } ) );
    if ( credits.leadDesign ) { children.push( new MultiLineText( StringUtils.format( leadDesignString, credits.leadDesign ), multiLineTextOptions ) ); }
    if ( credits.softwareDevelopment ) { children.push( new MultiLineText( StringUtils.format( softwareDevelopmentString, credits.softwareDevelopment ), multiLineTextOptions ) ); }
    if ( credits.team ) { children.push( new MultiLineText( StringUtils.format( teamString, credits.team ), multiLineTextOptions ) ); }
    if ( credits.qualityAssurance ) { children.push( new MultiLineText( StringUtils.format( qualityAssuranceString, credits.qualityAssurance ), multiLineTextOptions ) ); }
    if ( credits.graphicArts ) { children.push( new MultiLineText( StringUtils.format( graphicArtsString, credits.graphicArts ), multiLineTextOptions ) ); }

    //TODO see joist#163, translation credit should be obtained from string files
    // Translation
    if ( credits.translation ) {
      if ( children.length > 0 ) { children.push( new VStrut( 10 ) ); }
      children.push( new Text( translationTitleString, { font: titleFont } ) );
      children.push( new MultiLineText( credits.translation, multiLineTextOptions ) );
    }

    // Thanks
    if ( credits.thanks ) {
      if ( children.length > 0 ) { children.push( new VStrut( 10 ) ); }
      children.push( new Text( thanksTitleString, { font: titleFont } ) );
      children.push( new MultiLineText( credits.thanks, multiLineTextOptions ) );
    }

    return new VBox( { align: 'left', spacing: 1, children: children } );
  };

  inherit( ScreenView, AboutDialog );

  return AboutDialog;
} );