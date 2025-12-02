import { View } from './View.js'

class Form extends View
{
    constructor({ id, views, submit }) { 
        super({ id, views })
        this.submit = submit
    }

    render = (html) => 
    {
        html.push(`
            <form class="row g-4" id="${this.id}" method="post" enctype="multipart/form-data">`)

        html = super.renderChildren(html)

        html.push(`
            </form>`)

        return html
    }

    trigger = () =>
    {
        const submit = this.submit
        const form = document.getElementById(this.id)
        if (form) {
            form.onsubmit = async function (event) {
                event.preventDefault()
                submit()
            }
        }
    }
}

export { Form }