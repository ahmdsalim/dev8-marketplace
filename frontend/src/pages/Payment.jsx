import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const paymentStatus = state?.status; // Status bisa berupa 'success', 'pending', atau 'close'
  const paymentData = state?.paymentData; // Data pembayaran jika ada
  console.log("payment status", paymentStatus);
  console.log("payment data", paymentData);
  return (
    <div className="payment-status-page container text-center">
      {paymentStatus === "success" ? (
        <>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-700">
            Thank you for your purchase! Your transaction has been completed.
          </p>
          <div className="mt-4">
            <p>
              <strong>Transaction ID:</strong> {paymentData?.transaction_id}
            </p>
            <p>
              <strong>Order ID:</strong> {paymentData?.order_id}
            </p>
            <p>
              <strong>Amount:</strong> {paymentData?.gross_amount}
            </p>
          </div>
        </>
      ) : paymentStatus === "pending" ? (
        <>
          <h1 className="text-3xl font-bold text-yellow-600 mb-4">
            Payment Pending
          </h1>
          <p className="text-lg text-gray-700">
            Your payment is being processed. Please wait for the confirmation
            email or check your payment status in your account.
          </p>
          <div className="mt-4">
            <p>
              <strong>Transaction ID:</strong> {paymentData?.transaction_id}
            </p>
            <p>
              <strong>Order ID:</strong> {paymentData?.order_id}
            </p>
            <p>
              <strong>Amount:</strong> {paymentData?.gross_amount}
            </p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-700">
            You have closed the payment window. If you wish to complete your
            payment, please try again.
          </p>
        </>
      )}
      <button
        onClick={() => navigate(paymentStatus === "close" ? "/checkout" : "/")}
        className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md"
      >
        {paymentStatus === "close" ? "Back to Checkout" : "Back to Home"}
      </button>
    </div>
  );
};

// <div className="container mx-auto p-4 md:p-6">
//       <div className="flex flex-col md:flex-row md:space-x-8">
//         {/* Billing Details */}
//         <div className="flex-1 mb-8 md:mb-0">
//           <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
//           <form className="space-y-4">
//             <div className="flex flex-col sm:flex-row sm:space-x-4">
//               <div className="flex-1 mb-4 sm:mb-0">
//                 <label
//                   htmlFor="firstName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   First Name*
//                 </label>
//                 <input
//                   type="text"
//                   id="firstName"
//                   name="firstName"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label
//                   htmlFor="lastName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Last Name*
//                 </label>
//                 <input
//                   type="text"
//                   id="lastName"
//                   name="lastName"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="companyName"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Company Name*
//               </label>
//               <input
//                 type="text"
//                 id="companyName"
//                 name="companyName"
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="country"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Country*
//               </label>
//               <select
//                 id="country"
//                 name="country"
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
//               >
//                 <option value="">Select country</option>
//                 <option value="us">United States</option>
//                 <option value="ca">Canada</option>
//                 <option value="uk">United Kingdom</option>
//               </select>
//             </div>

//             <div>
//               <label
//                 htmlFor="streetAddress"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Street Address*
//               </label>
//               <input
//                 type="text"
//                 id="streetAddress"
//                 name="streetAddress"
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4">
//               <div className="flex-1 mb-4 sm:mb-0">
//                 <label
//                   htmlFor="townCity"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Town/City*
//                 </label>
//                 <input
//                   type="text"
//                   id="townCity"
//                   name="townCity"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex-1 mb-4 sm:mb-0">
//                 <label
//                   htmlFor="state"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   State*
//                 </label>
//                 <input
//                   type="text"
//                   id="state"
//                   name="state"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label
//                   htmlFor="zipCode"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Zip Code*
//                 </label>
//                 <input
//                   type="text"
//                   id="zipCode"
//                   name="zipCode"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:space-x-4">
//               <div className="flex-1 mb-4 sm:mb-0">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Email Address*
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div className="flex-1">
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Phone Number*
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="createAccount"
//                   name="createAccount"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="createAccount"
//                   className="ml-2 block text-sm text-gray-900"
//                 >
//                   Create Account?
//                 </label>
//               </div>
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   id="shipDifferent"
//                   name="shipDifferent"
//                   className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                 />
//                 <label
//                   htmlFor="shipDifferent"
//                   className="ml-2 block text-sm text-gray-900"
//                 >
//                   Ship to Different Address?
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label
//                 htmlFor="orderNote"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Order Note (Optional)
//               </label>
//               <textarea
//                 id="orderNote"
//                 name="orderNote"
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               ></textarea>
//             </div>
//           </form>
//         </div>

//         {/* Order Details */}
//         <div className="flex-1">
//           <div className="bg-white p-6 border border-gray-200 rounded-lg">
//             <h2 className="text-2xl font-semibold mb-6">Order Details</h2>

//             <div className="space-y-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-medium">Bluthooth Speaker</h3>
//                   <div className="text-sm text-gray-600">
//                     <p>Size: XL</p>
//                     <p>Color: Red</p>
//                   </div>
//                 </div>
//                 <span className="font-medium">$123.78</span>
//               </div>

//               <div className="border-t pt-4">
//                 <div className="flex justify-between mb-2">
//                   <span>Subtotal</span>
//                   <span>$123.78</span>
//                 </div>
//                 <div className="flex justify-between mb-2">
//                   <span>Shipping</span>
//                   <span>$5.00</span>
//                 </div>
//                 <div className="flex justify-between font-medium text-lg border-t pt-2">
//                   <span>TOTAL</span>
//                   <span>$128.00</span>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <div className="flex items-center mb-2">
//                     <input
//                       type="radio"
//                       id="bankTransfer"
//                       name="paymentMethod"
//                       value="bank"
//                       className="h-4 w-4 text-blue-600 border-gray-300"
//                       defaultChecked
//                     />
//                     <label
//                       htmlFor="bankTransfer"
//                       className="ml-2 block text-sm font-medium text-gray-700"
//                     >
//                       Direct Bank Transfer
//                     </label>
//                   </div>
//                   <p className="text-sm text-gray-600 ml-6">
//                     Make your payment directly into our account. Please use your
//                     Order ID as payment reference.
//                   </p>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="radio"
//                     id="paypal"
//                     name="paymentMethod"
//                     value="paypal"
//                     className="h-4 w-4 text-blue-600 border-gray-300"
//                   />
//                   <label
//                     htmlFor="paypal"
//                     className="ml-2 block text-sm font-medium text-gray-700"
//                   >
//                     PayPal
//                   </label>
//                 </div>
//                 <div className="flex items-center">
//                   <input
//                     type="radio"
//                     id="creditCard"
//                     name="paymentMethod"
//                     value="card"
//                     className="h-4 w-4 text-blue-600 border-gray-300"
//                   />
//                   <label
//                     htmlFor="creditCard"
//                     className="ml-2 block text-sm font-medium text-gray-700"
//                   >
//                     Credit Card
//                   </label>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <p className="text-sm text-gray-600">
//                   Your personal data will be used for your order, support your
//                   experience through this website & for other purposes described
//                   in our privacy policy.
//                 </p>
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="terms"
//                     name="terms"
//                     required
//                     className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                   />
//                   <label
//                     htmlFor="terms"
//                     className="ml-2 block text-sm text-gray-900"
//                   >
//                     I have read and agree to the website terms and conditions*
//                   </label>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-200"
//                 >
//                   PLACE ORDER
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
