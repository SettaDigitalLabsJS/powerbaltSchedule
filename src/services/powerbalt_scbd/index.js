const { tratarMsgErroApi } = require("../../utils");
const axios = require("axios");
const moment = require("moment");


const UpdateScbdTrigger = async () => {
    let powerStationsList;

    try {
        powerStationsList = await axios.get(`${process.env.TECSI_BASE_URL}/power-stations`,
            {
                headers: {
                    'X-API-KEY': process.env.X_API_KEY_TECSI
                }
            })
    } catch (error) { console.log(error.response) }

    for (var i in powerStationsList.data.data) {
        const valuesJSON = await GetValuesInvertersByPowerStations(powerStationsList.data.data[i])
        valuesJSON.sort(function (a, b) {
            return a.CodigoEquipamento - b.CodigoEquipamento;
        });
        valuesJSON.map(async (x) => { console.log(await postSCBDGeracao(x)) })
    }


    async function GetValuesInvertersByPowerStations(x) {
        let invertersJSON;
        let currentMoment = moment().locale("pt-br").seconds(0).milliseconds(0);
        let tomorrowMoment = moment().add(1, 'days').locale("pt-br").seconds(0).milliseconds(0);

        try {
            invertersJSON = (await axios.get(`${process.env.TECSI_BASE_URL}/power-stations/${x.id}/inverters/generation?start_date=${currentMoment.format("YYYY-MM-DD")}&end_date=${tomorrowMoment.format("YYYY-MM-DD")}`,
                {
                    headers: {
                        'X-API-KEY': process.env.X_API_KEY_TECSI
                    }
                })).data.data[0]
        } catch (error) { console.log(error.response) }
        if (invertersJSON == null) { return };

        invertersJSON = invertersJSON.inverters

        let newObj = []
        for (var i in invertersJSON) {
            const { id: CodigoEquipamento, power_yields_kwh: Energia, ...otherProperties } = invertersJSON[i]
            newObj[i] = { CodigoEquipamento, Energia, ...otherProperties, Data: currentMoment, Tipo: "Geracao" };
        }
        return newObj;
    }

    async function postSCBDGeracao(x) {
        try {
            return (await axios.post(`${process.env.SCBD_BACKEND_BASE_URL}/rest/apibdpowerbalt/v1/energia/insert`,
                x,
                {
                    auth: {
                        username: process.env.BASIC_AUTH_USER,
                        password: process.env.BASIC_AUTH_PASSWORD
                    }
                })).data
        } catch (error) { console.log(error.response) }
    }


    /*
    conexão com mindsphere e schedule do powerbalt:

    try {
        await axios.post(`${process.env.MINDSPHERE_BASE_URL}`, {
            headers: {
                'content-type': 'application/json',
                'X-SPACE-AUTH-KEY': 'process.env.X_SPACE_AUTH_KEY_MINDSPHERE',
            },
            data:
                { "appName": "appcredentials", "appVersion": "1.0.0", "userTenant": "setta402", "hostTenant": "setta402" }

        });
    } catch (error) { console.log(error.response.data) }

    try {
        axios.get(`${process.env.PW_BACKEND_BASE_URL}/rest/apipowerbalt/schedule`, {
            auth: {
                username: process.env.BASIC_AUTH_USER,
                password: process.env.BASIC_AUTH_PASSWORD
            }
        })
    } catch (error) { throw new Error(tratarMsgErroApi(error)) }
*/
};

module.exports = {
    UpdateScbdTrigger,
};