import { useResetPassword } from "@/hooks/authHooks";
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
import { useLocation, useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  password: yup.string().required("Password is required"),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password Confirmation is required"),
  email: yup.string().email().required("Email is required"),
  token: yup.string().required("Token is required"),
});

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const email = queryParams.get("email");
  const token = queryParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: email || "",
      token: token || "",
    },
  });

  const resetPasswordMutation = useResetPassword();

  const onSubmit = async (data) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        token: data.token,
      });
      showSuccessToast("Password has been successfully reset!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.data?.message ||
        "An error occurred. Please try again later.";
      showErrorToast(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your new password to reset your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("email")} />
            <input type="hidden" {...register("token")} />
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="w-full"
              />
              {errors.password && (
                <div className="flex items-center space-x-2 text-red-500">
                  <span>{errors.password.message}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">
                Password Confirmation
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                {...register("password_confirmation")}
                className="w-full"
              />
              {errors.password_confirmation && (
                <div className="flex items-center space-x-2 text-red-500">
                  <span>{errors.password_confirmation.message}</span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || resetPasswordMutation.isLoading}
            >
              {isSubmitting || resetPasswordMutation.isLoading
                ? "Processing..."
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
