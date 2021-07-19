import { expect } from 'chai';
import  sinon from 'sinon';

import {authController} from "../../src/utils/auth";
import Logger from '../../src/utils/logger';
import { userSchema } from "../../src/schemas/userSchema";


const controller = new authController();

describe('Auth Controller', () => {

    describe("Create Token", () => {
        it("Should return a jwt Token", async () => {
            const user = {
                id: "234jkjfnanfkjnsfd23sfs",
                email: "prudvihemanth@gmail.com",
                role: "user"
              }
    
           const token =  await controller.createToken(user);
           expect(token).to.be.a('string');
        
        });
        it("Should return error", async () => {
           const user = null;
           const token =  await controller.createToken(user);
           Logger.info(token);
           expect(token).to.throw(new Error(`Cannot read property '_id' of null`));
        });
    })
    

    describe("Validate decoded user id from db", () => {
        it("Should validate to true", async () => {
            
            const decodedUser = {_id:"234jkjfnanfkjnsfd23sfs",
            email: "prudvihemanth@gmail.com",
            role: "user" }

            const validateStub = sinon.stub(userSchema, "findOne");

            validateStub.withArgs(decodedUser)
              .resolves(Promise.resolve(decodedUser))
              .returns({ isValid: true });

            validateStub.withArgs({}).returns({ isValid: true });

            expect(validateStub.calledTwice).to.be.true;
        })

        it("Should validate to false", async () => {
        })


    });


    describe("Generate Hash", () => {
        it("Should generate hash", async () => {
           const password = "homelike123@";
           const hash : any =  await controller.generateHash(password);
           expect(hash).to.be.a('string');
           expect(password).to.not.equal(hash);
           expect(hash.length).to.be.above(password.length);
        });

    });

    describe("Compare Hash", () => {

        // it("should compare hash and plain password", async() => {
        //     const password =  "homelike123@";
        //     const hash = 
        // })

    });
    
  
});