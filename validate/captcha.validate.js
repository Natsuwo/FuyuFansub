module.exports.captcha = async (req, res, next) => {
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ) {
        return res.json({"success": false, "msg": "Please select captcha"});
    }

    // Secret Key
    const secretKey = '6LcLSBETAAAAAHKKptZbdAENAwUfW0W2lHerNKNk';

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    // Make Request to VerifyURL

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        // If not Successful
        if(body.success !== undefined && !body.success) {
            return res.json({"success": false, "msg": "Failed captcha verification"});
        }

        //If successful

         return res.json({"success": true, "msg": "Captcha passed"});
    });

    next();

}