import { describe, test, beforeEach, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import AuthController from "../../HWTestCar/controllers/AuthController.js";
import CarsController from "../../HWTestCar/controllers/CarsController.js";
import { QAAUTO_API_URL } from "../../src/constants/api.js";



describe("PUT /cars/:id", () => {
    const jar = new CookieJar();
    const client = wrapper(
        axios.create({
            baseURL: QAAUTO_API_URL,
            jar,
            validateStatus: () => true,
        })
    );

    const authController = new AuthController(client);
    const carsController = new CarsController(client);

    const password = `Qwerty${faker.number.int({ min: 100, max: 999 })}`;
    const userData = {
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password,
        repeatPassword: password,
    };

    beforeEach(async () => {
        const signup = await authController.signUp(userData);
        expect(signup.status).toBe(201);

        const signin = await authController.signIn({
            email: userData.email,
            password: userData.password,
            remember: false,
        });
        expect(signin.status).toBe(200);
    });

    test("should update car mileage", async () => {

        const brandsResponse = await carsController.getBrands();
        expect(brandsResponse.status).toBe(200);
        const brand = brandsResponse.data.data[0];


        const modelsResponse = await carsController.getModels();
        expect(modelsResponse.status).toBe(200);
        const model = modelsResponse.data.data.find(
            (model) => model.carBrandId === brand.id
        );


        const requestBody = {
            carBrandId: brand.id,
            carModelId: model.id,
            mileage: faker.number.int({ min: 1, max: 50_000 }),
        };

        const createResponse = await carsController.createCar(requestBody);
        expect(createResponse.status).toBe(201);

        const createdCar = createResponse.data.data;


        const updatedMileage = faker.number.int({
            min: requestBody.mileage + 1,
            max: 200_000,
        });

        const beforeUpdateTime = new Date();

        const updateResponse = await carsController.updateCar(
            createdCar.id,
            { mileage: updatedMileage }
        );

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.data.status).toBe("ok");

        const updatedCar = updateResponse.data.data;

        expect(updatedCar.id).toBe(createdCar.id);
        expect(updatedCar.mileage).toBe(updatedMileage);



        const getCarResponse = await carsController.getCarById(createdCar.id);
        expect(getCarResponse.status).toBe(200);
        expect(getCarResponse.data.data.mileage).toBe(updatedMileage);
    });
});
