export interface Budget{
    id:number,
    category:number ,
    limitValue :Float64Array,
    alertValue:Float64Array,
    UserId:string,
    BudgetPeriodId:string,
    CategoryName?:string
   
    
}