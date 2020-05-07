export class Job {
    id: string;
    name: string;
    jobTitle: string;
    description: string;
    country: string;
    city: string;
    links: string[];
    salary: string;
    currency: string;
    type: string;
    views: number = 0;
    following: string[];
    isRemote: boolean;
    constructor(
        id: string, 
        name: string, 
        jobTitle: string, 
        description: string, 
        country: string, 
        city: string, 
        links: string[],
        salary: string,
        currency: string, 
        type: string,
        views: number,
        following: string[],
        isRemote: boolean
        ) {
        this.id = id;
        this.name = name;
        this.jobTitle = jobTitle;
        this.description = description;
        this.country = country;
        this.city = city;
        this.links = links;
        this.salary = salary;
        this.currency = currency;
        this.type = type;
        this.views = views;
        this.following = following;
        this.isRemote = isRemote;
    }
}