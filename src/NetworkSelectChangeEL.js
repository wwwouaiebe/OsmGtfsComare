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

import OsmDataLoader from './OsmDataLoader.js';
import theGtfsDataLoader from './GtfsDataLoader.js';
import theOsmDataTreeBuilder from './OsmDataTreeBuilder.js';
import OsmGtfsComparator from './OsmGtfsComparator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class NetworkSelectChangeEL {

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Change event listener
	 * @param {Event} changeEvent The change event
	 */

	async handleEvent ( changeEvent ) {

		await new OsmDataLoader ( ).fetchData (
			{
				osmNetwork : changeEvent.target.value,
				osmVehicle : 'bus',
				osmRef : '28'
			}
		);
		theOsmDataTreeBuilder.buildTree ( );

		await theGtfsDataLoader.loadData ( changeEvent.target.value );

		/*
		console.log ( theOsmDataTreeBuilder.osmTree.routesMaster [ 0 ] );
		console.log (
			theGtfsDataLoader.gtfsTree.routesMaster.find ( element => '1' === element.ref )
		);
		*/

		new OsmGtfsComparator ( ).compareRoutesMaster (
			theOsmDataTreeBuilder.osmTree.routesMaster [ 0 ],
			theGtfsDataLoader.gtfsTree.routesMaster.find ( element => '28' === element.ref )
		);
	}
}

export default NetworkSelectChangeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */