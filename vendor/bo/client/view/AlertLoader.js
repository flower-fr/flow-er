export default class AlertLoader {

    /**
     * @param {Object} params
     * @param {string} params.application - Current application.
     * @param {string} params.entity - Current entity.
     * @param {string} params.view - Current view.
     * @param {number} params.profile_id - ID of the current profile.
     */
    constructor({ application, entity, view, profile_id }) {
        this.application = application
        this.entity = entity
        this.view = view
        this.profile_id = profile_id
    }

    initialize = async () => {
        const config = await this.loadRules()
        if (config.length === 0) return []

        const guidedActions = await this.loadGuidedActions()

        const alerts = this.getExistingAlerts()

        // Merge guided actions with existing alerts
        for (const action of guidedActions) {
            const existing = alerts.find((alert) => alert.id === action.id)

            if (existing?.visibility === "active" && action.visibility === "hidden") {
                existing.visibility = "hidden"
                existing.dismissedAt = new Date().toISOString()
            }
            if (existing) continue

            if (action.visibility === "active") alerts.push(action)
        }

        // Check each rule and update alerts
        for (const rule of config.rules) {
            const existing = alerts.find((alert) => alert.id === rule.id)

            if (!existing) {
                const matched = await this.checkCondition(rule.condition)
                if (matched) alerts.push({ ...rule.alert, id: rule.id })
                continue
            }

            if (existing.visibility === "hidden" && !this.isDismissedToday(existing.dismissedAt)) {
                const matched = await this.checkCondition(rule.condition)
                if (matched) {
                    existing.visibility = "active"
                    existing.dismissedAt = null
                }
            }
        }

        localStorage.setItem("alerts", JSON.stringify(alerts))
    }

    /**
     * Fetches the alert rules file for the current application
     * @returns {Promise<Array>}
     */
    loadRules = async () => {
        try {
            const response = await fetch(`/bo/rules/${ this.application }`)
            const config = await response.json()
            return config ?? []
        } catch (error) {
            console.error(`AlertLoader: no rules file found for application "${ this.application }"`, error)
            return []
        }
    }

    loadGuidedActions = async () => {
        const response = await fetch(`/core/v1/guided_action?columns=entity,view,validity_date,where_ids,profile_id,status&where=profile_id:${ this.profile_id },0`)
        if (!response.ok) {
            console.error("AlertLoader: failed to load guided actions")
            return []
        }
        const guidedActions = await response.json()

        // Filter out guided actions that are not valid
        const validGuidedActions = guidedActions.rows.filter(action => {
            const validityDate = action.validity_date ? new Date(action.validity_date) : null
            const today = new Date()
            return !validityDate || validityDate <= today
        })

        // Prepare alerts object for valid guided actions
        const alerts = validGuidedActions.map(action => {
            const where = action.where_ids ? { id: action.where_ids } : undefined
            const alert = {
                id: `guided_action_${ action.id }`,
                title: "Action guidée",
                message: "Vous avez une action guidée à réaliser. Retrouvez le détail sur la page suivante :",
                visibility: action.status === "active" ? "active" : "hidden",
                dismissedAt: null,
                stack: {
                    entity: action.entity,
                    view: action.view,
                    where,
                    title: "Action guidée",
                    description: "Vous avez une action guidée à effectuer.",
                    buttonLabel: "Accéder",
                }
            }
            return alert
        })

        return alerts
    }

    /**
     * Checks a rule's condition against the backend.
     * @param {Object} condition
     * @param {string} condition.entity - The entity to query.
     * @param {Object} condition.where - The filter criteria.
     * @param {number} [condition.minCount=1] - Minimum matching rows required.
     * @returns {Promise<boolean>}
     */
    checkCondition = async ({entity, where, minCount = 1 }) => {
        try {
            const response = await fetch(`/core/v1/${ entity }?columns=COUNT:id&where=${ encodeURIComponent(this.stringifyWhere(where)) }`)
            if (!response.ok) return false
            const data = await response.json()
            return (data.rows?.[0].id ?? 0) >= minCount
        } catch (error) {
            console.error("AlertLoader: failed to check condition", error)
            return false
        }
    }

    stringifyWhere(where) {
        return Object.entries(where)
            .map(([key, value]) => `${key}:${(Array.isArray(value) ? value.join(",") : value)}`)
            .join("|")
    }

    getExistingAlerts = () => {
        try {
            const raw = localStorage.getItem("alerts")
            return raw ? JSON.parse(raw) : []
        } catch (error) {
            console.error("AlertLoader: failed to parse existing alerts", error)
            return []
        }
    }

    isDismissedToday = (isoDate) => {
        if (!isoDate) return false
        const today = new Date().toISOString().slice(0, 10)
        return isoDate.slice(0, 10) === today
    }
}