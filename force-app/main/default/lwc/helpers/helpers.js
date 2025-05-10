export function transformToRadioGroupArray(arr){
    return arr.map((item)=>{
        return {
            label: item,
            value: item
        }
    })};