export class Profolio {
    id: string;
    name: string;
    jobTitle: string;
    description: string;
    country: string;
    city: string;
    links: string[];

    constructor(id: string, name: string, jobTitle: string, description: string, country: string, city: string, links: string[]) {
        this.id = id;
        this.name = name;
        this.jobTitle = jobTitle;
        this.description = description;
        this.country = country;
        this.city = city;
        this.links = links;
    }
}