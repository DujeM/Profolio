export class Job {
    id: string;
    name: string;
    jobTitle: string;
    description: string;
    country: string;
    city: string;
    links: string[];
    views: number = 0;
    following: number = 0;
    constructor(
        id: string, 
        name: string, 
        jobTitle: string, 
        description: string, 
        country: string, 
        city: string, 
        links: string[], 
        views: number,
        following: number
        ) {
        this.id = id;
        this.name = name;
        this.jobTitle = jobTitle;
        this.description = description;
        this.country = country;
        this.city = city;
        this.links = links;
        this.views = views;
        this.following = following;
    }
}