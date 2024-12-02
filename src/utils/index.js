const { isEmpty } = require( "lodash" );
const moment    = require( "moment" );
const path      = require( "path" );
const fs        = require( "fs" );

const tratarMsgErroApi = ( error ) =>{

    let mensagem = "";

    if( !isEmpty( error.response ) ){

        if( error.response.hasOwnProperty( "data" ) ){

            mensagem = error.response.data.message !== undefined ? error.response.data.message : "Ocorreu um erro inesperado, entre em contato com o setor responsável";

        }

    } else mensagem = error.message;

    return mensagem;

};

const gravarErrorLog = ( errors ) =>{

    const nomeArquivoDeLog  = `${moment().locale( "pt-br" ).format( "DD-MM-YYYY" )}.txt`
    const caminhoArquivoLog = path.join( process.env.LOG_PATH, `${nomeArquivoDeLog}` );

    if( !fs.existsSync( caminhoArquivoLog ) ) fs.writeFileSync( caminhoArquivoLog, "", { encoding: "utf8" } );

    if( fs.existsSync( caminhoArquivoLog ) ){

        if( Array.isArray( errors ) ){

            for( error of errors ){

                let mensagem = `[${moment().locale( "pt-br" ).format( "DD/MM/YYYY HH:mm:ss" )}] - ${error} \n`;
    
                fs.writeFileSync( caminhoArquivoLog, mensagem, { encoding: "utf8", flag: "a+" } );
    
            }

        } else{

            let mensagem = `[${moment().locale( "pt-br" ).format( "DD/MM/YYYY HH:mm:ss" )}] - ${errors} \n`;
    
            fs.writeFileSync( caminhoArquivoLog, mensagem, { encoding: "utf8", flag: "a+" } );

        }

    }

    return;

};

module.exports = {
    tratarMsgErroApi,
    gravarErrorLog
};