import { View } from './View.js'

class Submit extends View
{
    constructor({ id, action, value, controller, entity, key, view }) 
    {
        super({ id, views: [] })
        this.action = action
        this.value = value
        this.controller = controller
        this.entity = entity
        this.id = id
        this.key = key
        this.view = view
    }

    render = (html) => 
    {
        html.push(`
            <div>
                <input 
                    name="flSubmit-${ this.action }" 
                    type="submit" 
                    id="flSubmit-${ this.action }" 
                    class="btn btn-warning mt-3" 
                    value="${ this.value }"
                >
            </div>`)

        return html
    }
}

export { Submit }