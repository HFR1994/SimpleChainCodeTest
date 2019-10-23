"use strict";
import shim from "fabric-shim";
import { ChaincodeStub } from "fabric-shim";

interface Camioneta{
    numeroSerie: string
    uso: number;
    status: Estados;
    identificadorMarca: string;
    numeroPlacas: string;
    modelo: string;
    costo: number;
}

interface Presupuesto{
    total: number
    subtotal: number
    nombre: string
}

enum Estados{
    solicitada,
    autorizada,
    ejecutada,
    confirmada
}

function buildCamioneta(camioneta: Camioneta) {
    // Checar argumentos
    return camioneta;
}

function buildPresupuesto(presupuesto: Presupuesto) {
    // Checar argumentos
    return presupuesto;
}

export const Chaincode = class {
    /**
     * Init Method
     * @param stub
     */
    async Init(stub: ChaincodeStub){
        console.log('Init Testing Chaincode');
        return shim.success();
    }

    /**
     * Invoke Method
     * @param stub
     */
    async Invoke(stub: ChaincodeStub){
        let request = stub.getFunctionAndParameters();
        let method = this[request.fcn];

        if(!method){
            console.log('Method ' + request.fcn +' not found');
            return shim.error(Buffer.from('Method ' + request.fcn +' not found'));
        }

        try {
            let payload = await method(stub, ...request.params);
            return shim.success(payload);
        } catch (err) {
            return shim.error(err);
        }
    }

    public async compraCamioneta(stub: ChaincodeStub, camionetaModel: string, json: string){

        let camioneta = buildCamioneta(JSON.parse(json));

        if(camioneta.modelo != "Porsche 911"){
            throw new Error('No es la camioneta que espero');
        }else{
            camioneta.status = Estados.autorizada;
            await stub.putState(camionetaModel, Buffer.from(JSON.stringify(camioneta)));

            console.info('============= Todo salio bien ===========');
        }

    }

    public async validaPresupuesto(stub: ChaincodeStub, camionetaModel: string, presupuestoID: string, json: string){

        let presupuesto = buildPresupuesto(JSON.parse(json));

        let camionetaAsBytes = await stub.getState(camionetaModel); //get the camioneta from chaincode state
        if (!camionetaAsBytes || camionetaAsBytes.toString().length <= 0) {
            throw new Error(`No existe este el id del camioneta: ${camionetaModel}`);
        }

        let camioneta = JSON.parse(camionetaAsBytes.toString());

        if(camioneta["costo"] < presupuesto.total){
            await stub.putState(presupuestoID, Buffer.from(JSON.stringify(presupuesto)));
        }else{
            throw new Error(`No cuadra el presupuesto`);
        }
        console.info('============= Todo salio bien ===========');
    }

};

//@ts-ignore
