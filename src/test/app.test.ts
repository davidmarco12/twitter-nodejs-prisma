// import supertest from 'supertest';
// import {app} from "../server";

// const randonNumber = Math.floor(Math.random() * 99) + 99;



// const newUser = {
//     username: 'testingUserName'+randonNumber,
//     password: 'password',
//     email:'email@test.com'
// };

// describe('Creating a new user', () => {
//     it('Status should be 200, with an auth_toke', async () => {
//         const response = await supertest(app)
//         .post("/api/auth/signup")
//         .set("Accept", "application/json")
//         .send(newUser);
        
//         expect(response.status).toEqual(200);
//         expect(response.body.token.length).not.toBeLessThan(1);
//     });

// });


describe("Calculator tests", () => {
    test('adding 1 + 2 should return 3', () => {
      expect((1 + 2)).toBe(3);
    });
})