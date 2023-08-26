import mongoose from "mongoose";
import chai from "chai";
import request from "supertest";
import { app } from "../../src/app.js";

const expect = chai.expect;



describe("Testin KretzCommerce API", () => {
  before(function () {
    mongoose.connection.collections.users.drop();
    mongoose.connection.collections.products.drop();
    mongoose.connection.collections.carts.drop();
  });

  beforeEach(function () {});

  let token;
  let UID;
  let CID;
  let PID;

  describe("Testing ProductServices", () => {
    it("Agregamos el producto a la base de datos como ADMIN", async () => {
      //GIVEN
      const productMock = {
        title: "mockProduct",
        category: "mockProduct Category",
        stock: 3,
        price: 100,
        description: "mockProduct description",
        code: "abc123",
        status: true,
      };

      const adminData = {
        email: "adminCoder@coder.com",
        password: "adminCod3r123",
      };

      //THEN
      const logout = await request(app).get(`/api/users/logout`);
      const { headers } = await request(app)
        .post("/api/users/login")
        .send(adminData);
      const cookieResult = headers["set-cookie"][0];
      token = cookieResult;

      const { _body, status } = await request(app)
        .post("/api/products")
        .send(productMock)
        .set("Cookie", token);
      PID = _body._id;

      //ASSERT
      expect(_body).is.ok.and.to.have.property("_id");
      expect(status).is.equal(200);
    });

    it("Obtenemos el producto segun el id otorgado", async () => {
      //GIVEN

      //THEN
      const { _body, status } = await request(app)
        .get(`/api/products/${PID}`)
        .set("Cookie", token);

      //ASSERT
      expect(_body.payload.length).to.be.equal(1);
      expect(status).is.equal(200);
    });

    it("Actualizamos el producto", async () => {
      //GIVEN
      const updatedProductMock = {
        title: "updatedMockProduct",
        category: "mockProduct Category",
        stock: 7,
        price: 5000,
        description: "mockProduct updated description",
        code: "abc1ss23",
        status: false,
      };

      //THEN
      const { _body, statusCode } = await request(app)
        .put(`/api/products/${PID}`)
        .send(updatedProductMock)
        .set("Cookie", token);

      //ASSERT
      expect(_body.status).is.equal("Success");
      expect(statusCode).is.equal(200);
    });
  });

  describe("Testin Sessions", () => {
    const userMock = {
      firstName: "usermockname",
      lastName: "usermocklastname",
      email: "usermockmail@gmail.com",
      age: 23,
      password: "usermockpassword",
    };

    beforeEach(function () {
      this.timeout(5000);
    });

    it("Crear Usuario", async () => {
      //GIVEN

      //THEN
      const { statusCode } = await request(app)
        .post("/api/users/register")
        .send(userMock);

      //ASSERT
      expect(statusCode).is.equal(201);
    });

    it("Logear usuario", async () => {
      //GIVEN
      const loginMock = {
        email: "usermockmail@gmail.com",
        password: "usermockpassword",
      };

      //THEN
      const logout = await request(app).get(`/api/users/logout`);

      const { headers, _body, statusCode } = await request(app)
        .post("/api/users/login")
        .send(loginMock);
      const cookieResult = headers["set-cookie"][0];
      const cookieData = cookieResult.split("=");
      token = cookieResult;
      let cookie = {
        name: cookieData[0],
        value: cookieData[1],
      };
      UID = _body.payload;

      // //ASSERT
      expect(statusCode).is.equal(201);
      expect(cookie.name).to.be.ok.and.eql("jwtToken");
      expect(cookie.value).to.be.ok;
    });

    it("Cambiamos el rol del usuario", async () => {
      //GIVEN

      //THEN
      const { statusCode, _body, headers } = await request(app).get(
        `/api/users/premium/${UID}`
      );
      const cookieResult = headers["set-cookie"][0];
      const cookieData = cookieResult.split("=");
      token = cookieResult;
      //ASSERT

      expect(_body.Status).is.equal("Success");
      expect(statusCode).is.equal(200);
    });
  });

  describe("Testing CartServices", () => {
    it("Creamos un carrito", async () => {
      //GIVEN

      //THEN
      const { _body, statusCode } = await request(app)
        .post(`/api/carts`)
        .set("Cookie", token);
      CID = _body.payload._id;
      //ASSERT
      expect(statusCode).is.equal(200);
      expect(_body.status).is.equal("Success");
    });

    it("Agregamos un producto al carrito", async () => {
      //GIVEN

      //THEN
      const { statusCode, _body } = await request(app)
        .post(`/api/carts/${CID}/products/${PID}`)
        .set("Cookie", token);

      //ASSERT
      expect(statusCode).is.equal(200);
      expect(_body.status).is.equal("Success");
    });

    it("Modificamos la cantidad del producto en el carrito", async () => {
      //GIVEN
      const newQuantity = { quantity: 1000 };

      //THEN
      const { _body, statusCode } = await request(app)
        .put(`/api/carts/${CID}/products/${PID}`)
        .send(newQuantity)
        .set("Cookie", token);

      //ASSERT
      expect(_body.status).is.equal("Success");
      expect(statusCode).is.equal(200);
    });
  });

  after(function () {});
});
