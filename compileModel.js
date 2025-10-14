const { Audit } = require("./vendor/flCore/server/model/config/Audit")

const compileModel = () =>
{
    (new(Audit)).serialize("vendor/flCore/config/auditModel.json")
}

compileModel()