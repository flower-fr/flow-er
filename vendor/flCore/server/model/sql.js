const { dElete } = require("./delete")
const { insert } = require("./insert")
const { select } = require("./select")
const { update } = require("./update")

const sql = async (context, connection, entity, debug = false, { type, columns, where, order, limit, ids, data }) =>
{
    const model = context.config(`${ entity }/model`)
    if (type === "select") {
        const cursor = (await connection.execute(select(context, entity, columns, where, order, limit, model, debug)))[0]
        return cursor
    } else if (type === "insert") {
        return await connection.execute(insert(context, entity, data, model, debug))
    } else if (type === "update") {
        return await connection.execute(update(context, entity, ids, data, model, debug))
    } else if (type === "delete") {
        return await connection.execute(dElete(context, entity, ids, model, debug))
    }
}

module.exports = {
    sql
}