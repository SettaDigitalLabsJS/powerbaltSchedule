
require( "dotenv" ).config();

const bree = require( "bree" );
const path = require( "path" );
const cabin = require( "cabin" );

const schedule = new bree( {

    root: false,
    logger: new cabin( {
        axe: {
            showStack: false,
            showMeta: false,
            silent: true,
        }
    } ),
    jobs: [
        {
            name: "powerbalt_scbd",
            path: path.join( __dirname, "src", "jobs", "powerbalt_scbd", "index.js" ),
            interval: process.env.TIME_SCHEDULE,
        }
    ]

} );

schedule.start();