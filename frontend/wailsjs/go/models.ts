export namespace database {
	
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

}

