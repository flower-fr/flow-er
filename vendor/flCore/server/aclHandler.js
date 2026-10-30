const getAllowedProperties = (entity, operation, context) => {
    const model = context.config[`${entity}/model`]
    const acl = model?.acl
    if (!acl) return undefined

    const aclProperties = acl[operation]?.properties
    if (!aclProperties) return []

    const roles = Array.isArray(context.user.role) ? context.user.role : [context.user.role]

    const allowedProperties = Object.keys(aclProperties).filter((propertyId) => {
        const rule = aclProperties[propertyId]

        if (!rule) return false
        if (!rule.roles) return true

        return roles.some((role) => rule.roles.includes(role))
    })

    return allowedProperties
}

const filterRowsByAllowedProperties = (rows, allowedProperties) => {
    if (allowedProperties === undefined) return rows

    return rows.map((row) =>
        Object.fromEntries(
            Object.entries(row).filter(([propertyId]) =>
                allowedProperties.includes(propertyId)
            )
        )
    )
}

const isDeleteAllowed = (entity, context) => {
    const model = context.config[`${entity}/model`]
    const acl = model?.acl
    if (!acl) return true

    const rule = acl.delete

    if (!rule) return true
    if (!rule.roles) return false

    const userRoles = Array.isArray(context.user?.role) ? context.user.role : [context.user?.role]

    return userRoles.some((role) => rule.roles.includes(role))
}

module.exports = {
    getAllowedProperties,
    isDeleteAllowed,
    filterRowsByAllowedProperties
}