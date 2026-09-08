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

        // #region Test toast for stack
        let stack
        if (entity === "crm_account") stack = { title: "Prospects en retard", description: "Décalez en un clic la date de prochaine action de tous les prospects dont le traitement est en retard.", entity, view: "actionEnRetard", buttonLabel: "Accéder" }
        else stack = { title: "Suggestion", description: "Voici une suggestion d'action.", entity, view: "suggestion", buttonLabel: "En savoir plus" }
        this.test = new Toast({ controller, 
            entity, 
            view, 
            stack,
            layout },
        {
            title: "Alerte",
            message: entity === "crm_account" ? "Vous avez des prospects en retard. Décalez leur date de prochaine action sur la page suivante :" : "Voici une suggestion d'action.",
            type: "info",
            persistent: true,
            onValidate: () => console.log("Alert dismissed")
        })
        this.test.initialize()
        // #endregion

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
        const alert = this.alerts.find(alert => (alert.visibility !== "hidden") ? alert : false)
        this.toasts = (alert ? [alert] : []).map((alert) => new Toast({ 
            controller, 
            entity, 
            view, 
            properties,
            template: alert.template ? templates[alert.template] : undefined,
            action: alert.action ? actions[alert.action] : undefined,
            stack: alert.stack,
            layout,
            translations
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
        this.test?.trigger()
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