// Importing the configuration settings (like Appwrite endpoint and project ID)
import config from '../config/config';

// Importing necessary classes from the Appwrite SDK
import { Client, ID, Account } from 'appwrite';

// Defining the AuthService class to encapsulate authentication methods
export class AuthService {
    // Creating an instance of the Appwrite client
    client = new Client();
    // Declaring the account variable to hold the Account object
    account;

    // Constructor to initialize the Appwrite client and Account service
    constructor(){
        // Setting the Appwrite endpoint URL
        this.client
            .setEndpoint(config.appwriteURL)
            // Setting the Appwrite project ID
            .setProject(config.appwriteProjectId)
        // Initializing the Account object with the client
        this.account = new Account(this.client)
    }

    // Method to create a new user account with email, password, and name
    async createAccount({email, password, name}){
        try{
            // Creating the user account using a unique ID
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            // If account creation is successful, automatically log in the user
            if(userAccount)
            {
                return this.login({email, password})
            }
            else{
                // If account creation fails, return the result (likely null or error object)
                return userAccount;
            }
        }
        catch(error)
        {
            // Throwing the error so it can be handled by the caller
            throw error;
        }
    }

    // Method to log in a user using email and password
    async login({email, password})
    {
        try {
            // Creating a session for the user with provided credentials
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            // Throwing the error if login fails
            throw error;   
        }
    }

    // Method to get the currently logged-in user's account details
    async getCurrentUser(){
        try {
            // Fetching the account details of the current session
            return await this.account.get();
        } catch (error) {
            // Logging any error that occurs during the fetch
            console.log("Appwrite Service :: getCurrentUser :: error", error);
        }
        // Returning null if there's an error or no user is logged in
        return null;
    }

    // Method to log out the currently logged-in user
    async logout(){
        try {
            // Deleting all active sessions for the user, effectively logging them out
            await this.account.deleteSessions();
        } catch (error) {
            // Logging any error that occurs during logout
            console.log("Appwrite Service :: logout :: error", error);
        }
    }
}

// Creating an instance of AuthService for use throughout the app
const authService = new AuthService();

// Exporting the AuthService instance as the default export
export default authService;
