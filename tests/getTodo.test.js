import {expect, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../src/constants/api.js";

test('getTodo returns the correct todo item', async () => {
    const todoId = 1;

    const response = await fetch(`${API_URL}/todos/${todoId}`)
    expect(response.status).toBe(200);

    const json = await response.json();
    expect(json).toMatchObject({
        userId: todoId,
        id: expect.any(Number),
        title: expect.any(String),
    })
})

test('getTodo returns the correct todo item', async () => {
    const todoId = 1;

    const response = await axios(`${API_URL}/todos/${todoId}`)
    expect(response.status).toBe(200);

    expect(response.data).toMatchObject({
        userId: todoId,
        id: expect.any(Number),
        title: expect.any(String),
    })

})