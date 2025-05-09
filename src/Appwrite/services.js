// Importing configuration variables (like endpoint, project ID, etc.) from the config file
import config from "../config/config";

// Importing necessary modules from Appwrite SDK
import { Client, ID, Databases, Storage, Query } from 'appwrite';

// Defining the Service class to handle database and storage operations
export class Service {

    // Creating a new instance of Appwrite client
    client = new Client();
    // Declaring variables for database and storage services
    bucket;
    databases;

    // Constructor to initialize Appwrite services
    constructor()
    {
        // Setting up the Appwrite client with endpoint and project ID
        this.client
        .setEndpoint(config.appwriteURL)             // Appwrite API endpoint
        .setProject(config.appwriteProjectId)        // Appwrite project ID
        
        // Initializing Databases and Storage service with the client
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client);
    }

    // Method to create a new blog post document in the database
    async createPost({title, slug, content, feturedImage, status, userID}){
        try {
            // Creating a new document with the given data and unique slug as the document ID
            return await this.databases.createDocument(
                config.appwriteDatabaseId,         // Database ID
                config.appwriteCollectionId,       // Collection ID
                slug,                              // Document ID (slug)
                {
                    title,
                    content,
                    feturedImage,
                    status,
                    userID
                }
            )
        } catch (error) {
            // Logging any errors encountered during post creation
            console.log("Appwrite Service :: createPost :: error", error);
        }
    }

    // Method to update an existing post document
    async updatePost(slug, {title, content, feturedImage, status}){
        try {
            // Updating the document identified by slug with new values
            return await this.databases.updateDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    feturedImage,
                    status,
                }
            )
        } catch (error) {
            // Logging any errors encountered during post update
            console.log("Appwrite Service :: updatePost :: error", error);
        }
    }

    // Method to delete a post using its slug (document ID)
    async deletePost(slug){
        try {
            // Deleting the document from the database
            await this.databases.deleteDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            // Logging any errors encountered during deletion
            console.log("Appwrite Service :: deletePost :: error", error);
            return false;
        }
    }

    // Method to retrieve a single post using its slug
    async getPost(slug){
        try {
            // Getting the document from the collection
            return this.databases.getDocument(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            // Logging any errors encountered during retrieval
            console.log("Appwrite Service :: getPost :: error", error);
            return false;
        }
    }

    // Method to retrieve multiple posts based on given queries
    async getPosts(querries = [Query.equal("status","active")]){
        try {
            // Listing documents that match the queries
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,
                config.appwriteCollectionId,
                querries,
            )
        } catch (error) {
            // Logging any errors encountered during retrieval
            console.log("Appwrite Service :: getPosts :: error", error);
            return false;
        }
    }

    // ===========================
    // File Upload and Management
    // ===========================

    // Method to upload a file to Appwrite storage
    async uploadFile(file){
        try {
            // Creating a new file in the storage bucket
            return await this.bucket.createFile(
                config.appwriteBucketId,       // Storage bucket ID
                ID.unique(),                   // Generating a unique file ID
                file,                          // File to upload
            ) 
        } catch (error) {
            // Logging any errors encountered during upload
            console.log("Appwrite Service :: uploadFile :: error", error);
            return false;
        }
    }

    // Method to delete a file from the storage bucket
    async deleteFile(fileId){
        try {
            // Deleting the file using its file ID
            await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId,
            )
            return true;
        } catch (error) {
            // Logging any errors encountered during file deletion
            console.log("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    // Method to get a preview URL for a file
    getFilePreview(fileId){
        try {
            // Returning the preview URL of the file
            return this.bucket.getFilePreview(
                config.appwriteBucketId,
                fileId
            )
        } catch (error) {
            // Logging any errors encountered during preview generation
            console.log("Appwrite Service :: getFilePreview :: error", error);
            return false;
        }
    }
}

// Creating an instance of the Service class
const service = new Service();

// Exporting the instance to be used across the application
export default service;
