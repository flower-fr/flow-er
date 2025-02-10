$(".fl-password").each(function () {
    const input = $(this)
    $(`#${ $(this).attr("data-fl-toggle-icon") }`).click(function () {
        // Toggle input type between password and text
        if (input.prop("type") == "password") {
            input.prop("type", "text")
            $(this).removeClass("fa-eye").addClass("fa-eye-slash")
        } 
        else {
            input.prop("type", "password")
            $(this).removeClass("fa-eye-slash").addClass("fa-eye")
        }
    })
})
