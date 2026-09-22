import View from "../View.js"
import Toast from "./Toast.js"

export default class AlertsManager extends View
{
    /**
     * @param {Object} params
     * @param {Object} params.controller
     * @param {number} params.profileId - ID of the current profile.
     * @param {Object} params.layout - The layout object.
     */
    constructor({ controller, entity, view, profile_id, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.profile_id = profile_id
        this.layout = layout
        this.toasts = []
        this.alerts = []
    }

    initialize = async () =>
    {
        if (!this.profile_id) {
            console.error("Cannot initialize AlertsManager: missing profile_id")
            return
        }

        const { controller, entity, view, layout } = this

        let response = await fetch(`/bo/alert/${ this.entity }?view=${ this.view }`)
        const { profileEntity, properties, templates, actions, translations } = await response.json()
        this.profileEntity = profileEntity
        this.templates = templates
        this.actions = actions
        this.translations = translations

        this.alerts = this.getAlertsFromStorage()

        // Create Toast instances for each active alert
        const alert = this.alerts.find(alert => (alert.visibility !== "hidden") ? alert : false)
        this.toasts = (alert ? [alert] : []).map((alert) => new Toast({ 
            controller, 
            entity, 
            view,
            stack: alert.stack,
            layout,
            translations,
        },
        {
            title: alert.title,
            message: alert.message,
            type: "info",
            persistent: true,
            onValidate: () => this.dismissAlert(alert)
        }
        ))
        this.toasts?.forEach(async alert => await alert.initialize())
    }

    render = () => {}

    trigger = () =>
    {
        this.toasts?.forEach((toast) => toast.trigger())
    }

    /**
     * Reads alerts from localStorage.
     * @returns {Array<Object>} The list of stored alerts.
     */
    getAlertsFromStorage = () => {
        const raw = localStorage.getItem("alerts")

        try {
            return JSON.parse(raw) ?? []
        } catch (error) {
            console.error("Failed to parse alerts from localStorage", error)
            return []
        }
    }

    /**
     * Marks an alert as hidden in the backend
     * @param {Object} alert - The alert object to dismiss
     */
    dismissAlert = async (alert) =>
    {
        if (!this.profile_id) {
            console.error("Cannot dismiss alert: missing profile_id")
            return
        }

        alert.visibility = "hidden"
        alert.dismissedAt = new Date().toISOString()

        const separatorIndex = alert.id.lastIndexOf("_")
        const parsedId = {}
        if (separatorIndex !== -1) {
            parsedId.type = alert.id.slice(0, separatorIndex)
            parsedId.rowId = alert.id.slice(separatorIndex + 1)
        }

        if (parsedId.type === "guided_action") await this.validateGuidedAction(parsedId.rowId)

        try {
            localStorage.setItem("alerts", JSON.stringify(this.alerts))
        } catch (error) {
            console.error(`Failed to dismiss alert "${alert.title}"`, error)
        }
    }

    validateGuidedAction = async (id) => 
    {
        try {
            const response = await fetch(`/core/v1/guided_action?id=${ id }`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([{ status: "done" }])
            })
            const result = await response.json()
            if (result.status !== "ok") {
                console.error("Failed to validate guided action:", result)
            }
        } catch (error) {
            console.error(`Failed to validate guided action ${ id }`, error)
        }
    }
}