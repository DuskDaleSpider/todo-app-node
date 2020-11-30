<template>
   <div v-if="error" class="alert alert-dismissible alert-danger">
        {{ error }}
   </div>
   <form id="signUpForm" @submit.prevent="signUp">
        <fieldset class="form-group">
            <label class="control-label" for="username">Username:</label>
            <input 
                class="form-control"
                id="username" 
                type="text" 
                v-model="username"
                required
            />
            <label class="control-label" for="password">Password:</label>
            <input 
                class="form-control" 
                id="password" 
                type="password" 
                v-model="password"
                required
            />
            <label class="control-label" for="confirmPassword">Confirm Password:</label>
            <input 
                class="form-control" 
                id="confirmPassword" 
                type="password" 
                v-model="confirmPassword"
                required
            />
        </fieldset>
        <button type="submit" class="btn btn-primary">Sign Up</button>
        <button type="button" class="btn btn-secondary" @click="checkCookie">Test</button>
   </form>
</template>

<script>
// import bootswatch (Bootstrap themes)
// bootstrap js import is in client/public/index.html
import "bootswatch/dist/darkly/bootstrap.min.css"

// import Joi for validation
import joi from "joi"

const schema = joi.object({
    username: joi.string()
        .trim()
        .pattern(/^\w+$/)
        .min(4)
        .max(20)
        .required(),
    password: joi.string()
        .trim()
        .min(7)
        .max(255)
        .required()
});

export default {
  data(){
    return {
        name: 'Home',
        username: '',
        password: '',
        confirmPassword: '',
        signingUp: false,
        error: ''
    }
  },
  methods: {
    async signUp(){
        //check if passwords match
        if(this.password != this.confirmPassword){
            this.error = "Passwords do not match";
            return;
        }
        const info = {
            username: this.username,
            password: this.password
        }; 
        const valResult = schema.validate(info);
        if(valResult.error){
            this.error = valResult.error;
            return; 
        }
        
        //call signup api route
        const apiURL = 'http://localhost:5000/api/auth/signup';
        const fetchOptions = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(valResult.value)
        };
        
        let res = await fetch(apiURL, fetchOptions);
        if(res.ok){
            let response = await res.json();
            console.log("PENIS");
            console.log(response);   
        }
    },
    async checkCookie() {
        const apiURL = 'http://localhost:5000/api/auth/cookieTest';
        const fetchOptions = {
            mode: 'cors',
            credentials: 'include'
        };
        const res = await fetch(apiURL, fetchOptions);
        if(res.ok){
           const result = await res.json();
           console.log(result);
        }
    } 
  }
}
</script>

<style>
#signUpForm{
    margin-top: 1em;
    max-width: 50%;
    margin: auto;
}
#signUpForm label{
    color: white;
}
</style>
