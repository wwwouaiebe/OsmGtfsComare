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

import theDocConfig from './DocConfig.js';
import theExcludeList from './ExcludeList.js';
import theOperator from './Operator.js';
import theOsmDataLoader from './OsmDataLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class osmTreeRoute {

	/**
	 * Coming soon
	 * @type {String}
	 */

	#name = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#id = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#platforms = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#from = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#to = '';

	/**
	 * Coming soon
	 * @type {Map}
	 */

	#platformNames = new Map ( );

	/**
	 * Coming soon
	 * @type {String}
	 */

	#via = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	get name ( ) { return this.#name; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get id ( ) { return this.#id; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get type ( ) { return 'relation'; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get platforms ( ) { return this.#platforms; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get from ( ) { return this.#from; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get to ( ) { return this.#to; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get platformNames ( ) { return this.#platformNames; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get via ( ) { return this.#via; }

	/**
	 * Coming soon
	 * @param {Object} osmPlatform Coming soon
	 */

	#getOsmPlatformRef ( osmPlatform ) {

		let osmRef = osmPlatform.tags [ 'ref:' + theDocConfig.network ];

		osmPlatform.tags [ 'ref:' + theDocConfig.network ] =
            theExcludeList.translateOsmRefPlatform ( osmRef );

		let platformRef = osmPlatform.tags [ 'ref:' + theDocConfig.network ];
		if ( ! platformRef ) {
			let refCounter = 0;
			let networks = theOperator.networksAsStringArray;
			let tmpPlatformRef = null;
			networks.forEach (

				network => {
					if ( osmPlatform.tags [ 'ref:' + network ] ) {
						refCounter ++;
						tmpPlatformRef = osmPlatform.tags [ 'ref:' + network ];
					}
				}
			);
			if ( 1 === refCounter ) {
				platformRef = tmpPlatformRef;
			}
			else {
				platformRef = '????????';
			}
		}
		return platformRef;
	}

	/**
	 * The constructor
	 * @param {Object} osmRoute Coming Soon
	 */

	constructor ( osmRoute ) {

		this.#name = osmRoute.tags.name;

		this.#id = osmRoute.id;

		this.#via = osmRoute.tags?.via ?? '';

		let haveFrom = false;
		osmRoute.members.forEach (
			osmRouteMember => {
				if (
					-1
                    !==
                    [ 'platform', 'platform_entry_only', 'platform_exit_only' ].indexOf (
                    	osmRouteMember.role
                    )
				) {
					let osmPlatform =
						theOsmDataLoader.nodes.get ( osmRouteMember.ref )
                        ||
                        theOsmDataLoader.ways.get ( osmRouteMember.ref );

					let platformRef = this.#getOsmPlatformRef ( osmPlatform );
					this.#platforms += platformRef + ';';
					if ( ! haveFrom ) {
						this.#from = platformRef;
						haveFrom = true;
					}
					this.#to = platformRef;
					this.#platformNames.set (
						platformRef,
						osmPlatform.tags.name || ''
					);
				}
			}
		);
		Object.seal ( this );
	}
}

export default osmTreeRoute;

/* --- End of file --------------------------------------------------------------------------------------------------------- */