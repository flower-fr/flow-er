export default class View
{
    constructor({ controller }) {
        this.controller = controller
    }

    initialize = async () => {}

    render = () => ""

    trigger = () => {}
}