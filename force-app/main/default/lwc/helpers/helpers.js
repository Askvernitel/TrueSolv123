export function transformToRadioGroupArray(arr){
    return arr.map((item)=>{
        return {
            label: item,
            value: item
        }
    })};


export function filterItemsByFilter(items, filterObj){
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