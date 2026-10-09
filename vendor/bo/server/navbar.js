const { assert } = require("../../../core/api-utils")

const navbarAction = async ({ req }, { context }) => 
{
    const application = assert.notEmpty(req.params, "application")
    const tab = assert.notEmpty(req.params, "tab")
    const locale = req.query.locale || "default"
    const config = context.config[`viewModel_navbar_${ application }`]
    if (config.title[locale]) config.title = config.title[locale]
    config.defaultTab = tab
    config.user = context.user
    console.log({config})
    Object.values(config.menu).forEach(entry => { 
        if (entry.label[locale]) entry.label = entry.label[locale]
        else if (entry.label["default"]) entry.label = entry.label["default"]
    })

    // Filter menu based on ACL and user role
    const userRoles = (context.user?.role ?? "").split(",").map(role => role.trim()).filter(Boolean)
    const allowedMenu = {}

    for (const [menuTabId, menuTab] of Object.entries(config.menu)) {
        // If no ACL, allow it
        if (!menuTab.acl || menuTab.acl.length === 0) {
            allowedMenu[menuTabId] = menuTab
            continue
        }

        // Check if the user's role is allowed for this menu tab
        const isAllowed = menuTab.acl.some(
            role => userRoles.includes(role) || role === "user"
        )

        if (isAllowed) allowedMenu[menuTabId] = menuTab
    }

    config.menu = allowedMenu

    return [200, config, "application/json"]
}

module.exports = navbarAction