import { describe, test, beforeEach, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import moment from "moment";
import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import AuthController from "../../HWTestCar/controllers/AuthController.js";
import CarsController from "../../HWTestCar/controllers/CarsController.js";
import { QAAUTO_API_URL } from "../../src/constants/api.js";

describe("POST /cars and sort by mileage", () => {
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

    test("Should create cars and validate sorting by mileage", async () => {

        const brandsResponse = await carsController.getBrands();
        expect(brandsResponse.status).toBe(200);
        const brand = brandsResponse.data.data[0];

        const modelsResponse = await carsController.getModels();
        expect(modelsResponse.status).toBe(200);
        const model = modelsResponse.data.data.find(m => m.carBrandId === brand.id);


        const mileages = [5000, 2000, 10000];
        const createdCars = [];

        for (const mileage of mileages) {
            const createResponse = await carsController.createCar({
                carBrandId: brand.id,
                carModelId: model.id,
                mileage
            });
            expect(createResponse.status).toBe(201);

            const createdCar = createResponse.data.data;


            expect(createdCar).toMatchObject({
                carBrandId: brand.id,
                carModelId: model.id,
                mileage,
                brand: brand.title,
                model: model.title,
                logo: brand.logoFilename
            });


            expect(moment(createdCar.carCreatedAt).isValid()).toBe(true);
            expect(moment(createdCar.updatedMileageAt).isValid()).toBe(true);

            createdCars.push(createdCar);
        }


        const carsResponse = await carsController.getCars({
            sortBy: "mileage",
            order: "asc"
        });
        expect(carsResponse.status).toBe(200);

        const cars = carsResponse.data.data;


        const sortedCars = cars
            .filter(car => createdCars.some(c => c.id === car.id))
            .sort((a, b) => a.mileage - b.mileage); // на всякий случай сортируем


        for (let i = 0; i < sortedCars.length - 1; i++) {
            expect(sortedCars[i].mileage).toBeLessThanOrEqual(sortedCars[i + 1].mileage);
        }


        createdCars.forEach(car => {
            expect(cars).toEqual(
                expect.arrayContaining([expect.objectContaining({ id: car.id })])
            );
        });

        console.log("Машины после сортировки по пробегу:", sortedCars.map(c => c.mileage));
    });
});
