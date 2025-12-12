import {test,describe, expect} from "@jest/globals";

describe("Posts", ()=>{
    test("Should be able to create a Post",async ()=>{
        const requestBody = {
            title: 'foo',
            body: 'bar',
            userId: 1,
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })


        const post = await response.json();
        expect(post).toEqual({
            id: expect.any(Number),
            ...requestBody
        })
    })

    test("Should be able to create a Post with only ",async ()=>{
        const requestBody = {
            title: 'asdasdasd',
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })


        const post = await response.json();
        expect(post).toMatchObject({
            id: expect.any(Number),
            ...requestBody
        })
    })
})