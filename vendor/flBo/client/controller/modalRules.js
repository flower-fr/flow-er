const flModalRules = ({ context }) => {
    
    $(".fl-modal-rule").each(function () {

        const target = $(this).attr("data-fl-target")
        const f = $(this).attr("data-fl-function")
        const params = $(this).attr("data-fl-params").split(",")
        for (const trigger of params) {
            $(`#${trigger}`).change(() => {

                /**
                 * select
                 */

                if (f == "select") {
                    const key = $(`#${params[0]}`).val()
                    const value = $(`#${params[1]}`).val()
                    const dictionary = Object.fromEntries(new Map(value.split("|").map( x => x.split(":") )))
                    const disabled = $(`#${target}`).prop("disabled")
                    if (disabled) $(`#${target}`).prop("disabled", "")
                    $(`#${target}`).val(dictionary[key])
                    $(`#${target}`).trigger("change")
                    $(`#${target}`).focus()
                    if (disabled) $(`#${target}`).prop("disabled", "disabled")
                }

                /**
                 * multiply
                 */

                if (f == "multiply") {
                    let result = 1
                    for (const arg of params) result *= $(`#${arg}`).val()
                    const disabled = $(`#${target}`).prop("disabled")
                    if (disabled) $(`#${target}`).prop("disabled", "")
                    $(`#${target}`).val(result)
                    $(`#${target}`).trigger("change")
                    $(`#${target}`).focus()
                    if (disabled) $(`#${target}`).prop("disabled", "disabled")
                }

                /**
                 * discount
                 */
                
                else if (f == "discount") {
                    let result = $(`#${params[0]}`).val()
                    let rate = $(`#${params[1]}`).val()
                    if ($(`#${params[1]}`).attr("data-fl-type") == "percentage") rate /= 100
                    result -= result * rate
                    const disabled = $(`#${target}`).prop("disabled")
                    if (disabled) $(`#${target}`).prop("disabled", "")
                    $(`#${target}`).val(result)
                    $(`#${target}`).trigger("change")
                    $(`#${target}`).focus()
                    if (disabled) $(`#${target}`).prop("disabled", "disabled")
                }

                /**
                 * sum
                 */
                
                else if (f == "sum") {
                    let result = 0
                    for (const arg of params) result += parseFloat($(`#${arg}`).val())
                    const disabled = $(`#${target}`).prop("disabled")
                    if (disabled) $(`#${target}`).prop("disabled", "")
                    $(`#${target}`).val(result)
                    $(`#${target}`).trigger("change")
                    $(`#${target}`).focus()
                    if (disabled) $(`#${target}`).prop("disabled", "disabled")
                }
            })
        }
    })
}

export { flModalRules }