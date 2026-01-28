const BaseOutput = require("./BaseOutput");
const UserOutput = require("./UserOutput");

class AuthOutput extends BaseOutput {
    static authWithUserOutput(data) {
        return {
            token: data.token,
            expires_in: data.expires_in,
            user: UserOutput.userBasicOutput(data.user),
        };
    }
}

module.exports = AuthOutput;
