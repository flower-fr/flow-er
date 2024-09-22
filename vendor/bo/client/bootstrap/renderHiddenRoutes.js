const renderHiddenRoutes = ({ context, entity, view }, data) => {
    return `
    <input type="hidden" id="instanceCaption" value="${data.instance.caption}" />
    <input type="hidden" id="shortcutsRoute" value="/bo/shortcuts/${entity}?view=${view}" />
    <input type="hidden" id="countRoute" value="/bo/v1/${entity}/count" />        
    <input type="hidden" id="searchRoute" value="${ (data.indexConfig && data.indexConfig.searchView) ? data.indexConfig.searchView : "/bo/search" }/${entity}?view=${view}" />
    <input type="hidden" id="listRoute" value="${ (data.indexConfig && data.indexConfig.listView) ? data.indexConfig.listView : "/bo/list" }/${entity}?view=${view}" />
    <input type="hidden" id="listGroupRoute" value="generic/${entity}/groupUpdate?view=${view}" />
    <input type="hidden" id="detailRoute" value="/bo/detail/${entity}" />
    <input type="hidden" id="groupRoute" value="bo/group/${entity}" />
      
    <input type="hidden" id="listWhereHidden" value="${data.where}" />
    <input type="hidden" id="listOrderHidden" value="${data.order}" />
    <input type="hidden" id="listLimitHidden" value="${data.limit}" />`
}
