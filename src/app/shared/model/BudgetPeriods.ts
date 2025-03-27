export interface BudgetPeriods{
    id:number,
    Period:number,
    income:Float32Array,
    savings:Float32Array,
    startDate:Date,
    endDate:Date,
    userId:string,
    budgets:any[]


}