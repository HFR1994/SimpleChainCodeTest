import { uuid } from "uuid/v4";
import { expect } from "chai";
import { Chaincode } from "../src/main";
import { ChaincodeMockStub, Transform } from "@theledger/fabric-mock-stub";

const chaincode = new Chaincode();
describe("Testing Chaincode", () => {
  it("Should not invoke correctly", async () => {

    let camioneta = {
      numeroSerie: "BJNBJ389U5RJJNLK",
      uso: 3200,
      identificadorMarca: "Dodge",
      numeroPlacas: "T72HFO",
      modelo: "Neon",
      costo: 130000
    };

    //@ts-ignore
    const trx = new ChaincodeMockStub("Create", chaincode);
    const responseCreate = await trx.mockInvoke("trx01", [
      "compraCamioneta",
      "CAMIONETA1",
      JSON.stringify(camioneta)
    ]);

    console.log("El Error es: "+responseCreate.message);
    expect(responseCreate.status).to.not.eql(200)
  });

  it("Should invoke correctly", async () => {

    let camioneta = {
      numeroSerie: "BJNBJ389U5RJJNLK",
      uso: 3200,
      identificadorMarca: "Dodge",
      numeroPlacas: "T72HFO",
      modelo: "Porsche 911",
      costo: 130000
    };

    //@ts-ignore
    const trx = new ChaincodeMockStub("Create", chaincode);
    const responseCreate = await trx.mockInvoke("trx01", [
      "compraCamioneta",
      "CAMIONETA2",
      JSON.stringify(camioneta)
    ]);

    expect(responseCreate.status).to.eql(200);

    let presupuesto = {
      total: 2000,
      subtotal: 1800,
      nombre: "Mi presupuesto"
    };

    let responsePresupuesto = await trx.mockInvoke("trx02", [
      "validaPresupuesto",
      "CAMIONETA2",
      "Presupuesto1",
      JSON.stringify(presupuesto)
    ]);

    console.log("El Error es: "+responsePresupuesto.message);
    expect(responsePresupuesto.status).to.not.eql(200);

    presupuesto.total=300000;

    responsePresupuesto = await trx.mockInvoke("trx03", [
      "validaPresupuesto",
      "CAMIONETA2",
      "Presupuesto2",
      JSON.stringify(presupuesto)
    ]);

    expect(responsePresupuesto.status).to.eql(200)

  });
});
