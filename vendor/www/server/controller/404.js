const { render404 } = require("../rendering/render404")

const notFoundAction = async ({}, context) => {
    return render404(context)
}

module.exports = {
    notFoundAction
}