export async function transformToRadioGroupArray(arr){

    return arr.map((item)=>{
        return {
            label: item,
            value: item
        }
    })};


export async function filterItemsByFamilyAndType(items, filterObj){
    if(filterObj == undefined) return items;
    let filter = filterObj.filterData 
    console.log("FILTER LOG:", filter);
    if(filter.family && filter.type){
        return items.filter(item=>item.Family__c===filter.family && item.Type__c===filter.type);

    }else if(filter.family){
        return items.filter(item=>item.Family__c===filter.family);
    }else if(filter.type){
        return items.filter(item=>item.Type__c===filter.type);
    }else{
        return items;
    }
}

export async function filterItemsBySearchText(items, searchObj){
    console.log("FILTER SEARCH TEXT:",searchObj);
    return items.filter((item)=>{
        const text = `${item.Description__c || ''} ${item.Name__c || ''}`.toLowerCase();
        console.log("FILTER TEXT:", text);
        return text.includes((searchObj.searchText || '').toLowerCase());
    });
}