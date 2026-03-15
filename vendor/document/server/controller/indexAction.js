const { renderIndex } = require("../html/renderIndex")

module.exports =  async ({ req }, { context, logger }) => 
{
    return renderIndex(context, "dark")
}
