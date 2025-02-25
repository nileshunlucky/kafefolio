import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Upgrade = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('https://kafefolio-server.onrender.com/api/user/profile', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');

                setUser(data);
            } catch (error) {
                console.error('Profile Fetch Error:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handlePayment = async () => {
        try {
            // Fetch subscription details from your backend
            const response = await fetch("https://kafefolio-server.onrender.com/api/v1/subscription", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log(data);

            // Initiate Razorpay Checkout
            const options = {
                key: "rzp_live_rZzJDbHYxx55as", // Replace with your Razorpay Key ID
                subscription_id: data.subscription.id, // Subscription ID from backend
                name: "Kafefolio",
                description: "Monthly Subscription Plan",
                handler: async function (response) {
                    alert("Payment successful! Payment ID: " + response.razorpay_payment_id);

                    // Send payment details to the backend to update the user's subscription status
                    const updateRes = await fetch("https://kafefolio-server.onrender.com/api/user/activate-pro", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            payment_id: response.razorpay_payment_id,
                            amount: data.subscription.amount,
                            method: data.subscription.method,
                        }),
                    });

                    if (!updateRes.ok) {
                        const updateError = await updateRes.json();
                        throw new Error(updateError.message || "Failed to update subscription status.");
                    }

                    const updatedUser = await updateRes.json();
                    setUser(updatedUser); // Update the user state with the new data
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: {
                    color: "#e1bb80",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Error in payment:", error);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center padding20">
            {
                !user?.isPro ? (
                    <div className="flex flex-col gap-5 items-center text-center bg-[#E1BB80] text-[#432818] rounded-xl padding20">
                        <h1 className="text-2xl border-b border-[#432818] whitespace-nowrap">Upgrade to Pro Plan</h1>
                        <p>Subscribe for ₹99 per month and unlock premium features.</p>
                        <button
                            className="bg-[#432818] text-[#E1BB80] w-full cursor-pointer whitespace-nowrap padding10 rounded-xl"
                            onClick={handlePayment}
                        >
                            Subscribe Now
                        </button>
                        <button
                            onClick={() => navigate('/plans')}
                            className="border-[#432818] border-2 w-full cursor-pointer whitespace-nowrap padding10 rounded-xl"
                        >
                            Plan
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 items-center text-center bg-[#E1BB80] text-[#432818] rounded-xl padding20">
                        <h1 className="text-2xl border-b border-[#432818]">You're Already a Pro!</h1>
                        <p> Enjoy exclusive features and premium access with your subscription. Thank you for choosing the best.</p>
                        <button
                            className="bg-[#432818] text-[#E1BB80] w-full cursor-pointer whitespace-nowrap padding10 rounded-xl"
                            onClick={() => navigate('/plans')}
                        >
                           Explore Plan
                        </button>
                    </div>
                )
            }
        </div>
    );
};

export default Upgrade;