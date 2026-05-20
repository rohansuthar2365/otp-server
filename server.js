const express = require("express");
const cors = require("cors");

const app = express();

/*
 * Middleware
 */

app.use(cors());
app.use(express.json());

/*
 * Temporary OTP Store
 */

const otpStore = {};

/*
 * Generate OTP API
 */

app.post("/generate-otp", (req, res) => {

    try {

        const { phone } = req.body;

        /*
         * Validation
         */

        if (!phone) {

            return res.status(400).json({

                success: false,
                message: "Phone number required"
            });
        }

        /*
         * Generate 6 Digit OTP
         */

        const otp =
            Math.floor(100000 + Math.random() * 900000);

        /*
         * Save OTP
         */

        otpStore[phone] = otp;

        console.log(`Phone: ${phone}`);
        console.log(`OTP: ${otp}`);

        /*
         * Send Response
         */

        res.json({

            success: true,
            message: "OTP Generated Successfully",
            otp: otp
        });

    } catch (e) {

        res.status(500).json({

            success: false,
            message: e.message
        });
    }
});

/*
 * Verify OTP API
 */

app.post("/verify-otp", (req, res) => {

    try {

        const { phone, otp } = req.body;

        /*
         * Get Saved OTP
         */

        const savedOtp =
            otpStore[phone];

        /*
         * OTP Expired
         */

        if (!savedOtp) {

            return res.status(400).json({

                success: false,
                message: "OTP Expired"
            });
        }

        /*
         * Verify OTP
         */

        if (savedOtp.toString() === otp.toString()) {

            /*
             * Remove OTP
             */

            delete otpStore[phone];

            return res.json({

                success: true,
                message: "OTP Verified Successfully"
            });
        }

        /*
         * Invalid OTP
         */

        res.status(400).json({

            success: false,
            message: "Invalid OTP"
        });

    } catch (e) {

        res.status(500).json({

            success: false,
            message: e.message
        });
    }
});

/*
 * Default API
 */

app.get("/", (req, res) => {

    res.send("OTP Server Running");
});

/*
 * PORT
 */

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);
});