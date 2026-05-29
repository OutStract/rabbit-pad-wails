export function renderMiddleHeader(middleHeader) {
    const tabsBody = document.createElement("div")
    tabsBody.innerText = "Tabs"

    middleHeader.append(tabsBody)
}