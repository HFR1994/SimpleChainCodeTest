"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_shim_1 = __importDefault(require("fabric-shim"));
var Estados;
(function (Estados) {
    Estados[Estados["solicitada"] = 0] = "solicitada";
    Estados[Estados["autorizada"] = 1] = "autorizada";
    Estados[Estados["ejecutada"] = 2] = "ejecutada";
    Estados[Estados["confirmada"] = 3] = "confirmada";
})(Estados || (Estados = {}));
function buildCamioneta(camioneta) {
    // Checar argumentos
    return camioneta;
}
function buildPresupuesto(presupuesto) {
    // Checar argumentos
    return presupuesto;
}
exports.Chaincode = class {
    /**
     * Init Method
     * @param stub
     */
    Init(stub) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Init Testing Chaincode');
            return fabric_shim_1.default.success();
        });
    }
    /**
     * Invoke Method
     * @param stub
     */
    Invoke(stub) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = stub.getFunctionAndParameters();
            let method = this[request.fcn];
            if (!method) {
                console.log('Method ' + request.fcn + ' not found');
                return fabric_shim_1.default.error(Buffer.from('Method ' + request.fcn + ' not found'));
            }
            try {
                let payload = yield method(stub, ...request.params);
                return fabric_shim_1.default.success(payload);
            }
            catch (err) {
                return fabric_shim_1.default.error(err);
            }
        });
    }
    compraCamioneta(stub, camionetaModel, json) {
        return __awaiter(this, void 0, void 0, function* () {
            let camioneta = buildCamioneta(JSON.parse(json));
            if (camioneta.modelo != "Porsche 911") {
                throw new Error('No es la camioneta que espero');
            }
            else {
                camioneta.status = Estados.autorizada;
                yield stub.putState(camionetaModel, Buffer.from(JSON.stringify(camioneta)));
                console.info('============= Todo salio bien ===========');
            }
        });
    }
    validaPresupuesto(stub, camionetaModel, presupuestoID, json) {
        return __awaiter(this, void 0, void 0, function* () {
            let presupuesto = buildPresupuesto(JSON.parse(json));
            let camionetaAsBytes = yield stub.getState(camionetaModel); //get the camioneta from chaincode state
            if (!camionetaAsBytes || camionetaAsBytes.toString().length <= 0) {
                throw new Error(`No existe este el id del camioneta: ${camionetaModel}`);
            }
            let camioneta = JSON.parse(camionetaAsBytes.toString());
            if (camioneta["costo"] < presupuesto.total) {
                yield stub.putState(presupuestoID, Buffer.from(JSON.stringify(presupuesto)));
            }
            else {
                throw new Error(`No cuadra el presupuesto`);
            }
            console.info('============= Todo salio bien ===========');
        });
    }
};
//# sourceMappingURL=main.js.map