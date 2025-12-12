import {test,describe, expect} from "@jest/globals";
import axios from 'axios';
import {API_URL} from "../src/constants/api.js";

describe("Posts Axios", ()=>{
    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    })

    test("Should be able to create a Post",async ()=>{
        const requestBody = {
            title: 'foo',
            body: 'bar',
            userId: 1,
        }

        const response = await apiClient.post('/posts', requestBody );
        expect(response.status).toBe(201);
        const post = response.data;

        expect(post).toEqual({
            id: expect.any(Number),
            ...requestBody
        })
    })

    test("Should be able to create a Post with only ",async ()=>{
        const requestBody = {
            title: 'asdasdasd',
        }

        const response = await apiClient.post('/posts', requestBody );
        const post = response.data;
        expect(post).toMatchObject({
            id: expect.any(Number),
            ...requestBody
        })
    })
})
