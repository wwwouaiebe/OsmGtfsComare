/*
Copyright - 2024 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmGtfsComparator {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#gtfsRouteMaster;

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#osmRouteMaster;

	#searchMissingPlatforms ( osmRoute, gtfsRoute ) {

		let missingOsmPlatforms = '';
		gtfsRoute.platforms.slice ( 0, -1 ).split ( ';' )
			.forEach (
				gtfsPlatform => {
					if ( ! osmRoute.platformNames.get ( gtfsPlatform ) ) {
						missingOsmPlatforms += ' ' +
						gtfsRoute.platformNames.get ( gtfsPlatform ) +
						' ( ' + gtfsPlatform + ' )';
					}
				}
			);
		theReport.add ( 'p', 'Missing platforms in the osm relation:' + missingOsmPlatforms );

		let missingGtfsPlatforms = '';
		osmRoute.platforms.slice ( 0, -1 ).split ( ';' )
			.forEach (
				osmPlatform => {
					if ( ! gtfsRoute.platformNames.get ( osmPlatform ) ) {
						missingGtfsPlatforms += ' ' +
						osmRoute.platformNames.get ( osmPlatform ) +
						' ( ' + osmPlatform + ' )';
					}
				}
			);
		theReport.add ( 'p', 'Missing platforms in the gtfs data:' + missingGtfsPlatforms );
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromToLow ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if (
					gtfsRoute.from.slice ( 0, -1 ) === osmRoute.from.slice ( 0, -1 )
                    &&
                    gtfsRoute.to.slice ( 0, -1 ) === osmRoute.to.slice ( 0, -1 )
				) {
					possibleGtfsRoutes.push ( gtfsRoute );
 				}
			}
		);
		switch ( possibleGtfsRoutes.length ) {
		case 0 :
			theReport.add ( 'p', 'No gtfs route found' );
			break;
		case 1 :
			theReport.add ( 'p', 'A gtfs route with similar from and to stop found' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoutes [ 0 ] );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;
		default :
			theReport.add ( 'p', 'Multiple gtfs routes with similar from and to stop found' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					theReport.add ( 'p', possibleGtfsRoute.name, null, possibleGtfsRoute.shapePk );
					possibleGtfsRoute.osmRoute = true;
				}
			);
			break;
		}
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromToHight ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.from === osmRoute.from && gtfsRoute.to === osmRoute.to ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		switch ( possibleGtfsRoutes.length ) {
		case 0 :
			this.#compareFromToLow ( osmRoute );
			break;
		case 1 :
			theReport.add ( 'p', 'A gtfs route with from and to stop found' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoutes [ 0 ] );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;
		default :
			theReport.add ( 'p', 'Multiple gtfs routes with from and to stop found' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					theReport.add ( 'p', possibleGtfsRoute.name, null, possibleGtfsRoute.shapePk );
					possibleGtfsRoute.osmRoute = true;
				}
			);
			break;
		}
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#comparePlatformsHight ( osmRoute ) {

		let possibleGtfsRoutes = [];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.platforms === osmRoute.platforms ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		switch ( possibleGtfsRoutes.length ) {
		case 0 :

			// theReport.add ( 'p', 'No Gtfs route with all stop found' );
			this.#compareFromToHight ( osmRoute );
			break;
		case 1 :
			theReport.add ( 'p', 'A gtfs route with all stop found' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;
		default :
			theReport.add ( 'p', 'Multiple gtfs routes with all stop found' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					theReport.add ( 'p', possibleGtfsRoute.name, null, possibleGtfsRoute.shapePk );
					possibleGtfsRoute.osmRoute = true;
				}
			);
			break;
		}
	}

	/**
	 * Coming soon
	 * @param {Object} osmRouteMaster Coming soon
	 * @param {Object} gtfsRouteMaster Coming soon
	 */

	compareRoutesMaster ( osmRouteMaster, gtfsRouteMaster ) {
		this.#gtfsRouteMaster = gtfsRouteMaster;
		this.#osmRouteMaster = osmRouteMaster;
		theReport.add ( 'h1', this.#osmRouteMaster.name );
		this.#osmRouteMaster.routes.forEach (
			osmRoute => {
				theReport.add ( 'h2', osmRoute.name, osmRoute.id );
				this.#comparePlatformsHight ( osmRoute );
			}
		);
		theReport.add ( 'h2', 'Missing osm relations' );
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( ! gtfsRoute.osmRoute ) {
					theReport.add ( 'p', gtfsRoute.name, null, gtfsRoute.shapePk );
				}
			}
		);
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmGtfsComparator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */