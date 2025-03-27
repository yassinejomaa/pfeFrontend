export interface BudgetPeriods{
    id:number,
    budgetPeriodType:number,
    income:Float32Array,
    savings:Float32Array,
    startDate:Date,
    endDate:Date,
    userId:string,
    budgets:any[]


}