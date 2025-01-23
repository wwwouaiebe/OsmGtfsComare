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
Doc reviewed 20250110
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theOsmDataLoader from './OsmDataLoader.js';
import GtfsTreeBuilder from './GtfsTreeBuilder.js';
import OsmTreeBuilder from './OsmTreeBuilder.js';
import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';
import GtfsDataLoader from './GtfsDataLoader.js';
import OsmGtfsComparator from './OsmGtfsComparator.js';
import theDocConfig from './DocConfig.js';
import OsmRouteMasterValidator from './OsmRouteMasterValidator.js';
import MissingRouteMasterValidator from './MissingRouteMasterValidator.js';
import PlatformsValidator from './PlatformsValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
     * The costructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Coming soon
	 */

	async start ( ) {

		// reset of the Errors only button
		document.getElementById ( 'errorsOnlyInput' ).value = 'Errors only';

		// reading the form
		theDocConfig.loadData ( );

		// loading exclude list
		await theExcludeList.loadData ( );

		// opening report
		theReport.open ( );

		// loading osm data
		await theOsmDataLoader.fetchData (	);

		theReport.addShortcuts ( );

		new PlatformsValidator ( ).validate ( );

		await new MissingRouteMasterValidator ( ).fetchData ( );

		// validating the osm routes and route master
		new OsmRouteMasterValidator ( ).validate ( );

		// building the osmtree
		new OsmTreeBuilder ( ).buildTree ( );

		// loading gtfs data
		await new GtfsDataLoader ( ).fetchData ( );

		// building the gtfs tree
		new GtfsTreeBuilder ( ).buildTree ( );

		// compare existing osm route master with gtfs route
		let osmGtfsComparator = new OsmGtfsComparator ( );
		osmGtfsComparator.compare ( );

		// Search Missing osm route master only if no osm ref given by user
		if ( ! theDocConfig.ref ) {
			osmGtfsComparator.searchMissingOsmRouteMaster ( );
		}

		// close...
		theReport.close ( );
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */