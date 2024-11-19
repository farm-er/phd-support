export namespace database {
	
	export class Activity {
	    Day: number;
	    Time: string;
	    Title: string;
	    Link: string;
	    Duration: number;
	    Type: string;
	
	    static createFrom(source: any = {}) {
	        return new Activity(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Day = source["Day"];
	        this.Time = source["Time"];
	        this.Title = source["Title"];
	        this.Link = source["Link"];
	        this.Duration = source["Duration"];
	        this.Type = source["Type"];
	    }
	}
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
	export class File {
	    Id: number;
	    Topic: number;
	    Title: string;
	    Type: string;
	    LastUpdate: string;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Topic = source["Topic"];
	        this.Title = source["Title"];
	        this.Type = source["Type"];
	        this.LastUpdate = source["LastUpdate"];
	    }
	}
	export class HistoryDay {
	    Id: number;
	    Day: string;
	
	    static createFrom(source: any = {}) {
	        return new HistoryDay(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Day = source["Day"];
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
	export class Topic {
	    Id: number;
	    Title: string;
	
	    static createFrom(source: any = {}) {
	        return new Topic(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Title = source["Title"];
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

