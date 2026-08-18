import View from "../View.js"
import Toast from "./Toast.js"

export default class AlertsManager extends View
{
    /**
     * @param {Object} params
     * @param {Object} params.controller
     * @param {number} params.profileId - ID of the current profile.
     */
    constructor({ controller, entity, view, profile_id })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.profile_id = profile_id
        this.toasts = []
        this.alerts = []
    }

    initialize = async () =>
    {
        if (!this.profile_id) {
            console.error("Cannot initialize AlertsManager: missing profile_id")
            return
        }

        const { controller, entity, view } = this

        let response = await fetch(`/bo/alert/${ this.entity }?view=${ this.view }`)
        const { profileEntity, properties, templates, actions, translations } = await response.json()
        this.profileEntity = profileEntity
        this.templates = templates
        this.actions = actions

        // Fetch alerts for the given profileId
        response = await fetch(`/core/v1/${ profileEntity }?columns=alerts&where=id:${ this.profile_id }`)
        if (!response.ok) {
            console.error("Failed to load profile alerts")
            return
        }
        const data = await response.json()
        this.alerts = data.rows?.[0]?.alerts ?? []

        // Create Toast instances for each active alert
        this.toasts = this.alerts.find(alert => (alert.visibility !== "hidden") ? alert : false)?.map((alert) => new Toast({ 
            controller, 
            entity, 
            view, 
            properties,
            template: alert.template ? templates[alert.template] : undefined,
            action: alert.action ? actions[alert.action] : undefined,
            translations
        },
        {
            title: alert.title,
            message: alert.message,
            type: "info",
            persistent: true,
            onClose: () => this.dismissAlert(alert)
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
     * Marks an alert as hidden in the backend
     * @param {Object} alert - The alert object to dismiss
     */
    dismissAlert = async (alert) =>
    {
        if (!this.profile_id) {
            console.error("Cannot dismiss alert: missing profile_id")
            return
        }

        const { profileEntity } = this

        alert.visibility = "hidden"
        try {
            const response = await fetch(`/core/v1/${ profileEntity }?id=${ this.profile_id }`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([{ alerts: this.alerts }])
            })
            const result = await response.json()
            if (result.status !== "ok") {
                console.error("Failed to dismiss alert:", result)
            }
        } catch (error) {
            console.error(`Failed to dismiss alert "${alert.title}"`, error)
        }
    }
}