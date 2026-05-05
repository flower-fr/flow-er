const fs = require("fs")

let js 

js = require("./card_account_default")
fs.writeFileSync("../../config/viewModel_card_account_default.json", JSON.stringify({
    "viewModel_card_account_default": js
}))

js = require("./detail_account_default")
fs.writeFileSync("../../config/viewModel_detail_account_default.json", JSON.stringify({
    "viewModel_detail_account_default": js
}))

js = require("./form_account_default")
fs.writeFileSync("../../config/viewModel_form_account_default.json", JSON.stringify({
    "viewModel_form_account_default": js
}))

js = require("./form_catalogue_default")
fs.writeFileSync("../../config/viewModel_form_catalogue_default.json", JSON.stringify({
    "viewModel_form_catalogue_default": js
}))

js = require("./global_account_default")
fs.writeFileSync("../../config/viewModel_global_account_default.json", JSON.stringify({
    "viewModel_global_account_default": js
}))

js = require("./group_account_default")
fs.writeFileSync("../../config/viewModel_group_account_default.json", JSON.stringify({
    "viewModel_group_account_default": js
}))

js = require("./list_account_default")
fs.writeFileSync("../../config/viewModel_list_account_default.json", JSON.stringify({
    "viewModel_list_account_default": js
}))

js = require("./navbar_flower")
fs.writeFileSync("../../config/viewModel_navbar_flower.json", JSON.stringify({
    "viewModel_navbar_flower": js
}))

js = require("./search_account_default")
fs.writeFileSync("../../config/viewModel_search_account_default.json", JSON.stringify({
    "viewModel_search_account_default": js
}))
