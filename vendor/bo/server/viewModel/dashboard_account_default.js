module.exports = {
	event: {
		title: "Events",
		objective: "15",
		background: "rgba(20, 164, 77, 0.5)",
		entity : "event",
		columns: "id",
		aggregator: "count"
	},
	interaction: {
		title: "Interactions",
		objective: "20",
		background: "rgba(228, 65, 27, 0.5)",
		entity : "interaction",
		columns: "id",
		where: {
			status: "new",
			touched_at: ["<", "start_of_month"]
		},
		aggregator: "count"
	}
}
