// utils/error.js

const onError = (err, req, res, next) => {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Something went wrong", details: err.message });
};

export default onError;
