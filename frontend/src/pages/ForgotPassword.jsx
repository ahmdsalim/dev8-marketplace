import { useForgotPassword } from "@/hooks/authHooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = async (data) => {
    try {
      await forgotPasswordMutation.mutateAsync({ email: data.email });
      showSuccessToast("Password has been successfully reset!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.data?.message || error.response?.data?.data?.email ||
        "An error occurred. Please try again later.";
      showErrorToast(errorMessage);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="w-full"
              />
            </div>
            {errors.email && (
              <div className="flex items-center space-x-2 text-red-500">
                {/* <AlertCircle size={20} /> */}
                <span>{errors.email.message}</span>
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || forgotPasswordMutation.isLoading}
            >
              {forgotPasswordMutation.isLoading
                ? "Sending..."
                : "Reset Password"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a href="/login" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};
