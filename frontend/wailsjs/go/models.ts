export namespace services {
	
	export class Payload {
	    id: string;
	    success: boolean;
	    action: string;
	    error: any;
	    message: string;
	    data: any;
	
	    static createFrom(source: any = {}) {
	        return new Payload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.success = source["success"];
	        this.action = source["action"];
	        this.error = source["error"];
	        this.message = source["message"];
	        this.data = source["data"];
	    }
	}
	export class ProjectNode {
	    name: string;
	    path: string;
	    isFolder: boolean;
	    children: ProjectNode[];
	
	    static createFrom(source: any = {}) {
	        return new ProjectNode(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.isFolder = source["isFolder"];
	        this.children = this.convertValues(source["children"], ProjectNode);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

