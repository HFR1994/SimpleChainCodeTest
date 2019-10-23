"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const main_1 = require("../src/main");
const fabric_mock_stub_1 = require("@theledger/fabric-mock-stub");
const chaincode = new main_1.Chaincode();
describe("Testing Chaincode", () => {
    it("Should not invoke correctly", () => __awaiter(this, void 0, void 0, function* () {
        let camioneta = {
            numeroSerie: "BJNBJ389U5RJJNLK",
            uso: 3200,
            identificadorMarca: "Dodge",
            numeroPlacas: "T72HFO",
            modelo: "Neon",
            costo: 130000
        };
        //@ts-ignore
        const trx = new fabric_mock_stub_1.ChaincodeMockStub("Create", chaincode);
        const responseCreate = yield trx.mockInvoke("trx01", [
            "compraCamioneta",
            "CAMIONETA1",
            JSON.stringify(camioneta)
        ]);
        console.log("El Error es: " + responseCreate.message);
        chai_1.expect(responseCreate.status).to.not.eql(200);
    }));
    it("Should invoke correctly", () => __awaiter(this, void 0, void 0, function* () {
        let camioneta = {
            numeroSerie: "BJNBJ389U5RJJNLK",
            uso: 3200,
            identificadorMarca: "Dodge",
            numeroPlacas: "T72HFO",
            modelo: "Porsche 911",
            costo: 130000
        };
        //@ts-ignore
        const trx = new fabric_mock_stub_1.ChaincodeMockStub("Create", chaincode);
        const responseCreate = yield trx.mockInvoke("trx01", [
            "compraCamioneta",
            "CAMIONETA2",
            JSON.stringify(camioneta)
        ]);
        chai_1.expect(responseCreate.status).to.eql(200);
        let presupuesto = {
            total: 2000,
            subtotal: 1800,
            nombre: "Mi presupuesto"
        };
        let responsePresupuesto = yield trx.mockInvoke("trx02", [
            "validaPresupuesto",
            "CAMIONETA2",
            "Presupuesto1",
            JSON.stringify(presupuesto)
        ]);
        console.log("El Error es: " + responsePresupuesto.message);
        chai_1.expect(responsePresupuesto.status).to.not.eql(200);
        presupuesto.total = 300000;
        responsePresupuesto = yield trx.mockInvoke("trx03", [
            "validaPresupuesto",
            "CAMIONETA2",
            "Presupuesto2",
            JSON.stringify(presupuesto)
        ]);
        chai_1.expect(responsePresupuesto.status).to.eql(200);
    }));
});
//# sourceMappingURL=shock.test.js.map