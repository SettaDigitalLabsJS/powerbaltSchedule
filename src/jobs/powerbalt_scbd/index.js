const axios = require( "axios" );
const { gravarErrorLog } = require("../../utils");
const serviceSCBDTrigger = require("../../services/powerbalt_scbd");

const main = () => {
    try {
        serviceSCBDTrigger.UpdateScbdTrigger();
    } catch (error) {
        gravarErrorLog(error.message);
    }
};

main();