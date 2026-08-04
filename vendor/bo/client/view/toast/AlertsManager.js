import View from "../View.js"
import Toast from "./Toast.js"

export default class AlertsManager extends View
{
    /**
     * @param {Object} params
     * @param {Object} params.controller
     * @param {number} params.profileId - ID of the current profile.
     */
    constructor({ controller, profileId })
    {
        super({ controller })
        this.profileId = profileId
        this.toasts = []
        this.alerts = []
    }

    initialize = async () =>
    {
        if (!this.profileId) {
            console.error("Cannot initialize AlertsManager: missing profileId")
            return
        }

        // Fetch alerts for the given profileId
        const response = await fetch(`/core/v1/cours_profile?columns=alerts&where=id:${ this.profileId }`)
        if (!response.ok) {
            console.error("Failed to load profile alerts")
            return
        }
        const data = await response.json()
        this.alerts = data.rows?.[0]?.alerts ?? []

        // Create Toast instances for each active alert
        this.toasts = this.alerts.filter(alert => alert.visibility === "active").map((alert) => new Toast({ controller: this.controller },
            {
                title: alert.title,
                message: alert.message,
                type: "info",
                persistent: true,
                onClose: () => this.dismissAlert(alert)
            }
        ))
    }

    render = () => {}

    trigger = () =>
    {
        this.toasts.forEach((toast) => toast.trigger())
    }

    /**
     * Marks an alert as hidden in the backend
     * @param {Object} alert - The alert object to dismiss
     */
    dismissAlert = async (alert) =>
    {
        if (!this.profileId) {
            console.error("Cannot dismiss alert: missing profileId")
            return
        }

        alert.visibility = "hidden"
        try {
            const response = await fetch(`/core/v1/cours_profile?id=${ this.profileId }`, {
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