export namespace database {
	
	export class DayStatistics {
	    Week: number;
	    Day: string;
	    Cons: number;
	    Prod: number;
	
	    static createFrom(source: any = {}) {
	        return new DayStatistics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Week = source["Week"];
	        this.Day = source["Day"];
	        this.Cons = source["Cons"];
	        this.Prod = source["Prod"];
	    }
	}
	export class Statistics {
	    WeekId: number;
	    Todo: number;
	    InProgress: number;
	    Done: number;
	    Hold: number;
	
	    static createFrom(source: any = {}) {
	        return new Statistics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.WeekId = source["WeekId"];
	        this.Todo = source["Todo"];
	        this.InProgress = source["InProgress"];
	        this.Done = source["Done"];
	        this.Hold = source["Hold"];
	    }
	}
	export class Task {
	    Id: number;
	    List: string;
	    Title: string;
	    Created: string;
	    For: string;
	    Body: string;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.List = source["List"];
	        this.Title = source["Title"];
	        this.Created = source["Created"];
	        this.For = source["For"];
	        this.Body = source["Body"];
	    }
	}
	export class WeekStatistic {
	    Id: number;
	    Cons: number;
	    Prod: number;
	
	    static createFrom(source: any = {}) {
	        return new WeekStatistic(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Cons = source["Cons"];
	        this.Prod = source["Prod"];
	    }
	}

}

