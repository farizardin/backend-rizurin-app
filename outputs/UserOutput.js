const BaseOutput = require("./BaseOutput");

class UserOutput extends BaseOutput {
    static userBasicOutput(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    }
}

module.exports = UserOutput;
