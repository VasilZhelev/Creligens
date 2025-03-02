import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { FormEvent, ReactNode, useId, useState } from "react";
import { LogIn } from "@/pages/auth/LogIn";
import { useAuth } from "@/provider/authProvider";
import axios from "axios";
import { useNavigate } from "react-router";

interface AuthDialogProps {
    children?: ReactNode;
  }


const SignUp = ({children, ...props}: AuthDialogProps)  => {
    const id = useId();

  
    const [username, setUsername] = useState("Tester");
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("TestUser@123");

    const { setToken } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();

      try {
        const response = await axios.post('http://localhost:8080/api/auth/register', {
          username,
          email,
          password,
        });
  
        // Assuming the JWT token is in the response data
        const { accessToken, refreshToken } = response.data;
  
        // Save the token in localStorage or your preferred method
        setToken(accessToken);
        
        // You can navigate to another page if needed, e.g., dashboard
        navigate('/arrays');
      } catch (error) {
        console.error('Login failed:', error);
        navigate(0);
      }

    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-white max-w-xl">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <svg
                className="stroke-zinc-800"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">Sign up SolarEye</DialogTitle>
              <DialogDescription className="sm:text-center">
                We just need a few details to get you started.
              </DialogDescription>
            </DialogHeader>
          </div>
  
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-name`}>Username</Label>
                <Input id={`${id}-name`} placeholder="Matt Welsh" type="text" 
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                 required />
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                 required />
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-password`}>Password</Label>
                <Input
                  id={`${id}-password`}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>
            <input type="submit" className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" 
            value="Sign Up"/>

          </form>
        </DialogContent>
      </Dialog>
    );
  }

  const SignIn = ({children, ...props}: AuthDialogProps) => {
    const id = useId();

    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("TestUser@123");

    const { setToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email,
          password
        });
  
        // Assuming the JWT token is in the response data
        const { accessToken, refreshToken } = response.data;
  
        // Save the token in localStorage or your preferred method
        setToken(accessToken);
        
        // You can navigate to another page if needed, e.g., dashboard
        // navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        navigate(0);
      }

    };

    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-white max-w-xl">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <svg
                className="stroke-zinc-800"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
              <DialogDescription className="sm:text-center">
                Enter your credentials to login to your account.
              </DialogDescription>
            </DialogHeader>
          </div>
  
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-email`}>Email</Label>
                <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" 
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required />
              </div>
              <div className="*:not-first:mt-2">
                <Label htmlFor={`${id}-password`}>Password</Label>
                <Input
                  id={`${id}-password`}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id={`${id}-remember`} />
                <Label htmlFor={`${id}-remember`} className="text-muted-foreground font-normal">
                  Remember me
                </Label>
              </div>
              <a className="text-sm underline hover:no-underline" href="#">
                Forgot password?
              </a>
            </div>
            <input type="submit" className="w-full rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" value="Sign In"/>
            </form>
        </DialogContent>
      </Dialog>
    );
}


export {SignUp, SignIn}