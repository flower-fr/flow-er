const fs = require("fs")

let js 

js = require("./form_account_default")
fs.writeFileSync("../../config/viewModel_form_account_default.json", JSON.stringify({
    "viewModel_form_account_default": js
}))

js = require("./form_catalogue_default")
fs.writeFileSync("../../config/viewModel_form_catalogue_default.json", JSON.stringify({
    "viewModel_form_catalogue_default": js
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

js = require("./tabbar_account_detail_default")
fs.writeFileSync("../../config/viewModel_tabbar_account_detail_default.json", JSON.stringify({
    "viewModel_tabbar_account_detail_default": js
}))
