import {observable, computed, autorun, action, reaction} from 'mobx';
import uuidV4 from 'uuid/v4';

export class MindmupNode {
    email;
    @observable dailyBudget;
    constructor(name,email,dailyBudget,dailyBudgetEditable,expenseList,expenseEditable,categoryList,selectedRoute,selectedDate) {
        this.name = name;
        this.email = email;
        this.dailyBudget = dailyBudget;
        this.dailyBudgetEditable = dailyBudgetEditable;
        this.expenseList = expenseList;
        this.expenseEditable = expenseEditable;
        this.categoryList = categoryList;
        this.selectedRoute = selectedRoute;
        this.selectedDate = selectedDate;
    }
    
    @computed get filterByDate(){
    	return this.expenseList.filter(
			expense =>  expense.date === this.selectedDate
		);
    }
    
    @computed get totalExpenses(){
        return this.expenseList.filter(ex => ex.date === this.selectedDate).map(ex => ex.amount).reduce(
			(acc,val) =>  acc + val
		);
    }
    
    @action saveExpense(expense){
        
    }
    
    @action updateExpense(expense){
        
    }
    
    @action deleteExpense(expense){
        
    }
}

export class Expense {
    id;
    @observable date;
    title;
    amount;
    category;
    constructor(date,amount,category,title){
        this.id = uuidV4();
        this.date = date;
        this.amount = amount;
        this.category = category;
        this.title = title;
    }
}