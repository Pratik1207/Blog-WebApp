import React, { useState } from 'react'
// Importing the service file which contains functions to interact with Appwrite
import Service from '../Appwrite/services'
// React Router hooks for navigation and routing
import { Link, useNavigate } from 'react-router-dom'
// Redux action to update the auth state
import { login } from '../store/authSlice'
// Custom components
import Button from '../components/Button'
import Input from "../components/Input"
import Logo from '../components/Logo'
// Hook to dispatch Redux actions
import { useDispatch } from 'react-redux'
// Hook for form handling
import { useForm } from 'react-hook-form'

function Signup() {
    const navigate = useNavigate() // used to redirect after signup
    const [error, setError] = useState("") // for storing error messages
    const dispatch = useDispatch() // to dispatch Redux actions
    const { register, handleSubmit } = useForm() // register = for form input bindings, handleSubmit = for handling form submission

    // Function to create a new account
    const create = async (data) => {
        setError("") // clear previous errors
        try {
            // Call Appwrite service to create a new account
            const userData = await Service.createAccount(data)

            if (userData) {
                // Get current logged-in user data
                const userData = await Service.getCurrentUser()

                // If user data is valid, store it in Redux
                if (userData) dispatch(login(userData));

                // Redirect to homepage
                navigate("/")
            }
        } catch (error) {
            // If error occurs during signup, set error message
            setError(error.message)
        }
    }

    return (
        <div className="flex items-center justify-center">
            {/* Container for the signup form */}
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">

                {/* Logo */}
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>

                {/* Heading */}
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Sign up to create account
                </h2>

                {/* Redirect to login page */}
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {/* Error message if any */}
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                {/* Signup form */}
                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        {/* Full Name Input */}
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />

                        {/* Email Input */}
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                        />

                        {/* Password Input */}
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />

                        {/* Submit Button */}
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
