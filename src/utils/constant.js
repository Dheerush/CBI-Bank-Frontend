export const checkout_url = "https://checkout.razorpay.com/v1/checkout.js"

export const razorpayCallBackUrl = (txn_id) => {
    return `http://localhost:1234/api/v1/payment-success/txn_id=${txn_id}`
}

export const txn_type = {
    fixed_deposit: {
        "name": "FD",
        color: "#1E90FF", // blue
        desc: "Fixed Deposit Initiated",
    },
    credit: {
        "name": "Credit",
        color: "#28a745", // green
        desc: "Amount Credited",
    },
    debit: {
        "name": "Debit",
        color: "#dc3545", // red
        desc: "Amount Debited",
    }
};