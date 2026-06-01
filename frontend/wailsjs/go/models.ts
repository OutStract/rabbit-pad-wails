export namespace services {
	
	export class LibraryTree {
	    name: string;
	    path: string;
	    lastMod: string;
	
	    static createFrom(source: any = {}) {
	        return new LibraryTree(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.lastMod = source["lastMod"];
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

