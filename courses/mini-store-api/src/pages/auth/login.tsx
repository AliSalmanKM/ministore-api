import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import axios from "@/services/axios";
import { User } from "@/context";
import { AxiosResponse } from "axios";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

type AuthResponse = {
  user: User;
  token: string;
};

export default function Login() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  console.log("auth", auth);

  const { mutateAsync: signin, isPending } = useMutation<
    AuthResponse,
    Error,
    FormValues
  >({
    mutationFn: async (data: FormValues) => {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        "/auth/login",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      setAuth({ user: data.user, access_token: data.token });
      toast.success("Login Success");
      navigate("/", { replace: true });
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
    },
    onError: (err) => {
      toast.error("Invalid Credentials");
      console.log("error", err);
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await signin(data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="grid place-items-center min-h-screen px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full flex items-center gap-2"
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin w-5 h-5 text-accent" />
                ) : null}
                Login
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
