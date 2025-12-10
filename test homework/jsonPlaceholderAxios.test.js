import { test, describe, expect } from "@jest/globals";
import axios from "axios";

import {API_URL} from "../src/constants/api.js";

describe("JSONPlaceholder API Tests", () => {
    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    });

    // 1. GET /posts/1/
    test("Should get post with id 1", async () => {
        const response = await apiClient.get("/posts/1");
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            userId: expect.any(Number),
            id: 1,
            title: expect.any(String),
            body: expect.any(String),
        });
    });

    // 2. GET /posts/2/
    test("Should get post with id 2", async () => {
        const response = await apiClient.get("/posts/2");
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            userId: expect.any(Number),
            id: 2,
            title: expect.any(String),
            body: expect.any(String),
        });
    });

    // 3. GET/users/1
    test("Should get user with id 1", async () => {
        const response = await apiClient.get("/users/1");
        expect(response.status).toBe(200);
        expect(response.data).toMatchObject({
            id: 1,
            name: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),

        });
    });

    // 4. POST /posts
    test("Should create a new post", async () => {
        const requestBody = {
            title: "foo",
            body: "bar",
            userId: 1
        };
        const response = await apiClient.post("/posts", requestBody);
        expect(response.status).toBe(201);
        expect(response.data).toEqual({
            id: expect.any(Number),
            ...requestBody
        });
    });

    // 5. POST /users
    test("Should create a new user", async () => {
        const requestBody = {
            name: "John Doe",
            username: "johndoe",
            email: "john@example.com"
        };
        const response = await apiClient.post("/users", requestBody);
        expect(response.status).toBe(201);
        expect(response.data).toMatchObject({
            id: expect.any(Number),
            ...requestBody
        });
    });

});
